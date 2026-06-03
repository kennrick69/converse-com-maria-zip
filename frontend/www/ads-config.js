/**
 * ads-config.js — lê a configuração de anúncios do Firestore (config/ads)
 * e aplica nos dois sistemas:
 *
 *   - AdMobService.config (mobile, Capacitor Android)
 *   - AdSense (web, <ins class="adsbygoogle">)
 *
 * Salvo via painel-admin.html → aba "📺 Anúncios". Recarrega no boot
 * de cada sessão (cache do SW pode atrasar 1 boot — aceitável).
 *
 * Estrutura do documento Firestore:
 *   config/ads {
 *     enabled: boolean,
 *     admob: { appId, bannerId, interstitialId, interstitialInterval,
 *              cooldownSec, testMode },
 *     adsense: { client, slotBanner, slotInterstitial, testMode, enabled }
 *   }
 */
(function () {
    'use strict';

    window.AdsConfig = {
        carregada: false,
        master: true,
        admob: null,
        adsense: null,

        async carregar() {
            // Aguarda Firebase inicializar
            if (!window.firebase || !firebase.firestore) {
                console.warn('[AdsConfig] Firebase ainda não pronto');
                return false;
            }
            try {
                const doc = await firebase.firestore().collection('config').doc('ads').get();
                if (!doc.exists) {
                    console.log('[AdsConfig] sem config no Firestore — usando defaults do código');
                    this.carregada = true;
                    return false;
                }
                const c = doc.data();
                this.master = c.enabled !== false;
                this.admob = c.admob || null;
                this.adsense = c.adsense || null;
                this.carregada = true;

                console.log('[AdsConfig] config carregada:', {
                    master: this.master,
                    admob: !!this.admob,
                    adsense: this.adsense?.enabled || false
                });

                this._aplicarAdMob();
                this._aplicarAdSense();
                return true;
            } catch (e) {
                console.error('[AdsConfig] erro ao carregar:', e);
                return false;
            }
        },

        _aplicarAdMob() {
            if (!this.admob || !window.AdMobService) return;
            const c = window.AdMobService.config;
            if (this.admob.appId) c.appId = this.admob.appId;
            if (this.admob.bannerId) c.bannerId = this.admob.bannerId;
            if (this.admob.interstitialId) c.interstitialId = this.admob.interstitialId;
            if (this.admob.interstitialInterval > 0) c.interstitialInterval = this.admob.interstitialInterval;
            if (this.admob.cooldownSec > 0) c.cooldownMs = this.admob.cooldownSec * 1000;
            window.AdMobService._adminTestMode = !!this.admob.testMode;
            console.log('[AdsConfig] AdMob aplicado:', c);
        },

        _aplicarAdSense() {
            if (!this.master) {
                console.log('[AdsConfig] AdSense desligado (master kill switch)');
                return;
            }
            const a = this.adsense;
            if (!a || !a.enabled || !a.client || !a.client.startsWith('ca-pub-')) {
                console.log('[AdsConfig] AdSense não está ativo / sem Publisher ID');
                return;
            }
            // Injeta script principal do Google AdSense (1 vez)
            if (!document.querySelector('script[data-adsense-loader]')) {
                const s = document.createElement('script');
                s.async = true;
                s.crossOrigin = 'anonymous';
                s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(a.client)}`;
                s.setAttribute('data-adsense-loader', '1');
                document.head.appendChild(s);
                console.log('[AdsConfig] AdSense loader injetado:', a.client);
            }
            // Disponibiliza helper global pra renderizar banner em qualquer tela
            window.renderAdSenseBanner = (containerId) => {
                if (!a.slotBanner) return;
                const container = document.getElementById(containerId);
                if (!container) return;
                container.innerHTML = '';
                const ins = document.createElement('ins');
                ins.className = 'adsbygoogle';
                ins.style.cssText = 'display:block;text-align:center;';
                ins.setAttribute('data-ad-client', a.client);
                ins.setAttribute('data-ad-slot', a.slotBanner);
                ins.setAttribute('data-ad-format', 'auto');
                ins.setAttribute('data-full-width-responsive', 'true');
                if (a.testMode) ins.setAttribute('data-adtest', 'on');
                container.appendChild(ins);
                try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { console.warn(e); }
            };
        }
    };

    // Auto-carrega quando Firebase Auth resolver (garante que firestore tá pronto)
    function tentar() {
        if (window.firebase && firebase.firestore) AdsConfig.carregar();
        else setTimeout(tentar, 500);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(tentar, 1000));
    } else {
        setTimeout(tentar, 1000);
    }
})();
