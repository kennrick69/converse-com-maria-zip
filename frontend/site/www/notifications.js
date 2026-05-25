// ========================================
// 🔔 SISTEMA DE NOTIFICAÇÕES - CONVERSE COM MARIA
// Compatível com Browser e Capacitor (APK)
// ========================================

const NotificationSystem = {
    // Versículos do dia
    versiculos: [
        { texto: "Eis aqui a serva do Senhor. Faça-se em mim segundo a tua palavra.", ref: "Lucas 1:38", reflexao: "A entrega total a Deus é o caminho da paz verdadeira." },
        { texto: "Minha alma engrandece o Senhor, meu espírito exulta em Deus meu Salvador.", ref: "Lucas 1:46-47", reflexao: "Deixe seu coração transbordar de gratidão hoje." },
        { texto: "Fazei tudo o que Ele vos disser.", ref: "João 2:5", reflexao: "Confie e obedeça, mesmo sem entender os planos de Deus." },
        { texto: "Maria guardava todas estas coisas, meditando-as no seu coração.", ref: "Lucas 2:19", reflexao: "Reserve um momento de silêncio para ouvir a voz de Deus." },
        { texto: "Bendita és tu entre as mulheres e bendito é o fruto do teu ventre.", ref: "Lucas 1:42", reflexao: "Você também é abençoado(a) por Deus de forma única." },
        { texto: "O Todo-Poderoso fez em mim maravilhas, Santo é o seu nome.", ref: "Lucas 1:49", reflexao: "Reconheça as maravilhas que Deus já fez em sua vida." },
        { texto: "Sua misericórdia se estende de geração em geração.", ref: "Lucas 1:50", reflexao: "A misericórdia de Deus nunca tem fim. Confie nela." },
        { texto: "Não temas, Maria, pois encontraste graça diante de Deus.", ref: "Lucas 1:30", reflexao: "Não tenha medo. Você também encontrou graça diante de Deus." },
        { texto: "O Senhor é contigo!", ref: "Lucas 1:28", reflexao: "Em cada momento, lembre-se: Deus está ao seu lado." },
        { texto: "Todas as gerações me chamarão bem-aventurada.", ref: "Lucas 1:48", reflexao: "A humildade atrai as bênçãos do Céu." },
        { texto: "Junto à cruz de Jesus estava sua mãe.", ref: "João 19:25", reflexao: "Nos momentos de dor, Maria está ao seu lado também." },
        { texto: "Mulher, eis aí teu filho. Filho, eis aí tua mãe.", ref: "João 19:26-27", reflexao: "Jesus nos deu Maria como Mãe. Acolha esse presente." },
        { texto: "Todos perseveravam na oração, junto com Maria.", ref: "Atos 1:14", reflexao: "A oração perseverante move montanhas." },
        { texto: "Eis que a virgem conceberá e dará à luz um filho.", ref: "Isaías 7:14", reflexao: "Deus cumpre suas promessas, mesmo as impossíveis." },
        { texto: "Dispersou os soberbos e exaltou os humildes.", ref: "Lucas 1:51-52", reflexao: "A verdadeira grandeza está na humildade." }
    ],

    // Mensagens para cada horário
    mensagensHorario: {
        manha: [
            "Bom dia, filho(a)! Maria tem uma palavra para você hoje...",
            "O sol nasceu e com ele novas graças. Venha receber sua bênção!",
            "Que este dia seja repleto da paz de Deus. Maria te espera.",
            "Acorde com o coração cheio de esperança. Nossa Senhora te abençoa!",
            "Um novo dia é um novo presente de Deus. Vamos agradecer juntos?"
        ],
        angelus: [
            "🔔 Hora do Angelus! O anjo do Senhor anunciou a Maria...",
            "Meio-dia: momento de pausar e rezar o Angelus com Maria.",
            "Pare um instante e lembre-se do SIM de Maria que mudou o mundo.",
            "O sino toca ao meio-dia. É hora de oração com Nossa Senhora."
        ],
        noite: [
            "Boa noite, filho(a). Venha encerrar o dia em oração com Maria.",
            "O dia termina, mas o amor de Deus não. Descanse em paz.",
            "Antes de dormir, um momento com sua Mãe do Céu.",
            "Que Nossa Senhora proteja seu sono e seus sonhos.",
            "Entregue as preocupações do dia a Deus. Maria intercede por você."
        ]
    },

    // Detectar ambiente
    isNative: false,
    LocalNotifications: null,

    // Inicializar sistema
    async init() {
        console.log('🔔 Inicializando sistema de notificações...');
        
        // Detectar se está no Capacitor (APK)
        this.isNative = typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform && Capacitor.isNativePlatform();
        console.log('🔔 Ambiente:', this.isNative ? 'Nativo (APK)' : 'Browser');
        
        // Carregar plugin do Capacitor se disponível
        if (this.isNative && typeof Capacitor !== 'undefined' && Capacitor.Plugins) {
            this.LocalNotifications = Capacitor.Plugins.LocalNotifications;
            console.log('🔔 Plugin LocalNotifications:', this.LocalNotifications ? 'Disponível' : 'Não encontrado');
        }
        
        this.loadSettings();
        this.setupDailyVerse();
        
        // Se já tem permissão, agendar notificações
        const hasPermission = await this.checkPermission();
        if (hasPermission && this.settings.enabled) {
            this.scheduleNotifications();
        }
    },

    // Verificar permissão atual
    async checkPermission() {
        if (this.isNative && this.LocalNotifications) {
            try {
                const result = await this.LocalNotifications.checkPermissions();
                return result.display === 'granted';
            } catch (e) {
                console.log('🔔 Erro ao verificar permissão nativa:', e);
                return false;
            }
        } else {
            // Browser
            if (!('Notification' in window)) return false;
            return Notification.permission === 'granted';
        }
    },

    // Pedir permissão
    async requestPermission() {
        console.log('🔔 Solicitando permissão de notificações...');
        
        if (this.isNative && this.LocalNotifications) {
            // Capacitor (APK)
            try {
                const result = await this.LocalNotifications.requestPermissions();
                const granted = result.display === 'granted';
                console.log('🔔 Permissão nativa:', granted ? 'Concedida' : 'Negada');
                
                if (granted) {
                    this.saveSettings({ enabled: true });
                    await this.scheduleNotifications();
                }
                return granted;
            } catch (e) {
                console.log('🔔 Erro ao pedir permissão nativa:', e);
                return false;
            }
        } else {
            // Browser
            if (!('Notification' in window)) {
                console.log('🔔 Browser não suporta notificações');
                return false;
            }
            
            const permission = await Notification.requestPermission();
            console.log('🔔 Permissão browser:', permission);
            
            if (permission === 'granted') {
                this.saveSettings({ enabled: true });
                this.scheduleNotifications();
                return true;
            }
            return false;
        }
    },

    // Obter status da permissão
    async getPermissionStatus() {
        if (this.isNative && this.LocalNotifications) {
            try {
                const result = await this.LocalNotifications.checkPermissions();
                return result.display; // 'granted', 'denied', 'prompt'
            } catch (e) {
                return 'denied';
            }
        } else {
            if (!('Notification' in window)) return 'denied';
            return Notification.permission;
        }
    },

    // Configurações salvas
    loadSettings() {
        const saved = localStorage.getItem('mariaNotifications');
        this.settings = saved ? JSON.parse(saved) : {
            enabled: false,
            manha: true,
            angelus: true,
            noite: true,
            horarios: { manha: '07:00', angelus: '12:00', noite: '20:00' }
        };
        return this.settings;
    },

    saveSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('mariaNotifications', JSON.stringify(this.settings));
    },

    // Versículo do dia (baseado na data)
    getDailyVerse() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const index = dayOfYear % this.versiculos.length;
        return this.versiculos[index];
    },

    // Configurar versículo do dia
    setupDailyVerse() {
        const verse = this.getDailyVerse();
        localStorage.setItem('mariaDailyVerse', JSON.stringify({
            ...verse,
            date: new Date().toDateString()
        }));
        return verse;
    },

    // Agendar notificações
    async scheduleNotifications() {
        if (!this.settings.enabled) return;
        console.log('🔔 Agendando notificações...');
        
        if (this.isNative && this.LocalNotifications) {
            await this.scheduleNativeNotifications();
        } else {
            this.scheduleBrowserNotifications();
        }
    },

    // ==================== NOTIFICAÇÕES NATIVAS (CAPACITOR) ====================
    async scheduleNativeNotifications() {
        try {
            // Cancelar notificações anteriores
            const pending = await this.LocalNotifications.getPending();
            if (pending.notifications.length > 0) {
                await this.LocalNotifications.cancel(pending);
            }
            
            const notifications = [];
            const verse = this.getDailyVerse();
            let notificationId = 1;
            
            // Criar notificações para cada horário
            if (this.settings.manha) {
                const [hours, minutes] = this.settings.horarios.manha.split(':').map(Number);
                const mensagem = this.mensagensHorario.manha[Math.floor(Math.random() * this.mensagensHorario.manha.length)];
                
                notifications.push({
                    id: notificationId++,
                    title: mensagem,
                    body: `"${verse.texto}" - ${verse.ref}`,
                    schedule: {
                        on: { hour: hours, minute: minutes },
                        repeats: true,
                        allowWhileIdle: true
                    },
                    sound: 'default',
                    smallIcon: 'ic_stat_notify',
                    largeIcon: 'ic_launcher',
                    channelId: 'maria-lembretes'
                });
            }
            
            if (this.settings.angelus) {
                const [hours, minutes] = this.settings.horarios.angelus.split(':').map(Number);
                const mensagem = this.mensagensHorario.angelus[Math.floor(Math.random() * this.mensagensHorario.angelus.length)];
                
                notifications.push({
                    id: notificationId++,
                    title: mensagem,
                    body: `"${verse.texto}" - ${verse.ref}`,
                    schedule: {
                        on: { hour: hours, minute: minutes },
                        repeats: true,
                        allowWhileIdle: true
                    },
                    sound: 'default',
                    smallIcon: 'ic_stat_notify',
                    largeIcon: 'ic_launcher',
                    channelId: 'maria-lembretes'
                });
            }
            
            if (this.settings.noite) {
                const [hours, minutes] = this.settings.horarios.noite.split(':').map(Number);
                const mensagem = this.mensagensHorario.noite[Math.floor(Math.random() * this.mensagensHorario.noite.length)];
                
                notifications.push({
                    id: notificationId++,
                    title: mensagem,
                    body: `"${verse.texto}" - ${verse.ref}`,
                    schedule: {
                        on: { hour: hours, minute: minutes },
                        repeats: true,
                        allowWhileIdle: true
                    },
                    sound: 'default',
                    smallIcon: 'ic_stat_notify',
                    largeIcon: 'ic_launcher',
                    channelId: 'maria-lembretes'
                });
            }
            
            // Criar canal de notificação (Android)
            await this.LocalNotifications.createChannel({
                id: 'maria-lembretes',
                name: 'Lembretes de Oração',
                description: 'Lembretes diários para oração com Maria',
                importance: 4, // HIGH
                visibility: 1, // PUBLIC
                sound: 'default',
                vibration: true,
                lights: true
            });
            
            // Agendar todas
            if (notifications.length > 0) {
                await this.LocalNotifications.schedule({ notifications });
                console.log(`🔔 ${notifications.length} notificações agendadas (nativo)`);
            }
            
        } catch (e) {
            console.error('🔔 Erro ao agendar notificações nativas:', e);
        }
    },

    // ==================== NOTIFICAÇÕES BROWSER ====================
    scheduleBrowserNotifications() {
        // Limpar agendamentos anteriores
        if (this.scheduledTimers) {
            this.scheduledTimers.forEach(timer => clearTimeout(timer));
        }
        this.scheduledTimers = [];

        const now = new Date();
        
        const scheduleFor = (timeStr, type) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const target = new Date(now);
            target.setHours(hours, minutes, 0, 0);
            
            // Se já passou, agenda para amanhã
            if (target <= now) {
                target.setDate(target.getDate() + 1);
            }
            
            const delay = target - now;
            console.log(`⏰ Notificação ${type} agendada para ${target.toLocaleString()}`);
            
            const timer = setTimeout(() => {
                this.triggerBrowserNotification(type);
                // Reagendar para o próximo dia
                this.scheduleBrowserNotifications();
            }, delay);
            
            this.scheduledTimers.push(timer);
        };

        if (this.settings.manha) scheduleFor(this.settings.horarios.manha, 'manha');
        if (this.settings.angelus) scheduleFor(this.settings.horarios.angelus, 'angelus');
        if (this.settings.noite) scheduleFor(this.settings.horarios.noite, 'noite');
    },

    // Disparar notificação browser
    async triggerBrowserNotification(type) {
        if (Notification.permission !== 'granted') return;
        
        const mensagens = this.mensagensHorario[type];
        const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
        const verse = this.getDailyVerse();
        
        // Tentar Service Worker primeiro, senão usar Notification API direta
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                registration.showNotification(mensagem, {
                    body: `"${verse.texto}" - ${verse.ref}`,
                    icon: 'icons/icon-192.png',
                    badge: 'icons/icon-72.png',
                    vibrate: [100, 50, 100],
                    tag: `maria-${type}`,
                    renotify: true
                });
                return;
            } catch (e) {
                console.log('🔔 Service Worker não disponível, usando Notification API');
            }
        }
        
        // Fallback para Notification API direta
        new Notification(mensagem, {
            body: `"${verse.texto}" - ${verse.ref}`,
            icon: 'icons/icon-192.png',
            tag: `maria-${type}`
        });
    },

    // Testar notificação
    async testNotification() {
        const verse = this.getDailyVerse();
        const mensagem = 'Maria tem uma palavra para você! 🙏';
        const body = `"${verse.texto}" - ${verse.ref}`;
        
        if (this.isNative && this.LocalNotifications) {
            // Notificação nativa imediata
            try {
                await this.LocalNotifications.schedule({
                    notifications: [{
                        id: 999,
                        title: mensagem,
                        body: body,
                        schedule: { at: new Date(Date.now() + 1000) }, // 1 segundo
                        sound: 'default',
                        smallIcon: 'ic_stat_notify',
                        channelId: 'maria-lembretes'
                    }]
                });
                console.log('🔔 Notificação de teste enviada (nativo)');
            } catch (e) {
                console.error('🔔 Erro no teste de notificação:', e);
            }
        } else {
            // Browser
            if (Notification.permission === 'granted') {
                new Notification(mensagem, {
                    body: body,
                    icon: 'icons/icon-192.png',
                    tag: 'maria-test'
                });
                console.log('🔔 Notificação de teste enviada (browser)');
            }
        }
    },

    // Cancelar todas as notificações
    async cancelAll() {
        if (this.isNative && this.LocalNotifications) {
            try {
                const pending = await this.LocalNotifications.getPending();
                if (pending.notifications.length > 0) {
                    await this.LocalNotifications.cancel(pending);
                }
                console.log('🔔 Notificações canceladas (nativo)');
            } catch (e) {
                console.error('🔔 Erro ao cancelar:', e);
            }
        } else {
            if (this.scheduledTimers) {
                this.scheduledTimers.forEach(timer => clearTimeout(timer));
                this.scheduledTimers = [];
            }
            console.log('🔔 Notificações canceladas (browser)');
        }
    }
};

// Inicializar ao carregar
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => NotificationSystem.init(), 1000);
});

// Exportar para uso global
window.NotificationSystem = NotificationSystem;
