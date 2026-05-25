// ========================================
// 🔔 SISTEMA DE LEMBRETES - CONVERSE COM MARIA
// Versão simplificada (som padrão do sistema)
// ========================================

const NotificationSystem = {
    // Som padrão apenas

    // Versículos do dia
    versiculos: [
        { texto: "Eis aqui a serva do Senhor. Faça-se em mim segundo a tua palavra.", ref: "Lucas 1:38" },
        { texto: "Minha alma engrandece o Senhor, meu espírito exulta em Deus meu Salvador.", ref: "Lucas 1:46-47" },
        { texto: "Fazei tudo o que Ele vos disser.", ref: "João 2:5" },
        { texto: "Maria guardava todas estas coisas, meditando-as no seu coração.", ref: "Lucas 2:19" },
        { texto: "Bendita és tu entre as mulheres e bendito é o fruto do teu ventre.", ref: "Lucas 1:42" },
        { texto: "O Todo-Poderoso fez em mim maravilhas, Santo é o seu nome.", ref: "Lucas 1:49" },
        { texto: "Sua misericórdia se estende de geração em geração.", ref: "Lucas 1:50" },
        { texto: "Não temas, Maria, pois encontraste graça diante de Deus.", ref: "Lucas 1:30" },
        { texto: "O Senhor é contigo!", ref: "Lucas 1:28" },
        { texto: "Todas as gerações me chamarão bem-aventurada.", ref: "Lucas 1:48" },
        { texto: "Junto à cruz de Jesus estava sua mãe.", ref: "João 19:25" },
        { texto: "Mulher, eis aí teu filho. Filho, eis aí tua mãe.", ref: "João 19:26-27" },
        { texto: "Todos perseveravam na oração, junto com Maria.", ref: "Atos 1:14" },
        { texto: "Eis que a virgem conceberá e dará à luz um filho.", ref: "Isaías 7:14" },
        { texto: "Dispersou os soberbos e exaltou os humildes.", ref: "Lucas 1:51-52" }
    ],

    // Mensagens para cada tipo de lembrete
    mensagens: {
        manha: [
            "☀️ Bom dia! Maria tem uma palavra para você...",
            "🌅 O sol nasceu! Venha receber sua bênção.",
            "🙏 Que este dia seja repleto da paz de Deus."
        ],
        angelus: [
            "🔔 Hora do Angelus! O anjo do Senhor anunciou a Maria...",
            "⏰ Meio-dia: momento de pausar e rezar.",
            "🕊️ Pare um instante e lembre-se do SIM de Maria."
        ],
        noite: [
            "🌙 Boa noite! Venha encerrar o dia em oração.",
            "✨ Antes de dormir, um momento com Maria.",
            "💫 Que Nossa Senhora proteja seu sono."
        ]
    },

    // Estado
    LocalNotifications: null,
    isNative: false,
    settings: null,

    async init() {
        console.log('🔔 Inicializando sistema de lembretes...');
        this.isNative = this.detectCapacitor();
        console.log('🔔 Plataforma:', this.isNative ? 'APK Nativo ✓' : 'Browser ✗');
        
        if (this.isNative) {
            this.loadPlugin();
            await this.createNotificationChannel();
        }
        
        this.loadSettings();
        
        if (this.isNative && this.settings.enabled) {
            await this.scheduleAll();
        }
    },

    detectCapacitor() {
        try {
            if (typeof Capacitor === 'undefined') return false;
            if (typeof Capacitor.isNativePlatform === 'function') {
                return Capacitor.isNativePlatform();
            }
            return Capacitor.isNative === true;
        } catch (e) {
            return false;
        }
    },

    loadPlugin() {
        try {
            if (Capacitor.Plugins?.LocalNotifications) {
                this.LocalNotifications = Capacitor.Plugins.LocalNotifications;
            } else if (typeof LocalNotifications !== 'undefined') {
                this.LocalNotifications = LocalNotifications;
            }
            console.log('🔔 Plugin LocalNotifications:', this.LocalNotifications ? '✓' : '✗');
        } catch (e) {
            console.error('🔔 Erro ao carregar plugin:', e);
        }
    },

    async createNotificationChannel() {
        if (!this.LocalNotifications) return;
        
        try {
            await this.LocalNotifications.createChannel({
                id: 'maria-lembretes',
                name: 'Lembretes de Oração',
                description: 'Lembretes diários para oração com Maria',
                importance: 4,
                visibility: 1,
                sound: 'default',
                vibration: true,
                lights: true
            });
            console.log('🔔 Canal de notificação criado');
        } catch (e) {
            console.log('🔔 Canal já existe ou erro:', e.message);
        }
    },

    loadSettings() {
        const saved = localStorage.getItem('mariaLembretes');
        this.settings = saved ? JSON.parse(saved) : {
            enabled: false,
            lembretes: {
                manha: { ativo: true, horario: '07:00' },
                angelus: { ativo: true, horario: '12:00' },
                noite: { ativo: true, horario: '20:00' }
            }
        };
        return this.settings;
    },

    saveSettings() {
        localStorage.setItem('mariaLembretes', JSON.stringify(this.settings));
    },

    async checkPermission() {
        if (!this.isNative || !this.LocalNotifications) return false;
        try {
            const result = await this.LocalNotifications.checkPermissions();
            return result.display === 'granted';
        } catch (e) {
            return false;
        }
    },

    async requestPermission() {
        if (!this.isNative || !this.LocalNotifications) {
            return { success: false, message: 'Lembretes só funcionam no app instalado' };
        }
        
        try {
            const currentStatus = await this.LocalNotifications.checkPermissions();
            
            if (currentStatus.display !== 'granted') {
                const result = await this.LocalNotifications.requestPermissions();
                if (result.display !== 'granted') {
                    return { 
                        success: false, 
                        message: 'Permissão negada. Vá em Configurações > Apps > Converse com Maria > Notificações e ative.' 
                    };
                }
            }
            
            this.settings.enabled = true;
            this.saveSettings();
            await this.scheduleAll();
            return { success: true, message: 'Lembretes ativados!' };
        } catch (e) {
            return { success: false, message: 'Erro: ' + e.message };
        }
    },

    async scheduleAll() {
        if (!this.isNative || !this.LocalNotifications) return;
        
        console.log('🔔 Agendando lembretes...');
        await this.cancelAll();
        
        if (!this.settings.enabled) return;
        
        const notifications = [];
        const verse = this.getDailyVerse();
        let id = 1;
        
        for (const [tipo, config] of Object.entries(this.settings.lembretes)) {
            if (!config.ativo) continue;
            
            const [hours, minutes] = config.horario.split(':').map(Number);
            const msgs = this.mensagens[tipo];
            const titulo = msgs[Math.floor(Math.random() * msgs.length)];
            
            notifications.push({
                id: id++,
                title: titulo,
                body: '"' + verse.texto + '" - ' + verse.ref,
                schedule: {
                    on: { hour: hours, minute: minutes },
                    repeats: true,
                    allowWhileIdle: true
                },
                sound: 'default',
                smallIcon: 'ic_stat_notify',
                largeIcon: 'ic_launcher',
                channelId: 'maria-lembretes',
                extra: { tipo: tipo }
            });
            
            console.log('🔔 Lembrete ' + tipo + ': ' + config.horario);
        }
        
        if (notifications.length > 0) {
            try {
                await this.LocalNotifications.schedule({ notifications });
                console.log('🔔 ' + notifications.length + ' lembretes agendados!');
            } catch (e) {
                console.error('🔔 Erro ao agendar:', e);
            }
        }
    },

    async cancelAll() {
        if (!this.LocalNotifications) return;
        try {
            const pending = await this.LocalNotifications.getPending();
            if (pending?.notifications?.length > 0) {
                await this.LocalNotifications.cancel(pending);
            }
        } catch (e) {
            console.log('🔔 Nada para cancelar');
        }
    },

    async enable() {
        return await this.requestPermission();
    },

    async disable() {
        this.settings.enabled = false;
        this.saveSettings();
        await this.cancelAll();
        return { success: true, message: 'Lembretes desativados' };
    },

    async toggle() {
        if (this.settings.enabled) {
            return await this.disable();
        } else {
            return await this.enable();
        }
    },

    async setLembrete(tipo, config) {
        if (!this.settings.lembretes[tipo]) return;
        
        this.settings.lembretes[tipo] = {
            ...this.settings.lembretes[tipo],
            ...config
        };
        this.saveSettings();
        
        if (this.settings.enabled) {
            await this.scheduleAll();
        }
    },

    async toggleLembrete(tipo) {
        if (!this.settings.lembretes[tipo]) return;
        
        this.settings.lembretes[tipo].ativo = !this.settings.lembretes[tipo].ativo;
        this.saveSettings();
        
        if (this.settings.enabled) {
            await this.scheduleAll();
        }
    },

    async testNotification(tipo = 'manha') {
        if (!this.isNative || !this.LocalNotifications) {
            return { success: false, message: 'Só funciona no app instalado' };
        }
        
        const msgs = this.mensagens[tipo];
        const titulo = msgs[Math.floor(Math.random() * msgs.length)];
        const verse = this.getDailyVerse();
        
        try {
            await this.LocalNotifications.schedule({
                notifications: [{
                    id: 999,
                    title: titulo,
                    body: '"' + verse.texto + '" - ' + verse.ref,
                    schedule: { at: new Date(Date.now() + 2000) },
                    sound: 'default',
                    smallIcon: 'ic_stat_notify',
                    channelId: 'maria-lembretes'
                }]
            });
            return { success: true, message: 'Notificação enviada! Aguarde 2 segundos...' };
        } catch (e) {
            return { success: false, message: 'Erro: ' + e.message };
        }
    },

    getDailyVerse() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        return this.versiculos[dayOfYear % this.versiculos.length];
    },

    isSupported() {
        return this.isNative && this.LocalNotifications !== null;
    },

    getStatus() {
        return {
            supported: this.isSupported(),
            enabled: this.settings?.enabled || false,
            lembretes: this.settings?.lembretes || {}
        };
    }
};

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { NotificationSystem.init(); }, 500);
});

window.NotificationSystem = NotificationSystem;
