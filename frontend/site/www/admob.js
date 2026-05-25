// ========================================
// 📺 SISTEMA DE ANÚNCIOS - ADMOB
// Converse com Maria
// ========================================

const AdMobService = {
    // Configuração
    config: {
        // IDs de PRODUÇÃO - Converse com Maria
        appId: 'ca-app-pub-4489113682448462~4292303415',
        bannerId: 'ca-app-pub-4489113682448462/7521101982',
        interstitialId: 'ca-app-pub-4489113682448462/3865778066',
        
        // Configurações de exibição
        bannerPosition: 'bottom',
        interstitialInterval: 5, // Mostrar a cada X mensagens
    },
    
    // Estado
    initialized: false,
    interstitialReady: false,
    messageCount: 0,
    lastInterstitialTime: 0,
    adMobPlugin: null,
    
    // ========================================
    // INICIALIZAÇÃO
    // ========================================
    
    async init() {
        console.log('📺 AdMob: Iniciando...');
        
        // Só funciona em app nativo (Capacitor)
        if (!window.Capacitor?.isNativePlatform()) {
            console.log('📺 AdMob: Não é plataforma nativa, usando mock');
            return this.initMock();
        }
        
        // Verificar se usuário é premium
        if (await this.isPremium()) {
            console.log('👑 AdMob: Usuário premium - ads desativados');
            return false;
        }
        
        try {
            // Importar plugin AdMob do Capacitor
            const { AdMob, BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob');
            this.adMobPlugin = AdMob;
            this.BannerAdSize = BannerAdSize;
            this.BannerAdPosition = BannerAdPosition;
            
            // Inicializar
            await AdMob.initialize({
                requestTrackingAuthorization: true,
                initializeForTesting: false // PRODUÇÃO
            });
            
            this.initialized = true;
            console.log('✅ AdMob inicializado com sucesso!');
            
            // Configurar listeners
            this.setupListeners();
            
            // Mostrar banner
            await this.showBanner();
            
            // Preparar interstitial
            await this.prepareInterstitial();
            
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao inicializar AdMob:', error);
            // Fallback para mock em caso de erro
            return this.initMock();
        }
    },
    
    // ========================================
    // MOCK PARA DESENVOLVIMENTO
    // ========================================
    
    initMock() {
        console.log('📺 AdMob Mock: Modo desenvolvimento ativado');
        this.initialized = true;
        this.isMock = true;
        
        // Mostrar banner mock após um delay
        setTimeout(() => {
            if (!this.isPremiumSync()) {
                this.showMockBanner();
            }
        }, 2000);
        
        return true;
    },
    
    showMockBanner() {
        if (document.getElementById('admob-mock-banner')) return;
        
        const banner = document.createElement('div');
        banner.id = 'admob-mock-banner';
        banner.innerHTML = `
            <div style="
                position: fixed;
                bottom: 70px;
                left: 0;
                right: 0;
                height: 50px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                z-index: 9999;
                border-top: 1px solid rgba(255,255,255,0.1);
            ">
                <span style="color: #ffd700; font-size: 12px;">📺 Anúncio</span>
                <span style="color: #fff; font-size: 11px; opacity: 0.7;">
                    Assine Premium para remover
                </span>
                <button onclick="if(window.TelaPremium) TelaPremium.abrir('ads')" style="
                    background: linear-gradient(135deg, #ffd700, #ff8c00);
                    border: none;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: bold;
                    cursor: pointer;
                ">
                    👑 PREMIUM
                </button>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Ajustar padding do chat
        const composer = document.querySelector('.chat-composer');
        if (composer) {
            composer.style.paddingBottom = '60px';
        }
    },
    
    hideMockBanner() {
        const banner = document.getElementById('admob-mock-banner');
        if (banner) banner.remove();
        
        const composer = document.querySelector('.chat-composer');
        if (composer) {
            composer.style.paddingBottom = '';
        }
    },
    
    // ========================================
    // LISTENERS DE EVENTOS
    // ========================================
    
    setupListeners() {
        if (!this.adMobPlugin) return;
        
        // Banner
        this.adMobPlugin.addListener('onBannerAdLoaded', () => {
            console.log('📺 Banner carregado');
        });
        
        this.adMobPlugin.addListener('onBannerAdFailedToLoad', (error) => {
            console.error('❌ Erro no banner:', error);
        });
        
        // Interstitial
        this.adMobPlugin.addListener('onInterstitialAdLoaded', () => {
            console.log('📺 Interstitial pronto');
            this.interstitialReady = true;
        });
        
        this.adMobPlugin.addListener('onInterstitialAdFailedToLoad', (error) => {
            console.error('❌ Erro no interstitial:', error);
            this.interstitialReady = false;
        });
        
        this.adMobPlugin.addListener('onInterstitialAdDismissed', () => {
            console.log('📺 Interstitial fechado');
            this.interstitialReady = false;
            // Preparar próximo
            this.prepareInterstitial();
        });
    },
    
    // ========================================
    // BANNER (Footer - Sempre visível para free)
    // ========================================
    
    async showBanner() {
        if (!this.initialized || !this.adMobPlugin) return;
        if (await this.isPremium()) return;
        
        try {
            const options = {
                adId: this.config.bannerId,
                adSize: this.BannerAdSize?.BANNER || 'BANNER',
                position: this.BannerAdPosition?.BOTTOM_CENTER || 'BOTTOM_CENTER',
                margin: 60, // Margem para não cobrir o bottom nav
                isTesting: false // PRODUÇÃO
            };
            
            await this.adMobPlugin.showBanner(options);
            console.log('📺 Banner exibido');
            
            // Ajustar padding do app
            this.adjustPaddingForBanner(true);
            
        } catch (error) {
            console.error('Erro ao mostrar banner:', error);
        }
    },
    
    async hideBanner() {
        if (!this.initialized || !this.adMobPlugin) return;
        
        try {
            await this.adMobPlugin.hideBanner();
            this.adjustPaddingForBanner(false);
        } catch (error) {
            console.error('Erro ao esconder banner:', error);
        }
    },
    
    adjustPaddingForBanner(show) {
        const composer = document.querySelector('.chat-composer');
        if (composer) {
            if (show) {
                composer.style.paddingBottom = '60px';
            } else {
                composer.style.paddingBottom = '';
            }
        }
    },
    
    // ========================================
    // INTERSTITIAL (Tela cheia entre conversas)
    // ========================================
    
    async prepareInterstitial() {
        if (!this.initialized || !this.adMobPlugin) return;
        if (await this.isPremium()) return;
        
        try {
            const options = {
                adId: this.config.interstitialId,
                isTesting: false // PRODUÇÃO
            };
            
            await this.adMobPlugin.prepareInterstitial(options);
            
        } catch (error) {
            console.error('Erro ao preparar interstitial:', error);
        }
    },
    
    async showInterstitial() {
        if (!this.initialized) return false;
        if (await this.isPremium()) return false;
        
        // Mock - mostrar modal simulado
        if (this.isMock) {
            return this.showMockInterstitial();
        }
        
        if (!this.interstitialReady) return false;
        
        // Verificar intervalo mínimo (2 minutos)
        const now = Date.now();
        if (now - this.lastInterstitialTime < 120000) {
            return false;
        }
        
        try {
            await this.adMobPlugin.showInterstitial();
            this.lastInterstitialTime = now;
            console.log('📺 Interstitial exibido');
            return true;
            
        } catch (error) {
            console.error('Erro ao mostrar interstitial:', error);
            return false;
        }
    },
    
    showMockInterstitial() {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.id = 'admob-mock-interstitial';
            modal.innerHTML = `
                <div style="
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.95);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 99999;
                ">
                    <div style="
                        background: linear-gradient(180deg, #1a1a2e 0%, #0a0612 100%);
                        padding: 32px;
                        border-radius: 20px;
                        text-align: center;
                        max-width: 300px;
                    ">
                        <div style="font-size: 60px; margin-bottom: 16px;">📺</div>
                        <h3 style="color: #fff; margin-bottom: 8px;">Anúncio</h3>
                        <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 20px;">
                            Sem anúncios com Maria Premium!
                        </p>
                        
                        <button onclick="if(window.TelaPremium) TelaPremium.abrir('interstitial'); document.getElementById('admob-mock-interstitial').remove();" style="
                            width: 100%;
                            padding: 14px;
                            background: linear-gradient(135deg, #ffd700, #ff8c00);
                            border: none;
                            border-radius: 12px;
                            font-weight: bold;
                            cursor: pointer;
                            margin-bottom: 10px;
                        ">
                            👑 Remover Anúncios
                        </button>
                        
                        <button id="close-interstitial" style="
                            width: 100%;
                            padding: 12px;
                            background: rgba(255,255,255,0.1);
                            border: none;
                            border-radius: 12px;
                            color: #fff;
                            font-size: 12px;
                            cursor: pointer;
                        ">
                            Fechar em <span id="countdown">5</span>s
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Countdown
            let seconds = 5;
            const countdownEl = document.getElementById('countdown');
            const closeBtn = document.getElementById('close-interstitial');
            
            const interval = setInterval(() => {
                seconds--;
                if (countdownEl) countdownEl.textContent = seconds;
                
                if (seconds <= 0) {
                    clearInterval(interval);
                    if (closeBtn) {
                        closeBtn.textContent = 'Fechar';
                        closeBtn.onclick = () => {
                            modal.remove();
                            resolve(true);
                        };
                    }
                }
            }, 1000);
        });
    },
    
    // Chamar após cada mensagem
    async onMessageSent() {
        this.messageCount++;
        
        // Mostrar interstitial a cada X mensagens
        if (this.messageCount >= this.config.interstitialInterval) {
            this.messageCount = 0;
            await this.showInterstitial();
        }
    },
    
    // ========================================
    // HELPERS
    // ========================================
    
    async isPremium() {
        // Verificar via PremiumService ou localStorage
        if (typeof PremiumService !== 'undefined') {
            return await PremiumService.isPremium();
        }
        if (typeof TelaPremium !== 'undefined' && TelaPremium.isPremium) {
            return TelaPremium.isPremium();
        }
        return localStorage.getItem('mariaPremium') === 'true';
    },
    
    isPremiumSync() {
        if (typeof TelaPremium !== 'undefined' && TelaPremium.isPremium) {
            return TelaPremium.isPremium();
        }
        return localStorage.getItem('mariaPremium') === 'true';
    },
    
    // Remover todos os ads quando virar premium
    async onPremiumActivated() {
        console.log('👑 Premium ativado - removendo ads');
        
        if (this.isMock) {
            this.hideMockBanner();
        } else {
            await this.hideBanner();
        }
        
        this.initialized = false;
    }
};

// ========================================
// EXPORTAR GLOBALMENTE
// ========================================

window.AdMobService = AdMobService;

console.log('📺 AdMob Service carregado!');
