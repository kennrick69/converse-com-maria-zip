// ========================================
// 🔥 FIREBASE - CONFIGURAÇÃO E SERVIÇOS
// Converse com Maria
// ========================================

// INSTRUÇÕES:
// 1. Vá em https://console.firebase.google.com
// 2. Crie um novo projeto chamado "converse-com-maria"
// 3. Ative Authentication (Email/Senha e Google)
// 4. Ative Firestore Database
// 5. Copie as credenciais e cole abaixo

const firebaseConfig = {
    apiKey: "AIzaSy8PHjPeMi3Vv9Eccml08uALLP-pSnGWAFQ",
    authDomain: "converse-com-maria.firebaseapp.com",
    projectId: "converse-com-maria",
    storageBucket: "converse-com-maria.firebasestorage.app",
    messagingSenderId: "316758623296",
    appId: "1:316758623296:web:e2864b47debd4e341c8ba5"
};

// ========================================
// 🚀 INICIALIZAÇÃO
// ========================================

let db = null;
let auth = null;
let currentUser = null;

const FirebaseService = {
    // Status de inicialização
    initialized: false,
    
    // Inicializar Firebase
    async init() {
        if (this.initialized) return true;
        
        try {
            // Verificar se Firebase foi carregado
            if (typeof firebase === 'undefined') {
                console.error('Firebase SDK não carregado');
                return false;
            }
            
            // Inicializar app
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            // Referências
            db = firebase.firestore();
            auth = firebase.auth();
            
            // Habilitar persistência offline
            try {
                await db.enablePersistence();
                console.log('✅ Persistência offline habilitada');
            } catch (err) {
                if (err.code === 'failed-precondition') {
                    console.warn('Múltiplas abas abertas, persistência limitada');
                } else if (err.code === 'unimplemented') {
                    console.warn('Navegador não suporta persistência');
                }
            }
            
            // Listener de autenticação
            auth.onAuthStateChanged((user) => {
                currentUser = user;
                if (user) {
                    console.log('✅ Usuário logado:', user.email || user.uid);
                    this.onUserLogin(user);
                } else {
                    console.log('❌ Usuário deslogado');
                    this.onUserLogout();
                }
            });
            
            this.initialized = true;
            console.log('🔥 Firebase inicializado com sucesso!');
            return true;
            
        } catch (error) {
            console.error('Erro ao inicializar Firebase:', error);
            return false;
        }
    },
    
    // Callback quando usuário loga
    onUserLogin(user) {
        // Sincronizar dados locais para nuvem
        setTimeout(() => {
            UserDataService.syncLocalToCloud();
        }, 1000);
    },
    
    // Callback quando usuário desloga
    onUserLogout() {
        currentUser = null;
    },
    
    // Verificar se está inicializado
    isReady() {
        return this.initialized && db !== null;
    },
    
    // Obter usuário atual
    getCurrentUser() {
        return currentUser;
    },
    
    // Verificar se está logado
    isLoggedIn() {
        return currentUser !== null;
    }
};

// ========================================
// 🔐 AUTENTICAÇÃO
// ========================================

const AuthService = {

    // 📧 Dispara o e-mail de boas-vindas (fire-and-forget).
    // Não bloqueia nem quebra o cadastro se o backend estiver fora/sem SMTP.
    // Portado de fase-old-base — antes era no-op em `main`, por isso usuários
    // novos cadastrados não recebiam o e-mail.
    _enviarBoasVindas(email, nome) {
        try {
            if (!email) return;
            fetch('https://converse-com-maria-production.up.railway.app/api/boas-vindas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, nome: nome || '' })
            }).catch(() => {});
        } catch (_) {}
    },

    // Registrar com email e senha
    async registerWithEmail(email, password, nome) {
        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);

            // Atualizar perfil com nome
            await result.user.updateProfile({
                displayName: nome
            });

            // Criar documento do usuário no Firestore
            await UserDataService.createUserDocument(result.user.uid, {
                nome: nome,
                email: email,
                criadoEm: firebase.firestore.FieldValue.serverTimestamp()
            });

            // E-mail de boas-vindas (não espera a resposta)
            this._enviarBoasVindas(email, nome);

            return { success: true, user: result.user };
        } catch (error) {
            console.error('Erro no registro:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    },
    
    // Login com email e senha
    async loginWithEmail(email, password) {
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: result.user };
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    },
    
    // Login com Google
    async loginWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await auth.signInWithPopup(provider);
            
            // Verificar se é novo usuário
            if (result.additionalUserInfo?.isNewUser) {
                await UserDataService.createUserDocument(result.user.uid, {
                    nome: result.user.displayName,
                    email: result.user.email,
                    foto: result.user.photoURL,
                    criadoEm: firebase.firestore.FieldValue.serverTimestamp()
                });
                // E-mail de boas-vindas também pra quem entra pela 1ª vez via Google
                this._enviarBoasVindas(result.user.email, result.user.displayName);
            }

            return { success: true, user: result.user };
        } catch (error) {
            console.error('Erro no login Google:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    },
    
    // Logout
    async logout() {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            console.error('Erro no logout:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Recuperar senha
    async resetPassword(email) {
        try {
            await auth.sendPasswordResetEmail(email);
            return { success: true };
        } catch (error) {
            console.error('Erro ao recuperar senha:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    },
    
    // Traduzir erros
    getErrorMessage(code) {
        const errors = {
            'auth/email-already-in-use': 'Este email já está cadastrado',
            'auth/invalid-email': 'Email inválido',
            'auth/operation-not-allowed': 'Operação não permitida',
            'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres)',
            'auth/user-disabled': 'Usuário desativado',
            'auth/user-not-found': 'Usuário não encontrado',
            'auth/wrong-password': 'Senha incorreta',
            'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos',
            'auth/popup-closed-by-user': 'Login cancelado'
        };
        return errors[code] || 'Erro desconhecido. Tente novamente.';
    }
};

// ========================================
// 👤 DADOS DO USUÁRIO
// ========================================

const UserDataService = {
    
    // Criar documento inicial do usuário
    async createUserDocument(uid, dados) {
        if (!FirebaseService.isReady()) return false;
        
        try {
            await db.collection('usuarios').doc(uid).set({
                ...dados,
                perfil: {
                    nome: dados.nome || '',
                    genero: '',
                    estadoCivil: '',
                    temFilhos: ''
                },
                estatisticas: {
                    mensagensEnviadas: 0,
                    tercosCompletos: 0,
                    velasAcesas: 0,
                    intencoesPublicadas: 0,
                    streakAtual: 0,
                    streakMaximo: 0,
                    ultimaAtividade: null
                },
                conquistas: [],
                premium: {
                    ativo: false,
                    expiraEm: null,
                    plano: null
                },
                preferencias: {
                    tema: 'padrao',
                    notificacoes: true,
                    musica: null
                },
                criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
                atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            console.log('✅ Documento do usuário criado');
            return true;
        } catch (error) {
            console.error('Erro ao criar documento:', error);
            return false;
        }
    },
    
    // Obter dados do usuário
    async getUserData() {
        if (!FirebaseService.isReady() || !currentUser) return null;
        
        try {
            const doc = await db.collection('usuarios').doc(currentUser.uid).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Erro ao obter dados:', error);
            return null;
        }
    },
    
    // Atualizar perfil
    async updateProfile(perfil) {
        if (!FirebaseService.isReady() || !currentUser) return false;
        
        try {
            await db.collection('usuarios').doc(currentUser.uid).update({
                perfil: perfil,
                atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            return false;
        }
    },
    
    // Atualizar estatísticas
    async updateStats(campo, valor) {
        if (!FirebaseService.isReady() || !currentUser) return false;
        
        try {
            await db.collection('usuarios').doc(currentUser.uid).update({
                [`estatisticas.${campo}`]: valor,
                'estatisticas.ultimaAtividade': firebase.firestore.FieldValue.serverTimestamp(),
                atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Erro ao atualizar estatísticas:', error);
            return false;
        }
    },
    
    // Incrementar estatística
    async incrementStat(campo, quantidade = 1) {
        if (!FirebaseService.isReady() || !currentUser) return false;
        
        try {
            await db.collection('usuarios').doc(currentUser.uid).update({
                [`estatisticas.${campo}`]: firebase.firestore.FieldValue.increment(quantidade),
                'estatisticas.ultimaAtividade': firebase.firestore.FieldValue.serverTimestamp(),
                atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Erro ao incrementar:', error);
            return false;
        }
    },
    
    // Atualizar streak
    async updateStreak(novoStreak) {
        if (!FirebaseService.isReady() || !currentUser) return false;
        
        try {
            const userData = await this.getUserData();
            const maxStreak = Math.max(novoStreak, userData?.estatisticas?.streakMaximo || 0);
            
            await db.collection('usuarios').doc(currentUser.uid).update({
                'estatisticas.streakAtual': novoStreak,
                'estatisticas.streakMaximo': maxStreak,
                'estatisticas.ultimaAtividade': firebase.firestore.FieldValue.serverTimestamp(),
                atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Erro ao atualizar streak:', error);
            return false;
        }
    },
    
    // Adicionar conquista
    async addConquista(conquistaId) {
        if (!FirebaseService.isReady() || !currentUser) return false;
        
        try {
            await db.collection('usuarios').doc(currentUser.uid).update({
                conquistas: firebase.firestore.FieldValue.arrayUnion({
                    id: conquistaId,
                    desbloqueadaEm: new Date().toISOString()
                }),
                atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Erro ao adicionar conquista:', error);
            return false;
        }
    },
    
    // Atualizar preferências
    async updatePreferences(prefs) {
        if (!FirebaseService.isReady() || !currentUser) return false;
        
        try {
            await db.collection('usuarios').doc(currentUser.uid).update({
                preferencias: prefs,
                atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Erro ao atualizar preferências:', error);
            return false;
        }
    },
    
    // Sincronizar dados locais para nuvem
    async syncLocalToCloud() {
        if (!FirebaseService.isReady() || !currentUser) return;
        
        console.log('🔄 Sincronizando dados locais para nuvem...');
        
        try {
            // Perfil
            const perfilLocal = localStorage.getItem('mariaPerfil');
            if (perfilLocal) {
                await this.updateProfile(JSON.parse(perfilLocal));
            }
            
            // Streak
            const streakLocal = localStorage.getItem('mariaStreak');
            if (streakLocal) {
                const { count } = JSON.parse(streakLocal);
                await this.updateStreak(count);
            }
            
            // Estatísticas
            const statsLocal = localStorage.getItem('mariaEstatisticas');
            if (statsLocal) {
                const stats = JSON.parse(statsLocal);
                for (const [key, value] of Object.entries(stats)) {
                    if (typeof value === 'number') {
                        await this.updateStats(key, value);
                    }
                }
            }
            
            // Conquistas
            const conquistasLocal = localStorage.getItem('mariaConquistas');
            if (conquistasLocal) {
                const conquistas = JSON.parse(conquistasLocal);
                for (const id of conquistas) {
                    await this.addConquista(id);
                }
            }
            
            // Preferências
            const temaLocal = localStorage.getItem('mariaTema');
            const musicaLocal = localStorage.getItem('mariaMusica');
            if (temaLocal || musicaLocal) {
                await this.updatePreferences({
                    tema: temaLocal || 'padrao',
                    musica: musicaLocal || null,
                    notificacoes: true
                });
            }
            
            console.log('✅ Sincronização concluída!');
        } catch (error) {
            console.error('Erro na sincronização:', error);
        }
    },
    
    // Carregar dados da nuvem para local
    async syncCloudToLocal() {
        if (!FirebaseService.isReady() || !currentUser) return;
        
        console.log('🔄 Carregando dados da nuvem...');
        
        try {
            const userData = await this.getUserData();
            if (!userData) return;
            
            // Perfil
            if (userData.perfil) {
                localStorage.setItem('mariaPerfil', JSON.stringify(userData.perfil));
            }
            
            // Estatísticas
            if (userData.estatisticas) {
                localStorage.setItem('mariaEstatisticas', JSON.stringify(userData.estatisticas));
                
                // Streak específico
                localStorage.setItem('mariaStreak', JSON.stringify({
                    count: userData.estatisticas.streakAtual || 0,
                    lastDate: new Date().toDateString()
                }));
            }
            
            // Conquistas
            if (userData.conquistas) {
                const ids = userData.conquistas.map(c => c.id);
                localStorage.setItem('mariaConquistas', JSON.stringify(ids));
            }
            
            // Preferências
            if (userData.preferencias) {
                if (userData.preferencias.tema) {
                    localStorage.setItem('mariaTema', userData.preferencias.tema);
                }
                if (userData.preferencias.musica) {
                    localStorage.setItem('mariaMusica', userData.preferencias.musica);
                }
            }
            
            console.log('✅ Dados carregados da nuvem!');
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }
};

// ========================================
// 🕯️ VELAS COMPARTILHADAS
// ========================================

const VelasService = {
    
    // Acender vela (salvar no Firebase)
    async acenderVela(vela) {
        if (!FirebaseService.isReady()) return null;
        
        try {
            const docRef = await db.collection('velas').add({
                usuarioId: currentUser?.uid || 'anonimo',
                usuarioNome: currentUser?.displayName || 'Anônimo',
                tipo: vela.tipo,
                intencao: vela.intencao,
                cor: vela.cor,
                acesaEm: firebase.firestore.FieldValue.serverTimestamp(),
                expiraEm: new Date(Date.now() + (vela.duracao || 24) * 60 * 60 * 1000),
                rezasPorEla: 0,
                ativa: true
            });
            
            // Incrementar estatística
            if (currentUser) {
                await UserDataService.incrementStat('velasAcesas');
            }
            
            return docRef.id;
        } catch (error) {
            console.error('Erro ao acender vela:', error);
            return null;
        }
    },
    
    // Obter velas ativas (tempo real)
    onVelasAtivas(callback) {
        if (!FirebaseService.isReady()) return () => {};
        
        return db.collection('velas')
            .where('ativa', '==', true)
            .where('expiraEm', '>', new Date())
            .orderBy('expiraEm')
            .orderBy('acesaEm', 'desc')
            .limit(50)
            .onSnapshot((snapshot) => {
                const velas = [];
                snapshot.forEach(doc => {
                    velas.push({ id: doc.id, ...doc.data() });
                });
                callback(velas);
            }, (error) => {
                console.error('Erro ao ouvir velas:', error);
            });
    },
    
    // Rezar por uma vela
    async rezarPorVela(velaId) {
        if (!FirebaseService.isReady()) return false;
        
        try {
            await db.collection('velas').doc(velaId).update({
                rezasPorEla: firebase.firestore.FieldValue.increment(1)
            });
            return true;
        } catch (error) {
            console.error('Erro ao rezar por vela:', error);
            return false;
        }
    }
};

// ========================================
// 👥 MURAL DE INTENÇÕES COMPARTILHADO
// ========================================

const MuralService = {
    
    // Publicar intenção
    async publicarIntencao(intencao) {
        if (!FirebaseService.isReady()) return null;
        
        try {
            const docRef = await db.collection('intencoes').add({
                usuarioId: currentUser?.uid || 'anonimo',
                usuarioNome: currentUser?.displayName || 'Anônimo',
                texto: intencao.texto,
                categoria: intencao.categoria || 'geral',
                publicadaEm: firebase.firestore.FieldValue.serverTimestamp(),
                rezasPorEla: 0,
                ativa: true
            });
            
            // Incrementar estatística
            if (currentUser) {
                await UserDataService.incrementStat('intencoesPublicadas');
            }
            
            return docRef.id;
        } catch (error) {
            console.error('Erro ao publicar intenção:', error);
            return null;
        }
    },
    
    // Obter intenções (tempo real)
    onIntencoes(callback, limite = 30) {
        if (!FirebaseService.isReady()) return () => {};
        
        return db.collection('intencoes')
            .where('ativa', '==', true)
            .orderBy('publicadaEm', 'desc')
            .limit(limite)
            .onSnapshot((snapshot) => {
                const intencoes = [];
                snapshot.forEach(doc => {
                    intencoes.push({ id: doc.id, ...doc.data() });
                });
                callback(intencoes);
            }, (error) => {
                console.error('Erro ao ouvir intenções:', error);
            });
    },
    
    // Rezar por uma intenção
    async rezarPorIntencao(intencaoId) {
        if (!FirebaseService.isReady()) return false;
        
        try {
            await db.collection('intencoes').doc(intencaoId).update({
                rezasPorEla: firebase.firestore.FieldValue.increment(1)
            });
            return true;
        } catch (error) {
            console.error('Erro ao rezar por intenção:', error);
            return false;
        }
    },
    
    // Denunciar intenção
    async denunciarIntencao(intencaoId, motivo) {
        if (!FirebaseService.isReady()) return false;
        
        try {
            await db.collection('denuncias').add({
                intencaoId: intencaoId,
                denunciadoPor: currentUser?.uid || 'anonimo',
                motivo: motivo,
                data: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Erro ao denunciar:', error);
            return false;
        }
    }
};

// ========================================
// 👑 PREMIUM
// ========================================

const PremiumService = {
    
    // Verificar se é premium
    async isPremium() {
        if (!FirebaseService.isReady() || !currentUser) {
            // Fallback para localStorage
            return localStorage.getItem('mariaPremium') === 'true';
        }
        
        try {
            const userData = await UserDataService.getUserData();
            if (userData?.premium?.ativo) {
                // Verificar se não expirou
                if (userData.premium.expiraEm) {
                    const expira = userData.premium.expiraEm.toDate();
                    return expira > new Date();
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro ao verificar premium:', error);
            return false;
        }
    },
    
    // Ativar premium (após pagamento confirmado)
    async ativarPremium(plano, duracaoDias) {
        if (!FirebaseService.isReady() || !currentUser) return false;
        
        try {
            const expiraEm = new Date();
            expiraEm.setDate(expiraEm.getDate() + duracaoDias);
            
            await db.collection('usuarios').doc(currentUser.uid).update({
                'premium.ativo': true,
                'premium.plano': plano,
                'premium.ativadoEm': firebase.firestore.FieldValue.serverTimestamp(),
                'premium.expiraEm': expiraEm
            });
            
            // Atualizar localStorage
            localStorage.setItem('mariaPremium', 'true');
            
            return true;
        } catch (error) {
            console.error('Erro ao ativar premium:', error);
            return false;
        }
    }
};

// ========================================
// 📊 ESTATÍSTICAS GLOBAIS (para ranking futuro)
// ========================================

const StatsGlobaisService = {
    
    // Obter total de usuários orando
    async getTotalUsuariosOrando() {
        if (!FirebaseService.isReady()) return 0;
        
        try {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            
            const snapshot = await db.collection('usuarios')
                .where('estatisticas.ultimaAtividade', '>=', hoje)
                .get();
            
            return snapshot.size;
        } catch (error) {
            console.error('Erro ao obter total:', error);
            return 0;
        }
    },
    
    // Obter total de velas acesas hoje
    async getVelasHoje() {
        if (!FirebaseService.isReady()) return 0;
        
        try {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            
            const snapshot = await db.collection('velas')
                .where('acesaEm', '>=', hoje)
                .get();
            
            return snapshot.size;
        } catch (error) {
            console.error('Erro ao obter velas:', error);
            return 0;
        }
    }
};

// ========================================
// 🚀 EXPORTAR PARA USO GLOBAL
// ========================================

window.FirebaseService = FirebaseService;
window.AuthService = AuthService;
window.UserDataService = UserDataService;
window.VelasService = VelasService;
window.MuralService = MuralService;
window.PremiumService = PremiumService;
window.StatsGlobaisService = StatsGlobaisService;

// Auto-inicializar quando o script carregar
document.addEventListener('DOMContentLoaded', () => {
    FirebaseService.init();
});

console.log('🔥 Firebase Config carregado!');
