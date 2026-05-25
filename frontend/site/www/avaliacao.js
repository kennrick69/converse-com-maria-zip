// ========================================
// ⭐ SISTEMA DE AVALIAÇÃO - PLAY STORE
// Converse com Maria
// Incentivo para avaliar + 1 mês Premium grátis
// ========================================

const AvaliacaoService = {
    // Configuração
    config: {
        // Link da Play Store (substituir pelo real)
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.conversemaria.app',
        
        // Quando mostrar o popup
        diasAposInstalacao: 3,    // Esperar X dias após instalar
        sessoesMinimasUso: 5,     // Após X sessões de uso
        mensagensMinimasEnviadas: 10, // Após enviar X mensagens
        
        // Controle de frequência
        intervaloEntrePedidos: 7, // Dias entre cada pedido
    },
    
    // Estado
    avaliacaoRegistrada: false,
    
    // ========================================
    // INICIALIZAÇÃO
    // ========================================
    
    init() {
        // Carregar estado
        this.loadState();
        
        // Verificar se deve mostrar popup
        this.checkAndShow();
        
        console.log('⭐ Sistema de Avaliação carregado');
    },
    
    loadState() {
        const state = localStorage.getItem('maria_avaliacao');
        if (state) {
            const data = JSON.parse(state);
            this.avaliacaoRegistrada = data.avaliacaoRegistrada || false;
        }
    },
    
    saveState() {
        localStorage.setItem('maria_avaliacao', JSON.stringify({
            avaliacaoRegistrada: this.avaliacaoRegistrada,
            ultimoPedido: Date.now(),
            premiumConcedido: this.avaliacaoRegistrada
        }));
    },
    
    // ========================================
    // VERIFICAR SE DEVE MOSTRAR
    // ========================================
    
    checkAndShow() {
        // Já avaliou? Não mostrar mais
        if (this.avaliacaoRegistrada) return;
        
        // Já é premium? Não precisa
        if (this.isPremium()) return;
        
        // Verificar critérios
        const stats = this.getUserStats();
        
        // Aguardar período inicial
        if (stats.diasDesdeInstalacao < this.config.diasAposInstalacao) return;
        
        // Aguardar uso mínimo
        if (stats.totalMensagens < this.config.mensagensMinimasEnviadas) return;
        
        // Verificar último pedido
        const ultimoPedido = localStorage.getItem('maria_ultimo_pedido_avaliacao');
        if (ultimoPedido) {
            const diasDesdeUltimo = (Date.now() - parseInt(ultimoPedido)) / (1000 * 60 * 60 * 24);
            if (diasDesdeUltimo < this.config.intervaloEntrePedidos) return;
        }
        
        // Mostrar popup com delay (não na abertura imediata)
        setTimeout(() => {
            this.mostrarPopup();
        }, 30000); // Após 30 segundos de uso
    },
    
    getUserStats() {
        // Pegar estatísticas do usuário
        const primeiroUso = localStorage.getItem('maria_primeiro_uso') || Date.now();
        const totalMensagens = parseInt(localStorage.getItem('maria_total_mensagens') || '0');
        
        // Salvar primeiro uso se não existir
        if (!localStorage.getItem('maria_primeiro_uso')) {
            localStorage.setItem('maria_primeiro_uso', Date.now().toString());
        }
        
        return {
            diasDesdeInstalacao: (Date.now() - parseInt(primeiroUso)) / (1000 * 60 * 60 * 24),
            totalMensagens: totalMensagens
        };
    },
    
    isPremium() {
        if (typeof PremiumService !== 'undefined') {
            return PremiumService.isPremium();
        }
        return localStorage.getItem('mariaPremium') === 'true';
    },
    
    // ========================================
    // POPUP DE AVALIAÇÃO
    // ========================================
    
    mostrarPopup() {
        // Registrar que pediu
        localStorage.setItem('maria_ultimo_pedido_avaliacao', Date.now().toString());
        
        const popup = document.createElement('div');
        popup.id = 'popup-avaliacao';
        popup.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4';
        popup.style.background = 'rgba(0,0,0,0.9)';
        
        popup.innerHTML = `
            <div class="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-3xl p-6 max-w-sm w-full animate-scale-in border border-purple-500/30 shadow-2xl">
                <!-- Header -->
                <div class="text-center mb-4">
                    <div class="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                        <span class="text-4xl">🙏</span>
                    </div>
                    <h2 class="text-xl font-bold text-white mb-1">
                        Está gostando do app?
                    </h2>
                    <p class="text-white/70 text-sm">
                        Sua opinião é muito importante para nós!
                    </p>
                </div>
                
                <!-- Recompensa -->
                <div class="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 mb-4 border border-yellow-500/30">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shrink-0">
                            <span class="text-2xl">👑</span>
                        </div>
                        <div>
                            <p class="text-yellow-400 font-bold text-sm">
                                🎁 PRESENTE ESPECIAL
                            </p>
                            <p class="text-white text-sm">
                                Avalie com ⭐⭐⭐⭐⭐ e ganhe <strong>1 mês Premium GRÁTIS!</strong>
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Estrelas animadas -->
                <div class="flex justify-center gap-1 mb-5">
                    ${[1,2,3,4,5].map(i => `
                        <span class="text-3xl animate-bounce" style="animation-delay: ${i * 0.1}s">⭐</span>
                    `).join('')}
                </div>
                
                <!-- Botões -->
                <div class="space-y-3">
                    <button onclick="AvaliacaoService.avaliarAgora()" class="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all shadow-lg flex items-center justify-center gap-2">
                        <span>⭐</span>
                        <span>SIM! Quero Avaliar</span>
                    </button>
                    
                    <button onclick="AvaliacaoService.fecharPopup('depois')" class="w-full py-3 bg-white/10 text-white/80 font-medium rounded-xl hover:bg-white/20 transition-all text-sm">
                        Talvez depois
                    </button>
                    
                    <button onclick="AvaliacaoService.fecharPopup('nao')" class="w-full py-2 text-white/40 font-medium text-xs hover:text-white/60 transition-all">
                        Não, obrigado
                    </button>
                </div>
                
                <!-- Nota -->
                <p class="text-center text-white/40 text-xs mt-4">
                    Maria agradece sua ajuda 💙
                </p>
            </div>
            
            <style>
                @keyframes scale-in {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in { animation: scale-in 0.3s ease-out; }
            </style>
        `;
        
        document.body.appendChild(popup);
    },
    
    fecharPopup(motivo) {
        const popup = document.getElementById('popup-avaliacao');
        if (popup) popup.remove();
        
        if (motivo === 'nao') {
            // Não mostrar mais por muito tempo
            localStorage.setItem('maria_avaliacao_recusada', 'true');
        }
        
        console.log('⭐ Popup fechado:', motivo);
    },
    
    // ========================================
    // AVALIAR NA PLAY STORE
    // ========================================
    
    async avaliarAgora() {
        this.fecharPopup('avaliar');
        
        // Abrir Play Store
        if (window.Capacitor?.isNativePlatform()) {
            // App nativo - usar plugin
            try {
                const { AppLauncher } = await import('@capacitor/app-launcher');
                await AppLauncher.openUrl({ url: this.config.playStoreUrl });
            } catch (e) {
                window.open(this.config.playStoreUrl, '_blank');
            }
        } else {
            // Browser - abrir em nova aba
            window.open(this.config.playStoreUrl, '_blank');
        }
        
        // Mostrar popup de confirmação após voltar
        setTimeout(() => {
            this.mostrarConfirmacao();
        }, 2000);
    },
    
    // ========================================
    // CONFIRMAÇÃO DE AVALIAÇÃO
    // ========================================
    
    mostrarConfirmacao() {
        const popup = document.createElement('div');
        popup.id = 'popup-confirmacao-avaliacao';
        popup.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4';
        popup.style.background = 'rgba(0,0,0,0.9)';
        
        popup.innerHTML = `
            <div class="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-3xl p-6 max-w-sm w-full animate-scale-in border border-purple-500/30 shadow-2xl">
                <div class="text-center">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <span class="text-3xl">✓</span>
                    </div>
                    
                    <h2 class="text-xl font-bold text-white mb-2">
                        Você avaliou com 5 estrelas?
                    </h2>
                    
                    <p class="text-white/70 text-sm mb-6">
                        Confirme para receber seu mês Premium grátis!
                    </p>
                    
                    <div class="space-y-3">
                        <button onclick="AvaliacaoService.confirmarAvaliacao()" class="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all shadow-lg">
                            <span>⭐⭐⭐⭐⭐</span>
                            <span class="block text-sm mt-1">Sim, avaliei com 5 estrelas!</span>
                        </button>
                        
                        <button onclick="document.getElementById('popup-confirmacao-avaliacao').remove()" class="w-full py-3 bg-white/10 text-white/80 font-medium rounded-xl hover:bg-white/20 transition-all text-sm">
                            Ainda não terminei
                        </button>
                    </div>
                    
                    <p class="text-white/40 text-xs mt-4">
                        Confiamos em você! 🙏
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
    },
    
    // ========================================
    // CONFIRMAR E CONCEDER PREMIUM
    // ========================================
    
    async confirmarAvaliacao() {
        const popup = document.getElementById('popup-confirmacao-avaliacao');
        if (popup) popup.remove();
        
        // Mostrar loading
        this.mostrarLoading();
        
        try {
            // Enviar para backend
            const userId = this.getUserId();
            const email = this.getUserEmail();
            
            const response = await fetch(`${window.API_URL || ''}/api/avaliacao/verificar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, email })
            });
            
            const result = await response.json();
            
            // Registrar localmente
            this.avaliacaoRegistrada = true;
            this.saveState();
            
            // Ativar premium localmente também
            if (typeof PremiumService !== 'undefined') {
                await PremiumService.ativarPremium('avaliacao', 30);
            } else {
                localStorage.setItem('mariaPremium', 'true');
                localStorage.setItem('mariaPremiumData', JSON.stringify({
                    ativo: true,
                    plano: 'avaliacao',
                    expiraEm: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }));
            }
            
            // Desativar anúncios
            if (typeof AdMobService !== 'undefined') {
                AdMobService.onPremiumActivated();
            }
            
            // Esconder loading e mostrar sucesso
            this.esconderLoading();
            this.mostrarSucesso();
            
        } catch (error) {
            console.error('Erro ao processar avaliação:', error);
            this.esconderLoading();
            
            // Ainda conceder localmente mesmo se backend falhar
            this.avaliacaoRegistrada = true;
            this.saveState();
            localStorage.setItem('mariaPremium', 'true');
            
            this.mostrarSucesso();
        }
    },
    
    // ========================================
    // UI HELPERS
    // ========================================
    
    mostrarLoading() {
        const loading = document.createElement('div');
        loading.id = 'loading-avaliacao';
        loading.className = 'fixed inset-0 z-[250] flex items-center justify-center';
        loading.style.background = 'rgba(0,0,0,0.95)';
        loading.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
                <p class="text-white font-semibold">Ativando seu Premium...</p>
            </div>
        `;
        document.body.appendChild(loading);
    },
    
    esconderLoading() {
        const loading = document.getElementById('loading-avaliacao');
        if (loading) loading.remove();
    },
    
    mostrarSucesso() {
        const sucesso = document.createElement('div');
        sucesso.id = 'sucesso-avaliacao';
        sucesso.className = 'fixed inset-0 z-[250] flex items-center justify-center p-4';
        sucesso.style.background = 'rgba(0,0,0,0.95)';
        
        sucesso.innerHTML = `
            <div class="text-center animate-scale-in">
                <!-- Confetes -->
                <div id="confetes-avaliacao" class="fixed inset-0 pointer-events-none overflow-hidden"></div>
                
                <div class="relative z-10">
                    <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl">
                        <span class="text-5xl">👑</span>
                    </div>
                    
                    <h1 class="text-2xl font-bold text-white mb-2">Parabéns!</h1>
                    <p class="text-yellow-400 font-semibold mb-4">30 dias de Premium ativados!</p>
                    
                    <div class="bg-white/10 backdrop-blur rounded-2xl p-4 mb-6 max-w-xs mx-auto">
                        <p class="text-white/90 text-sm">
                            Maria agradece muito sua avaliação! 🙏<br>
                            Aproveite todos os benefícios Premium!
                        </p>
                    </div>
                    
                    <ul class="text-left max-w-xs mx-auto mb-6 space-y-2">
                        <li class="flex items-center gap-2 text-white/80 text-sm">
                            <span class="text-green-400">✓</span> Conversas ilimitadas
                        </li>
                        <li class="flex items-center gap-2 text-white/80 text-sm">
                            <span class="text-green-400">✓</span> Sem anúncios
                        </li>
                        <li class="flex items-center gap-2 text-white/80 text-sm">
                            <span class="text-green-400">✓</span> Terço completo
                        </li>
                        <li class="flex items-center gap-2 text-white/80 text-sm">
                            <span class="text-green-400">✓</span> Velas especiais
                        </li>
                    </ul>
                    
                    <button onclick="document.getElementById('sucesso-avaliacao').remove()" class="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-2xl shadow-lg hover:from-yellow-400 hover:to-orange-400 transition-all">
                        Começar a Usar 🙏
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(sucesso);
        this.criarConfetes();
    },
    
    criarConfetes() {
        const container = document.getElementById('confetes-avaliacao');
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
                opacity: ${0.7 + Math.random() * 0.3};
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: confete-cair ${2 + Math.random() * 3}s linear forwards;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(confete);
        }
        
        if (!document.getElementById('confete-cair-style')) {
            const style = document.createElement('style');
            style.id = 'confete-cair-style';
            style.textContent = `
                @keyframes confete-cair {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(100vh) rotate(720deg); }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
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
        return null;
    }
};

// ========================================
// AUTO-INICIALIZAR
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        AvaliacaoService.init();
    }, 5000); // Aguardar 5s após carregar
});

window.AvaliacaoService = AvaliacaoService;

console.log('⭐ Sistema de Avaliação carregado!');
