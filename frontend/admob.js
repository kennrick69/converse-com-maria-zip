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
        // Só funciona em app nativo (Capacitor)
        if (!window.Capacitor?.isNativePlatform()) {
            console.log('📺 AdMob: Apenas em app nativo');
            return false;
        }
        
        // Verificar se usuário é premium
        if (await this.isPremium()) {
            console.log('👑 AdMob: Usuário premium - ads desativados');
            return false;
        }
        
        try {
            // Importar plugin AdMob do Capacitor
            const { AdMob } = await import('@capacitor-community/admob');
            this.adMobPlugin = AdMob;
            
            // Inicializar
            await AdMob.initialize({
                requestTrackingAuthorization: true,
                testingDevices: ['YOUR_TEST_DEVICE_ID'],
                initializeForTesting: true // Mudar para false em produção
            });
            
            this.initialized = true;
            console.log('✅ AdMob inicializado!');
            
            // Configurar listeners
            this.setupListeners();
            
            // Mostrar banner
            await this.showBanner();
            
            // Preparar interstitial
            await this.prepareInterstitial();
            
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao inicializar AdMob:', error);
            return false;
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
                adSize: 'BANNER',
                position: this.config.bannerPosition,
                margin: 0,
                isTesting: true // Mudar para false em produção
            };
            
            await this.adMobPlugin.showBanner(options);
            console.log('📺 Banner exibido');
            
            // Ajustar padding do app para não sobrepor
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
        const main = document.querySelector('main') || document.body;
        if (show) {
            main.style.paddingBottom = '60px'; // Altura do banner
        } else {
            main.style.paddingBottom = '0';
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
                isTesting: true // Mudar para false em produção
            };
            
            await this.adMobPlugin.prepareInterstitial(options);
            
        } catch (error) {
            console.error('Erro ao preparar interstitial:', error);
        }
    },
    
    async showInterstitial() {
        if (!this.initialized || !this.adMobPlugin) return false;
        if (await this.isPremium()) return false;
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
        return localStorage.getItem('mariaPremium') === 'true';
    },
    
    // Remover todos os ads quando virar premium
    async onPremiumActivated() {
        console.log('👑 Premium ativado - removendo ads');
        await this.hideBanner();
        this.initialized = false;
    }
};

// ========================================
// 📺 ADMOB MOCK PARA WEB (Desenvolvimento)
// ========================================

const AdMobMock = {
    config: AdMobService.config,
    initialized: false,
    mockBannerVisible: false,
    
    async init() {
        // Mock para testar layout no browser
        if (window.Capacitor?.isNativePlatform()) {
            return AdMobService.init();
        }
        
        console.log('📺 AdMob Mock: Modo desenvolvimento');
        this.initialized = true;
        
        // Mostrar banner mock se não for premium
        if (!await this.isPremium()) {
            this.showMockBanner();
        }
        
        return true;
    },
    
    showMockBanner() {
        if (this.mockBannerVisible) return;
        
        const banner = document.createElement('div');
        banner.id = 'admob-mock-banner';
        banner.innerHTML = `
            <div style="
                position: fixed;
                bottom: 0;
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
                    Assine Premium para remover anúncios
                </span>
                <button onclick="TelaPremium?.abrir('ads')" style="
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
        document.body.style.paddingBottom = '50px';
        this.mockBannerVisible = true;
    },
    
    hideMockBanner() {
        const banner = document.getElementById('admob-mock-banner');
        if (banner) banner.remove();
        document.body.style.paddingBottom = '0';
        this.mockBannerVisible = false;
    },
    
    async showInterstitial() {
        if (await this.isPremium()) return false;
        
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
                        
                        <button onclick="TelaPremium?.abrir('interstitial'); document.getElementById('admob-mock-interstitial').remove();" style="
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
    
    onMessageSent: AdMobService.onMessageSent.bind(AdMobService),
    isPremium: AdMobService.isPremium,
    
    async onPremiumActivated() {
        this.hideMockBanner();
    }
};

// ========================================
// EXPORTAR
// ========================================

// Usar mock no browser, real no app
window.AdMobService = window.Capacitor?.isNativePlatform() 
    ? AdMobService 
    : AdMobMock;

console.log('📺 AdMob Service carregado!');
