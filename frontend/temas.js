// ========================================
// 🎨 SISTEMA DE TEMAS VISUAIS
// Personalize sua experiência
// ========================================

const SistemaTemas = {
    // Temas disponíveis
    temas: {
        padrao: {
            id: 'padrao',
            nome: 'Dourado Celestial',
            descricao: 'O tema clássico do app',
            icone: '✨',
            premium: false,
            cores: {
                primary: '#D4A574',
                secondary: '#8B6914',
                background: 'linear-gradient(180deg, #D4A574 0%, #C49A6C 50%, #B8956A 100%)',
                cardBg: 'rgba(255, 255, 255, 0.15)',
                text: '#1a1a2e',
                textLight: 'rgba(26, 26, 46, 0.7)',
                accent: '#FFD700',
                headerBg: 'linear-gradient(135deg, #D4A574 0%, #C49A6C 100%)'
            }
        },
        aparecida: {
            id: 'aparecida',
            nome: 'Aparecida',
            descricao: 'Azul e dourado da Padroeira',
            icone: '🇧🇷',
            premium: false,
            cores: {
                primary: '#1E3A5F',
                secondary: '#0D2137',
                background: 'linear-gradient(180deg, #1E3A5F 0%, #152C4A 50%, #0D2137 100%)',
                cardBg: 'rgba(255, 255, 255, 0.1)',
                text: '#FFFFFF',
                textLight: 'rgba(255, 255, 255, 0.7)',
                accent: '#FFD700',
                headerBg: 'linear-gradient(135deg, #1E3A5F 0%, #2A4A73 100%)'
            }
        },
        fatima: {
            id: 'fatima',
            nome: 'Fátima',
            descricao: 'Verde e branco de Portugal',
            icone: '🇵🇹',
            premium: false,
            cores: {
                primary: '#1B5E20',
                secondary: '#0D3311',
                background: 'linear-gradient(180deg, #1B5E20 0%, #145218 50%, #0D3311 100%)',
                cardBg: 'rgba(255, 255, 255, 0.1)',
                text: '#FFFFFF',
                textLight: 'rgba(255, 255, 255, 0.7)',
                accent: '#FFEB3B',
                headerBg: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)'
            }
        },
        guadalupe: {
            id: 'guadalupe',
            nome: 'Guadalupe',
            descricao: 'Rosa e turquesa mexicano',
            icone: '🇲🇽',
            premium: true,
            cores: {
                primary: '#C2185B',
                secondary: '#880E4F',
                background: 'linear-gradient(180deg, #C2185B 0%, #AD1457 50%, #880E4F 100%)',
                cardBg: 'rgba(255, 255, 255, 0.12)',
                text: '#FFFFFF',
                textLight: 'rgba(255, 255, 255, 0.7)',
                accent: '#00BCD4',
                headerBg: 'linear-gradient(135deg, #C2185B 0%, #E91E63 100%)'
            }
        },
        lourdes: {
            id: 'lourdes',
            nome: 'Lourdes',
            descricao: 'Azul celeste da França',
            icone: '🇫🇷',
            premium: true,
            cores: {
                primary: '#0288D1',
                secondary: '#01579B',
                background: 'linear-gradient(180deg, #0288D1 0%, #0277BD 50%, #01579B 100%)',
                cardBg: 'rgba(255, 255, 255, 0.12)',
                text: '#FFFFFF',
                textLight: 'rgba(255, 255, 255, 0.7)',
                accent: '#FFFFFF',
                headerBg: 'linear-gradient(135deg, #0288D1 0%, #03A9F4 100%)'
            }
        },
        carmo: {
            id: 'carmo',
            nome: 'Nossa Senhora do Carmo',
            descricao: 'Marrom carmelita',
            icone: '📿',
            premium: true,
            cores: {
                primary: '#5D4037',
                secondary: '#3E2723',
                background: 'linear-gradient(180deg, #5D4037 0%, #4E342E 50%, #3E2723 100%)',
                cardBg: 'rgba(255, 255, 255, 0.1)',
                text: '#FFFFFF',
                textLight: 'rgba(255, 255, 255, 0.7)',
                accent: '#FFD54F',
                headerBg: 'linear-gradient(135deg, #5D4037 0%, #6D4C41 100%)'
            }
        },
        imaculada: {
            id: 'imaculada',
            nome: 'Imaculada Conceição',
            descricao: 'Branco e azul celestial',
            icone: '👑',
            premium: true,
            cores: {
                primary: '#E8EAF6',
                secondary: '#C5CAE9',
                background: 'linear-gradient(180deg, #E8EAF6 0%, #C5CAE9 50%, #9FA8DA 100%)',
                cardBg: 'rgba(63, 81, 181, 0.1)',
                text: '#1A237E',
                textLight: 'rgba(26, 35, 126, 0.7)',
                accent: '#3F51B5',
                headerBg: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)'
            }
        },
        noturno: {
            id: 'noturno',
            nome: 'Modo Noturno',
            descricao: 'Escuro para oração noturna',
            icone: '🌙',
            premium: false,
            cores: {
                primary: '#1a1a2e',
                secondary: '#0f0f1a',
                background: 'linear-gradient(180deg, #1a1a2e 0%, #16162a 50%, #0f0f1a 100%)',
                cardBg: 'rgba(255, 255, 255, 0.05)',
                text: '#FFFFFF',
                textLight: 'rgba(255, 255, 255, 0.6)',
                accent: '#BB86FC',
                headerBg: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)'
            }
        }
    },

    // Tema atual
    temaAtual: 'padrao',

    // Inicializar
    init() {
        const salvo = localStorage.getItem('mariaTema');
        if (salvo && this.temas[salvo]) {
            this.aplicarTema(salvo, false);
        }
    },

    // Aplicar tema
    aplicarTema(temaId, salvar = true) {
        const tema = this.temas[temaId];
        if (!tema) return;
        
        // Verificar se é premium
        if (tema.premium && !this.isPremium()) {
            if (window.TelaPremium) {
                TelaPremium.abrir('🎨 Desbloqueie temas exclusivos com o Premium!');
            }
            return;
        }
        
        this.temaAtual = temaId;
        
        // Aplicar CSS customizado
        let style = document.getElementById('tema-custom');
        if (!style) {
            style = document.createElement('style');
            style.id = 'tema-custom';
            document.head.appendChild(style);
        }
        
        const c = tema.cores;
        
        style.textContent = `
            :root {
                --tema-primary: ${c.primary};
                --tema-secondary: ${c.secondary};
                --tema-accent: ${c.accent};
                --tema-text: ${c.text};
                --tema-text-light: ${c.textLight};
            }
            
            /* Fundo principal */
            body {
                background: ${c.background} !important;
            }
            
            /* Chat shell - fundo do chat */
            .chat-shell {
                background: ${c.background} !important;
            }
            
            /* Header do chat */
            .chat-header {
                background: ${c.headerBg} !important;
            }
            
            /* Título */
            .chat-title {
                color: ${c.text} !important;
            }
            
            .chat-subtitle, .chat-meta {
                color: ${c.textLight} !important;
            }
            
            /* Bolhas de mensagem */
            .bubble-bot {
                background: ${c.cardBg} !important;
                color: ${c.text} !important;
            }
            
            .bubble-user {
                background: ${c.accent}33 !important;
                color: ${c.text} !important;
            }
            
            /* Composer (área do input) */
            .chat-composer {
                background: ${c.headerBg} !important;
            }
            
            /* Footer note */
            .chat-footer-note {
                color: ${c.textLight} !important;
            }
        `;
        
        if (salvar) {
            localStorage.setItem('mariaTema', temaId);
            if (window.showToast) showToast(`🎨 Tema "${tema.nome}" aplicado!`);
        }
        
        // Fechar modal se aberto
        document.getElementById('modal-temas')?.remove();
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

    // Abrir seletor de temas
    abrir() {
        const premium = this.isPremium();
        
        const modal = document.createElement('div');
        modal.id = 'modal-temas';
        modal.className = 'fixed inset-0 z-[60] overflow-y-auto';
        modal.style.background = 'linear-gradient(180deg, #1a1a2e 0%, #2d1b4e 50%, #1a1a2e 100%)';
        
        modal.innerHTML = `
            <div class="min-h-screen pb-8">
                <!-- Header -->
                <div class="sticky top-0 z-10 bg-gradient-to-b from-[#1a1a2e] via-[#1a1a2e] to-transparent p-4 pb-8">
                    <div class="flex items-center justify-between mb-4">
                        <button onclick="document.getElementById('modal-temas').remove(); document.body.style.overflow='';" class="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                        <h1 class="text-white text-xl font-bold">🎨 Temas</h1>
                        <div class="w-10"></div>
                    </div>
                    
                    <p class="text-white/60 text-sm text-center">Personalize a aparência do app</p>
                </div>
                
                <div class="px-4">
                    <!-- Temas Gratuitos -->
                    <div class="mb-6">
                        <h3 class="text-white/80 text-sm font-semibold mb-3">Gratuitos</h3>
                        <div class="grid grid-cols-2 gap-3">
                            ${Object.values(this.temas).filter(t => !t.premium).map(tema => this.renderTemaCard(tema)).join('')}
                        </div>
                    </div>
                    
                    <!-- Temas Premium -->
                    <div>
                        <h3 class="text-white/80 text-sm font-semibold mb-3 flex items-center gap-2">
                            <span>👑</span>
                            <span>Premium</span>
                            ${!premium ? '<span class="text-xs text-yellow-400/70">(Desbloqueie com Premium)</span>' : ''}
                        </h3>
                        <div class="grid grid-cols-2 gap-3">
                            ${Object.values(this.temas).filter(t => t.premium).map(tema => this.renderTemaCard(tema, !premium)).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    },

    // Renderizar card de tema
    renderTemaCard(tema, bloqueado = false) {
        const ativo = this.temaAtual === tema.id;
        const c = tema.cores;
        
        return `
            <div onclick="SistemaTemas.aplicarTema('${tema.id}')" 
                 class="relative rounded-2xl overflow-hidden cursor-pointer border-2 ${ativo ? 'border-yellow-500' : 'border-transparent'} hover:border-white/30 transition-all ${bloqueado ? 'opacity-60' : ''}">
                
                <!-- Preview do tema -->
                <div class="h-28 relative" style="background: ${c.background}">
                    <!-- Mini preview -->
                    <div class="absolute inset-2 rounded-lg" style="background: ${c.cardBg}; border: 1px solid ${c.accent}33">
                        <div class="h-6 flex items-center px-2" style="background: ${c.headerBg}">
                            <div class="w-8 h-2 rounded" style="background: ${c.accent}"></div>
                        </div>
                        <div class="p-2 space-y-1">
                            <div class="h-2 rounded" style="background: ${c.text}33; width: 80%"></div>
                            <div class="h-2 rounded" style="background: ${c.text}22; width: 60%"></div>
                        </div>
                    </div>
                    
                    ${bloqueado ? '<div class="absolute inset-0 flex items-center justify-center bg-black/30"><span class="text-2xl">🔒</span></div>' : ''}
                    ${ativo ? '<div class="absolute top-2 right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg></div>' : ''}
                </div>
                
                <!-- Info -->
                <div class="p-3 bg-white/5">
                    <div class="flex items-center gap-2">
                        <span class="text-lg">${tema.icone}</span>
                        <div class="flex-1 min-w-0">
                            <p class="text-white text-sm font-semibold truncate">${tema.nome}</p>
                            <p class="text-white/50 text-xs truncate">${tema.descricao}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

// Inicializar ao carregar
document.addEventListener('DOMContentLoaded', () => {
    SistemaTemas.init();
});

window.SistemaTemas = SistemaTemas;
