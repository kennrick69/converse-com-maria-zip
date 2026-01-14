// ========================================
// 🕯️ SANTUÁRIO DE VELAS VIRTUAIS
// Uma experiência de oração imersiva
// ========================================

const SantuarioVelas = {
    // Tipos de velas disponíveis
    tiposVelas: {
        simples: {
            nome: "Vela Simples",
            descricao: "Uma luz de esperança",
            cor: "#FFF8E7",
            corChama: "#FF6B35",
            altura: 80,
            duracao: "24 horas",
            preco: "Grátis",
            premium: false,
            brilho: 1
        },
        devocao: {
            nome: "Vela de Devoção",
            descricao: "Amor ardente a Nossa Senhora",
            cor: "#E8F4FD",
            corChama: "#4A9FD4",
            altura: 100,
            duracao: "3 dias",
            preco: "Premium",
            premium: true,
            brilho: 1.3
        },
        gratidao: {
            nome: "Vela de Gratidão",
            descricao: "Agradecimento pelas graças recebidas",
            cor: "#FDF2E9",
            corChama: "#F4A460",
            altura: 100,
            duracao: "3 dias",
            preco: "Premium",
            premium: true,
            brilho: 1.3
        },
        rosa: {
            nome: "Rosa Mística",
            descricao: "Em honra à Mãe de Deus",
            cor: "#FFE4E9",
            corChama: "#FF69B4",
            altura: 120,
            duracao: "7 dias",
            preco: "Premium",
            premium: true,
            brilho: 1.5
        },
        dourada: {
            nome: "Vela Dourada",
            descricao: "Consagração total a Maria",
            cor: "#FFF9E6",
            corChama: "#FFD700",
            altura: 140,
            duracao: "15 dias",
            preco: "Premium",
            premium: true,
            brilho: 2
        },
        aparecida: {
            nome: "N.S. Aparecida",
            descricao: "Padroeira do Brasil",
            cor: "#E8EAF6",
            corChama: "#3F51B5",
            altura: 130,
            duracao: "12 dias",
            preco: "Premium",
            premium: true,
            brilho: 1.8,
            especial: true
        },
        fatima: {
            nome: "N.S. de Fátima",
            descricao: "Pelos segredos de Fátima",
            cor: "#FFFDE7",
            corChama: "#FFFFFF",
            altura: 130,
            duracao: "13 dias",
            preco: "Premium",
            premium: true,
            brilho: 2,
            especial: true
        }
    },

    // Velas acesas pelo usuário
    velasAcesas: [],

    // Inicializar
    init() {
        this.carregarVelas();
    },

    // Carregar velas salvas
    carregarVelas() {
        const salvas = localStorage.getItem('mariaVelas');
        if (salvas) {
            this.velasAcesas = JSON.parse(salvas);
            // Remover velas expiradas
            const agora = Date.now();
            this.velasAcesas = this.velasAcesas.filter(v => v.expira > agora);
            this.salvarVelas();
        }
    },

    // Salvar velas
    salvarVelas() {
        localStorage.setItem('mariaVelas', JSON.stringify(this.velasAcesas));
    },

    // Abrir santuário
    abrir() {
        this.carregarVelas();
        
        const modal = document.createElement('div');
        modal.id = 'santuario-velas';
        modal.className = 'fixed inset-0 z-50 overflow-hidden';
        
        modal.innerHTML = `
            <!-- Background do santuário -->
            <div class="absolute inset-0 santuario-bg"></div>
            
            <!-- Partículas flutuantes -->
            <div class="particles-container" id="particles"></div>
            
            <!-- Conteúdo -->
            <div class="relative h-full flex flex-col">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
                    <button onclick="SantuarioVelas.fechar()" class="p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-all">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div class="text-center">
                        <h1 class="text-white font-bold text-lg flex items-center gap-2">
                            <span class="text-2xl">🕯️</span> Santuário de Velas
                        </h1>
                        <p class="text-yellow-300/80 text-xs">Ilumine suas intenções</p>
                    </div>
                    <div class="w-10"></div>
                </div>
                
                <!-- Altar com velas acesas -->
                <div class="flex-1 overflow-y-auto px-4 pb-4">
                    <!-- Imagem de Nossa Senhora -->
                    <div class="relative flex justify-center mb-6">
                        <div class="relative">
                            <div class="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-200/30 to-yellow-500/20 flex items-center justify-center backdrop-blur-sm border border-yellow-400/30 shadow-2xl maria-glow">
                                <span class="text-7xl">👑</span>
                            </div>
                            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-3 py-1 rounded-full">
                                <p class="text-yellow-300 text-xs font-semibold">Nossa Senhora</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Velas acesas -->
                    ${this.renderizarVelasAcesas()}
                    
                    <!-- Botão acender nova vela -->
                    <button onclick="SantuarioVelas.abrirEscolhaVela()" class="w-full py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-black font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mb-6 acender-btn">
                        <span class="text-2xl">🕯️</span>
                        <span>Acender Nova Vela</span>
                        <span class="text-2xl">✨</span>
                    </button>
                    
                    <!-- Intenções da comunidade -->
                    <div class="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
                        <h3 class="text-white font-bold mb-3 flex items-center gap-2">
                            <span>🙏</span> Velas da Comunidade
                        </h3>
                        <p class="text-white/60 text-sm text-center py-4">
                            ${this.velasAcesas.length > 0 ? `${this.velasAcesas.length} ${this.velasAcesas.length === 1 ? 'vela acesa' : 'velas acesas'} neste santuário` : 'Seja o primeiro a acender uma vela hoje'}
                        </p>
                    </div>
                </div>
            </div>
            
            <style>
                .santuario-bg {
                    background: linear-gradient(180deg, #0a0612 0%, #1a0a1e 30%, #2d1b1b 70%, #1a0f0a 100%);
                }
                
                .maria-glow {
                    animation: maria-pulse 4s ease-in-out infinite;
                    box-shadow: 0 0 60px rgba(255, 215, 0, 0.3), 0 0 100px rgba(255, 215, 0, 0.1);
                }
                
                @keyframes maria-pulse {
                    0%, 100% { box-shadow: 0 0 60px rgba(255, 215, 0, 0.3), 0 0 100px rgba(255, 215, 0, 0.1); }
                    50% { box-shadow: 0 0 80px rgba(255, 215, 0, 0.5), 0 0 120px rgba(255, 215, 0, 0.2); }
                }
                
                .acender-btn {
                    background-size: 200% 100%;
                    animation: shimmer 3s linear infinite;
                }
                
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                
                .particles-container {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    pointer-events: none;
                }
                
                .particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: radial-gradient(circle, rgba(255,215,0,0.8) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: float-up 8s ease-in infinite;
                }
                
                @keyframes float-up {
                    0% { transform: translateY(100vh) scale(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100px) scale(1); opacity: 0; }
                }
                
                /* Vela CSS */
                .vela-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .vela-corpo {
                    position: relative;
                    border-radius: 8px 8px 12px 12px;
                    background: linear-gradient(180deg, var(--cor-vela) 0%, var(--cor-vela-dark) 100%);
                    box-shadow: inset -3px 0 10px rgba(0,0,0,0.1), inset 3px 0 10px rgba(255,255,255,0.2);
                }
                
                .vela-pavio {
                    position: absolute;
                    top: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 2px;
                    height: 10px;
                    background: #333;
                    border-radius: 1px;
                }
                
                .chama-container {
                    position: absolute;
                    top: -45px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 30px;
                    height: 50px;
                }
                
                .chama {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 14px;
                    height: 35px;
                    background: linear-gradient(180deg, transparent 0%, var(--cor-chama) 20%, #FFF6E0 60%, #FFFFFF 100%);
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    animation: chama-dance 0.5s ease-in-out infinite alternate;
                    filter: blur(1px);
                }
                
                .chama-inner {
                    position: absolute;
                    bottom: 2px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 6px;
                    height: 20px;
                    background: linear-gradient(180deg, transparent 0%, #FFF 50%, #FFFEF0 100%);
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    animation: chama-inner-dance 0.3s ease-in-out infinite alternate;
                }
                
                .chama-glow {
                    position: absolute;
                    bottom: -5px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 40px;
                    height: 50px;
                    background: radial-gradient(ellipse at center bottom, var(--cor-chama) 0%, transparent 70%);
                    opacity: 0.6;
                    animation: glow-pulse 2s ease-in-out infinite;
                }
                
                @keyframes chama-dance {
                    0% { transform: translateX(-50%) scaleX(1) rotate(-2deg); height: 35px; }
                    100% { transform: translateX(-50%) scaleX(0.9) rotate(2deg); height: 38px; }
                }
                
                @keyframes chama-inner-dance {
                    0% { transform: translateX(-50%) scaleX(1); }
                    100% { transform: translateX(-50%) scaleX(0.8); }
                }
                
                @keyframes glow-pulse {
                    0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
                    50% { opacity: 0.8; transform: translateX(-50%) scale(1.1); }
                }
                
                .vela-reflexo {
                    position: absolute;
                    bottom: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60px;
                    height: 20px;
                    background: radial-gradient(ellipse at center, var(--cor-chama) 0%, transparent 70%);
                    opacity: 0.4;
                    filter: blur(8px);
                }
            </style>
        `;
        
        document.body.appendChild(modal);
        this.criarParticulas();
    },

    // Criar partículas flutuantes
    criarParticulas() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 4) + 's';
            container.appendChild(particle);
        }
    },

    // Renderizar velas acesas
    renderizarVelasAcesas() {
        if (this.velasAcesas.length === 0) {
            return `
                <div class="text-center py-8 mb-6">
                    <p class="text-white/40 text-sm">Nenhuma vela acesa ainda</p>
                    <p class="text-white/30 text-xs mt-1">Acenda uma vela e ilumine sua intenção</p>
                </div>
            `;
        }
        
        return `
            <div class="grid grid-cols-3 gap-4 mb-6">
                ${this.velasAcesas.map((vela, index) => this.renderizarVelaAcesa(vela, index)).join('')}
            </div>
        `;
    },

    // Renderizar uma vela acesa
    renderizarVelaAcesa(vela, index) {
        const tipo = this.tiposVelas[vela.tipo];
        const tempoRestante = this.calcularTempoRestante(vela.expira);
        
        return `
            <div class="vela-card flex flex-col items-center p-3 bg-white/5 rounded-xl backdrop-blur cursor-pointer hover:bg-white/10 transition-all" onclick="SantuarioVelas.verIntencao(${index})">
                <div class="vela-container mb-2" style="--cor-vela: ${tipo.cor}; --cor-vela-dark: ${this.escurecerCor(tipo.cor)}; --cor-chama: ${tipo.corChama};">
                    <div class="chama-container">
                        <div class="chama-glow"></div>
                        <div class="chama"></div>
                        <div class="chama-inner"></div>
                    </div>
                    <div class="vela-corpo" style="width: 24px; height: ${tipo.altura * 0.5}px;">
                        <div class="vela-pavio"></div>
                    </div>
                    <div class="vela-reflexo"></div>
                </div>
                <p class="text-white/80 text-xs text-center mt-1 line-clamp-1">${vela.intencao.substring(0, 15)}...</p>
                <p class="text-yellow-400/60 text-[10px]">${tempoRestante}</p>
            </div>
        `;
    },

    // Calcular tempo restante
    calcularTempoRestante(expira) {
        const agora = Date.now();
        const diff = expira - agora;
        
        if (diff <= 0) return 'Expirada';
        
        const horas = Math.floor(diff / (1000 * 60 * 60));
        const dias = Math.floor(horas / 24);
        
        if (dias > 0) return `${dias}d restantes`;
        return `${horas}h restantes`;
    },

    // Escurecer cor
    escurecerCor(cor) {
        const hex = cor.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 30);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 30);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 30);
        return `rgb(${r}, ${g}, ${b})`;
    },

    // Abrir escolha de vela
    abrirEscolhaVela() {
        const modal = document.createElement('div');
        modal.id = 'escolha-vela';
        modal.className = 'fixed inset-0 z-[60] flex items-end justify-center';
        modal.style.background = 'rgba(0,0,0,0.8)';
        modal.onclick = (e) => { if (e.target === modal) this.fecharEscolhaVela(); };
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-slide-up">
                <div class="sticky top-0 bg-gradient-to-b from-gray-900 to-transparent p-4 pb-6">
                    <div class="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4"></div>
                    <h2 class="text-white text-xl font-bold text-center flex items-center justify-center gap-2">
                        <span>✨</span> Escolha sua Vela <span>✨</span>
                    </h2>
                </div>
                
                <div class="px-4 pb-8 grid gap-3">
                    ${Object.entries(this.tiposVelas).map(([key, tipo]) => this.renderizarOpcaoVela(key, tipo)).join('')}
                </div>
            </div>
            
            <style>
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            </style>
        `;
        
        document.body.appendChild(modal);
    },

    // Renderizar opção de vela
    renderizarOpcaoVela(key, tipo) {
        const isEspecial = tipo.especial;
        
        return `
            <button onclick="SantuarioVelas.selecionarVela('${key}')" class="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02] ${isEspecial ? 'bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-500/30' : 'bg-white/5 hover:bg-white/10'}">
                <!-- Preview da vela -->
                <div class="vela-container flex-shrink-0" style="--cor-vela: ${tipo.cor}; --cor-vela-dark: ${this.escurecerCor(tipo.cor)}; --cor-chama: ${tipo.corChama}; transform: scale(0.7);">
                    <div class="chama-container">
                        <div class="chama-glow"></div>
                        <div class="chama"></div>
                        <div class="chama-inner"></div>
                    </div>
                    <div class="vela-corpo" style="width: 20px; height: ${tipo.altura * 0.4}px;">
                        <div class="vela-pavio"></div>
                    </div>
                </div>
                
                <!-- Info -->
                <div class="flex-1 text-left">
                    <div class="flex items-center gap-2">
                        <h3 class="text-white font-bold">${tipo.nome}</h3>
                        ${tipo.premium ? '<span class="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded-full font-bold">PREMIUM</span>' : '<span class="text-[10px] bg-green-500 text-black px-2 py-0.5 rounded-full font-bold">GRÁTIS</span>'}
                    </div>
                    <p class="text-white/60 text-sm">${tipo.descricao}</p>
                    <p class="text-yellow-400/80 text-xs mt-1">🕐 Duração: ${tipo.duracao}</p>
                </div>
                
                <!-- Seta -->
                <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
        `;
    },

    // Selecionar vela
    selecionarVela(tipoKey) {
        this.fecharEscolhaVela();
        this.abrirFormularioIntencao(tipoKey);
    },

    // Abrir formulário de intenção
    abrirFormularioIntencao(tipoKey) {
        const tipo = this.tiposVelas[tipoKey];
        
        const modal = document.createElement('div');
        modal.id = 'form-intencao';
        modal.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4';
        modal.style.background = 'rgba(0,0,0,0.9)';
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 rounded-3xl w-full max-w-md p-6 animate-scale-in">
                <!-- Preview da vela grande -->
                <div class="flex justify-center mb-6">
                    <div class="vela-container" style="--cor-vela: ${tipo.cor}; --cor-vela-dark: ${this.escurecerCor(tipo.cor)}; --cor-chama: ${tipo.corChama}; transform: scale(1.2);">
                        <div class="chama-container">
                            <div class="chama-glow"></div>
                            <div class="chama"></div>
                            <div class="chama-inner"></div>
                        </div>
                        <div class="vela-corpo" style="width: 30px; height: ${tipo.altura}px;">
                            <div class="vela-pavio"></div>
                        </div>
                        <div class="vela-reflexo"></div>
                    </div>
                </div>
                
                <h2 class="text-white text-xl font-bold text-center mb-1">${tipo.nome}</h2>
                <p class="text-white/60 text-sm text-center mb-6">${tipo.descricao}</p>
                
                <!-- Campo de intenção -->
                <div class="mb-6">
                    <label class="text-white/80 text-sm mb-2 block">Sua intenção:</label>
                    <textarea id="input-intencao" rows="3" placeholder="Pela minha família, pela saúde de..." class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 resize-none"></textarea>
                </div>
                
                <!-- Quem oferece -->
                <div class="mb-6">
                    <label class="text-white/80 text-sm mb-2 block">Oferecida por (opcional):</label>
                    <input type="text" id="input-oferecente" placeholder="Seu nome" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500">
                </div>
                
                <!-- Botões -->
                <div class="flex gap-3">
                    <button onclick="SantuarioVelas.fecharFormulario()" class="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
                        Cancelar
                    </button>
                    <button onclick="SantuarioVelas.acenderVela('${tipoKey}')" class="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-xl font-bold hover:from-yellow-400 hover:to-orange-400 transition-all flex items-center justify-center gap-2">
                        <span>🕯️</span> Acender
                    </button>
                </div>
            </div>
            
            <style>
                @keyframes scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in { animation: scale-in 0.3s ease-out; }
            </style>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('input-intencao').focus();
    },

    // Acender vela
    acenderVela(tipoKey) {
        const intencao = document.getElementById('input-intencao').value.trim();
        const oferecente = document.getElementById('input-oferecente').value.trim();
        
        // Validar intenção com filtro de palavrões
        if (window.FiltroPalavras) {
            const validacaoIntencao = FiltroPalavras.validar(intencao);
            if (!validacaoIntencao.valido) {
                alert(validacaoIntencao.mensagem);
                return;
            }
            
            // Validar nome também
            const validacaoNome = FiltroPalavras.validarNome(oferecente);
            if (!validacaoNome.valido) {
                alert(validacaoNome.mensagem);
                return;
            }
        }
        
        if (!intencao) {
            document.getElementById('input-intencao').classList.add('border-red-500');
            return;
        }
        
        const tipo = this.tiposVelas[tipoKey];
        const duracaoMs = this.parseDuracao(tipo.duracao);
        
        const novaVela = {
            tipo: tipoKey,
            intencao,
            oferecente: oferecente || 'Anônimo',
            acesa: Date.now(),
            expira: Date.now() + duracaoMs
        };
        
        this.velasAcesas.push(novaVela);
        this.salvarVelas();
        
        // Registrar vela nas estatísticas
        if (window.EstatisticasOracao) {
            EstatisticasOracao.registrarVela(tipoKey);
        }
        
        this.fecharFormulario();
        this.mostrarAnimacaoAcender(tipo);
    },

    // Parse duração
    parseDuracao(duracao) {
        const match = duracao.match(/(\d+)\s*(hora|dia|dias|horas)/i);
        if (!match) return 24 * 60 * 60 * 1000; // default 24h
        
        const valor = parseInt(match[1]);
        const unidade = match[2].toLowerCase();
        
        if (unidade.includes('hora')) return valor * 60 * 60 * 1000;
        return valor * 24 * 60 * 60 * 1000;
    },

    // Mostrar animação de acender
    mostrarAnimacaoAcender(tipo) {
        const modal = document.createElement('div');
        modal.id = 'animacao-acender';
        modal.className = 'fixed inset-0 z-[70] flex items-center justify-center';
        modal.style.background = 'rgba(0,0,0,0.95)';
        
        modal.innerHTML = `
            <div class="text-center animate-acender">
                <!-- Vela grande animada -->
                <div class="vela-container mb-8 transform scale-150" style="--cor-vela: ${tipo.cor}; --cor-vela-dark: ${this.escurecerCor(tipo.cor)}; --cor-chama: ${tipo.corChama};">
                    <div class="chama-container chama-acendendo">
                        <div class="chama-glow"></div>
                        <div class="chama"></div>
                        <div class="chama-inner"></div>
                    </div>
                    <div class="vela-corpo" style="width: 40px; height: ${tipo.altura * 1.2}px;">
                        <div class="vela-pavio"></div>
                    </div>
                    <div class="vela-reflexo"></div>
                </div>
                
                <h2 class="text-white text-2xl font-bold mb-2">Vela Acesa! 🙏</h2>
                <p class="text-white/70">Sua intenção foi elevada a Nossa Senhora</p>
                
                <!-- Partículas de luz -->
                <div class="luz-particles"></div>
            </div>
            
            <style>
                @keyframes acender-vela {
                    0% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1.1); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-acender { animation: acender-vela 1s ease-out; }
                
                .chama-acendendo .chama, .chama-acendendo .chama-inner, .chama-acendendo .chama-glow {
                    animation: chama-crescer 1s ease-out forwards, chama-dance 0.5s ease-in-out infinite alternate 1s;
                }
                
                @keyframes chama-crescer {
                    0% { transform: translateX(-50%) scale(0); opacity: 0; }
                    100% { transform: translateX(-50%) scale(1); opacity: 1; }
                }
                
                .luz-particles {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, ${tipo.corChama}22 0%, transparent 50%);
                    animation: pulse-luz 2s ease-in-out infinite;
                }
                
                @keyframes pulse-luz {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
            </style>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.remove();
            this.fechar();
            this.abrir(); // Reabrir para mostrar vela nova
            if (window.showToast) showToast('🕯️ Vela acesa! Maria recebeu sua intenção.');
        }, 2500);
    },

    // Ver intenção de uma vela
    verIntencao(index) {
        const vela = this.velasAcesas[index];
        const tipo = this.tiposVelas[vela.tipo];
        
        const modal = document.createElement('div');
        modal.id = 'ver-intencao';
        modal.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4';
        modal.style.background = 'rgba(0,0,0,0.9)';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 rounded-3xl w-full max-w-sm p-6">
                <div class="flex justify-center mb-4">
                    <div class="vela-container" style="--cor-vela: ${tipo.cor}; --cor-vela-dark: ${this.escurecerCor(tipo.cor)}; --cor-chama: ${tipo.corChama};">
                        <div class="chama-container">
                            <div class="chama-glow"></div>
                            <div class="chama"></div>
                            <div class="chama-inner"></div>
                        </div>
                        <div class="vela-corpo" style="width: 26px; height: ${tipo.altura * 0.6}px;">
                            <div class="vela-pavio"></div>
                        </div>
                        <div class="vela-reflexo"></div>
                    </div>
                </div>
                
                <h3 class="text-white font-bold text-center mb-1">${tipo.nome}</h3>
                <p class="text-yellow-400/80 text-xs text-center mb-4">${this.calcularTempoRestante(vela.expira)}</p>
                
                <div class="bg-white/10 rounded-xl p-4 mb-4">
                    <p class="text-white/60 text-xs mb-1">Intenção:</p>
                    <p class="text-white">"${vela.intencao}"</p>
                </div>
                
                <p class="text-white/40 text-xs text-center mb-4">Oferecida por: ${vela.oferecente}</p>
                
                <button onclick="this.parentElement.parentElement.remove()" class="w-full py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
                    Fechar
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    // Fechar modais
    fecharEscolhaVela() {
        const modal = document.getElementById('escolha-vela');
        if (modal) modal.remove();
    },

    fecharFormulario() {
        const modal = document.getElementById('form-intencao');
        if (modal) modal.remove();
    },

    fechar() {
        const modal = document.getElementById('santuario-velas');
        if (modal) modal.remove();
    }
};

window.SantuarioVelas = SantuarioVelas;
