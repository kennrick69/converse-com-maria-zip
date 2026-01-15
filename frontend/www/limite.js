// ========================================
// 🔒 SISTEMA DE LIMITE DE MENSAGENS
// Monetização Freemium - 3 mensagens gratuitas
// ========================================

const SistemaMensagens = {
    // Configurações
    LIMITE_DIARIO_GRATIS: 3,
    
    // Carregar dados do dia
    carregarDados() {
        const hoje = new Date().toISOString().split('T')[0];
        const salvo = localStorage.getItem('mariaMensagensDia');
        
        if (salvo) {
            const dados = JSON.parse(salvo);
            if (dados.data !== hoje) {
                // Novo dia, resetar contagem
                return { data: hoje, contagem: 0, mensagensEnviadas: 0 };
            }
            return dados;
        }
        
        return { data: hoje, contagem: 0, mensagensEnviadas: 0 };
    },

    // Salvar dados
    salvarDados(dados) {
        localStorage.setItem('mariaMensagensDia', JSON.stringify(dados));
    },

    // Obter número da mensagem atual (1, 2, 3...)
    getNumeroMensagemAtual() {
        const dados = this.carregarDados();
        return dados.mensagensEnviadas + 1;
    },

    // Verificar se pode enviar
    podeEnviar() {
        if (this.isPremium()) return true;
        const dados = this.carregarDados();
        return dados.contagem < this.LIMITE_DIARIO_GRATIS;
    },

    // Registrar mensagem enviada
    registrarMensagem() {
        if (this.isPremium()) return true;
        
        const dados = this.carregarDados();
        dados.contagem++;
        dados.mensagensEnviadas++;
        this.salvarDados(dados);
        this.atualizarContador();
        
        const restantes = this.LIMITE_DIARIO_GRATIS - dados.contagem;
        this.mostrarLembreteSuave(restantes);
        
        if (dados.contagem >= this.LIMITE_DIARIO_GRATIS) {
            setTimeout(() => this.mostrarAvisoLimite(), 1500);
        }
        
        return true;
    },

    // Verificar premium
    isPremium() {
        if (window.TelaPremium && TelaPremium.isPremium) {
            return TelaPremium.isPremium();
        }
        const data = localStorage.getItem('mariaPremium');
        if (data) {
            const premium = JSON.parse(data);
            return premium.ativo === true;
        }
        return false;
    },

    // Obter mensagens restantes
    getMensagensRestantes() {
        if (this.isPremium()) return '∞';
        const dados = this.carregarDados();
        return Math.max(0, this.LIMITE_DIARIO_GRATIS - dados.contagem);
    },

    // Atualizar contador na UI
    atualizarContador() {
        const contador = document.getElementById('contador-mensagens');
        if (contador) {
            const restantes = this.getMensagensRestantes();
            if (restantes === '∞') {
                contador.innerHTML = '💬 <span class="text-green-400">∞</span>';
                contador.title = 'Premium - Mensagens ilimitadas';
            } else {
                const corClasse = restantes === 0 ? 'text-red-400' : restantes === 1 ? 'text-yellow-400' : 'text-white';
                contador.innerHTML = `💬 <span class="${corClasse}">${restantes}</span>/${this.LIMITE_DIARIO_GRATIS}`;
                contador.title = `${restantes} mensagens restantes hoje`;
            }
        }
    },

    // Mostrar aviso de limite
    mostrarAvisoLimite() {
        const modal = document.createElement('div');
        modal.id = 'modal-limite';
        modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-4';
        modal.style.background = 'rgba(0,0,0,0.9)';
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-purple-900/80 rounded-3xl w-full max-w-md p-6 text-center animate-scale-in">
                <div class="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center">
                    <span class="text-5xl">🙏</span>
                </div>
                
                <h2 class="text-white text-2xl font-bold mb-2">Suas mensagens acabaram</h2>
                <p class="text-white/60 mb-4">Você usou suas ${this.LIMITE_DIARIO_GRATIS} mensagens gratuitas de hoje.</p>
                
                <div class="bg-white/5 rounded-xl p-4 mb-6">
                    <p class="text-white/50 text-sm mb-1">Novas mensagens em:</p>
                    <p class="text-2xl font-bold text-white" id="timer-reset">${this.getTempoReset()}</p>
                </div>
                
                <div class="space-y-3">
                    <button onclick="document.getElementById('modal-limite').remove(); if(window.TelaPremium) TelaPremium.abrir('💬 Continue sua conversa com Maria!');" 
                            class="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all flex items-center justify-center gap-2">
                        <span>👑</span>
                        <span>Continuar com Premium</span>
                    </button>
                    
                    <p class="text-white/50 text-sm">Com Premium, converse sem limites!</p>
                    
                    <div class="text-white/40 text-sm mt-4">Enquanto isso, explore:</div>
                    
                    <div class="grid grid-cols-3 gap-2">
                        <button onclick="document.getElementById('modal-limite').remove(); if(window.abrirTerco) abrirTerco();" 
                                class="py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex flex-col items-center gap-1">
                            <span class="text-xl">📿</span>
                            <span class="text-[10px]">Terço</span>
                        </button>
                        <button onclick="document.getElementById('modal-limite').remove(); if(window.abrirSantuarioVelas) abrirSantuarioVelas();" 
                                class="py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex flex-col items-center gap-1">
                            <span class="text-xl">🕯️</span>
                            <span class="text-[10px]">Velas</span>
                        </button>
                        <button onclick="document.getElementById('modal-limite').remove(); if(window.abrirMuralIntencoes) abrirMuralIntencoes();" 
                                class="py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex flex-col items-center gap-1">
                            <span class="text-xl">🙏</span>
                            <span class="text-[10px]">Mural</span>
                        </button>
                    </div>
                </div>
                
                <button onclick="document.getElementById('modal-limite').remove()" class="w-full mt-4 py-3 text-white/50 hover:text-white transition-all text-sm">
                    Voltar amanhã
                </button>
            </div>
            
            <style>
                @keyframes scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in { animation: scale-in 0.3s ease-out; }
            </style>
        `;
        
        document.body.appendChild(modal);
        this.iniciarTimerReset();
    },

    // Obter tempo até reset
    getTempoReset() {
        const agora = new Date();
        const amanha = new Date(agora);
        amanha.setDate(amanha.getDate() + 1);
        amanha.setHours(0, 0, 0, 0);
        
        const diff = amanha - agora;
        const horas = Math.floor(diff / (1000 * 60 * 60));
        const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    },

    // Timer de reset
    timerInterval: null,
    iniciarTimerReset() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            const timer = document.getElementById('timer-reset');
            if (timer) {
                timer.textContent = this.getTempoReset();
            } else {
                clearInterval(this.timerInterval);
            }
        }, 1000);
    },

    // Mostrar lembrete suave
    mostrarLembreteSuave(restantes) {
        if (restantes === 2) {
            setTimeout(() => {
                if (window.showToast) showToast('💬 Você tem 2 mensagens restantes hoje');
            }, 1500);
        } else if (restantes === 1) {
            setTimeout(() => {
                if (window.showToast) showToast('⚠️ Última mensagem gratuita do dia!');
            }, 1500);
        }
    },

    // Inicializar
    init() {
        this.atualizarContador();
    }
};

// Inicializar ao carregar
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => SistemaMensagens.init(), 1000);
});

window.SistemaMensagens = SistemaMensagens;
