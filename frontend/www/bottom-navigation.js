// ==================== BOTTOM NAVIGATION E MENU MAIS ====================
// Versão 2.0 - Corrigida

(function() {
    'use strict';
    
    // Aguardar DOM carregar completamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarBottomNav);
    } else {
        inicializarBottomNav();
    }
    
    function inicializarBottomNav() {
        console.log('🔧 Inicializando Bottom Navigation...');
        
        // Tentar criar imediatamente
        tentarCriarBottomNav();
        
        // Também observar mudanças no DOM
        const observer = new MutationObserver(function() {
            tentarCriarBottomNav();
        });
        
        observer.observe(document.body, { 
            childList: true, 
            subtree: true, 
            attributes: true,
            attributeFilter: ['class']
        });
        
        // Fallback: tentar a cada segundo por 10 segundos
        let tentativas = 0;
        const intervalo = setInterval(function() {
            tentativas++;
            tentarCriarBottomNav();
            if (tentativas >= 10 || document.getElementById('bottom-nav')) {
                clearInterval(intervalo);
            }
        }, 1000);
    }
    
    function tentarCriarBottomNav() {
        const chat = document.getElementById('chat');
        
        // Só criar se o chat existir e estiver visível
        if (chat && !chat.classList.contains('hidden')) {
            if (!document.getElementById('bottom-nav')) {
                console.log('✅ Criando Bottom Navigation');
                criarBottomNavigation();
            }
            if (!document.getElementById('modal-mais')) {
                criarModalMais();
            }
        }
    }
    
    // ==================== CRIAR BOTTOM NAVIGATION ====================
    function criarBottomNavigation() {
        const nav = document.createElement('nav');
        nav.id = 'bottom-nav';
        nav.className = 'bottom-nav';
        
        nav.innerHTML = `
            <div class="bottom-nav-inner">
                <!-- Chat -->
                <button class="bottom-nav-item active" onclick="window.BottomNav.setActive(this)">
                    <span class="bottom-nav-icon">💬</span>
                    <span class="bottom-nav-label">Chat</span>
                    <div class="active-dot"></div>
                </button>
                
                <!-- Terço -->
                <button class="bottom-nav-item" onclick="window.BottomNav.setActive(this); if(window.abrirTerco) abrirTerco();">
                    <span class="bottom-nav-icon">📿</span>
                    <span class="bottom-nav-label">Terço</span>
                    <div class="active-dot"></div>
                </button>
                
                <!-- Velas (Destacado) -->
                <button class="bottom-nav-item featured" onclick="if(window.abrirSantuarioVelas) abrirSantuarioVelas();">
                    <div class="bottom-nav-icon-wrapper">
                        <span class="bottom-nav-icon">🕯️</span>
                    </div>
                    <span class="bottom-nav-label">Velas</span>
                </button>
                
                <!-- Mural -->
                <button class="bottom-nav-item" onclick="window.BottomNav.setActive(this); if(window.abrirMuralIntencoes) abrirMuralIntencoes();">
                    <span class="bottom-nav-icon">📜</span>
                    <span class="bottom-nav-label">Mural</span>
                    <div class="active-dot"></div>
                </button>
                
                <!-- Mais -->
                <button class="bottom-nav-item" onclick="window.BottomNav.abrirMais();">
                    <span class="bottom-nav-icon">•••</span>
                    <span class="bottom-nav-label">Mais</span>
                    <div class="active-dot"></div>
                </button>
            </div>
        `;
        
        document.body.appendChild(nav);
    }
    
    // ==================== CRIAR MODAL MAIS ====================
    function criarModalMais() {
        const modal = document.createElement('div');
        modal.id = 'modal-mais';
        modal.className = 'modal-mais';
        modal.onclick = function(e) { 
            if (e.target === modal) window.BottomNav.fecharMais(); 
        };
        
        modal.innerHTML = `
            <div class="modal-mais-content">
                <div class="modal-mais-header">
                    <span class="modal-mais-title">
                        <span>✨</span> Mais Recursos
                    </span>
                    <button class="modal-mais-close" onclick="window.BottomNav.fecharMais()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                </div>
                
                <div class="modal-mais-body">
                    <div class="modal-mais-grid">
                        <button class="modal-mais-item" onclick="window.BottomNav.fecharMais(); if(window.SistemaMusicasFundo) SistemaMusicasFundo.abrir();">
                            <span class="modal-mais-item-icon">🎵</span>
                            <span class="modal-mais-item-label">Músicas</span>
                        </button>
                        <button class="modal-mais-item" onclick="window.BottomNav.fecharMais(); if(window.abrirAparicoes) abrirAparicoes();">
                            <span class="modal-mais-item-icon">⭐</span>
                            <span class="modal-mais-item-label">Aparições</span>
                        </button>
                        <button class="modal-mais-item" onclick="window.BottomNav.fecharMais(); if(window.abrirEstatisticas) abrirEstatisticas();">
                            <span class="modal-mais-item-icon">📊</span>
                            <span class="modal-mais-item-label">Estatísticas</span>
                        </button>
                        <button class="modal-mais-item" onclick="window.BottomNav.fecharMais(); if(window.abrirConquistas) abrirConquistas();">
                            <span class="modal-mais-item-icon">🏆</span>
                            <span class="modal-mais-item-label">Conquistas</span>
                        </button>
                        <button class="modal-mais-item" onclick="window.BottomNav.fecharMais(); if(window.mostrarCalendario) mostrarCalendario();">
                            <span class="modal-mais-item-icon">📅</span>
                            <span class="modal-mais-item-label">Calendário</span>
                        </button>
                        <button class="modal-mais-item" onclick="window.BottomNav.fecharMais(); if(window.mostrarVersiculoDoDia) mostrarVersiculoDoDia();">
                            <span class="modal-mais-item-icon">📖</span>
                            <span class="modal-mais-item-label">Versículo</span>
                        </button>
                        <button class="modal-mais-item" onclick="window.BottomNav.abrirConfig();">
                            <span class="modal-mais-item-icon">⚙️</span>
                            <span class="modal-mais-item-label">Config</span>
                        </button>
                        <button class="modal-mais-item" onclick="window.BottomNav.mostrarAjuda();">
                            <span class="modal-mais-item-icon">❓</span>
                            <span class="modal-mais-item-label">Ajuda</span>
                        </button>
                    </div>
                    
                    <div class="modal-mais-separator"></div>
                    
                    <!-- Premium -->
                    <button class="modal-mais-premium" onclick="window.BottomNav.fecharMais(); if(window.abrirTelaPremium) abrirTelaPremium();">
                        <span class="modal-mais-premium-icon">👑</span>
                        <div class="modal-mais-premium-text">
                            <p class="modal-mais-premium-title">Maria Premium</p>
                            <p class="modal-mais-premium-desc">Conversas ilimitadas + Sem anúncios</p>
                        </div>
                    </button>
                </div>
                
                <div class="modal-mais-footer">
                    <p class="modal-mais-version">Versão 1.0.0 • Feito com 🙏</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // ==================== API GLOBAL ====================
    window.BottomNav = {
        // Abrir modal "Mais"
        abrirMais: function() {
            const modal = document.getElementById('modal-mais');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },
        
        // Fechar modal "Mais"
        fecharMais: function() {
            const modal = document.getElementById('modal-mais');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        },
        
        // Setar item ativo
        setActive: function(element) {
            document.querySelectorAll('.bottom-nav-item').forEach(function(item) {
                item.classList.remove('active');
            });
            if (element) element.classList.add('active');
        },
        
        // Abrir Configurações
        abrirConfig: function() {
            this.fecharMais();
            
            const modal = document.createElement('div');
            modal.id = 'modal-config';
            modal.className = 'fixed inset-0 z-[70] flex items-end justify-center';
            modal.style.background = 'rgba(0,0,0,0.8)';
            modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
            
            modal.innerHTML = `
                <div class="bg-gradient-to-br from-gray-900 to-purple-900/50 rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto" style="animation: slideUp 0.3s ease;">
                    <div class="sticky top-0 bg-gradient-to-b from-gray-900 to-transparent p-4 pb-6 z-10">
                        <div class="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4"></div>
                        <h2 class="text-white text-xl font-bold text-center flex items-center justify-center gap-2">
                            <span>⚙️</span> Configurações
                        </h2>
                    </div>
                    
                    <div class="px-4 pb-8 space-y-3">
                        <!-- Temas -->
                        <button onclick="document.getElementById('modal-config').remove(); if(window.abrirTemas) abrirTemas();" class="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left">
                            <span class="text-2xl">🎨</span>
                            <div class="flex-1">
                                <p class="text-white font-semibold">Temas</p>
                                <p class="text-white/50 text-sm">Personalize as cores do app</p>
                            </div>
                            <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                        
                        <!-- Notificações -->
                        <button onclick="document.getElementById('modal-config').remove(); if(window.pedirPermissaoNotificacao) pedirPermissaoNotificacao();" class="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left">
                            <span class="text-2xl">🔔</span>
                            <div class="flex-1">
                                <p class="text-white font-semibold">Lembretes</p>
                                <p class="text-white/50 text-sm">Configure seus lembretes de oração</p>
                            </div>
                            <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                        
                        <!-- Músicas -->
                        <button onclick="document.getElementById('modal-config').remove(); if(window.SistemaMusicasFundo) SistemaMusicasFundo.abrir();" class="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left">
                            <span class="text-2xl">🎵</span>
                            <div class="flex-1">
                                <p class="text-white font-semibold">Música de Fundo</p>
                                <p class="text-white/50 text-sm">Sons para meditação</p>
                            </div>
                            <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                        
                        <div class="border-t border-white/10 my-4"></div>
                        
                        <!-- Política de Privacidade -->
                        <button onclick="document.getElementById('modal-config').remove(); if(window.abrirPoliticaPrivacidade) abrirPoliticaPrivacidade();" class="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left">
                            <span class="text-2xl">🔒</span>
                            <div class="flex-1">
                                <p class="text-white font-semibold">Política de Privacidade</p>
                                <p class="text-white/50 text-sm">Como protegemos seus dados</p>
                            </div>
                            <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                        
                        <!-- Termos de Uso -->
                        <button onclick="document.getElementById('modal-config').remove(); if(window.abrirTermosUso) abrirTermosUso();" class="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left">
                            <span class="text-2xl">📜</span>
                            <div class="flex-1">
                                <p class="text-white font-semibold">Termos de Uso</p>
                                <p class="text-white/50 text-sm">Regras do aplicativo</p>
                            </div>
                            <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                        
                        <div class="border-t border-white/10 my-4"></div>
                        
                        <!-- Ajuda -->
                        <button onclick="document.getElementById('modal-config').remove(); window.BottomNav.mostrarAjuda();" class="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left">
                            <span class="text-2xl">❓</span>
                            <div class="flex-1">
                                <p class="text-white font-semibold">Ajuda</p>
                                <p class="text-white/50 text-sm">Dúvidas frequentes</p>
                            </div>
                            <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                        
                        <!-- Versão -->
                        <div class="text-center pt-4">
                            <p class="text-white/30 text-xs">Versão 1.0.0 • Feito com 🙏</p>
                        </div>
                    </div>
                </div>
                
                <style>
                    @keyframes slideUp {
                        from { transform: translateY(100%); }
                        to { transform: translateY(0); }
                    }
                </style>
            `;
            
            document.body.appendChild(modal);
        },
        
        // Mostrar Ajuda
        mostrarAjuda: function() {
            this.fecharMais();
            
            const modal = document.createElement('div');
            modal.id = 'modal-ajuda';
            modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-4';
            modal.style.background = 'rgba(0,0,0,0.9)';
            modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
            
            modal.innerHTML = `
                <div class="bg-gradient-to-br from-gray-900 to-purple-900/50 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
                    <div class="p-6">
                        <h2 class="text-white text-xl font-bold text-center mb-6">❓ Ajuda</h2>
                        
                        <div class="space-y-4">
                            <div class="bg-white/5 rounded-xl p-4">
                                <h3 class="text-white font-semibold mb-2">💬 Como funciona o chat?</h3>
                                <p class="text-white/70 text-sm">Digite sua mensagem e Maria responderá com palavras de conforto baseadas nas Sagradas Escrituras.</p>
                            </div>
                            
                            <div class="bg-white/5 rounded-xl p-4">
                                <h3 class="text-white font-semibold mb-2">📿 Como rezar o Terço?</h3>
                                <p class="text-white/70 text-sm">Toque no ícone do Terço no menu inferior. Maria guiará você em cada mistério.</p>
                            </div>
                            
                            <div class="bg-white/5 rounded-xl p-4">
                                <h3 class="text-white font-semibold mb-2">🕯️ Como acender velas?</h3>
                                <p class="text-white/70 text-sm">Toque no ícone de Velas (central). Escolha o tipo e escreva sua intenção.</p>
                            </div>
                            
                            <div class="bg-white/5 rounded-xl p-4">
                                <h3 class="text-white font-semibold mb-2">👑 O que é Premium?</h3>
                                <p class="text-white/70 text-sm">Com Premium você tem conversas ilimitadas, todas as velas especiais, sem anúncios e muito mais!</p>
                            </div>
                        </div>
                        
                        <button onclick="document.getElementById('modal-ajuda').remove()" class="w-full mt-6 py-3 bg-white/10 text-white rounded-xl font-semibold">
                            Entendi
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
    };
    
    // Aliases globais para compatibilidade
    window.abrirMenuMais = function() { window.BottomNav.abrirMais(); };
    window.fecharMenuMais = function() { window.BottomNav.fecharMais(); };
    window.abrirConfiguracoes = function() { window.BottomNav.abrirConfig(); };
    window.mostrarAjuda = function() { window.BottomNav.mostrarAjuda(); };
    
})();
