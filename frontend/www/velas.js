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
        nossa_senhora: {
            nome: "Nossa Senhora",
            descricao: "Em honra à Mãe de Deus",
            cor: "#E8F4FD",
            corChama: "#4A9FD4",
            altura: 100,
            duracao: "3 dias",
            preco: "Premium",
            premium: true,
            brilho: 1.3
        },
        sagrado_coracao: {
            nome: "Sagrado Coração",
            descricao: "Amor ardente de Jesus",
            cor: "#FDF2E9",
            corChama: "#F4A460",
            altura: 100,
            duracao: "3 dias",
            preco: "Premium",
            premium: true,
            brilho: 1.3
        },
        anjo_guarda: {
            nome: "Anjo da Guarda",
            descricao: "Proteção celestial",
            cor: "#FFE4E9",
            corChama: "#FF69B4",
            altura: 120,
            duracao: "7 dias",
            preco: "Premium",
            premium: true,
            brilho: 1.5
        },
        sete_dias: {
            nome: "Vela de 7 Dias",
            descricao: "Uma semana de luz",
            cor: "#FFF9E6",
            corChama: "#FFD700",
            altura: 140,
            duracao: "7 dias",
            preco: "Premium",
            premium: true,
            brilho: 2
        },
        votiva: {
            nome: "Vela Votiva",
            descricao: "Promessa e devoção",
            cor: "#E8EAF6",
            corChama: "#3F51B5",
            altura: 130,
            duracao: "12 dias",
            preco: "Premium",
            premium: true,
            brilho: 1.8,
            especial: true
        },
        pascal: {
            nome: "Vela Pascal",
            descricao: "A luz de Cristo Ressuscitado",
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
    
    // Velas simuladas (sempre aparecem para dar vida ao santuário)
    velasFake: [
        { id: 'fake-1', tipo: 'simples', intencao: 'Pela paz mundial e conversão dos pecadores', oferecente: 'Maria S.', acesa: Date.now() - 2*60*60*1000, expira: Date.now() + 22*60*60*1000, fake: true },
        { id: 'fake-2', tipo: 'nossa_senhora', intencao: 'Pela cura da minha mãe que está doente', oferecente: 'João P.', acesa: Date.now() - 5*60*60*1000, expira: Date.now() + 67*60*60*1000, fake: true },
        { id: 'fake-3', tipo: 'sagrado_coracao', intencao: 'Agradeço pela graça alcançada!', oferecente: 'Ana L.', acesa: Date.now() - 8*60*60*1000, expira: Date.now() + 64*60*60*1000, fake: true },
        { id: 'fake-4', tipo: 'simples', intencao: 'Pelo meu emprego e sustento da família', oferecente: 'Carlos M.', acesa: Date.now() - 12*60*60*1000, expira: Date.now() + 12*60*60*1000, fake: true },
        { id: 'fake-5', tipo: 'anjo_guarda', intencao: 'Em honra à Nossa Senhora das Graças', oferecente: 'Teresa R.', acesa: Date.now() - 24*60*60*1000, expira: Date.now() + 144*60*60*1000, fake: true },
        { id: 'fake-6', tipo: 'votiva', intencao: 'Pela proteção do Brasil e de todas as famílias brasileiras', oferecente: 'Conceição A.', acesa: Date.now() - 4*60*60*1000, expira: Date.now() + 284*60*60*1000, fake: true },
        { id: 'fake-7', tipo: 'pascal', intencao: 'Pela luz de Cristo em nossas vidas', oferecente: 'Lúcia F.', acesa: Date.now() - 6*60*60*1000, expira: Date.now() + 306*60*60*1000, fake: true },
        { id: 'fake-8', tipo: 'nossa_senhora', intencao: 'Pelos meus filhos e netos', oferecente: 'José A.', acesa: Date.now() - 18*60*60*1000, expira: Date.now() + 54*60*60*1000, fake: true },
        { id: 'fake-9', tipo: 'sete_dias', intencao: 'Pela conversão dos meus familiares!', oferecente: 'Benedita M.', acesa: Date.now() - 10*60*60*1000, expira: Date.now() + 278*60*60*1000, fake: true },
        { id: 'fake-10', tipo: 'simples', intencao: 'Pela saúde de toda minha família', oferecente: 'Paula C.', acesa: Date.now() - 6*60*60*1000, expira: Date.now() + 18*60*60*1000, fake: true }
    ],
    
    // Listener Firebase
    unsubscribe: null,

    // Inicializar
    init() {
        this.carregarVelas();
    },

    // Carregar velas salvas (localStorage como fallback)
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
    
    // Carregar velas do Firebase
    async carregarVelasFirebase() {
        if (typeof firebase === 'undefined' || !firebase.firestore) {
            console.log('Firebase não disponível, usando localStorage');
            return;
        }
        
        try {
            const db = firebase.firestore();
            const agora = Date.now();
            
            const snapshot = await db.collection('velas')
                .where('expira', '>', agora)
                .orderBy('expira', 'desc')
                .limit(50)
                .get();
            
            const velasFirebase = [];
            snapshot.forEach(doc => {
                velasFirebase.push({ id: doc.id, ...doc.data() });
            });
            
            // Mesclar com velas locais (evitar duplicatas)
            const idsFirebase = new Set(velasFirebase.map(v => v.id));
            const velasLocais = this.velasAcesas.filter(v => !idsFirebase.has(v.id));
            this.velasAcesas = [...velasFirebase, ...velasLocais];
            
            console.log(`🕯️ ${this.velasAcesas.length} velas carregadas`);
        } catch (error) {
            console.error('Erro ao carregar velas Firebase:', error);
        }
    },
    
    // Escutar mudanças em tempo real
    escutarVelas() {
        if (typeof firebase === 'undefined' || !firebase.firestore) return;
        
        const db = firebase.firestore();
        const agora = Date.now();
        
        this.unsubscribe = db.collection('velas')
            .where('expira', '>', agora)
            .orderBy('expira', 'desc')
            .limit(50)
            .onSnapshot(snapshot => {
                const velasFirebase = [];
                snapshot.forEach(doc => {
                    velasFirebase.push({ id: doc.id, ...doc.data() });
                });
                
                // Mesclar com locais
                const idsFirebase = new Set(velasFirebase.map(v => v.id));
                const velasLocais = this.velasAcesas.filter(v => !v.id || !idsFirebase.has(v.id));
                this.velasAcesas = [...velasFirebase, ...velasLocais];
                
                this.atualizarContador();
            }, error => {
                console.error('Erro listener velas:', error);
            });
    },
    
    // Parar de escutar
    pararEscuta() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    },
    
    // Atualizar contador
    atualizarContador() {
        const total = this.velasAcesas.length + this.velasFake.length;
        const contador = document.getElementById('contador-velas');
        if (contador) {
            contador.textContent = `${total} ${total === 1 ? 'vela acesa' : 'velas acesas'} neste santuário`;
        }
    },
    
    // Obter todas as velas (reais + fake)
    obterTodasVelas() {
        return [...this.velasAcesas, ...this.velasFake].sort((a, b) => b.acesa - a.acesa);
    },

    // Salvar velas
    salvarVelas() {
        localStorage.setItem('mariaVelas', JSON.stringify(this.velasAcesas));
    },

    // Abrir santuário
    async abrir() {
        this.carregarVelas();
        await this.carregarVelasFirebase();
        this.escutarVelas();
        
        // Se já existe, só atualizar o conteúdo (sem piscar)
        const existente = document.getElementById('santuario-velas');
        if (existente) {
            this.atualizarConteudoSantuario();
            return;
        }
        
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
                <!-- Header com safe-area para notch -->
                <div class="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent" style="padding-top: calc(1rem + env(safe-area-inset-top, 0px));">
                    <button onclick="SantuarioVelas.fechar()" class="p-2 bg-white/10  rounded-full hover:bg-white/20 transition-all">
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
                <div class="flex-1 overflow-y-auto px-4 pb-24">
                    <!-- Imagem de Nossa Senhora -->
                    <div class="relative flex justify-center mb-6">
                        <div class="relative">
                            <div class="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-200/30 to-yellow-500/20 flex items-center justify-center  border border-yellow-400/30 shadow-2xl maria-glow">
                                <span class="text-7xl">👑</span>
                            </div>
                            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/60  px-3 py-1 rounded-full">
                                <p class="text-yellow-300 text-xs font-semibold whitespace-nowrap">Nossa Senhora</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Velas acesas -->
                    <div id="velas-container">
                        ${this.renderizarVelasAcesas()}
                    </div>
                    
                    <!-- Intenções da comunidade -->
                    <div class="bg-white/5  rounded-2xl p-4 border border-white/10">
                        <h3 class="text-white font-bold mb-3 flex items-center gap-2">
                            <span>🙏</span> Velas da Comunidade
                        </h3>
                        <p class="text-white/60 text-sm text-center py-4" id="contador-velas">
                            ${this.obterTodasVelas().length} velas acesas neste santuário
                        </p>
                    </div>
                </div>
                
                <!-- Botão fixo no bottom com safe-area -->
                <div class="fixed left-1/2 -translate-x-1/2 z-20" style="bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));">
                    <button onclick="SantuarioVelas.abrirEscolhaVela()" class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 acender-btn whitespace-nowrap">
                        <span>🕯️</span>
                        <span>Acender Vela</span>
                    </button>
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
                    animation: pulse-btn 2s ease-in-out infinite;
                }
                
                @keyframes pulse-btn {
                    0%, 100% { box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4); }
                    50% { box-shadow: 0 4px 25px rgba(251, 191, 36, 0.7); }
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
                    will-change: transform;
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
                    will-change: transform;
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
                    will-change: transform, opacity;
                }
                
                @keyframes chama-dance {
                    0% { transform: translateX(-50%) scaleX(1) scaleY(1) rotate(-2deg); }
                    100% { transform: translateX(-50%) scaleX(0.9) scaleY(1.08) rotate(2deg); }
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
        
        // Reduzido de 20 para 8 para melhor performance
        for (let i = 0; i < 8; i++) {
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
        const todasVelas = this.obterTodasVelas();
        
        if (todasVelas.length === 0) {
            return `
                <div class="text-center py-8 mb-6">
                    <p class="text-white/40 text-sm">Nenhuma vela acesa ainda</p>
                    <p class="text-white/30 text-xs mt-1">Acenda uma vela e ilumine sua intenção</p>
                </div>
            `;
        }
        
        return `
            <div class="grid grid-cols-3 gap-4 mb-6">
                ${todasVelas.slice(0, 12).map((vela, index) => this.renderizarVelaAcesa(vela, index)).join('')}
            </div>
            ${todasVelas.length > 12 ? `<p class="text-white/40 text-xs text-center mb-4">+${todasVelas.length - 12} outras velas acesas</p>` : ''}
        `;
    },

    // Renderizar uma vela acesa
    renderizarVelaAcesa(vela, index) {
        const tipo = this.tiposVelas[vela.tipo] || this.tiposVelas.simples;
        const tempoRestante = this.calcularTempoRestante(vela.expira);
        const velaId = vela.id || `local-${index}`;
        
        return `
            <div class="vela-card flex flex-col items-center p-3 bg-white/5 rounded-xl  cursor-pointer hover:bg-white/10 transition-all" onclick="SantuarioVelas.verIntencaoById('${velaId}')">
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
    
    // Ver intenção por ID (suporta velas reais e fake)
    verIntencaoById(id) {
        // Buscar em todas as velas
        const todasVelas = this.obterTodasVelas();
        const vela = todasVelas.find(v => v.id === id || `local-${todasVelas.indexOf(v)}` === id);
        
        if (!vela) return;
        
        const tipo = this.tiposVelas[vela.tipo] || this.tiposVelas.simples;
        
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
                
                <button onclick="this.parentElement.parentElement.remove()" class="w-full py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all mb-2">
                    Fechar
                </button>
                
                ${!vela.fake ? `
                <button onclick="SantuarioVelas.reportarVelaById('${id}')" class="w-full py-2 text-white/40 text-xs hover:text-white/60 transition-all">
                    Reportar conteúdo
                </button>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    // Reportar vela por ID
    reportarVelaById(id) {
        const todasVelas = this.obterTodasVelas();
        const vela = todasVelas.find(v => v.id === id);
        
        if (!vela) return;
        
        document.getElementById('ver-intencao')?.remove();
        
        const modal = document.createElement('div');
        modal.id = 'modal-reportar-vela';
        modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-4';
        modal.style.background = 'rgba(0,0,0,0.85)';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 max-w-sm w-full">
                <h3 class="text-white font-bold text-lg mb-3">🚩 Reportar conteúdo</h3>
                <p class="text-white/60 text-sm mb-4">Esta intenção será enviada para moderação.</p>
                
                <div class="bg-white/5 rounded-xl p-3 mb-4">
                    <p class="text-white/40 text-xs mb-1">Intenção:</p>
                    <p class="text-white/80 text-sm">"${vela.intencao.substring(0, 100)}${vela.intencao.length > 100 ? '...' : ''}"</p>
                </div>
                
                <div class="mb-4">
                    <label class="text-white/60 text-xs mb-2 block">Motivo:</label>
                    <select id="motivo-denuncia-vela" class="w-full bg-white/10 text-white rounded-xl p-3 text-sm border border-white/20">
                        <option value="conteudo_inapropriado">Conteúdo inapropriado</option>
                        <option value="linguagem_ofensiva">Linguagem ofensiva</option>
                        <option value="spam">Spam ou propaganda</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="text-white/60 text-xs mb-2 block">Descreva o problema: <span class="text-red-400">*</span></label>
                    <textarea id="descricao-denuncia-vela" rows="3" maxlength="300" placeholder="Por favor, explique por que está reportando este conteúdo..." class="w-full bg-white/10 text-white rounded-xl p-3 text-sm border border-white/20 focus:border-red-400 focus:outline-none resize-none"></textarea>
                    <p class="text-white/40 text-xs mt-1">Mínimo 10 caracteres</p>
                </div>
                
                <div class="flex gap-3">
                    <button onclick="document.getElementById('modal-reportar-vela').remove()" class="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
                        Cancelar
                    </button>
                    <button onclick="SantuarioVelas.enviarReportVelaById('${id}')" class="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-500 transition-all">
                        Reportar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    // Enviar denúncia por ID
    async enviarReportVelaById(id) {
        const todasVelas = this.obterTodasVelas();
        const vela = todasVelas.find(v => v.id === id);
        
        if (!vela) return;
        
        const motivo = document.getElementById('motivo-denuncia-vela')?.value || 'Não especificado';
        const descricao = document.getElementById('descricao-denuncia-vela')?.value?.trim() || '';
        const denunciante = localStorage.getItem('mariaUserName') || 'Anônimo';
        
        // Validar descrição obrigatória
        if (descricao.length < 10) {
            if (window.showToast) showToast('⚠️ Por favor, descreva o problema (mínimo 10 caracteres)');
            document.getElementById('descricao-denuncia-vela')?.focus();
            return;
        }
        
        try {
            const response = await fetch('https://conversecommaria.com.br/enviar-denuncia.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipo: 'vela',
                    conteudo: vela.intencao,
                    autor: vela.oferecente,
                    motivo: motivo,
                    descricao: descricao,
                    denunciante: denunciante,
                    velaId: id,
                    isFake: vela.fake || false
                })
            });
            
            document.getElementById('modal-reportar-vela')?.remove();
            
            if (response.ok) {
                if (window.showToast) showToast('✅ Denúncia enviada. Obrigado!');
            } else {
                if (window.showToast) showToast('❌ Erro ao enviar. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao enviar denúncia:', error);
            document.getElementById('modal-reportar-vela')?.remove();
            if (window.showToast) showToast('❌ Erro de conexão');
        }
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
        // Se já existe, não criar de novo
        if (document.getElementById('escolha-vela')) return;
        
        const modal = document.createElement('div');
        modal.id = 'escolha-vela';
        modal.className = 'fixed inset-0 z-[60] flex items-end justify-center';
        modal.style.background = 'rgba(0,0,0,0.8)';
        modal.onclick = (e) => { if (e.target === modal) this.fecharEscolhaVela(); };
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-slide-up">
                <div class="sticky top-0 bg-gradient-to-b from-gray-900 to-transparent p-4 pb-6">
                    <div class="flex items-center justify-between mb-2">
                        <div class="w-10"></div>
                        <div class="w-12 h-1 bg-white/30 rounded-full"></div>
                        <button onclick="SantuarioVelas.fecharEscolhaVela()" class="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
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
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up { animation: slide-up 0.2s ease-out; }
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
        const tipo = this.tiposVelas[tipoKey];
        
        // Verificar se é vela premium e usuário não é premium
        if (tipo.premium && !this.verificarPremium()) {
            this.fecharEscolhaVela();
            this.mostrarPopupPremium(tipo);
            return;
        }
        
        this.fecharEscolhaVela();
        this.abrirFormularioIntencao(tipoKey);
    },
    
    // Verificar se usuário é premium
    verificarPremium() {
        // Verificar via TelaPremium
        if (window.TelaPremium && typeof TelaPremium.isPremium === 'function') {
            return TelaPremium.isPremium();
        }
        
        // Fallback: verificar localStorage diretamente
        const premium = localStorage.getItem('mariaPremium');
        if (!premium) return false;
        
        try {
            const dados = JSON.parse(premium);
            return dados.ativo === true;
        } catch (e) {
            return false;
        }
    },
    
    // Mostrar popup para virar premium
    mostrarPopupPremium(tipoVela) {
        const modal = document.createElement('div');
        modal.id = 'popup-premium-vela';
        modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-4';
        modal.style.background = 'rgba(0,0,0,0.95)';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-3xl w-full max-w-sm p-6 text-center animate-scale-in border border-yellow-500/30">
                <!-- Vela preview -->
                <div class="flex justify-center mb-4">
                    <div class="vela-container" style="--cor-vela: ${tipoVela.cor}; --cor-vela-dark: ${this.escurecerCor(tipoVela.cor)}; --cor-chama: ${tipoVela.corChama};">
                        <div class="chama-container">
                            <div class="chama-glow"></div>
                            <div class="chama"></div>
                            <div class="chama-inner"></div>
                        </div>
                        <div class="vela-corpo" style="width: 26px; height: ${tipoVela.altura * 0.6}px;">
                            <div class="vela-pavio"></div>
                        </div>
                        <div class="vela-reflexo"></div>
                    </div>
                </div>
                
                <!-- Cadeado -->
                <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center border border-yellow-500/30">
                    <span class="text-3xl">🔒</span>
                </div>
                
                <h3 class="text-white text-xl font-bold mb-2">${tipoVela.nome}</h3>
                <p class="text-yellow-400 font-semibold mb-3">✨ Vela Exclusiva Premium ✨</p>
                
                <p class="text-white/70 text-sm mb-6">
                    Esta vela especial está disponível apenas para assinantes Premium. 
                    Acenda velas por até <strong class="text-yellow-400">${tipoVela.duracao}</strong> e tenha suas intenções elevadas a Nossa Senhora!
                </p>
                
                <!-- Benefícios rápidos -->
                <div class="bg-white/5 rounded-xl p-4 mb-6 text-left">
                    <p class="text-white/60 text-xs mb-2">Com o Premium você também ganha:</p>
                    <div class="flex items-center gap-2 text-white/80 text-sm mb-1">
                        <span>💬</span> Conversas ilimitadas com Maria
                    </div>
                    <div class="flex items-center gap-2 text-white/80 text-sm mb-1">
                        <span>📿</span> Terço guiado completo
                    </div>
                    <div class="flex items-center gap-2 text-white/80 text-sm">
                        <span>🚫</span> Sem anúncios
                    </div>
                </div>
                
                <!-- Botões -->
                <button onclick="document.getElementById('popup-premium-vela').remove(); if(window.TelaPremium) TelaPremium.abrir('vela_premium');" class="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl shadow-lg hover:from-yellow-400 hover:to-orange-400 transition-all mb-3 flex items-center justify-center gap-2">
                    <span>👑</span> Quero ser Premium <span>👑</span>
                </button>
                
                <button onclick="document.getElementById('popup-premium-vela').remove(); SantuarioVelas.abrirEscolhaVela();" class="w-full py-3 bg-white/10 text-white/70 rounded-xl font-semibold hover:bg-white/20 transition-all text-sm">
                    Usar vela grátis por enquanto
                </button>
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
    async acenderVela(tipoKey) {
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
        
        // Salvar no Firebase se disponível
        let salvoNoFirebase = false;
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            try {
                const db = firebase.firestore();
                const docRef = await db.collection('velas').add({
                    ...novaVela,
                    visivel: true
                });
                novaVela.id = docRef.id;
                salvoNoFirebase = true;
                console.log('🕯️ Vela salva no Firebase:', docRef.id);
                // O listener onSnapshot vai adicionar automaticamente, não precisa adicionar manualmente
            } catch (error) {
                console.error('Erro ao salvar no Firebase:', error);
            }
        }
        
        // Só adiciona localmente se NÃO salvou no Firebase (o listener cuida)
        if (!salvoNoFirebase) {
            this.velasAcesas.push(novaVela);
            this.salvarVelas();
        }
        
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
            // Só atualizar conteúdo, sem piscar
            this.atualizarConteudoSantuario();
            if (window.showToast) showToast('🕯️ Vela acesa! Maria recebeu sua intenção.');
        }, 2500);
    },
    
    // Atualizar apenas o conteúdo do santuário (sem piscar)
    atualizarConteudoSantuario() {
        const velasContainer = document.getElementById('velas-container');
        if (velasContainer) {
            velasContainer.innerHTML = this.renderizarVelasAcesas();
        }
        
        const contador = document.getElementById('contador-velas');
        if (contador) {
            contador.textContent = `${this.obterTodasVelas().length} velas acesas neste santuário`;
        }
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
        this.pararEscuta();
        const modal = document.getElementById('santuario-velas');
        if (modal) modal.remove();
    }
};

window.SantuarioVelas = SantuarioVelas;
