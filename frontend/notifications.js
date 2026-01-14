// ========================================
// 🔔 SISTEMA DE NOTIFICAÇÕES - CONVERSE COM MARIA
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

    // Inicializar sistema
    init() {
        this.checkSupport();
        this.loadSettings();
        this.setupDailyVerse();
    },

    // Verificar suporte a notificações
    checkSupport() {
        if (!('Notification' in window)) {
            console.log('❌ Navegador não suporta notificações');
            return false;
        }
        if (!('serviceWorker' in navigator)) {
            console.log('❌ Navegador não suporta Service Worker');
            return false;
        }
        return true;
    },

    // Pedir permissão
    async requestPermission() {
        if (!this.checkSupport()) return false;
        
        const permission = await Notification.requestPermission();
        console.log('🔔 Permissão de notificação:', permission);
        
        if (permission === 'granted') {
            this.saveSettings({ enabled: true });
            this.scheduleNotifications();
            return true;
        }
        return false;
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

    // Mostrar notificação local
    async showNotification(title, body, options = {}) {
        if (Notification.permission !== 'granted') return;

        const registration = await navigator.serviceWorker.ready;
        
        registration.showNotification(title, {
            body,
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-72.png',
            vibrate: [100, 50, 100],
            tag: options.tag || 'maria-notification',
            renotify: true,
            data: { url: '/' },
            ...options
        });
    },

    // Agendar notificações
    scheduleNotifications() {
        if (!this.settings.enabled) return;
        
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
                this.triggerNotification(type);
                // Reagendar para o próximo dia
                this.scheduleNotifications();
            }, delay);
            
            this.scheduledTimers.push(timer);
        };

        if (this.settings.manha) scheduleFor(this.settings.horarios.manha, 'manha');
        if (this.settings.angelus) scheduleFor(this.settings.horarios.angelus, 'angelus');
        if (this.settings.noite) scheduleFor(this.settings.horarios.noite, 'noite');
    },

    // Disparar notificação por tipo
    triggerNotification(type) {
        const mensagens = this.mensagensHorario[type];
        const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
        const verse = this.getDailyVerse();
        
        this.showNotification(
            mensagem,
            `"${verse.texto}" - ${verse.ref}`,
            { tag: `maria-${type}` }
        );
    },

    // Testar notificação
    async testNotification() {
        const verse = this.getDailyVerse();
        await this.showNotification(
            'Maria tem uma palavra para você! 🙏',
            `"${verse.texto}" - ${verse.ref}`,
            { tag: 'maria-test' }
        );
    }
};

// Exportar para uso global
window.NotificationSystem = NotificationSystem;
