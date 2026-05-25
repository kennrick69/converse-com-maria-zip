// ========================================
// 🔐 SISTEMA DE AUTENTICAÇÃO SIMPLES
// Pensado para público idoso
// Sem senha - apenas código por email/SMS
// ========================================

const SistemaAuth = {
    // Dados do usuário logado
    usuario: null,
    
    // Verificar se está logado
    estaLogado() {
        const salvo = localStorage.getItem('mariaUsuario');
        if (salvo) {
            this.usuario = JSON.parse(salvo);
            return true;
        }
        return false;
    },

    // Carregar usuário
    carregarUsuario() {
        const salvo = localStorage.getItem('mariaUsuario');
        if (salvo) {
            this.usuario = JSON.parse(salvo);
            return this.usuario;
        }
        return null;
    },

    // Salvar usuário
    salvarUsuario(dados) {
        this.usuario = dados;
        localStorage.setItem('mariaUsuario', JSON.stringify(dados));
    },

    // Fazer logout
    logout() {
        this.usuario = null;
        localStorage.removeItem('mariaUsuario');
        location.reload();
    },

    // ========================================
    // TELA DE CADASTRO/LOGIN
    // ========================================
    
    mostrarTelaAuth(onSuccess) {
        this.onSuccess = onSuccess;
        
        const modal = document.createElement('div');
        modal.id = 'tela-auth';
        modal.className = 'fixed inset-0 z-[100] overflow-y-auto';
        modal.style.background = 'linear-gradient(180deg, #D4A574 0%, #C49A6C 50%, #B8956A 100%)';
        
        modal.innerHTML = `
            <div class="min-h-screen flex flex-col items-center justify-center p-6">
                <!-- Logo -->
                <div class="text-center mb-8">
                    <div class="text-6xl mb-4">👑</div>
                    <h1 class="text-3xl font-serif text-amber-900 font-bold">Converse com Maria</h1>
                    <p class="text-amber-800 mt-2">Mãe de Jesus Cristo • Rainha dos Céus</p>
                </div>
                
                <!-- Card principal -->
                <div class="bg-white/90 backdrop-blur rounded-3xl p-6 w-full max-w-md shadow-2xl">
                    
                    <!-- Etapa 1: Escolher método -->
                    <div id="auth-etapa-1">
                        <h2 class="text-xl font-bold text-amber-900 text-center mb-2">Bem-vindo(a)! 🙏</h2>
                        <p class="text-amber-700 text-center text-sm mb-6">Como você prefere entrar?</p>
                        
                        <div class="space-y-3">
                            <button onclick="SistemaAuth.escolherMetodo('email')" class="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 text-lg">
                                <span class="text-2xl">📧</span>
                                <span>Entrar com E-mail</span>
                            </button>
                            
                            <button onclick="SistemaAuth.escolherMetodo('telefone')" class="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 text-lg">
                                <span class="text-2xl">📱</span>
                                <span>Entrar com Telefone</span>
                            </button>
                        </div>
                        
                        <div class="mt-6 p-4 bg-amber-50 rounded-xl">
                            <p class="text-amber-800 text-sm text-center">
                                <span class="font-bold">🔒 Sem senha!</span><br>
                                Enviaremos um código de 4 números para você confirmar.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Etapa 2: Informar email/telefone -->
                    <div id="auth-etapa-2" class="hidden">
                        <button onclick="SistemaAuth.voltarEtapa(1)" class="mb-4 text-amber-700 flex items-center gap-1 hover:text-amber-900">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                            <span>Voltar</span>
                        </button>
                        
                        <div id="auth-form-email" class="hidden">
                            <h2 class="text-xl font-bold text-amber-900 text-center mb-2">📧 Seu E-mail</h2>
                            <p class="text-amber-700 text-center text-sm mb-6">Digite seu e-mail para receber o código</p>
                            
                            <input type="email" id="input-email" placeholder="seuemail@exemplo.com" 
                                   class="w-full px-4 py-4 text-lg border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:outline-none text-center"
                                   autocomplete="email">
                            
                            <button onclick="SistemaAuth.enviarCodigo('email')" id="btn-enviar-email" class="w-full mt-4 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl transition-all text-lg">
                                Enviar Código 📨
                            </button>
                        </div>
                        
                        <div id="auth-form-telefone" class="hidden">
                            <h2 class="text-xl font-bold text-amber-900 text-center mb-2">📱 Seu Telefone</h2>
                            <p class="text-amber-700 text-center text-sm mb-6">Digite seu número com DDD</p>
                            
                            <div class="flex gap-2">
                                <div class="flex items-center gap-1 px-3 py-4 bg-amber-100 rounded-xl text-amber-800 font-bold">
                                    <span>🇧🇷</span>
                                    <span>+55</span>
                                </div>
                                <input type="tel" id="input-telefone" placeholder="(11) 99999-9999" 
                                       class="flex-1 px-4 py-4 text-lg border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:outline-none text-center"
                                       autocomplete="tel"
                                       oninput="SistemaAuth.formatarTelefone(this)">
                            </div>
                            
                            <button onclick="SistemaAuth.enviarCodigo('telefone')" id="btn-enviar-tel" class="w-full mt-4 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl transition-all text-lg">
                                Enviar Código 📨
                            </button>
                        </div>
                    </div>
                    
                    <!-- Etapa 3: Confirmar código -->
                    <div id="auth-etapa-3" class="hidden">
                        <button onclick="SistemaAuth.voltarEtapa(2)" class="mb-4 text-amber-700 flex items-center gap-1 hover:text-amber-900">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                            <span>Voltar</span>
                        </button>
                        
                        <div class="text-center mb-6">
                            <div class="text-5xl mb-3">🔢</div>
                            <h2 class="text-xl font-bold text-amber-900">Digite o Código</h2>
                            <p class="text-amber-700 text-sm mt-1">São apenas 4 números</p>
                            <p class="text-amber-600 text-sm mt-2" id="auth-destino-codigo">Enviamos para seu e-mail</p>
                        </div>
                        
                        <!-- Campos do código -->
                        <div class="flex justify-center gap-3 mb-6">
                            <input type="text" maxlength="1" class="codigo-input w-14 h-16 text-3xl font-bold text-center border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:outline-none" oninput="SistemaAuth.avancarCampo(this, 0)">
                            <input type="text" maxlength="1" class="codigo-input w-14 h-16 text-3xl font-bold text-center border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:outline-none" oninput="SistemaAuth.avancarCampo(this, 1)">
                            <input type="text" maxlength="1" class="codigo-input w-14 h-16 text-3xl font-bold text-center border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:outline-none" oninput="SistemaAuth.avancarCampo(this, 2)">
                            <input type="text" maxlength="1" class="codigo-input w-14 h-16 text-3xl font-bold text-center border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:outline-none" oninput="SistemaAuth.avancarCampo(this, 3)">
                        </div>
                        
                        <button onclick="SistemaAuth.verificarCodigo()" id="btn-verificar" class="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold rounded-xl transition-all text-lg">
                            Verificar ✓
                        </button>
                        
                        <div class="mt-4 text-center">
                            <p class="text-amber-600 text-sm">Não recebeu?</p>
                            <button onclick="SistemaAuth.reenviarCodigo()" id="btn-reenviar" class="text-amber-800 font-semibold underline disabled:opacity-50 disabled:no-underline">
                                Enviar novamente
                            </button>
                            <p class="text-amber-500 text-xs mt-1" id="timer-reenviar"></p>
                        </div>
                    </div>
                    
                    <!-- Etapa 4: Completar perfil (novo usuário) -->
                    <div id="auth-etapa-4" class="hidden">
                        <div class="text-center mb-6">
                            <div class="text-5xl mb-3">🎉</div>
                            <h2 class="text-xl font-bold text-amber-900">Quase lá!</h2>
                            <p class="text-amber-700 text-sm">Conte um pouquinho sobre você</p>
                        </div>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="block text-amber-800 font-semibold mb-2">Como posso te chamar?</label>
                                <input type="text" id="input-nome" placeholder="Seu nome ou apelido" 
                                       class="w-full px-4 py-3 text-lg border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:outline-none">
                            </div>
                            
                            <div>
                                <label class="block text-amber-800 font-semibold mb-2">Você é...</label>
                                <div class="grid grid-cols-2 gap-3">
                                    <button type="button" onclick="SistemaAuth.selecionarGenero('feminino')" id="btn-genero-f" class="py-3 border-2 border-amber-300 rounded-xl text-amber-800 hover:bg-amber-100 transition-all flex items-center justify-center gap-2">
                                        <span class="text-xl">👩</span>
                                        <span>Mulher</span>
                                    </button>
                                    <button type="button" onclick="SistemaAuth.selecionarGenero('masculino')" id="btn-genero-m" class="py-3 border-2 border-amber-300 rounded-xl text-amber-800 hover:bg-amber-100 transition-all flex items-center justify-center gap-2">
                                        <span class="text-xl">👨</span>
                                        <span>Homem</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-amber-800 font-semibold mb-2">Estado civil</label>
                                <select id="input-estado-civil" class="w-full px-4 py-3 text-lg border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:outline-none bg-white">
                                    <option value="">Selecione...</option>
                                    <option value="solteiro">Solteiro(a)</option>
                                    <option value="casado">Casado(a)</option>
                                    <option value="viuvo">Viúvo(a)</option>
                                    <option value="divorciado">Divorciado(a)</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-amber-800 font-semibold mb-2">Tem filhos?</label>
                                <div class="grid grid-cols-2 gap-3">
                                    <button type="button" onclick="SistemaAuth.selecionarFilhos('sim')" id="btn-filhos-s" class="py-3 border-2 border-amber-300 rounded-xl text-amber-800 hover:bg-amber-100 transition-all">
                                        Sim 👨‍👩‍👧
                                    </button>
                                    <button type="button" onclick="SistemaAuth.selecionarFilhos('nao')" id="btn-filhos-n" class="py-3 border-2 border-amber-300 rounded-xl text-amber-800 hover:bg-amber-100 transition-all">
                                        Não
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <button onclick="SistemaAuth.completarCadastro()" class="w-full mt-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl transition-all text-lg">
                            Começar a Conversar com Maria 🙏
                        </button>
                    </div>
                    
                </div>
                
                <!-- Nota de privacidade -->
                <p class="text-amber-800/60 text-xs text-center mt-6 max-w-sm">
                    🔒 Suas informações são protegidas e usadas apenas para personalizar sua experiência espiritual.
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    // Estado do auth
    metodoAtual: null,
    contatoAtual: null,
    codigoGerado: null,
    generoSelecionado: null,
    filhosSelecionado: null,
    timerReenviar: null,

    // Escolher método (email ou telefone)
    escolherMetodo(metodo) {
        this.metodoAtual = metodo;
        
        document.getElementById('auth-etapa-1').classList.add('hidden');
        document.getElementById('auth-etapa-2').classList.remove('hidden');
        
        if (metodo === 'email') {
            document.getElementById('auth-form-email').classList.remove('hidden');
            document.getElementById('auth-form-telefone').classList.add('hidden');
            setTimeout(() => document.getElementById('input-email').focus(), 100);
        } else {
            document.getElementById('auth-form-email').classList.add('hidden');
            document.getElementById('auth-form-telefone').classList.remove('hidden');
            setTimeout(() => document.getElementById('input-telefone').focus(), 100);
        }
    },

    // Formatar telefone
    formatarTelefone(input) {
        let valor = input.value.replace(/\D/g, '');
        
        if (valor.length > 11) valor = valor.substring(0, 11);
        
        if (valor.length > 7) {
            valor = `(${valor.substring(0,2)}) ${valor.substring(2,7)}-${valor.substring(7)}`;
        } else if (valor.length > 2) {
            valor = `(${valor.substring(0,2)}) ${valor.substring(2)}`;
        } else if (valor.length > 0) {
            valor = `(${valor}`;
        }
        
        input.value = valor;
    },

    // Voltar para etapa anterior
    voltarEtapa(etapa) {
        document.querySelectorAll('[id^="auth-etapa-"]').forEach(el => el.classList.add('hidden'));
        document.getElementById(`auth-etapa-${etapa}`).classList.remove('hidden');
    },

    // Enviar código
    enviarCodigo(metodo) {
        let contato;
        
        if (metodo === 'email') {
            contato = document.getElementById('input-email').value.trim();
            if (!contato || !contato.includes('@')) {
                this.mostrarErro('Por favor, digite um e-mail válido');
                return;
            }
        } else {
            contato = document.getElementById('input-telefone').value.replace(/\D/g, '');
            if (contato.length < 10) {
                this.mostrarErro('Por favor, digite um telefone válido com DDD');
                return;
            }
        }
        
        this.contatoAtual = contato;
        
        // Gerar código de 4 dígitos
        this.codigoGerado = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Em produção, aqui chamaria a API para enviar o código
        // Por enquanto, vamos simular e mostrar o código no console
        console.log(`📧 Código de verificação: ${this.codigoGerado}`);
        
        // Mostrar etapa 3
        document.getElementById('auth-etapa-2').classList.add('hidden');
        document.getElementById('auth-etapa-3').classList.remove('hidden');
        
        // Atualizar texto
        const destino = metodo === 'email' ? 
            `Enviamos para ${this.mascarar(contato, 'email')}` :
            `Enviamos para ${this.mascarar(contato, 'telefone')}`;
        document.getElementById('auth-destino-codigo').textContent = destino;
        
        // Focar primeiro campo
        setTimeout(() => {
            document.querySelectorAll('.codigo-input')[0].focus();
        }, 100);
        
        // Iniciar timer de reenvio
        this.iniciarTimerReenvio();
        
        // MODO TESTE: Mostrar código na tela (REMOVER EM PRODUÇÃO!)
        this.mostrarCodigoTeste();
    },

    // Mascarar email/telefone
    mascarar(valor, tipo) {
        if (tipo === 'email') {
            const [nome, dominio] = valor.split('@');
            return `${nome.substring(0,2)}***@${dominio}`;
        } else {
            return `(**) *****-${valor.substring(valor.length - 4)}`;
        }
    },

    // Avançar para próximo campo do código
    avancarCampo(input, index) {
        // Aceitar apenas números
        input.value = input.value.replace(/\D/g, '');
        
        const campos = document.querySelectorAll('.codigo-input');
        
        if (input.value && index < 3) {
            campos[index + 1].focus();
        }
        
        // Verificar se todos foram preenchidos (4 dígitos)
        const codigo = Array.from(campos).map(c => c.value).join('');
        if (codigo.length === 4) {
            this.verificarCodigo();
        }
    },

    // Verificar código
    verificarCodigo() {
        const campos = document.querySelectorAll('.codigo-input');
        const codigo = Array.from(campos).map(c => c.value).join('');
        
        if (codigo.length !== 4) {
            this.mostrarErro('Por favor, digite os 4 números');
            return;
        }
        
        if (codigo === this.codigoGerado) {
            // Código correto!
            this.verificarUsuarioExistente();
        } else {
            this.mostrarErro('Código incorreto. Tente novamente.');
            campos.forEach(c => {
                c.value = '';
                c.classList.add('border-red-400');
            });
            campos[0].focus();
            
            setTimeout(() => {
                campos.forEach(c => c.classList.remove('border-red-400'));
            }, 2000);
        }
    },

    // Verificar se usuário já existe
    verificarUsuarioExistente() {
        // Em produção, verificaria no banco de dados
        // Por enquanto, vamos verificar no localStorage
        const usuarios = JSON.parse(localStorage.getItem('mariaUsuarios') || '{}');
        const usuarioExistente = usuarios[this.contatoAtual];
        
        if (usuarioExistente) {
            // Usuário já existe - fazer login direto
            this.salvarUsuario(usuarioExistente);
            this.finalizarAuth();
        } else {
            // Novo usuário - pedir para completar perfil
            document.getElementById('auth-etapa-3').classList.add('hidden');
            document.getElementById('auth-etapa-4').classList.remove('hidden');
            setTimeout(() => document.getElementById('input-nome').focus(), 100);
        }
    },

    // Selecionar gênero
    selecionarGenero(genero) {
        this.generoSelecionado = genero;
        
        document.getElementById('btn-genero-f').classList.remove('bg-amber-500', 'text-white', 'border-amber-500');
        document.getElementById('btn-genero-m').classList.remove('bg-amber-500', 'text-white', 'border-amber-500');
        
        const btnId = genero === 'feminino' ? 'btn-genero-f' : 'btn-genero-m';
        document.getElementById(btnId).classList.add('bg-amber-500', 'text-white', 'border-amber-500');
    },

    // Selecionar filhos
    selecionarFilhos(temFilhos) {
        this.filhosSelecionado = temFilhos;
        
        document.getElementById('btn-filhos-s').classList.remove('bg-amber-500', 'text-white', 'border-amber-500');
        document.getElementById('btn-filhos-n').classList.remove('bg-amber-500', 'text-white', 'border-amber-500');
        
        const btnId = temFilhos === 'sim' ? 'btn-filhos-s' : 'btn-filhos-n';
        document.getElementById(btnId).classList.add('bg-amber-500', 'text-white', 'border-amber-500');
    },

    // Completar cadastro
    completarCadastro() {
        const nome = document.getElementById('input-nome').value.trim();
        const estadoCivil = document.getElementById('input-estado-civil').value;
        
        if (!nome) {
            this.mostrarErro('Por favor, digite seu nome');
            return;
        }
        
        if (!this.generoSelecionado) {
            this.mostrarErro('Por favor, selecione se é homem ou mulher');
            return;
        }
        
        // Criar objeto do usuário
        const novoUsuario = {
            id: Date.now().toString(),
            contato: this.contatoAtual,
            metodo: this.metodoAtual,
            nome: nome,
            genero: this.generoSelecionado,
            estadoCivil: estadoCivil || '',
            temFilhos: this.filhosSelecionado === 'sim',
            criadoEm: Date.now(),
            ultimoAcesso: Date.now()
        };
        
        // Salvar no "banco de dados" local
        const usuarios = JSON.parse(localStorage.getItem('mariaUsuarios') || '{}');
        usuarios[this.contatoAtual] = novoUsuario;
        localStorage.setItem('mariaUsuarios', JSON.stringify(usuarios));
        
        // Salvar sessão atual
        this.salvarUsuario(novoUsuario);
        
        // Finalizar
        this.finalizarAuth();
    },

    // Finalizar autenticação
    finalizarAuth() {
        // Atualizar último acesso
        this.usuario.ultimoAcesso = Date.now();
        this.salvarUsuario(this.usuario);
        
        // Fechar modal
        document.getElementById('tela-auth')?.remove();
        
        // Callback de sucesso
        if (this.onSuccess) {
            this.onSuccess(this.usuario);
        }
    },

    // Timer para reenviar código
    iniciarTimerReenvio() {
        let segundos = 60;
        const btn = document.getElementById('btn-reenviar');
        const timer = document.getElementById('timer-reenviar');
        
        btn.disabled = true;
        
        if (this.timerReenviar) clearInterval(this.timerReenviar);
        
        this.timerReenviar = setInterval(() => {
            segundos--;
            timer.textContent = `Aguarde ${segundos}s`;
            
            if (segundos <= 0) {
                clearInterval(this.timerReenviar);
                btn.disabled = false;
                timer.textContent = '';
            }
        }, 1000);
    },

    // Reenviar código
    reenviarCodigo() {
        // Gerar novo código
        this.codigoGerado = Math.floor(1000 + Math.random() * 9000).toString();
        console.log(`📧 Novo código: ${this.codigoGerado}`);
        
        // Limpar campos
        document.querySelectorAll('.codigo-input').forEach(c => c.value = '');
        document.querySelectorAll('.codigo-input')[0].focus();
        
        // Reiniciar timer
        this.iniciarTimerReenvio();
        
        // MODO TESTE: Mostrar novo código
        this.mostrarCodigoTeste();
    },

    // Mostrar erro
    mostrarErro(mensagem) {
        if (window.showToast) {
            showToast(`❌ ${mensagem}`);
        } else {
            alert(mensagem);
        }
    },

    // MODO TESTE: Mostrar código na tela (REMOVER EM PRODUÇÃO!)
    mostrarCodigoTeste() {
        // Remover aviso anterior se existir
        document.getElementById('aviso-codigo-teste')?.remove();
        
        const aviso = document.createElement('div');
        aviso.id = 'aviso-codigo-teste';
        aviso.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[200] bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl text-center animate-bounce';
        aviso.innerHTML = `
            <p class="text-xs opacity-80 mb-1">⚠️ MODO TESTE - Seu código é:</p>
            <p class="text-4xl font-bold tracking-widest">${this.codigoGerado}</p>
            <p class="text-xs opacity-60 mt-2">(Em produção, chegará por email/SMS)</p>
        `;
        document.body.appendChild(aviso);
        
        // Remover após 30 segundos
        setTimeout(() => aviso.remove(), 30000);
    },

    // ========================================
    // MINI PERFIL (canto da tela)
    // ========================================
    
    criarBotaoPerfil() {
        if (!this.usuario) return;
        if (document.getElementById('btn-perfil-usuario')) return;
        
        const btn = document.createElement('button');
        btn.id = 'btn-perfil-usuario';
        btn.className = 'fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:shadow-xl transition-all';
        btn.onclick = () => this.abrirPerfil();
        
        const inicial = this.usuario.nome.charAt(0).toUpperCase();
        const emoji = this.usuario.genero === 'feminino' ? '👩' : '👨';
        
        btn.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                ${inicial}
            </div>
            <span class="text-amber-900 text-sm font-semibold max-w-[100px] truncate">${this.usuario.nome}</span>
        `;
        
        document.body.appendChild(btn);
    },

    // Abrir perfil
    abrirPerfil() {
        if (!this.usuario) return;
        
        const modal = document.createElement('div');
        modal.id = 'modal-perfil';
        modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-4';
        modal.style.background = 'rgba(0,0,0,0.7)';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        const emoji = this.usuario.genero === 'feminino' ? '👩' : '👨';
        const tratamento = this.usuario.genero === 'feminino' ? 'Filha de Maria' : 'Filho de Maria';
        
        modal.innerHTML = `
            <div class="bg-white rounded-3xl w-full max-w-sm p-6">
                <div class="text-center mb-6">
                    <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl mb-3">
                        ${emoji}
                    </div>
                    <h2 class="text-xl font-bold text-amber-900">${this.usuario.nome}</h2>
                    <p class="text-amber-600 text-sm">${tratamento}</p>
                </div>
                
                <div class="space-y-3 mb-6">
                    <div class="flex justify-between py-2 border-b border-amber-100">
                        <span class="text-amber-700">📧 Contato</span>
                        <span class="text-amber-900 font-semibold">${this.mascarar(this.usuario.contato, this.usuario.metodo)}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-amber-100">
                        <span class="text-amber-700">📅 Membro desde</span>
                        <span class="text-amber-900 font-semibold">${new Date(this.usuario.criadoEm).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>
                
                <div class="space-y-3">
                    <button onclick="document.getElementById('modal-perfil').remove()" class="w-full py-3 bg-amber-100 text-amber-800 font-semibold rounded-xl hover:bg-amber-200 transition-all">
                        Fechar
                    </button>
                    <button onclick="SistemaAuth.confirmarLogout()" class="w-full py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all">
                        Sair da Conta
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    // Confirmar logout
    confirmarLogout() {
        if (confirm('Tem certeza que deseja sair? Você precisará entrar novamente com o código.')) {
            this.logout();
        }
    }
};

window.SistemaAuth = SistemaAuth;
