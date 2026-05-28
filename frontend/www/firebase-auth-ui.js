// ========================================
// 🔐 TELA DE LOGIN/CADASTRO
// Converse com Maria - Firebase Auth
// ========================================

const TelaAuth = {
    
    // Abrir tela de login
    abrir(modo = 'login') {
        // Remover modal existente
        const existente = document.getElementById('modal-auth');
        if (existente) existente.remove();
        
        const modal = document.createElement('div');
        modal.id = 'modal-auth';
        modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4';
        modal.style.background = 'linear-gradient(135deg, #5b2206 0%, #a34b10 50%, #5b2206 100%)';
        
        modal.innerHTML = `
            <div class="w-full max-w-md">
                <!-- Logo e título -->
                <div class="text-center mb-6">
                    <div class="text-6xl mb-3">🙏</div>
                    <h1 class="text-3xl font-bold text-white" style="font-family: 'Crimson Text', serif;">
                        Converse com Maria
                    </h1>
                    <p class="text-amber-200 mt-2 text-sm">Mãe de Jesus Cristo • Rainha dos Céus</p>
                </div>
                
                <!-- Card do formulário -->
                <div class="bg-white/95 rounded-3xl p-6 shadow-2xl">
                    
                    <!-- Abas Login/Cadastro -->
                    <div class="flex mb-6 bg-amber-100 rounded-xl p-1">
                        <button onclick="TelaAuth.trocarAba('login')" id="aba-login"
                            class="flex-1 py-2 rounded-lg font-semibold transition-all ${modo === 'login' ? 'bg-amber-600 text-white' : 'text-amber-800'}">
                            Entrar
                        </button>
                        <button onclick="TelaAuth.trocarAba('cadastro')" id="aba-cadastro"
                            class="flex-1 py-2 rounded-lg font-semibold transition-all ${modo === 'cadastro' ? 'bg-amber-600 text-white' : 'text-amber-800'}">
                            Criar Conta
                        </button>
                    </div>
                    
                    <!-- Mensagem de erro -->
                    <div id="auth-erro" class="hidden mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm"></div>
                    
                    <!-- Mensagem de sucesso -->
                    <div id="auth-sucesso" class="hidden mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-xl text-sm"></div>
                    
                    <!-- Formulário de Login -->
                    <div id="form-login" class="${modo === 'login' ? '' : 'hidden'}">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-semibold text-amber-900 mb-1">Email</label>
                                <input type="email" id="login-email" placeholder="seu@email.com"
                                    class="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none text-gray-800">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-amber-900 mb-1">Senha</label>
                                <input type="password" id="login-senha" placeholder="Sua senha"
                                    class="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none text-gray-800">
                            </div>
                            
                            <button onclick="TelaAuth.fazerLogin()" id="btn-login"
                                class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition-all">
                                Entrar
                            </button>
                            
                            <button onclick="TelaAuth.esqueceuSenha()" 
                                class="w-full text-amber-700 text-sm hover:underline">
                                Esqueceu a senha?
                            </button>
                        </div>
                    </div>
                    
                    <!-- Formulário de Cadastro -->
                    <div id="form-cadastro" class="${modo === 'cadastro' ? '' : 'hidden'}">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-semibold text-amber-900 mb-1">Nome</label>
                                <input type="text" id="cadastro-nome" placeholder="Seu nome"
                                    class="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none text-gray-800">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-amber-900 mb-1">Email</label>
                                <input type="email" id="cadastro-email" placeholder="seu@email.com"
                                    class="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none text-gray-800">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-amber-900 mb-1">Senha</label>
                                <input type="password" id="cadastro-senha" placeholder="Mínimo 6 caracteres"
                                    class="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none text-gray-800">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-amber-900 mb-1">Confirmar Senha</label>
                                <input type="password" id="cadastro-senha2" placeholder="Repita a senha"
                                    class="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none text-gray-800">
                            </div>
                            
                            <button onclick="TelaAuth.fazerCadastro()" id="btn-cadastro"
                                class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition-all">
                                Criar Conta
                            </button>
                        </div>
                    </div>
                    
                    <!-- Divisor -->
                    <div class="flex items-center my-6">
                        <div class="flex-1 border-t border-amber-200"></div>
                        <span class="px-4 text-amber-600 text-sm">ou</span>
                        <div class="flex-1 border-t border-amber-200"></div>
                    </div>
                    
                    <!-- Login Social -->
                    <button onclick="TelaAuth.loginGoogle()" 
                        class="w-full py-3 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold text-gray-700 flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow">
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continuar com Google
                    </button>
                    
                    <!-- Entrar sem conta -->
                    <button onclick="TelaAuth.entrarSemConta()" 
                        class="w-full mt-4 py-3 text-amber-700 hover:text-amber-900 text-sm font-semibold">
                        Continuar sem conta (dados locais apenas)
                    </button>
                </div>
                
                <!-- Termos -->
                <p class="text-center text-amber-200/70 text-xs mt-4">
                    Ao continuar, você concorda com nossos<br>
                    <a href="#" class="underline">Termos de Uso</a> e <a href="#" class="underline">Política de Privacidade</a>
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Focus no primeiro campo
        setTimeout(() => {
            const campo = modo === 'login' ? 'login-email' : 'cadastro-nome';
            document.getElementById(campo)?.focus();
        }, 100);
    },
    
    // Fechar modal
    fechar() {
        const modal = document.getElementById('modal-auth');
        if (modal) modal.remove();
    },
    
    // Trocar entre abas
    trocarAba(aba) {
        const formLogin = document.getElementById('form-login');
        const formCadastro = document.getElementById('form-cadastro');
        const abaLogin = document.getElementById('aba-login');
        const abaCadastro = document.getElementById('aba-cadastro');
        
        // Limpar erros
        this.limparMensagens();
        
        if (aba === 'login') {
            formLogin.classList.remove('hidden');
            formCadastro.classList.add('hidden');
            abaLogin.classList.add('bg-amber-600', 'text-white');
            abaLogin.classList.remove('text-amber-800');
            abaCadastro.classList.remove('bg-amber-600', 'text-white');
            abaCadastro.classList.add('text-amber-800');
        } else {
            formCadastro.classList.remove('hidden');
            formLogin.classList.add('hidden');
            abaCadastro.classList.add('bg-amber-600', 'text-white');
            abaCadastro.classList.remove('text-amber-800');
            abaLogin.classList.remove('bg-amber-600', 'text-white');
            abaLogin.classList.add('text-amber-800');
        }
    },
    
    // Mostrar erro
    mostrarErro(mensagem) {
        const erro = document.getElementById('auth-erro');
        const sucesso = document.getElementById('auth-sucesso');
        if (erro) {
            erro.textContent = mensagem;
            erro.classList.remove('hidden');
        }
        if (sucesso) sucesso.classList.add('hidden');
    },
    
    // Mostrar sucesso
    mostrarSucesso(mensagem) {
        const sucesso = document.getElementById('auth-sucesso');
        const erro = document.getElementById('auth-erro');
        if (sucesso) {
            sucesso.textContent = mensagem;
            sucesso.classList.remove('hidden');
        }
        if (erro) erro.classList.add('hidden');
    },
    
    // Limpar mensagens
    limparMensagens() {
        document.getElementById('auth-erro')?.classList.add('hidden');
        document.getElementById('auth-sucesso')?.classList.add('hidden');
    },
    
    // Desabilitar botões durante loading
    setLoading(loading) {
        const btnLogin = document.getElementById('btn-login');
        const btnCadastro = document.getElementById('btn-cadastro');
        
        if (btnLogin) {
            btnLogin.disabled = loading;
            btnLogin.textContent = loading ? 'Aguarde...' : 'Entrar';
        }
        if (btnCadastro) {
            btnCadastro.disabled = loading;
            btnCadastro.textContent = loading ? 'Aguarde...' : 'Criar Conta';
        }
    },
    
    // Fazer login
    async fazerLogin() {
        const email = document.getElementById('login-email')?.value.trim();
        const senha = document.getElementById('login-senha')?.value;
        
        if (!email || !senha) {
            this.mostrarErro('Preencha email e senha');
            return;
        }
        
        this.setLoading(true);
        this.limparMensagens();
        
        const result = await AuthService.loginWithEmail(email, senha);
        
        this.setLoading(false);
        
        if (result.success) {
            this.mostrarSucesso('Login realizado com sucesso!');
            setTimeout(() => {
                this.fechar();
                this.onLoginSuccess(result.user);
            }, 1000);
        } else {
            this.mostrarErro(result.error);
        }
    },
    
    // Fazer cadastro
    async fazerCadastro() {
        const nome = document.getElementById('cadastro-nome')?.value.trim();
        const email = document.getElementById('cadastro-email')?.value.trim();
        const senha = document.getElementById('cadastro-senha')?.value;
        const senha2 = document.getElementById('cadastro-senha2')?.value;
        
        if (!nome || !email || !senha) {
            this.mostrarErro('Preencha todos os campos');
            return;
        }
        
        if (senha !== senha2) {
            this.mostrarErro('As senhas não conferem');
            return;
        }
        
        if (senha.length < 6) {
            this.mostrarErro('A senha deve ter pelo menos 6 caracteres');
            return;
        }
        
        this.setLoading(true);
        this.limparMensagens();
        
        const result = await AuthService.registerWithEmail(email, senha, nome);
        
        this.setLoading(false);
        
        if (result.success) {
            this.mostrarSucesso('Conta criada com sucesso! Bem-vindo(a)!');
            setTimeout(() => {
                this.fechar();
                this.onLoginSuccess(result.user);
            }, 1500);
        } else {
            this.mostrarErro(result.error);
        }
    },
    
    // Login com Google
    async loginGoogle() {
        this.limparMensagens();
        
        const result = await AuthService.loginWithGoogle();
        
        if (result.success) {
            this.mostrarSucesso('Login realizado com sucesso!');
            setTimeout(() => {
                this.fechar();
                this.onLoginSuccess(result.user);
            }, 1000);
        } else {
            this.mostrarErro(result.error);
        }
    },
    
    // Esqueceu a senha
    async esqueceuSenha() {
        const email = document.getElementById('login-email')?.value.trim();
        
        if (!email) {
            this.mostrarErro('Digite seu email para recuperar a senha');
            return;
        }
        
        this.limparMensagens();
        
        const result = await AuthService.resetPassword(email);
        
        if (result.success) {
            this.mostrarSucesso('Email de recuperação enviado! Verifique sua caixa de entrada.');
        } else {
            this.mostrarErro(result.error);
        }
    },
    
    // Entrar sem conta (modo local)
    entrarSemConta() {
        localStorage.setItem('mariaAuthMode', 'local');
        this.fechar();
        
        // Ir para onboarding se for novo usuário
        const perfil = localStorage.getItem('mariaPerfil');
        if (!perfil) {
            // Mostrar onboarding
            document.getElementById('testimonials')?.classList.add('hidden');
            document.getElementById('onboarding')?.classList.remove('hidden');
        } else {
            // Ir direto para chat
            irParaChat();
        }
    },
    
    // Callback de sucesso no login
    onLoginSuccess(user) {
        console.log('✅ Login success:', user.displayName || user.email);
        
        // Carregar dados da nuvem
        UserDataService.syncCloudToLocal();
        
        // Verificar se tem perfil completo
        UserDataService.getUserData().then(userData => {
            if (userData?.perfil?.nome && userData?.perfil?.genero) {
                // Tem perfil completo - ir para chat
                irParaChat();
            } else {
                // Precisa completar onboarding
                document.getElementById('testimonials')?.classList.add('hidden');
                document.getElementById('onboarding')?.classList.remove('hidden');
            }
        });
    }
};

// Função auxiliar para ir para o chat
function irParaChat() {
    document.getElementById('testimonials')?.classList.add('hidden');
    document.getElementById('onboarding')?.classList.add('hidden');
    document.getElementById('chat')?.classList.remove('hidden');
    
    // Carregar nome do perfil
    const perfil = localStorage.getItem('mariaPerfil');
    if (perfil) {
        const { nome } = JSON.parse(perfil);
        document.getElementById('header-nome').textContent = `Conversando com ${nome}`;
    }
}

// Expor globalmente
window.TelaAuth = TelaAuth;

console.log('🔐 Tela de Auth carregada!');
