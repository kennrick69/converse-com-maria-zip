// ========================================
// 👥 MURAL DE INTENÇÕES - COMUNIDADE
// Com Firebase para compartilhar entre usuários
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

    // Intenções simuladas (sempre aparecem)
    intencoesFake: [
        { id: 'fake-1', categoria: 'saude', texto: 'Pela cura do meu pai que está com câncer. Maria, interceda por ele!', autor: 'Ana C.', criadaEm: Date.now() - 2*60*60*1000, rezando: 47, fake: true },
        { id: 'fake-2', categoria: 'familia', texto: 'Pela conversão do meu marido. Que ele volte para Deus e para nossa família.', autor: 'Maria L.', criadaEm: Date.now() - 3*60*60*1000, rezando: 32, fake: true },
        { id: 'fake-3', categoria: 'trabalho', texto: 'Estou desempregado há 8 meses. Preciso muito de um emprego para sustentar minha família.', autor: 'João P.', criadaEm: Date.now() - 5*60*60*1000, rezando: 89, fake: true },
        { id: 'fake-4', categoria: 'gratidao', texto: 'Agradeço a Nossa Senhora pela graça alcançada! Minha filha passou no vestibular!', autor: 'Tereza M.', criadaEm: Date.now() - 24*60*60*1000, rezando: 124, fake: true },
        { id: 'fake-5', categoria: 'saude', texto: 'Pela minha mãe que vai fazer uma cirurgia delicada amanhã. Nossa Senhora, protegei-a!', autor: 'Pedro S.', criadaEm: Date.now() - 6*60*60*1000, rezando: 156, fake: true },
        { id: 'fake-6', categoria: 'espiritual', texto: 'Peço forças para vencer a depressão. Sinto-me tão sozinha...', autor: 'Juliana R.', criadaEm: Date.now() - 4*60*60*1000, rezando: 203, fake: true },
        { id: 'fake-7', categoria: 'relacionamento', texto: 'Pelo meu noivado. Que Maria abençoe nossa união e nos guie até o altar.', autor: 'Fernanda A.', criadaEm: Date.now() - 8*60*60*1000, rezando: 67, fake: true },
        { id: 'fake-8', categoria: 'financeiro', texto: 'Estou com muitas dívidas e não sei o que fazer. Maria, me ajuda!', autor: 'Carlos M.', criadaEm: Date.now() - 12*60*60*1000, rezando: 98, fake: true },
        { id: 'fake-9', categoria: 'estudos', texto: 'Pela aprovação no concurso público. Estudei tanto, agora confio em Deus!', autor: 'Rafaela B.', criadaEm: Date.now() - 24*60*60*1000, rezando: 145, fake: true },
        { id: 'fake-10', categoria: 'familia', texto: 'Pela paz na minha família. Há muita briga e discórdia entre meus irmãos.', autor: 'Roberto F.', criadaEm: Date.now() - 48*60*60*1000, rezando: 78, fake: true },
        { id: 'fake-11', categoria: 'saude', texto: 'Pela saúde mental do meu filho adolescente. Ele está passando por um momento muito difícil.', autor: 'Sandra L.', criadaEm: Date.now() - 7*60*60*1000, rezando: 112, fake: true },
        { id: 'fake-12', categoria: 'gratidao', texto: 'Nossa Senhora me curou de uma doença grave! Obrigada, Mãezinha do Céu!', autor: 'Lucia H.', criadaEm: Date.now() - 72*60*60*1000, rezando: 289, fake: true }
    ],

    // Intenções carregadas do Firebase
    intencoesComunidade: [],
    
    // IDs que o usuário está rezando
    rezandoPor: [],
    
    // Filtro atual
    filtroAtual: 'todas',
    
    // Listener do Firestore
    unsubscribe: null,

    // Inicializar
    init() {
        this.carregarDadosLocal();
    },
    
    // Carregar dados do localStorage
    carregarDadosLocal() {
        const rezando = localStorage.getItem('mariaRezandoPor');
        if (rezando) this.rezandoPor = JSON.parse(rezando);
    },
    
    // Salvar dados locais
    salvarDadosLocal() {
        localStorage.setItem('mariaRezandoPor', JSON.stringify(this.rezandoPor));
    },

    // Carregar intenções do Firebase
    async carregarIntencoesFirebase() {
        if (typeof firebase === 'undefined' || !firebase.firestore) {
            console.log('Firebase não disponível');
            return;
        }
        
        try {
            const db = firebase.firestore();
            const seteDiasAtras = Date.now() - (7 * 24 * 60 * 60 * 1000);
            
            // Query simples igual às velas (sem índice composto)
            const snapshot = await db.collection('intencoes')
                .where('criadaEm', '>', seteDiasAtras)
                .orderBy('criadaEm', 'desc')
                .limit(50)
                .get();
            
            this.intencoesComunidade = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                // Filtrar visíveis no cliente
                if (data.visivel !== false) {
                    this.intencoesComunidade.push({ id: doc.id, ...data });
                }
            });
            
            console.log(`🙏 ${this.intencoesComunidade.length} intenções carregadas`);
        } catch (error) {
            console.error('Erro ao carregar intenções:', error);
        }
    },
    
    // Escutar mudanças em tempo real
    escutarIntencoes() {
        if (typeof firebase === 'undefined' || !firebase.firestore) return;
        
        const db = firebase.firestore();
        const seteDiasAtras = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        // Debounce para evitar múltiplas atualizações rápidas
        let debounceTimer = null;
        
        // Query simples igual às velas
        this.unsubscribe = db.collection('intencoes')
            .where('criadaEm', '>', seteDiasAtras)
            .orderBy('criadaEm', 'desc')
            .limit(50)
            .onSnapshot(snapshot => {
                this.intencoesComunidade = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    // Filtrar visíveis no cliente
                    if (data.visivel !== false) {
                        this.intencoesComunidade.push({ id: doc.id, ...data });
                    }
                });
                
                // Debounce: só atualiza a lista se não tiver atualização recente
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    // Só atualiza se não acabou de clicar em rezar (evita piscar)
                    if (!this.ignorarProximaAtualizacao) {
                        this.atualizarLista();
                    }
                    this.ignorarProximaAtualizacao = false;
                }, 500);
            }, error => {
                console.error('Erro no listener:', error);
            });
    },
    
    // Parar de escutar
    pararEscuta() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    },
    
    // Atualizar lista na UI
    atualizarLista() {
        const lista = document.getElementById('lista-intencoes');
        if (lista) {
            lista.innerHTML = this.renderizarIntencoes(this.filtroAtual);
        }
    },

    // Publicar intenção no Firebase
    async publicarIntencaoFirebase(categoria, texto, autor) {
        if (typeof firebase === 'undefined' || !firebase.firestore) {
            if (window.showToast) showToast('Erro: Firebase não disponível');
            return false;
        }
        
        try {
            const db = firebase.firestore();
            
            const novaIntencao = {
                categoria: categoria,
                texto: texto,
                autor: autor,
                criadaEm: Date.now(),
                rezando: 0,
                visivel: true
            };
            
            await db.collection('intencoes').add(novaIntencao);
            
            console.log('✅ Intenção publicada no Firebase');
            return true;
        } catch (error) {
            console.error('Erro ao publicar:', error);
            if (window.showToast) showToast('Erro ao publicar intenção');
            return false;
        }
    },
    
    // Rezar por uma intenção
    async rezarPor(id) {
        // Verificar se já está rezando
        if (this.rezandoPor.includes(id)) {
            if (window.showToast) showToast('Você já está rezando por esta intenção');
            return;
        }
        
        // Adicionar à lista local
        this.rezandoPor.push(id);
        this.salvarDadosLocal();
        
        // Marcar para ignorar próxima atualização do Firebase (evita piscar)
        this.ignorarProximaAtualizacao = true;
        
        // Atualizar APENAS o card clicado (sem recarregar lista toda)
        this.atualizarCardRezando(id);
        
        // Incrementar contador no Firebase (apenas para intenções reais)
        if (!id.startsWith('fake-') && typeof firebase !== 'undefined' && firebase.firestore) {
            try {
                const db = firebase.firestore();
                await db.collection('intencoes').doc(id).update({
                    rezando: firebase.firestore.FieldValue.increment(1)
                });
            } catch (error) {
                console.error('Erro ao atualizar contador:', error);
            }
        }
        
        // Para fake, incrementar localmente
        if (id.startsWith('fake-')) {
            const fake = this.intencoesFake.find(f => f.id === id);
            if (fake) fake.rezando++;
        }
        
        // Registrar oração nas estatísticas
        if (window.EstatisticasOracao) {
            EstatisticasOracao.registrarOracaoPorIntencao();
        }
        
        if (window.showToast) showToast('🙏 Sua oração foi registrada!');
    },
    
    // Atualizar apenas o card específico (sem piscar a lista toda)
    atualizarCardRezando(id) {
        // Encontrar o botão que foi clicado
        const botao = document.querySelector(`button[onclick="MuralIntencoes.rezarPor('${id}')"]`);
        if (!botao) return;
        
        // Substituir botão por "✓ Rezando"
        const novoElemento = document.createElement('span');
        novoElemento.className = 'text-green-400 text-xs flex items-center gap-1';
        novoElemento.innerHTML = '✓ Rezando';
        botao.replaceWith(novoElemento);
        
        // Atualizar contador de pessoas rezando
        const card = novoElemento.closest('.intencao-card');
        if (card) {
            const contadorSpan = card.querySelector('.text-white\\/50 span:last-child');
            if (contadorSpan) {
                const textoAtual = contadorSpan.textContent;
                const numAtual = parseInt(textoAtual) || 0;
                const novoNum = numAtual + 1;
                contadorSpan.textContent = `${novoNum} ${novoNum === 1 ? 'pessoa rezando' : 'pessoas rezando'}`;
            }
        }
    },

    // Abrir mural
    async abrir() {
        this.carregarDadosLocal();
        await this.carregarIntencoesFirebase();
        this.escutarIntencoes();
        this.filtroAtual = 'todas';
        
        const modal = document.createElement('div');
        modal.id = 'mural-intencoes';
        modal.className = 'fixed inset-0 z-50 flex flex-col';
        modal.style.background = 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)';
        
        modal.innerHTML = `
            <div class="sticky top-0 z-10 bg-gradient-to-b from-indigo-950 to-transparent p-4 pb-6" style="padding-top: calc(1rem + env(safe-area-inset-top, 0px));">
                <div class="flex items-center justify-between mb-4">
                    <div style="width:40px;height:40px;flex-shrink:0;"></div>
                    <div class="text-center">
                        <h1 class="text-white font-bold text-lg flex items-center gap-2">
                            <span>🙏</span> Mural de Intenções
                        </h1>
                        <p class="text-indigo-300 text-xs">Una-se em oração com a comunidade</p>
                    </div>
                    <button onclick="MuralIntencoes.fechar()" class="btn-modal-x" aria-label="Fechar">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                
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
            
            <div class="flex-1 overflow-y-auto px-4 pb-24" id="lista-intencoes">
                ${this.renderizarIntencoes('todas')}
            </div>
            
            <div class="fixed left-1/2 -translate-x-1/2" style="bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));">
                <button onclick="MuralIntencoes.abrirFormulario()" class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 publicar-btn">
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
        // Combinar intenções reais do Firebase com as fake
        let intencoes = [...this.intencoesComunidade, ...this.intencoesFake];
        
        // Ordenar por data (mais recentes primeiro)
        intencoes.sort((a, b) => b.criadaEm - a.criadaEm);
        
        // Filtrar por categoria
        if (filtro !== 'todas') {
            intencoes = intencoes.filter(i => i.categoria === filtro);
        }
        
        if (intencoes.length === 0) {
            return `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">🕊️</div>
                    <p class="text-white/60 text-lg mb-2">Nenhuma intenção encontrada</p>
                    <p class="text-white/40 text-sm">Seja o primeiro a pedir uma oração!</p>
                </div>
            `;
        }
        
        return intencoes.map(intencao => {
            const cat = this.categorias[intencao.categoria] || this.categorias.outros;
            const jaRezando = this.rezandoPor.includes(intencao.id);
            const tempo = this.calcularTempo(intencao.criadaEm);
            
            return `
                <div class="intencao-card bg-white/5  rounded-2xl p-4 mb-3 border border-white/10">
                    <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg" style="background: ${cat.cor}20;">
                            ${cat.emoji}
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between mb-1">
                                <div class="flex items-center gap-2">
                                    <span class="text-white font-semibold text-sm">${intencao.autor || 'Anônimo'}</span>
                                    <span class="text-white/40 text-xs">• ${tempo}</span>
                                </div>
                                <button onclick="MuralIntencoes.reportarIntencao('${intencao.id}')" class="text-white/30 hover:text-white/60 transition-all p-1" title="Reportar">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                </button>
                            </div>
                            <p class="text-white/90 text-sm mb-3">${intencao.texto}</p>
                            
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-1 text-white/50 text-xs">
                                    <span>🙏</span>
                                    <span>${intencao.rezando || 0} ${(intencao.rezando || 0) === 1 ? 'pessoa rezando' : 'pessoas rezando'}</span>
                                </div>
                                
                                ${jaRezando ? `
                                    <span class="text-green-400 text-xs flex items-center gap-1">
                                        ✓ Rezando
                                    </span>
                                ` : `
                                    <button onclick="MuralIntencoes.rezarPor('${intencao.id}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-full font-semibold transition-all">
                                        🙏 Rezar
                                    </button>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Filtrar por categoria
    filtrar(categoria) {
        this.filtroAtual = categoria;
        
        // Atualizar botões
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            if (btn.dataset.categoria === categoria) {
                btn.className = 'filtro-btn flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-indigo-900 transition-all';
            } else {
                btn.className = 'filtro-btn flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all';
            }
        });
        
        // Atualizar lista
        this.atualizarLista();
    },

    // Abrir formulário para nova intenção
    abrirFormulario() {
        const nomeUsuario = localStorage.getItem('mariaUserName') || '';
        
        const modal = document.createElement('div');
        modal.id = 'form-intencao';
        modal.className = 'fixed inset-0 z-[60] flex items-end justify-center';
        modal.style.background = 'rgba(0,0,0,0.9)';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-t-2xl w-full max-w-md p-4 pb-6">
                <div class="w-12 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
                <h2 class="text-white font-bold text-base text-center mb-3">✏️ Pedir Oração</h2>
                
                <div class="space-y-2">
                    <div class="flex gap-2">
                        <div class="flex-1">
                            <input type="text" id="autor-intencao" value="${nomeUsuario}" maxlength="30" placeholder="Seu nome" class="w-full bg-white/10 text-white rounded-lg p-2 text-sm border border-white/20 focus:border-indigo-400 focus:outline-none">
                        </div>
                        <div class="flex-1">
                            <select id="categoria-intencao" class="w-full bg-white/10 text-white rounded-lg p-2 text-sm border border-white/20 focus:border-indigo-400 focus:outline-none">
                                ${Object.entries(this.categorias).map(([key, cat]) => 
                                    `<option value="${key}">${cat.emoji} ${cat.nome}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <textarea id="texto-intencao" maxlength="300" rows="2" placeholder="Escreva sua intenção de oração..." class="w-full bg-white/10 text-white rounded-lg p-2 text-sm border border-white/20 focus:border-indigo-400 focus:outline-none resize-none"></textarea>
                    </div>
                </div>
                
                <div class="flex gap-2 mt-3">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="flex-1 py-2.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all text-sm">
                        Cancelar
                    </button>
                    <button onclick="MuralIntencoes.publicarIntencao()" class="flex-1 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm">
                        📤 Publicar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Contador de caracteres
        const textarea = document.getElementById('texto-intencao');
        textarea.addEventListener('input', () => {
            // Contador removido para economizar espaço
        });
    },

    // Publicar nova intenção
    async publicarIntencao() {
        const autor = document.getElementById('autor-intencao')?.value.trim() || 'Anônimo';
        const categoria = document.getElementById('categoria-intencao')?.value;
        const texto = document.getElementById('texto-intencao')?.value.trim();
        
        if (!texto) {
            if (window.showToast) showToast('Por favor, escreva sua intenção');
            return;
        }
        
        if (texto.length < 10) {
            if (window.showToast) showToast('Intenção muito curta');
            return;
        }
        
        // Salvar nome
        if (autor && autor !== 'Anônimo') {
            localStorage.setItem('mariaUserName', autor);
        }
        
        // Publicar
        const sucesso = await this.publicarIntencaoFirebase(categoria, texto, autor);
        
        if (sucesso) {
            document.getElementById('form-intencao')?.remove();
            if (window.showToast) showToast('🙏 Intenção publicada! A comunidade vai rezar por você.');
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
    
    // Reportar intenção
    reportarIntencao(id) {
        // Buscar intenção em todas (reais e fakes)
        let intencao = this.intencoesComunidade.find(i => i.id === id);
        if (!intencao) {
            intencao = this.intencoesFake.find(i => i.id === id);
        }
        if (!intencao) return;
        
        const modal = document.createElement('div');
        modal.id = 'modal-reportar-intencao';
        modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-4';
        modal.style.background = 'rgba(0,0,0,0.85)';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 max-w-sm w-full">
                <h3 class="text-white font-bold text-lg mb-3">🚩 Reportar conteúdo</h3>
                <p class="text-white/60 text-sm mb-4">Esta intenção será enviada para moderação.</p>
                
                <div class="bg-white/5 rounded-xl p-3 mb-4">
                    <p class="text-white/40 text-xs mb-1">Intenção:</p>
                    <p class="text-white/80 text-sm">"${intencao.texto.substring(0, 100)}${intencao.texto.length > 100 ? '...' : ''}"</p>
                </div>
                
                <div class="mb-4">
                    <label class="text-white/60 text-xs mb-2 block">Motivo:</label>
                    <select id="motivo-denuncia-mural" onchange="MuralIntencoes.toggleCampoDescricao()" class="w-full bg-white/10 text-white rounded-xl p-3 text-sm border border-white/20">
                        <option value="conteudo_inapropriado">Conteúdo inapropriado</option>
                        <option value="linguagem_ofensiva">Linguagem ofensiva</option>
                        <option value="spam">Spam ou propaganda</option>
                        <option value="informacao_falsa">Informação falsa</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="text-white/60 text-xs mb-2 block">Descreva o problema: <span class="text-red-400">*</span></label>
                    <textarea id="descricao-denuncia-mural" rows="3" maxlength="300" placeholder="Por favor, explique por que está reportando este conteúdo..." class="w-full bg-white/10 text-white rounded-xl p-3 text-sm border border-white/20 focus:border-red-400 focus:outline-none resize-none"></textarea>
                    <p class="text-white/40 text-xs mt-1">Mínimo 10 caracteres</p>
                </div>
                
                <div class="flex gap-3">
                    <button onclick="document.getElementById('modal-reportar-intencao').remove()" class="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
                        Cancelar
                    </button>
                    <button onclick="MuralIntencoes.enviarReportIntencao('${id}')" class="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-500 transition-all">
                        Reportar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    // Toggle campo descrição (para enfatizar quando "Outro" é selecionado)
    toggleCampoDescricao() {
        const select = document.getElementById('motivo-denuncia-mural');
        const textarea = document.getElementById('descricao-denuncia-mural');
        if (select && textarea) {
            if (select.value === 'outro') {
                textarea.placeholder = 'OBRIGATÓRIO: Explique detalhadamente o motivo da denúncia...';
                textarea.classList.add('border-red-400');
            } else {
                textarea.placeholder = 'Por favor, explique por que está reportando este conteúdo...';
                textarea.classList.remove('border-red-400');
            }
        }
    },
    
    // Enviar denúncia de intenção para o servidor
    async enviarReportIntencao(id) {
        // Buscar intenção em todas (reais e fakes)
        let intencao = this.intencoesComunidade.find(i => i.id === id);
        if (!intencao) {
            intencao = this.intencoesFake.find(i => i.id === id);
        }
        if (!intencao) return;
        
        const motivo = document.getElementById('motivo-denuncia-mural')?.value || 'Não especificado';
        const descricao = document.getElementById('descricao-denuncia-mural')?.value?.trim() || '';
        const denunciante = localStorage.getItem('mariaUserName') || 'Anônimo';
        
        // Validar descrição obrigatória
        if (descricao.length < 10) {
            if (window.showToast) showToast('⚠️ Por favor, descreva o problema (mínimo 10 caracteres)');
            document.getElementById('descricao-denuncia-mural')?.focus();
            return;
        }
        
        try {
            const response = await fetch('https://conversecommaria.com.br/enviar-denuncia.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipo: 'mural',
                    conteudo: intencao.texto,
                    autor: intencao.autor,
                    motivo: motivo,
                    descricao: descricao,
                    denunciante: denunciante,
                    intencaoId: id,
                    isFake: intencao.fake || false
                })
            });
            
            document.getElementById('modal-reportar-intencao')?.remove();
            
            if (response.ok) {
                if (window.showToast) showToast('✅ Denúncia enviada. Obrigado!');
            } else {
                if (window.showToast) showToast('❌ Erro ao enviar. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao enviar denúncia:', error);
            document.getElementById('modal-reportar-intencao')?.remove();
            if (window.showToast) showToast('❌ Erro de conexão');
        }
    },

    // Fechar mural
    fechar() {
        this.pararEscuta();
        const modal = document.getElementById('mural-intencoes');
        if (modal) modal.remove();
    }
};

window.MuralIntencoes = MuralIntencoes;
