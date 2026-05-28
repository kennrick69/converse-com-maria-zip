// ========================================
// 📱 NAVEGAÇÃO INFERIOR - ÍCONES CUSTOMIZADOS
// Estilo "Bênção da Manhã" - Para idosos
// ========================================

// SVGs dos ícones inline
const IconesSVG = {
    // 💬 CHAT - Balão com coração
    chat: `<svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="chatBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FFE4B5"/>
                <stop offset="100%" style="stop-color:#FFD700"/>
            </linearGradient>
            <linearGradient id="chatHeart" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FF6B9D"/>
                <stop offset="100%" style="stop-color:#E91E63"/>
            </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="3" fill="#FFD700" opacity="0.6"/>
        <circle cx="52" cy="8" r="2" fill="#FFD700" opacity="0.5"/>
        <path d="M10 18C10 13.5817 13.5817 10 18 10H46C50.4183 10 54 13.5817 54 18V36C54 40.4183 50.4183 44 46 44H30L18 54V44H18C13.5817 44 10 40.4183 10 36V18Z" fill="url(#chatBg)" stroke="#DAA520" stroke-width="2"/>
        <path d="M32 38C32 38 22 31 22 24.5C22 21.5 24.5 19 27.5 19C29.5 19 31 20 32 21.5C33 20 34.5 19 36.5 19C39.5 19 42 21.5 42 24.5C42 31 32 38 32 38Z" fill="url(#chatHeart)"/>
        <ellipse cx="27" cy="23" rx="2" ry="1.5" fill="white" opacity="0.6"/>
        <path d="M51 16L52 18L51 20L53 19L55 20L54 18L55 16L53 17L51 16Z" fill="#FFD700"/>
    </svg>`,

    // 📿 TERÇO - Rosário dourado
    terco: `<svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="tercoCross" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FFD700"/>
                <stop offset="100%" style="stop-color:#B8860B"/>
            </linearGradient>
            <linearGradient id="tercoBeads" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#87CEEB"/>
                <stop offset="100%" style="stop-color:#4169E1"/>
            </linearGradient>
            <linearGradient id="tercoBigBead" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#DDA0DD"/>
                <stop offset="100%" style="stop-color:#9370DB"/>
            </linearGradient>
        </defs>
        <circle cx="8" cy="16" r="2" fill="#FFD700" opacity="0.5"/>
        <circle cx="56" cy="12" r="2.5" fill="#FFD700" opacity="0.6"/>
        <rect x="28" y="4" width="8" height="24" rx="2" fill="url(#tercoCross)"/>
        <rect x="22" y="10" width="20" height="6" rx="2" fill="url(#tercoCross)"/>
        <circle cx="32" cy="32" r="5" fill="url(#tercoBigBead)"/>
        <circle cx="20" cy="36" r="3.5" fill="url(#tercoBeads)"/>
        <circle cx="14" cy="42" r="3.5" fill="url(#tercoBeads)"/>
        <circle cx="12" cy="50" r="3.5" fill="url(#tercoBeads)"/>
        <circle cx="16" cy="57" r="3.5" fill="url(#tercoBeads)"/>
        <circle cx="44" cy="36" r="3.5" fill="url(#tercoBeads)"/>
        <circle cx="50" cy="42" r="3.5" fill="url(#tercoBeads)"/>
        <circle cx="52" cy="50" r="3.5" fill="url(#tercoBeads)"/>
        <circle cx="48" cy="57" r="3.5" fill="url(#tercoBeads)"/>
        <circle cx="32" cy="58" r="4" fill="url(#tercoBigBead)"/>
        <path d="M32 28 Q32 32 32 37 Q28 40 20 36" stroke="#DAA520" stroke-width="1.5" fill="none"/>
        <path d="M32 28 Q32 32 32 37 Q36 40 44 36" stroke="#DAA520" stroke-width="1.5" fill="none"/>
        <path d="M20 36 Q14 38 14 42 Q12 46 12 50 Q14 54 16 57 Q24 60 32 58" stroke="#DAA520" stroke-width="1.5" fill="none"/>
        <path d="M44 36 Q50 38 50 42 Q52 46 52 50 Q50 54 48 57 Q40 60 32 58" stroke="#DAA520" stroke-width="1.5" fill="none"/>
    </svg>`,

    // 🕯️ VELAS - Vela acesa (central/destaque)
    velas: `<svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="velaBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FFF8DC"/>
                <stop offset="100%" style="stop-color:#F5DEB3"/>
            </linearGradient>
            <linearGradient id="velaFlame" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" style="stop-color:#FF6B00"/>
                <stop offset="40%" style="stop-color:#FFD700"/>
                <stop offset="100%" style="stop-color:#FFFACD"/>
            </linearGradient>
            <linearGradient id="velaGlow" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" style="stop-color:#FF8C00" stop-opacity="0.3"/>
                <stop offset="100%" style="stop-color:#FFD700" stop-opacity="0"/>
            </linearGradient>
        </defs>
        <ellipse cx="32" cy="28" rx="20" ry="24" fill="url(#velaGlow)"/>
        <circle cx="10" cy="10" r="2.5" fill="#FFD700" opacity="0.6"/>
        <circle cx="54" cy="8" r="2" fill="#FFD700" opacity="0.5"/>
        <path d="M12 24L14 28L12 32L16 30L20 32L18 28L20 24L16 26L12 24Z" fill="#FFD700" opacity="0.8"/>
        <path d="M44 24L46 28L44 32L48 30L52 32L50 28L52 24L48 26L44 24Z" fill="#FFD700" opacity="0.8"/>
        <rect x="24" y="32" width="16" height="28" rx="3" fill="url(#velaBody)" stroke="#DAA520" stroke-width="1.5"/>
        <rect x="31" y="26" width="2" height="8" fill="#4A3728"/>
        <ellipse cx="32" cy="18" rx="8" ry="14" fill="url(#velaFlame)"/>
        <ellipse cx="32" cy="20" rx="4" ry="8" fill="#FFFACD" opacity="0.8"/>
        <ellipse cx="32" cy="22" rx="2" ry="4" fill="white" opacity="0.6"/>
        <ellipse cx="32" cy="60" rx="12" ry="3" fill="#DAA520"/>
    </svg>`,

    // 🙏 MURAL - Mãos em oração
    mural: `<svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="muralHands" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FFDAB9"/>
                <stop offset="100%" style="stop-color:#DEB887"/>
            </linearGradient>
            <linearGradient id="muralHeart" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FF69B4"/>
                <stop offset="100%" style="stop-color:#DC143C"/>
            </linearGradient>
        </defs>
        <circle cx="8" cy="12" r="2.5" fill="#FFD700" opacity="0.6"/>
        <circle cx="56" cy="10" r="2" fill="#FFD700" opacity="0.5"/>
        <path d="M6 28L8 32L6 36L10 34L14 36L12 32L14 28L10 30L6 28Z" fill="#FFD700" opacity="0.7"/>
        <path d="M50 28L52 32L50 36L54 34L58 36L56 32L58 28L54 30L50 28Z" fill="#FFD700" opacity="0.7"/>
        <path d="M32 52C32 52 12 38 12 24C12 16 18 10 26 10C30 10 32 13 32 13C32 13 34 10 38 10C46 10 52 16 52 24C52 38 32 52 32 52Z" fill="url(#muralHeart)" opacity="0.3"/>
        <path d="M22 54 Q22 56 24 56 L30 56 Q32 56 32 54 L32 30 Q32 28 30 28 L26 30 Q22 32 22 36 Z" fill="url(#muralHands)" stroke="#C4A77D" stroke-width="1"/>
        <path d="M42 54 Q42 56 40 56 L34 56 Q32 56 32 54 L32 30 Q32 28 34 28 L38 30 Q42 32 42 36 Z" fill="url(#muralHands)" stroke="#C4A77D" stroke-width="1"/>
        <path d="M32 20C32 20 27 16 27 12C27 9 29 7 31 7C31.8 7 32 8 32 8C32 8 32.2 7 33 7C35 7 37 9 37 12C37 16 32 20 32 20Z" fill="url(#muralHeart)"/>
        <line x1="32" y1="4" x2="32" y2="6" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
        <line x1="24" y1="8" x2="26" y2="10" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="40" y1="8" x2="38" y2="10" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,

    // ⭐ MAIS - Estrela com +
    mais: `<svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="maisCenter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FFD700"/>
                <stop offset="100%" style="stop-color:#FFA500"/>
            </linearGradient>
            <linearGradient id="maisStar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#87CEEB"/>
                <stop offset="100%" style="stop-color:#4169E1"/>
            </linearGradient>
            <linearGradient id="maisGlow" x1="50%" y1="50%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FFD700" stop-opacity="0.3"/>
                <stop offset="100%" style="stop-color:#FFD700" stop-opacity="0"/>
            </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#maisGlow)"/>
        <circle cx="8" cy="8" r="2.5" fill="#FFD700" opacity="0.6"/>
        <circle cx="56" cy="8" r="2" fill="#FFD700" opacity="0.5"/>
        <path d="M32 6 L36 26 L56 32 L36 38 L32 58 L28 38 L8 32 L28 26 Z" fill="url(#maisStar)" opacity="0.3"/>
        <circle cx="32" cy="32" r="14" fill="url(#maisCenter)"/>
        <rect x="29" y="22" width="6" height="20" rx="2" fill="white" opacity="0.9"/>
        <rect x="22" y="29" width="20" height="6" rx="2" fill="white" opacity="0.9"/>
        <ellipse cx="26" cy="26" rx="4" ry="3" fill="white" opacity="0.4"/>
        <path d="M14 16L16 20L14 24L18 22L22 24L20 20L22 16L18 18L14 16Z" fill="#FFD700"/>
        <path d="M42 16L44 20L42 24L46 22L50 24L48 20L50 16L46 18L42 16Z" fill="#FFD700"/>
        <circle cx="32" cy="10" r="2" fill="#FF69B4"/>
        <circle cx="32" cy="54" r="2" fill="#FF69B4"/>
    </svg>`
};

// Criar a navegação inferior
function criarBottomNavigation() {
    // Verificar se já existe
    if (document.querySelector('.bottom-nav')) return;

    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.innerHTML = `
        <div class="bottom-nav-inner">
            <!-- Chat -->
            <button class="bottom-nav-item active" onclick="navegarPara('chat')" data-tab="chat">
                <div class="bottom-nav-icon">${IconesSVG.chat}</div>
                <span class="bottom-nav-label">Chat</span>
                <div class="active-dot"></div>
            </button>

            <!-- Terço -->
            <button class="bottom-nav-item" onclick="navegarPara('terco')" data-tab="terco">
                <div class="bottom-nav-icon">${IconesSVG.terco}</div>
                <span class="bottom-nav-label">Terço</span>
                <div class="active-dot"></div>
            </button>

            <!-- Velas (Central/Destaque) -->
            <button class="bottom-nav-item featured" onclick="navegarPara('velas')" data-tab="velas">
                <div class="bottom-nav-icon-wrapper">
                    <div class="bottom-nav-icon">${IconesSVG.velas}</div>
                </div>
                <span class="bottom-nav-label">Velas</span>
            </button>

            <!-- Mural -->
            <button class="bottom-nav-item" onclick="navegarPara('mural')" data-tab="mural">
                <div class="bottom-nav-icon">${IconesSVG.mural}</div>
                <span class="bottom-nav-label">Mural</span>
                <div class="active-dot"></div>
            </button>

            <!-- Mais -->
            <button class="bottom-nav-item" onclick="navegarPara('mais')" data-tab="mais">
                <div class="bottom-nav-icon">${IconesSVG.mais}</div>
                <span class="bottom-nav-label">Mais</span>
                <div class="active-dot"></div>
            </button>
        </div>
    `;

    document.body.appendChild(nav);
}

// Navegar para seção
function navegarPara(secao) {
    // Atualizar estado ativo
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const itemAtivo = document.querySelector(`[data-tab="${secao}"]`);
    if (itemAtivo) itemAtivo.classList.add('active');

    // Executar ação - usando funções corretas do index.html
    switch(secao) {
        case 'chat':
            // Voltar ao chat (fechar modais se houver)
            fecharModaisAbertos();
            break;
        case 'terco':
            // Função correta: abrirTerco() que usa TercoGuiado
            if (window.abrirTerco) {
                abrirTerco();
            } else if (window.TercoGuiado) {
                TercoGuiado.iniciar();
            } else {
                showToast('Carregando terço...');
            }
            break;
        case 'velas':
            // Função correta: abrirSantuarioVelas()
            if (window.abrirSantuarioVelas) {
                abrirSantuarioVelas();
            } else if (window.SantuarioVelas) {
                SantuarioVelas.abrir();
            } else {
                showToast('Carregando santuário...');
            }
            break;
        case 'mural':
            // Função correta: abrirMuralIntencoes()
            if (window.abrirMuralIntencoes) {
                abrirMuralIntencoes();
            } else if (window.MuralIntencoes) {
                MuralIntencoes.abrir();
            } else {
                showToast('Carregando mural...');
            }
            break;
        case 'mais':
            // Abrir modal "Mais Recursos"
            abrirModalMaisRecursos();
            break;
    }
}

// Modal "Mais Recursos" 
function abrirModalMaisRecursos() {
    // Se já existe, mostrar
    let modal = document.getElementById('modal-mais-recursos');
    if (modal) {
        modal.classList.add('active');
        return;
    }
    
    // Criar modal
    modal = document.createElement('div');
    modal.id = 'modal-mais-recursos';
    modal.className = 'modal-mais';
    modal.onclick = (e) => { if (e.target === modal) fecharModalMais(); };
    
    modal.innerHTML = `
        <div class="modal-mais-content">
            <div class="modal-mais-header">
                <h2 class="modal-mais-title">✨ Mais Recursos</h2>
                <button class="modal-mais-close" onclick="fecharModalMais()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            </div>
            
            <div class="modal-mais-body">
                <div class="modal-mais-grid">
                    <button class="modal-mais-item" onclick="fecharModalMais(); if(window.BibliotecaCrista) BibliotecaCrista.abrir();">
                        <div class="modal-mais-item-icon">📚</div>
                        <span class="modal-mais-item-label">Biblioteca</span>
                    </button>

                    <button class="modal-mais-item" onclick="fecharModalMais(); if(window.abrirConquistas) abrirConquistas();">
                        <div class="modal-mais-item-icon">🏅</div>
                        <span class="modal-mais-item-label">Conquistas</span>
                    </button>
                    
                    <button class="modal-mais-item" onclick="fecharModalMais(); if(window.abrirEstatisticas) abrirEstatisticas();">
                        <div class="modal-mais-item-icon">📊</div>
                        <span class="modal-mais-item-label">Estatísticas</span>
                    </button>
                    
                    <button class="modal-mais-item" onclick="fecharModalMais(); if(window.abrirAparicoes) abrirAparicoes();">
                        <div class="modal-mais-item-icon">🌟</div>
                        <span class="modal-mais-item-label">Aparições</span>
                    </button>
                    
                    <button class="modal-mais-item" onclick="fecharModalMais(); if(window.abrirTemas) abrirTemas();">
                        <div class="modal-mais-item-icon">🎨</div>
                        <span class="modal-mais-item-label">Temas</span>
                    </button>
                    
                    <button class="modal-mais-item" onclick="fecharModalMais(); if(window.mostrarCalendario) mostrarCalendario();">
                        <div class="modal-mais-item-icon">📅</div>
                        <span class="modal-mais-item-label">Calendário</span>
                    </button>
                    
                    <button class="modal-mais-item" onclick="fecharModalMais(); if(window.abrirTermosUso) abrirTermosUso();">
                        <div class="modal-mais-item-icon">📜</div>
                        <span class="modal-mais-item-label">Termos</span>
                    </button>
                </div>
                
                <div class="modal-mais-separator"></div>
                
                <button class="modal-mais-premium" onclick="fecharModalMais(); if(window.abrirTelaPremium) abrirTelaPremium();">
                    <div class="modal-mais-premium-icon">👑</div>
                    <div class="modal-mais-premium-text">
                        <span class="modal-mais-premium-title">Maria Premium</span>
                        <span class="modal-mais-premium-desc">Desbloqueie todos os recursos!</span>
                    </div>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animar entrada
    setTimeout(() => modal.classList.add('active'), 10);
}

function fecharModalMais() {
    const modal = document.getElementById('modal-mais-recursos');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Fechar modais abertos
function fecharModaisAbertos() {
    const modais = [
        'terco-interativo-modal',
        'terco-guiado-modal',
        'modal-terco-guiado',
        'santuario-velas',
        'mural-intencoes',
        'modal-mais',
        'modal-mais-recursos',
        'galeria-conquistas',
        'modal-estatisticas',
        'modal-aparicoes',
        'modal-temas'
    ];
    
    modais.forEach(id => {
        const modal = document.getElementById(id);
        if (modal) modal.remove();
    });
    
    // Remover modais com classe
    document.querySelectorAll('.modal-mais.active').forEach(m => {
        m.classList.remove('active');
        setTimeout(() => m.remove(), 300);
    });
    
    document.body.style.overflow = '';
}

// Exportar globalmente
window.criarBottomNavigation = criarBottomNavigation;
window.navegarPara = navegarPara;
window.IconesSVG = IconesSVG;
window.abrirModalMaisRecursos = abrirModalMaisRecursos;
window.fecharModalMais = fecharModalMais;

console.log('📱 Bottom Navigation com ícones customizados carregado!');
