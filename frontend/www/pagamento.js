// ========================================
// 💳 SISTEMA DE PAGAMENTOS - FRONTEND
// Converse com Maria
// Stripe + Mercado Pago PIX
// ========================================

const PagamentoService = {
    // Configuração
    config: {
        apiUrl: window.API_URL || '', // Será definido baseado no ambiente
        stripePublicKey: 'pk_test_xxxxx', // Substituir pela chave pública real
    },
    
    // Estado
    pixPollingInterval: null,
    currentPaymentId: null,
    
    // ========================================
    // STRIPE - CARTÃO INTERNACIONAL
    // ========================================
    
    async pagarComStripe(plano) {
        try {
            this.mostrarLoading('Preparando pagamento...');
            
            const userId = this.getUserId();
            const email = this.getUserEmail();
            
            // Criar sessão no backend
            const response = await fetch(`${this.config.apiUrl}/api/pagamento/stripe/criar-sessao`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plano,
                    userId,
                    email,
                    successUrl: `${window.location.origin}/pagamento-sucesso`,
                    cancelUrl: `${window.location.origin}/premium`
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erro ao criar sessão');
            }
            
            this.esconderLoading();
            
            // Redirecionar para Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            }
            
        } catch (error) {
            console.error('Erro Stripe:', error);
            this.esconderLoading();
            this.mostrarErro('Erro ao processar pagamento. Tente novamente.');
        }
    },
    
    // ========================================
    // MERCADO PAGO - PIX
    // ========================================
    
    async pagarComPix(plano) {
        try {
            this.mostrarLoading('Gerando código PIX...');
            
            const userId = this.getUserId();
            const email = this.getUserEmail();
            const nome = this.getUserNome();
            
            // Criar pagamento PIX no backend
            const response = await fetch(`${this.config.apiUrl}/api/pagamento/pix/criar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plano, userId, email, nome })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erro ao gerar PIX');
            }
            
            this.esconderLoading();
            this.currentPaymentId = data.paymentId;
            
            // Mostrar modal do PIX
            this.mostrarModalPix(data, plano);
            
            // Começar a verificar status
            this.iniciarPollingPix(data.paymentId, plano);
            
        } catch (error) {
            console.error('Erro PIX:', error);
            this.esconderLoading();
            this.mostrarErro('Erro ao gerar PIX. Tente novamente.');
        }
    },
    
    mostrarModalPix(data, plano) {
        const valores = {
            mensal: { preco: 'R$ 19,90', periodo: 'mensal' },
            anual: { preco: 'R$ 119,90', periodo: 'anual' }
        };
        
        const planoInfo = valores[plano];
        
        const modal = document.createElement('div');
        modal.id = 'modal-pix';
        modal.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto';
        modal.style.background = 'rgba(0,0,0,0.95)';
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-emerald-900/90 to-teal-900/90 rounded-3xl p-6 max-w-sm w-full border border-emerald-500/30 shadow-2xl my-4">
                <!-- Header -->
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                            <span class="text-xl">🇧🇷</span>
                        </div>
                        <div>
                            <h2 class="text-white font-bold">Pagar com PIX</h2>
                            <p class="text-emerald-400 text-xs">Aprovação instantânea</p>
                        </div>
                    </div>
                    <button onclick="PagamentoService.fecharModalPix()" class="p-2 bg-white/10 rounded-full hover:bg-white/20">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                <!-- Valor -->
                <div class="text-center mb-4">
                    <p class="text-white/60 text-sm">Maria Premium ${planoInfo.periodo}</p>
                    <p class="text-3xl font-bold text-white">${planoInfo.preco}</p>
                </div>
                
                <!-- QR Code -->
                <div class="bg-white rounded-2xl p-4 mb-4">
                    ${data.qrCodeBase64 
                        ? `<img src="data:image/png;base64,${data.qrCodeBase64}" alt="QR Code PIX" class="w-full max-w-[200px] mx-auto">`
                        : `<div class="w-[200px] h-[200px] mx-auto bg-gray-200 flex items-center justify-center rounded-xl">
                            <span class="text-gray-500">QR Code</span>
                           </div>`
                    }
                </div>
                
                <!-- Código Copia e Cola -->
                <div class="mb-4">
                    <p class="text-white/60 text-xs mb-2 text-center">Ou copie o código:</p>
                    <div class="bg-black/30 rounded-xl p-3 flex items-center gap-2">
                        <input type="text" 
                               id="pix-code" 
                               value="${data.qrCode || ''}" 
                               readonly
                               class="flex-1 bg-transparent text-white/80 text-xs outline-none truncate">
                        <button onclick="PagamentoService.copiarCodigoPix()" 
                                class="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-400 transition-all">
                            Copiar
                        </button>
                    </div>
                </div>
                
                <!-- Status -->
                <div id="pix-status" class="bg-yellow-500/20 rounded-xl p-3 mb-4 border border-yellow-500/30">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <p class="text-yellow-400 text-sm font-medium">Aguardando pagamento...</p>
                    </div>
                    <p class="text-white/50 text-xs mt-1">O pagamento será confirmado automaticamente</p>
                </div>
                
                <!-- Instruções -->
                <div class="bg-white/5 rounded-xl p-3">
                    <p class="text-white/80 text-xs font-medium mb-2">Como pagar:</p>
                    <ol class="text-white/60 text-xs space-y-1">
                        <li>1. Abra o app do seu banco</li>
                        <li>2. Escolha pagar com PIX</li>
                        <li>3. Escaneie o QR Code ou cole o código</li>
                        <li>4. Confirme o pagamento</li>
                    </ol>
                </div>
                
                <!-- Tempo restante -->
                <p class="text-center text-white/40 text-xs mt-4">
                    ⏰ PIX válido por 30 minutos
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    copiarCodigoPix() {
        const input = document.getElementById('pix-code');
        if (input) {
            navigator.clipboard.writeText(input.value);
            if (window.showToast) {
                showToast('✓ Código PIX copiado!');
            }
        }
    },
    
    iniciarPollingPix(paymentId, plano) {
        // Verificar status a cada 3 segundos
        this.pixPollingInterval = setInterval(async () => {
            try {
                const response = await fetch(`${this.config.apiUrl}/api/pagamento/pix/status/${paymentId}`);
                const data = await response.json();
                
                if (data.status === 'approved') {
                    // Pagamento aprovado!
                    this.pararPollingPix();
                    this.atualizarStatusPix('aprovado');
                    
                    // Ativar premium
                    await this.ativarPremium(plano);
                    
                    // Fechar modal e mostrar sucesso
                    setTimeout(() => {
                        this.fecharModalPix();
                        this.mostrarSucessoPagamento(plano);
                    }, 2000);
                    
                } else if (data.status === 'rejected' || data.status === 'cancelled') {
                    this.pararPollingPix();
                    this.atualizarStatusPix('erro');
                }
                
            } catch (error) {
                console.error('Erro polling PIX:', error);
            }
        }, 3000);
        
        // Parar após 30 minutos
        setTimeout(() => {
            this.pararPollingPix();
        }, 30 * 60 * 1000);
    },
    
    pararPollingPix() {
        if (this.pixPollingInterval) {
            clearInterval(this.pixPollingInterval);
            this.pixPollingInterval = null;
        }
    },
    
    atualizarStatusPix(status) {
        const statusEl = document.getElementById('pix-status');
        if (!statusEl) return;
        
        if (status === 'aprovado') {
            statusEl.className = 'bg-green-500/20 rounded-xl p-3 mb-4 border border-green-500/30';
            statusEl.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="text-2xl">✓</span>
                    <p class="text-green-400 text-sm font-bold">Pagamento confirmado!</p>
                </div>
                <p class="text-white/70 text-xs mt-1">Ativando seu Premium...</p>
            `;
        } else if (status === 'erro') {
            statusEl.className = 'bg-red-500/20 rounded-xl p-3 mb-4 border border-red-500/30';
            statusEl.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="text-2xl">✗</span>
                    <p class="text-red-400 text-sm font-bold">Pagamento não realizado</p>
                </div>
                <p class="text-white/70 text-xs mt-1">Tente novamente ou escolha outro método</p>
            `;
        }
    },
    
    fecharModalPix() {
        this.pararPollingPix();
        const modal = document.getElementById('modal-pix');
        if (modal) modal.remove();
    },
    
    // ========================================
    // ATIVAR PREMIUM
    // ========================================
    
    async ativarPremium(plano) {
        const duracaoDias = plano === 'anual' ? 365 : 30;
        
        // Ativar via Firebase se disponível
        if (typeof PremiumService !== 'undefined') {
            await PremiumService.ativarPremium(plano, duracaoDias);
        }
        
        // Salvar localmente
        localStorage.setItem('mariaPremium', 'true');
        localStorage.setItem('mariaPremiumData', JSON.stringify({
            ativo: true,
            plano: plano,
            ativadoEm: new Date().toISOString(),
            expiraEm: new Date(Date.now() + duracaoDias * 24 * 60 * 60 * 1000).toISOString()
        }));
        
        // Desativar anúncios
        if (typeof AdMobService !== 'undefined') {
            AdMobService.onPremiumActivated();
        }
    },
    
    // ========================================
    // UI HELPERS
    // ========================================
    
    mostrarSucessoPagamento(plano) {
        const sucesso = document.createElement('div');
        sucesso.id = 'sucesso-pagamento';
        sucesso.className = 'fixed inset-0 z-[250] flex items-center justify-center p-4';
        sucesso.style.background = 'linear-gradient(180deg, #0a0612 0%, #1a0a2e 100%)';
        
        sucesso.innerHTML = `
            <div class="text-center animate-scale-in py-8">
                <div id="confetes-pag" class="fixed inset-0 pointer-events-none overflow-hidden"></div>
                
                <div class="relative z-10">
                    <div class="w-28 h-28 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
                        <span class="text-6xl">👑</span>
                    </div>
                    
                    <h1 class="text-3xl font-bold text-white mb-2">Parabéns!</h1>
                    <p class="text-yellow-400 font-semibold text-lg mb-4">Você é Maria Premium!</p>
                    
                    <p class="text-white/70 text-sm mb-6 max-w-xs mx-auto">
                        Seu plano ${plano === 'anual' ? 'anual' : 'mensal'} está ativo.
                        Maria está muito feliz em ter você mais perto!
                    </p>
                    
                    ${plano === 'anual' ? `
                        <div class="bg-gradient-to-br from-yellow-900/40 to-amber-900/30 rounded-2xl p-4 mb-6 mx-4 border border-yellow-500/30">
                            <div class="flex items-center gap-3">
                                <span class="text-3xl">🏅</span>
                                <div class="text-left">
                                    <p class="text-white font-bold text-sm">Sua medalha está a caminho!</p>
                                    <p class="text-yellow-400/80 text-xs">Prazo: até 15 dias úteis</p>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    <button onclick="document.getElementById('sucesso-pagamento').remove(); TelaPremium?.fechar();" 
                            class="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-2xl shadow-lg hover:from-yellow-400 hover:to-orange-400 transition-all">
                        Começar a Usar 🙏
                    </button>
                </div>
            </div>
            
            <style>
                @keyframes scale-in {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in { animation: scale-in 0.4s ease-out; }
            </style>
        `;
        
        document.body.appendChild(sucesso);
        this.criarConfetes();
    },
    
    criarConfetes() {
        const container = document.getElementById('confetes-pag');
        if (!container) return;
        
        const cores = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB', '#98FB98'];
        
        for (let i = 0; i < 50; i++) {
            const confete = document.createElement('div');
            confete.style.cssText = `
                position: absolute;
                width: ${5 + Math.random() * 10}px;
                height: ${5 + Math.random() * 10}px;
                background: ${cores[Math.floor(Math.random() * cores.length)]};
                left: ${Math.random() * 100}%;
                top: -20px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: confete-fall ${2 + Math.random() * 3}s linear forwards;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(confete);
        }
    },
    
    mostrarLoading(mensagem) {
        const loading = document.createElement('div');
        loading.id = 'loading-pagamento';
        loading.className = 'fixed inset-0 z-[300] flex items-center justify-center';
        loading.style.background = 'rgba(0,0,0,0.95)';
        loading.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
                <p class="text-white font-semibold">${mensagem}</p>
            </div>
        `;
        document.body.appendChild(loading);
    },
    
    esconderLoading() {
        const loading = document.getElementById('loading-pagamento');
        if (loading) loading.remove();
    },
    
    mostrarErro(mensagem) {
        const erro = document.createElement('div');
        erro.className = 'fixed bottom-4 left-4 right-4 z-[300] bg-red-500/90 text-white p-4 rounded-xl text-center animate-slide-up';
        erro.innerHTML = `<p>${mensagem}</p>`;
        document.body.appendChild(erro);
        
        setTimeout(() => erro.remove(), 4000);
    },
    
    // ========================================
    // HELPERS
    // ========================================
    
    getUserId() {
        if (typeof FirebaseService !== 'undefined' && FirebaseService.getCurrentUser()) {
            return FirebaseService.getCurrentUser().uid;
        }
        let id = localStorage.getItem('maria_user_id');
        if (!id) {
            id = 'anon_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('maria_user_id', id);
        }
        return id;
    },
    
    getUserEmail() {
        if (typeof FirebaseService !== 'undefined' && FirebaseService.getCurrentUser()) {
            return FirebaseService.getCurrentUser().email;
        }
        return localStorage.getItem('maria_user_email') || null;
    },
    
    getUserNome() {
        const profile = localStorage.getItem('mariaUserProfile');
        if (profile) {
            return JSON.parse(profile).nome;
        }
        return null;
    }
};

// ========================================
// EXPORTAR
// ========================================

window.PagamentoService = PagamentoService;

console.log('💳 Sistema de Pagamentos carregado!');
