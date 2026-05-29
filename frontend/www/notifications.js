// ========================================
// 🔔 SISTEMA DE LEMBRETES - CONVERSE COM MARIA
// Capacitor Local Notifications
// ========================================

const NotificationSystem = {
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

    // ========================================
    // INICIALIZAÇÃO
    // ========================================
    async init() {
        console.log('🔔 Inicializando sistema de lembretes...');
        
        this.isNative = this.detectCapacitor();
        console.log('🔔 Plataforma:', this.isNative ? 'APK Nativo ✓' : 'Browser ✗');
        
        if (this.isNative) {
            this.loadPlugin();
            
            if (this.LocalNotifications) {
                await this.createNotificationChannel();
                
                // Listener para quando notificação é clicada
                try {
                    this.LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
                        console.log('🔔 Notificação clicada:', notification);
                        
                        // Marcar que notificação foi clicada (para cold start)
                        localStorage.setItem('maria_notification_pending', Date.now().toString());
                        
                        // Usar handler comum
                        this.handleNotificationOpen();
                    });
                } catch (e) {
                    console.log('🔔 Listener já existe ou erro:', e.message);
                }
            }
        }
        
        this.loadSettings();

        // Carrega frases do painel admin (Firestore) pra entrar no pool de versículos.
        // Background, não bloqueia init. Cache localStorage 24h pra reduzir reads.
        this._loadFrasesFromFirestore().catch(e => console.warn('Frases Firestore falhou:', e.message));

        // Reagendar se estava ativo
        if (this.isNative && this.settings.enabled) {
            await this.scheduleAll();
        }

        console.log('🔔 Sistema de lembretes iniciado!');
        
        // Verificar se app foi aberto por notificação (cold start)
        if (this.isNative && this.LocalNotifications) {
            this.checkLaunchNotification();
        }
    },
    
    // Verificar se app foi aberto por uma notificação (cold start)
    async checkLaunchNotification() {
        try {
            // Pequeno delay para garantir que o app carregou
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verificar se há notificação pendente que abriu o app
            const lastAction = localStorage.getItem('maria_notification_pending');
            if (lastAction) {
                const timestamp = parseInt(lastAction);
                const agora = Date.now();
                
                // Só processar se foi há menos de 10 segundos (evita processar notificações antigas)
                if (agora - timestamp < 10000) {
                    localStorage.removeItem('maria_notification_pending');
                    console.log('🔔 App aberto por notificação (cold start detectado)');
                    this.handleNotificationOpen();
                } else {
                    localStorage.removeItem('maria_notification_pending');
                    console.log('🔔 Notificação antiga ignorada');
                }
            }
        } catch (e) {
            console.log('🔔 Erro ao verificar launch notification:', e);
        }
    },
    
    // Handler comum para abertura via notificação
    handleNotificationOpen() {
        const nomeUsuario = localStorage.getItem('maria_user_nome');
        if (!nomeUsuario) {
            console.log('🔔 Usuário não cadastrado, ignorando');
            return;
        }
        
        const chat = document.getElementById('chat');
        
        // Se chat já está aberto, apenas mostrar modal de continuar
        if (chat && !chat.classList.contains('hidden')) {
            console.log('🔔 Chat aberto, mostrando modal de continuar...');
            if (typeof mostrarModalContinuarConversa === 'function') {
                mostrarModalContinuarConversa();
            }
            return;
        }
        
        // Esconder tela de acesso e abrir chat
        const telaAcesso = document.getElementById('tela-acesso');
        if (telaAcesso) telaAcesso.classList.add('hidden');
        
        // Iniciar chat (já vai mostrar modal automaticamente)
        if (typeof iniciarChatComUsuarioCadastrado === 'function') {
            console.log('🔔 Iniciando chat via notificação (cold start)...');
            iniciarChatComUsuarioCadastrado();
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
            // Tentar várias formas de acessar o plugin
            if (window.Capacitor?.Plugins?.LocalNotifications) {
                this.LocalNotifications = window.Capacitor.Plugins.LocalNotifications;
            } else if (Capacitor?.Plugins?.LocalNotifications) {
                this.LocalNotifications = Capacitor.Plugins.LocalNotifications;
            } else if (typeof LocalNotifications !== 'undefined') {
                this.LocalNotifications = LocalNotifications;
            }
            
            console.log('🔔 Plugin LocalNotifications:', this.LocalNotifications ? '✓ Carregado' : '✗ Não encontrado');
            
            if (!this.LocalNotifications) {
                console.error('🔔 ERRO: Plugin @capacitor/local-notifications não está instalado!');
                console.error('🔔 Execute: npm install @capacitor/local-notifications');
                console.error('🔔 E depois: npx cap sync android');
            }
        } catch (e) {
            console.error('🔔 Erro ao carregar plugin:', e);
        }
    },

    // ========================================
    // CANAL DE NOTIFICAÇÃO (Android 8+)
    // ========================================
    async createNotificationChannel() {
        if (!this.LocalNotifications) return;
        
        try {
            await this.LocalNotifications.createChannel({
                id: 'maria-lembretes',
                name: 'Lembretes de Oração',
                description: 'Lembretes diários para oração com Maria',
                importance: 4, // HIGH - aparece como heads-up
                visibility: 1, // PUBLIC
                sound: 'default',
                vibration: true,
                lights: true,
                lightColor: '#9333EA' // Roxo
            });
            console.log('🔔 Canal de notificação criado: maria-lembretes');
        } catch (e) {
            console.log('🔔 Canal já existe ou erro:', e.message);
        }
    },

    // ========================================
    // CONFIGURAÇÕES
    // ========================================
    loadSettings() {
        try {
            const saved = localStorage.getItem('mariaLembretes');
            this.settings = saved ? JSON.parse(saved) : {
                enabled: false,
                lembretes: {
                    manha: { ativo: false, horario: '07:00' },
                    angelus: { ativo: false, horario: '12:00' },
                    noite: { ativo: false, horario: '20:00' }
                }
            };
        } catch (e) {
            this.settings = {
                enabled: false,
                lembretes: {
                    manha: { ativo: false, horario: '07:00' },
                    angelus: { ativo: false, horario: '12:00' },
                    noite: { ativo: false, horario: '20:00' }
                }
            };
        }
        return this.settings;
    },

    saveSettings() {
        try {
            localStorage.setItem('mariaLembretes', JSON.stringify(this.settings));
            console.log('🔔 Configurações salvas');
        } catch (e) {
            console.error('🔔 Erro ao salvar:', e);
        }
    },

    // ========================================
    // PERMISSÕES
    // ========================================
    async checkPermission() {
        if (!this.isNative || !this.LocalNotifications) return false;
        
        try {
            const result = await this.LocalNotifications.checkPermissions();
            console.log('🔔 Permissão atual:', result.display);
            return result.display === 'granted';
        } catch (e) {
            console.error('🔔 Erro ao verificar permissão:', e);
            return false;
        }
    },

    async requestPermission() {
        if (!this.isNative) {
            return { success: false, message: 'Lembretes só funcionam no app instalado' };
        }
        
        if (!this.LocalNotifications) {
            return { success: false, message: 'Plugin de notificações não instalado. Execute: npm install @capacitor/local-notifications' };
        }
        
        try {
            // Verificar permissão atual
            const currentStatus = await this.LocalNotifications.checkPermissions();
            console.log('🔔 Status atual:', currentStatus.display);
            
            if (currentStatus.display !== 'granted') {
                // Pedir permissão
                const result = await this.LocalNotifications.requestPermissions();
                console.log('🔔 Resultado da solicitação:', result.display);
                
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
            
            return { success: true, message: 'Lembretes ativados com sucesso!' };
        } catch (e) {
            console.error('🔔 Erro ao pedir permissão:', e);
            return { success: false, message: 'Erro: ' + e.message };
        }
    },

    // ========================================
    // AGENDAMENTO DE NOTIFICAÇÕES
    // ========================================
    async scheduleAll() {
        if (!this.isNative || !this.LocalNotifications) {
            console.log('🔔 Não é possível agendar (não nativo ou plugin ausente)');
            return;
        }
        
        console.log('🔔 Agendando lembretes...');
        
        // Primeiro cancelar todas existentes
        await this.cancelAll();
        
        if (!this.settings.enabled) {
            console.log('🔔 Lembretes desativados, não agendando');
            return;
        }
        
        const notifications = [];
        const verse = this.getDailyVerse();
        let id = 1;
        
        for (const [tipo, config] of Object.entries(this.settings.lembretes)) {
            if (!config.ativo) continue;
            
            const [hours, minutes] = config.horario.split(':').map(Number);
            const msgs = this.mensagens[tipo];
            const titulo = msgs[Math.floor(Math.random() * msgs.length)];
            
            const notification = {
                id: id++,
                title: titulo,
                body: `"${verse.texto}" - ${verse.ref}`,
                schedule: {
                    on: {
                        hour: hours,
                        minute: minutes
                    },
                    repeats: true,
                    allowWhileIdle: true
                },
                sound: 'default',
                smallIcon: 'ic_stat_notify',
                largeIcon: 'ic_launcher',
                channelId: 'maria-lembretes',
                autoCancel: true,
                extra: { tipo: tipo }
            };
            
            notifications.push(notification);
            console.log(`🔔 Preparando ${tipo}: ${config.horario}`);
        }
        
        if (notifications.length > 0) {
            try {
                await this.LocalNotifications.schedule({ notifications });
                console.log(`🔔 ✓ ${notifications.length} lembrete(s) agendado(s)!`);
                
                // Verificar se foi agendado
                const pending = await this.LocalNotifications.getPending();
                console.log('🔔 Notificações pendentes:', pending.notifications?.length || 0);
            } catch (e) {
                console.error('🔔 Erro ao agendar:', e);
            }
        } else {
            console.log('🔔 Nenhum lembrete ativo para agendar');
        }
    },

    async cancelAll() {
        if (!this.LocalNotifications) return;
        
        try {
            const pending = await this.LocalNotifications.getPending();
            if (pending?.notifications?.length > 0) {
                await this.LocalNotifications.cancel(pending);
                console.log('🔔 Notificações anteriores canceladas');
            }
        } catch (e) {
            console.log('🔔 Nada para cancelar ou erro:', e.message);
        }
    },

    // ========================================
    // CONTROLES PÚBLICOS
    // ========================================
    async enable() {
        return await this.requestPermission();
    },

    async disable() {
        this.settings.enabled = false;
        
        for (const tipo in this.settings.lembretes) {
            this.settings.lembretes[tipo].ativo = false;
        }
        
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

    async toggleLembrete(tipo) {
        if (!this.settings.lembretes[tipo]) {
            return { success: false, message: 'Tipo de lembrete inválido' };
        }
        
        // Se está ativando e sistema não está enabled
        if (!this.settings.lembretes[tipo].ativo && !this.settings.enabled) {
            const result = await this.enable();
            if (!result.success) return result;
        }
        
        this.settings.lembretes[tipo].ativo = !this.settings.lembretes[tipo].ativo;
        this.saveSettings();
        
        if (this.settings.enabled) {
            await this.scheduleAll();
        }
        
        const status = this.settings.lembretes[tipo].ativo ? 'ativado' : 'desativado';
        return { success: true, message: `Lembrete da ${tipo} ${status}!` };
    },

    async setHorario(tipo, horario) {
        if (!this.settings.lembretes[tipo]) return;
        
        this.settings.lembretes[tipo].horario = horario;
        this.saveSettings();
        
        if (this.settings.enabled) {
            await this.scheduleAll();
        }
        
        return { success: true, message: `Horário alterado para ${horario}` };
    },

    // ========================================
    // TESTE DE NOTIFICAÇÃO
    // ========================================
    async testNotification(tipo = 'manha') {
        if (!this.isNative) {
            if (typeof showToast === 'function') {
                showToast('❌ Só funciona no app instalado');
            }
            return { success: false, message: 'Só funciona no app instalado' };
        }
        
        if (!this.LocalNotifications) {
            if (typeof showToast === 'function') {
                showToast('❌ Plugin de notificações não instalado');
            }
            return { success: false, message: 'Plugin não instalado. Execute: npm install @capacitor/local-notifications' };
        }
        
        // Verificar/pedir permissão
        const hasPermission = await this.checkPermission();
        if (!hasPermission) {
            const result = await this.requestPermission();
            if (!result.success) {
                if (typeof showToast === 'function') {
                    showToast('❌ ' + result.message);
                }
                return result;
            }
        }
        
        const msgs = this.mensagens[tipo] || this.mensagens.manha;
        const titulo = msgs[Math.floor(Math.random() * msgs.length)];
        const verse = this.getDailyVerse();
        
        try {
            const scheduleTime = new Date(Date.now() + 3000);
            
            await this.LocalNotifications.schedule({
                notifications: [{
                    id: 9999,
                    title: '🙏 Teste de Lembrete',
                    body: `"${verse.texto}" - ${verse.ref}`,
                    schedule: { 
                        at: scheduleTime
                    },
                    sound: 'default',
                    smallIcon: 'ic_stat_notify',
                    largeIcon: 'ic_launcher',
                    channelId: 'maria-lembretes',
                    autoCancel: true
                }]
            });
            
            console.log('🔔 ✓ Notificação de teste agendada para 3 segundos');
            
            if (typeof showToast === 'function') {
                showToast('🔔 Notificação chegará em 3 segundos!');
            }
            
            return { success: true, message: 'Notificação enviada! Aguarde 3 segundos...' };
        } catch (e) {
            console.error('🔔 Erro no teste:', e);
            if (typeof showToast === 'function') {
                showToast('❌ Erro: ' + e.message);
            }
            return { success: false, message: 'Erro: ' + e.message };
        }
    },

    // ========================================
    // UTILITÁRIOS
    // ========================================

    // Frases administradas pelo painel admin (Firestore: conteudo_frases).
    // Carregadas em init() com cache 24h em localStorage pra reduzir reads.
    _frasesFirestore: [],

    async _loadFrasesFromFirestore() {
        // 1) Tenta cache localStorage (válido por 24h)
        try {
            const raw = localStorage.getItem('maria_frases_pool');
            if (raw) {
                const cache = JSON.parse(raw);
                if (cache && cache.timestamp && (Date.now() - cache.timestamp < 24 * 60 * 60 * 1000)) {
                    this._frasesFirestore = cache.lista || [];
                    return;
                }
            }
        } catch (e) {}

        // 2) Busca fresca no Firestore
        if (!window.firebase || !firebase.firestore) return;
        try {
            const snap = await firebase.firestore().collection('conteudo_frases').get();
            const lista = [];
            snap.forEach(doc => {
                const d = doc.data();
                if (d.texto) {
                    lista.push({
                        texto: d.texto,
                        ref: d.referencia || '',
                        reflexao: d.reflexao || ''
                    });
                }
            });
            this._frasesFirestore = lista;
            localStorage.setItem('maria_frases_pool', JSON.stringify({ timestamp: Date.now(), lista }));
            console.log('💭 Frases do painel carregadas:', lista.length);
        } catch (e) {
            console.warn('💭 Falha lendo conteudo_frases:', e.message);
        }
    },

    // Pool MISTO: frases do painel admin + versículos hardcoded como fallback
    _getFrasesPool() {
        const fromFirestore = this._frasesFirestore || [];
        // Se Firestore tem ≥ 7 frases, usa SÓ elas (curadoria do JOs).
        // Se tem poucas (<7), MESCLA com hardcoded pra ter variedade mínima.
        if (fromFirestore.length >= 7) return fromFirestore;
        return [...fromFirestore, ...this.versiculos];
    },

    getDailyVerse() {
        const pool = this._getFrasesPool();
        if (pool.length === 0) {
            return { texto: 'Fazei tudo o que Ele vos disser.', ref: 'João 2:5' };
        }
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        return pool[dayOfYear % pool.length];
    },

    isSupported() {
        return this.isNative && this.LocalNotifications !== null;
    },

    getStatus() {
        return {
            supported: this.isSupported(),
            isNative: this.isNative,
            pluginLoaded: this.LocalNotifications !== null,
            enabled: this.settings?.enabled || false,
            lembretes: this.settings?.lembretes || {}
        };
    },

    async listPending() {
        if (!this.LocalNotifications) {
            console.log('🔔 Plugin não disponível');
            return [];
        }
        
        try {
            const pending = await this.LocalNotifications.getPending();
            console.log('🔔 Notificações pendentes:', pending.notifications);
            return pending.notifications || [];
        } catch (e) {
            console.error('🔔 Erro ao listar:', e);
            return [];
        }
    }
};

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        NotificationSystem.init();
    }, 500);
});

// Expor globalmente
window.NotificationSystem = NotificationSystem;
