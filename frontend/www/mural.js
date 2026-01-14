// ========================================
// 👥 MURAL DE INTENÇÕES - COMUNIDADE
// Pedidos de oração da comunidade
// ========================================

const MuralIntencoes = {
    // Categorias de intenções
    categorias: {
        saude: { nome: 'Saúde', emoji: '🏥', cor: '#EF4444' },
        familia: { nome: 'Família', emoji: '👨‍👩‍👧‍👦', cor: '#8B5CF6' },
        trabalho: { nome: 'Trabalho', emoji: '💼', cor: '#3B82F6' },
        financeiro: { nome: 'Financeiro', emoji: '💰', cor: '#10B981' },
        relacionamento: { nome: 'Relacionamento', emoji: '💕', cor: '#EC4899' },
        estudos: { nome: 'Estudos', emoji: '📚', cor: '#F59E0B' },
        espiritual: { nome: 'Espiritual', emoji: '🙏', cor: '#6366F1' },
        gratidao: { nome: 'Gratidão', emoji: '💛', cor: '#FBBF24' },
        outros: { nome: 'Outros', emoji: '✨', cor: '#6B7280' }
    },

    // Intenções da "comunidade" (simuladas)
    intencoesComunidade: [
        { id: 'com-1', categoria: 'saude', texto: 'Pela cura do meu pai que está com câncer. Maria, interceda por ele!', autor: 'Ana C.', tempo: '2h', rezandoBase: 47, cidade: 'São Paulo' },
        { id: 'com-2', categoria: 'familia', texto: 'Pela conversão do meu marido. Que ele volte para Deus e para nossa família.', autor: 'Maria L.', tempo: '3h', rezandoBase: 32, cidade: 'Rio de Janeiro' },
        { id: 'com-3', categoria: 'trabalho', texto: 'Estou desempregado há 8 meses. Preciso muito de um emprego para sustentar minha família.', autor: 'João P.', tempo: '5h', rezandoBase: 89, cidade: 'Belo Horizonte' },
        { id: 'com-4', categoria: 'gratidao', texto: 'Agradeço a Nossa Senhora pela graça alcançada! Minha filha passou no vestibular!', autor: 'Tereza M.', tempo: '1d', rezandoBase: 124, cidade: 'Curitiba' },
        { id: 'com-5', categoria: 'saude', texto: 'Pela minha mãe que vai fazer uma cirurgia delicada amanhã. Nossa Senhora, protegei-a!', autor: 'Pedro S.', tempo: '6h', rezandoBase: 156, cidade: 'Salvador' },
        { id: 'com-6', categoria: 'espiritual', texto: 'Peço forças para vencer a depressão. Sinto-me tão sozinha...', autor: 'Juliana R.', tempo: '4h', rezandoBase: 203, cidade: 'Fortaleza' },
        { id: 'com-7', categoria: 'relacionamento', texto: 'Pelo meu noivado. Que Maria abençoe nossa união e nos guie até o altar.', autor: 'Fernanda A.', tempo: '8h', rezandoBase: 67, cidade: 'Porto Alegre' },
        { id: 'com-8', categoria: 'financeiro', texto: 'Estou com muitas dívidas e não sei o que fazer. Maria, me ajuda!', autor: 'Carlos M.', tempo: '12h', rezandoBase: 98, cidade: 'Recife' },
        { id: 'com-9', categoria: 'estudos', texto: 'Pela aprovação no concurso público. Estudei tanto, agora confio em Deus!', autor: 'Rafaela B.', tempo: '1d', rezandoBase: 145, cidade: 'Brasília' },
        { id: 'com-10', categoria: 'familia', texto: 'Pela paz na minha família. Há muita briga e discórdia entre meus irmãos.', autor: 'Roberto F.', tempo: '2d', rezandoBase: 78, cidade: 'Manaus' },
        { id: 'com-11', categoria: 'saude', texto: 'Pela saúde mental do meu filho adolescente. Ele está passando por um momento muito difícil.', autor: 'Sandra L.', tempo: '7h', rezandoBase: 112, cidade: 'Goiânia' },
        { id: 'com-12', categoria: 'gratidao', texto: 'Nossa Senhora me curou de uma doença grave! Obrigada, Mãezinha do Céu!', autor: 'Lucia H.', tempo: '3d', rezandoBase: 289, cidade: 'Aparecida' }
    ],

    // Intenções do usuário (localStorage)
    minhasIntencoes: [],

    // IDs que o usuário está rezando
    rezandoPor: [],
    
    // Filtro atual
    filtroAtual: 'todas',

    // Inicializar
    init() {
        this.carregarDados();
    },

    // Carregar dados salvos
    carregarDados() {
        const salvas = localStorage.getItem('mariaMinhasIntencoes');
        if (salvas) this.minhasIntencoes = JSON.parse(salvas);
        
        const rezando = localStorage.getItem('mariaRezandoPor');
        if (rezando) this.rezandoPor = JSON.parse(rezando);
    },

    // Salvar dados
    salvarDados() {
        localStorage.setItem('mariaMinhasIntencoes', JSON.stringify(this.minhasIntencoes));
        localStorage.setItem('mariaRezandoPor', JSON.stringify(this.rezandoPor));
    },

    // Abrir mural
    abrir() {
        this.carregarDados();
        this.filtroAtual = 'todas';
        
        const modal = document.createElement('div');
        modal.id = 'mural-intencoes';
        modal.className = 'fixed inset-0 z-50 flex flex-col';
        modal.style.background = 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)';
        
        modal.innerHTML = `
            <!-- Header -->
            <div class="sticky top-0 z-10 bg-gradient-to-b from-indigo-950 to-transparent p-4 pb-6">
                <div class="flex items-center justify-between mb-4">
                    <button onclick="MuralIntencoes.fechar()" class="p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-all">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div class="text-center">
                        <h1 class="text-white font-bold text-lg flex items-center gap-2">
                            <span>🙏</span> Mural de Intenções
                        </h1>
                        <p class="text-indigo-300 text-xs">Una-se em oração com a comunidade</p>
                    </div>
                    <div class="w-10"></div>
                </div>
                
                <!-- Filtros de categoria -->
                <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" id="filtros-categoria">
                    <button onclick="MuralIntencoes.filtrar('todas')" class="filtro-btn flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-indigo-900 transition-all" data-categoria="todas">
                        ✨ Todas
                    </button>
                    ${Object.entries(this.categorias).map(([key, cat]) => `
                        <button onclick="MuralIntencoes.filtrar('${key}')" class="filtro-btn flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all" data-categoria="${key}">
                            ${cat.emoji} ${cat.nome}
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <!-- Conteúdo -->
            <div class="flex-1 overflow-y-auto px-4 pb-24" id="lista-intencoes">
                ${this.renderizarIntencoes('todas')}
            </div>
            
            <!-- Botão flutuante para adicionar -->
            <div class="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                <button onclick="MuralIntencoes.abrirMinhasIntencoes()" class="px-5 py-3 bg-white/20 backdrop-blur text-white rounded-full font-semibold shadow-lg hover:bg-white/30 transition-all flex items-center gap-2">
                    <span>📋</span>
                    <span>Minhas (${this.minhasIntencoes.length})</span>
                </button>
                <button onclick="MuralIntencoes.abrirFormulario()" class="px-5 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 publicar-btn">
                    <span>✏️</span>
                    <span>Pedir Oração</span>
                </button>
            </div>
            
            <style>
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                
                .publicar-btn {
                    animation: pulse-btn 2s ease-in-out infinite;
                }
                
                @keyframes pulse-btn {
                    0%, 100% { box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4); }
                    50% { box-shadow: 0 4px 25px rgba(251, 191, 36, 0.7); }
                }
                
                .intencao-card {
                    animation: slide-in 0.3s ease-out;
                }
                
                @keyframes slide-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
        `;
        
        document.body.appendChild(modal);
    },

    // Renderizar lista de intenções
    renderizarIntencoes(filtro = 'todas') {
        let intencoes = [];
        
        // Adicionar intenções do usuário primeiro
        this.minhasIntencoes.forEach((int, idx) => {
            intencoes.push({
                ...int,
                id: `user-${idx}`,
                autor: 'Você',
                tempo: this.calcularTempo(int.criadaEm),
                minha: true,
                rezandoBase: int.rezando || 0
            });
        });
        
        // Adicionar intenções da comunidade
        intencoes = intencoes.concat(this.intencoesComunidade);
        
        // Filtrar por categoria
        if (filtro !== 'todas') {
            intencoes = intencoes.filter(i => i.categoria === filtro);
        }
        
        if (intencoes.length === 0) {
            return `
                <div class="text-center py-12">
                    <div class="text-5xl mb-4">🕊️</div>
                    <p class="text-white/60">Nenhuma intenção nesta categoria</p>
                </div>
            `;
        }
        
        return intencoes.map(int => this.renderizarIntencao(int)).join('');
    },

    // Renderizar uma intenção
    renderizarIntencao(int) {
        const cat = this.categorias[int.categoria] || this.categorias.outros;
        const estouRezando = this.rezandoPor.includes(int.id);
        const totalRezando = (int.rezandoBase || 0) + (estouRezando ? 1 : 0);
        
        return `
            <div class="intencao-card bg-white/5 backdrop-blur rounded-2xl p-4 mb-3 border border-white/10 ${int.minha ? 'ring-2 ring-yellow-500/50' : ''}" id="card-${int.id}">
                <!-- Header -->
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <span class="w-8 h-8 rounded-full flex items-center justify-center text-sm" style="background: ${cat.cor}22; color: ${cat.cor}">
                            ${cat.emoji}
                        </span>
                        <div>
                            <p class="text-white font-semibold text-sm">${int.autor}</p>
                            <p class="text-white/40 text-xs">${int.cidade || ''} • ${int.tempo}</p>
                        </div>
                    </div>
                    ${int.minha ? '<span class="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">Sua intenção</span>' : ''}
                </div>
                
                <!-- Texto -->
                <p class="text-white/90 text-sm leading-relaxed mb-4">${int.texto}</p>
                
                <!-- Footer -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1 text-white/50 text-xs" id="contador-${int.id}">
                        <span>🙏</span>
                        <span>${totalRezando} ${totalRezando === 1 ? 'pessoa rezando' : 'pessoas rezando'}</span>
                    </div>
                    
                    ${int.minha ? `
                        <button onclick="MuralIntencoes.excluirIntencao('${int.id}')" class="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold hover:bg-red-500/30 transition-all">
                            🗑️ Excluir
                        </button>
                    ` : `
                        <button onclick="MuralIntencoes.toggleRezar('${int.id}', ${int.rezandoBase || 0})" id="btn-rezar-${int.id}" class="px-4 py-2 rounded-full text-sm font-semibold transition-all ${estouRezando ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'}">
                            ${estouRezando ? '🙏 Rezando!' : '🙏 Rezar'}
                        </button>
                    `}
                </div>
            </div>
        `;
    },

    // Filtrar por categoria
    filtrar(categoria) {
        this.filtroAtual = categoria;
        
        // Atualizar botões
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            if (btn.dataset.categoria === categoria) {
                btn.classList.remove('bg-white/10', 'text-white');
                btn.classList.add('bg-white', 'text-indigo-900');
            } else {
                btn.classList.remove('bg-white', 'text-indigo-900');
                btn.classList.add('bg-white/10', 'text-white');
            }
        });
        
        // Atualizar lista
        const lista = document.getElementById('lista-intencoes');
        if (lista) {
            lista.innerHTML = this.renderizarIntencoes(categoria);
        }
    },

    // Toggle rezar - CORRIGIDO!
    toggleRezar(id, rezandoBase) {
        const index = this.rezandoPor.indexOf(id);
        const btn = document.getElementById(`btn-rezar-${id}`);
        const contador = document.getElementById(`contador-${id}`);
        
        if (index === -1) {
            // Adicionar
            this.rezandoPor.push(id);
            const novoTotal = rezandoBase + 1;
            
            if (btn) {
                btn.classList.remove('bg-white/10', 'text-white');
                btn.classList.add('bg-yellow-500', 'text-black');
                btn.innerHTML = '🙏 Rezando!';
            }
            if (contador) {
                contador.innerHTML = `<span>🙏</span><span>${novoTotal} ${novoTotal === 1 ? 'pessoa rezando' : 'pessoas rezando'}</span>`;
            }
            
            // Registrar oração por intenção nas estatísticas
            if (window.EstatisticasOracao) {
                EstatisticasOracao.registrarOracaoPorIntencao();
            }
            
            if (window.showToast) showToast('🙏 Você está rezando por esta intenção!');
        } else {
            // Remover
            this.rezandoPor.splice(index, 1);
            const novoTotal = rezandoBase;
            
            if (btn) {
                btn.classList.remove('bg-yellow-500', 'text-black');
                btn.classList.add('bg-white/10', 'text-white');
                btn.innerHTML = '🙏 Rezar';
            }
            if (contador) {
                contador.innerHTML = `<span>🙏</span><span>${novoTotal} ${novoTotal === 1 ? 'pessoa rezando' : 'pessoas rezando'}</span>`;
            }
        }
        
        this.salvarDados();
    },

    // Abrir formulário para nova intenção
    abrirFormulario() {
        const modal = document.createElement('div');
        modal.id = 'form-intencao-mural';
        modal.className = 'fixed inset-0 z-[60] flex items-end justify-center';
        modal.style.background = 'rgba(0,0,0,0.8)';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
                <div class="sticky top-0 bg-gradient-to-b from-indigo-900 to-transparent p-4 pb-6">
                    <div class="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4"></div>
                    <h2 class="text-white text-xl font-bold text-center">✏️ Pedir Oração</h2>
                    <p class="text-indigo-300 text-sm text-center mt-1">Compartilhe sua intenção com a comunidade</p>
                </div>
                
                <div class="px-4 pb-8">
                    <!-- Categoria -->
                    <div class="mb-4">
                        <label class="text-white/80 text-sm mb-2 block">Categoria:</label>
                        <div class="grid grid-cols-3 gap-2" id="categorias-select">
                            ${Object.entries(this.categorias).map(([key, cat]) => `
                                <button type="button" onclick="MuralIntencoes.selecionarCategoria('${key}')" class="cat-btn p-3 rounded-xl text-center transition-all bg-white/5 hover:bg-white/15 border-2 border-transparent" data-categoria="${key}">
                                    <span class="text-2xl">${cat.emoji}</span>
                                    <p class="text-white/70 text-xs mt-1">${cat.nome}</p>
                                </button>
                            `).join('')}
                        </div>
                        <input type="hidden" id="categoria-selecionada" value="">
                        <p id="erro-categoria" class="text-red-400 text-xs mt-2 hidden">⚠️ Selecione uma categoria</p>
                    </div>
                    
                    <!-- Intenção -->
                    <div class="mb-4">
                        <label class="text-white/80 text-sm mb-2 block">Sua intenção:</label>
                        <textarea id="texto-intencao" rows="4" maxlength="500" placeholder="Escreva sua intenção aqui... (máximo 500 caracteres)" class="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 resize-none transition-all"></textarea>
                        <p class="text-white/40 text-xs text-right mt-1"><span id="contador-chars">0</span>/500</p>
                    </div>
                    
                    <!-- Nome -->
                    <div class="mb-6">
                        <label class="text-white/80 text-sm mb-2 block">Seu nome (opcional):</label>
                        <input type="text" id="nome-intencao" maxlength="30" placeholder="Como deseja ser identificado?" class="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-all">
                        <p class="text-white/40 text-xs mt-1">Deixe em branco para "Anônimo"</p>
                    </div>
                    
                    <!-- Aviso -->
                    <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-6">
                        <p class="text-yellow-300 text-xs">
                            🛡️ Este é um espaço sagrado de oração. Mensagens com conteúdo impróprio serão bloqueadas automaticamente.
                        </p>
                    </div>
                    
                    <!-- Botões -->
                    <div class="flex gap-3">
                        <button onclick="document.getElementById('form-intencao-mural').remove()" class="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
                            Cancelar
                        </button>
                        <button onclick="MuralIntencoes.publicarIntencao()" class="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-xl font-bold hover:from-yellow-400 hover:to-orange-400 transition-all">
                            🙏 Publicar
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
                
                .cat-btn.selecionada {
                    background: rgba(234, 179, 8, 0.3) !important;
                    border-color: #EAB308 !important;
                    transform: scale(1.05);
                }
                
                .cat-btn.selecionada p {
                    color: #FDE047 !important;
                }
            </style>
        `;
        
        document.body.appendChild(modal);
        
        // Contador de caracteres
        document.getElementById('texto-intencao').addEventListener('input', (e) => {
            document.getElementById('contador-chars').textContent = e.target.value.length;
        });
    },

    // Selecionar categoria - CORRIGIDO!
    selecionarCategoria(key) {
        // Remover seleção de todos
        document.querySelectorAll('.cat-btn').forEach(btn => {
            btn.classList.remove('selecionada');
        });
        
        // Adicionar seleção no clicado
        const btn = document.querySelector(`.cat-btn[data-categoria="${key}"]`);
        if (btn) {
            btn.classList.add('selecionada');
        }
        
        // Salvar valor
        document.getElementById('categoria-selecionada').value = key;
        
        // Esconder erro se existir
        document.getElementById('erro-categoria').classList.add('hidden');
    },

    // Publicar intenção
    publicarIntencao() {
        const categoria = document.getElementById('categoria-selecionada').value;
        const texto = document.getElementById('texto-intencao').value.trim();
        const nome = document.getElementById('nome-intencao').value.trim();
        
        // Validar categoria
        if (!categoria) {
            document.getElementById('erro-categoria').classList.remove('hidden');
            showToast('❌ Selecione uma categoria');
            return;
        }
        
        // Validar com filtro de palavrões
        if (window.FiltroPalavras) {
            // Validar texto da intenção
            const validacaoTexto = FiltroPalavras.validar(texto);
            if (!validacaoTexto.valido) {
                showToast(validacaoTexto.mensagem);
                document.getElementById('texto-intencao').classList.add('border-red-500');
                return;
            }
            
            // Validar nome também
            const validacaoNome = FiltroPalavras.validarNome(nome);
            if (!validacaoNome.valido) {
                showToast(validacaoNome.mensagem);
                document.getElementById('nome-intencao').classList.add('border-red-500');
                return;
            }
        } else if (!texto || texto.length < 3) {
            showToast('❌ Escreva sua intenção');
            return;
        }
        
        // Criar intenção
        const novaIntencao = {
            categoria,
            texto,
            autor: nome || 'Anônimo',
            criadaEm: Date.now(),
            rezando: 0
        };
        
        this.minhasIntencoes.unshift(novaIntencao);
        this.salvarDados();
        
        // Registrar intenção nas estatísticas
        if (window.EstatisticasOracao) {
            EstatisticasOracao.registrarIntencao();
        }
        
        // Fechar formulário
        document.getElementById('form-intencao-mural').remove();
        
        // Atualizar lista
        this.filtrar(this.filtroAtual);
        
        showToast('🙏 Intenção publicada! A comunidade está rezando por você.');
    },

    // Abrir minhas intenções
    abrirMinhasIntencoes() {
        const modal = document.createElement('div');
        modal.id = 'minhas-intencoes';
        modal.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4';
        modal.style.background = 'rgba(0,0,0,0.9)';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
                <div class="sticky top-0 bg-indigo-900 p-4 border-b border-white/10">
                    <h2 class="text-white font-bold text-center">📋 Minhas Intenções</h2>
                </div>
                
                <div class="p-4">
                    ${this.minhasIntencoes.length === 0 ? `
                        <div class="text-center py-8">
                            <div class="text-4xl mb-3">🕊️</div>
                            <p class="text-white/60">Você ainda não publicou nenhuma intenção</p>
                        </div>
                    ` : this.minhasIntencoes.map((int, idx) => {
                        const cat = this.categorias[int.categoria] || this.categorias.outros;
                        return `
                            <div class="bg-white/5 rounded-xl p-3 mb-3">
                                <div class="flex items-center gap-2 mb-2">
                                    <span>${cat.emoji}</span>
                                    <span class="text-white/60 text-xs">${this.calcularTempo(int.criadaEm)}</span>
                                </div>
                                <p class="text-white text-sm mb-2">${int.texto}</p>
                                <button onclick="MuralIntencoes.excluirIntencaoIdx(${idx})" class="text-red-400 text-xs hover:text-red-300">
                                    🗑️ Excluir
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="p-4 border-t border-white/10">
                    <button onclick="document.getElementById('minhas-intencoes').remove()" class="w-full py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
                        Fechar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    // Excluir intenção
    excluirIntencaoIdx(idx) {
        if (confirm('Tem certeza que deseja excluir esta intenção?')) {
            this.minhasIntencoes.splice(idx, 1);
            this.salvarDados();
            document.getElementById('minhas-intencoes').remove();
            this.abrirMinhasIntencoes();
            this.filtrar(this.filtroAtual);
            showToast('Intenção excluída');
        }
    },

    excluirIntencao(id) {
        if (id.startsWith('user-')) {
            const idx = parseInt(id.replace('user-', ''));
            this.excluirIntencaoIdx(idx);
        }
    },

    // Calcular tempo relativo
    calcularTempo(timestamp) {
        const agora = Date.now();
        const diff = agora - timestamp;
        
        const minutos = Math.floor(diff / (1000 * 60));
        const horas = Math.floor(diff / (1000 * 60 * 60));
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (minutos < 1) return 'agora';
        if (minutos < 60) return `${minutos}min`;
        if (horas < 24) return `${horas}h`;
        return `${dias}d`;
    },

    // Fechar mural
    fechar() {
        const modal = document.getElementById('mural-intencoes');
        if (modal) modal.remove();
    }
};

window.MuralIntencoes = MuralIntencoes;
