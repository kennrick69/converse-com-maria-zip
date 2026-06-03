// ========================================
// 🧠 SISTEMA DE MEMÓRIA DE MARIA
// Versão localStorage (simples e estável)
// ========================================

const MemoriaMaria = {
    // Chave do localStorage
    STORAGE_KEY: 'maria_memoria',
    MAX_MEMORIAS: 5,
    
    // Estado atual
    memoriaAtual: null,
    usandoMemoria: false,
    jaSalvouNessaSessao: false,
    
    // ========================================
    // FUNÇÃO DE TESTE (chamar no console)
    // ========================================
    teste() {
        console.log('🧪 === TESTE DE MEMÓRIA ===');
        console.log('📦 STORAGE_KEY:', this.STORAGE_KEY);
        const memorias = this.carregarMemorias();
        console.log('📚 Memórias salvas:', memorias.length);
        memorias.forEach((m, i) => {
            console.log(`  ${i+1}. ${m.tema} (${m.sentimento}) - ${m.data}`);
        });
        const recente = this.obterMemoriaRecente();
        console.log('🕐 Memória mais recente:', recente);
        console.log('🎯 usandoMemoria:', this.usandoMemoria);
        console.log('🎯 memoriaAtual:', this.memoriaAtual);
        console.log('🎯 jaSalvouNessaSessao:', this.jaSalvouNessaSessao);
        return memorias;
    },
    
    // Salvar memória de teste
    testesSalvar() {
        const memoriaFake = {
            tema: 'Teste de memória',
            sentimento: 'neutro',
            resumo: 'Esta é uma memória de teste criada manualmente',
            pedidoOracao: null
        };
        this.adicionarMemoria(memoriaFake);
        console.log('✅ Memória de teste salva! Reabra o app e clique no input.');
    },
    
    // ========================================
    // OPERAÇÕES DE MEMÓRIA (localStorage)
    // ========================================
    
    // Carregar todas as memórias
    carregarMemorias() {
        try {
            const dados = localStorage.getItem(this.STORAGE_KEY);
            return dados ? JSON.parse(dados) : [];
        } catch (e) {
            console.error('Erro ao carregar memórias:', e);
            return [];
        }
    },
    
    // Salvar memórias
    salvarMemorias(memorias) {
        try {
            // Manter apenas as últimas MAX_MEMORIAS
            const recentes = memorias.slice(-this.MAX_MEMORIAS);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentes));
            return true;
        } catch (e) {
            console.error('Erro ao salvar memórias:', e);
            return false;
        }
    },
    
    // Adicionar nova memória
    adicionarMemoria(resumo) {
        if (!resumo || !resumo.tema) return false;
        
        const memorias = this.carregarMemorias();
        
        const novaMemoria = {
            id: Date.now().toString(),
            data: new Date().toISOString(),
            tema: resumo.tema || 'Conversa com Maria',
            sentimento: resumo.sentimento || 'neutro',
            resumo: resumo.resumo || '',
            pedidoOracao: resumo.pedidoOracao || null
        };
        
        memorias.push(novaMemoria);
        this.salvarMemorias(memorias);
        
        console.log('💾 Memória salva:', novaMemoria.tema);
        return true;
    },
    
    // Obter memória mais recente
    obterMemoriaRecente() {
        const memorias = this.carregarMemorias();
        if (memorias.length === 0) return null;
        
        const memoria = memorias[memorias.length - 1];
        
        // Calcular dias passados
        const dataMemoria = new Date(memoria.data);
        const hoje = new Date();
        const diffMs = hoje - dataMemoria;
        memoria.diasPassados = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        return memoria;
    },
    
    // Apagar memória específica
    apagarMemoria(memoriaId) {
        const memorias = this.carregarMemorias();
        const novas = memorias.filter(m => m.id !== memoriaId);
        this.salvarMemorias(novas);
        console.log('🗑️ Memória apagada');
        return true;
    },
    
    // Apagar todas as memórias
    apagarTodas() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.memoriaAtual = null;
        console.log('🗑️ Todas as memórias apagadas');
        return true;
    },
    
    // ========================================
    // GERAR RESUMO (via API ou fallback local)
    // ========================================
    
    async gerarResumo(historico) {
        console.log('🧠 Tentando gerar resumo, histórico:', historico?.length || 0, 'mensagens');
        
        try {
            if (!historico || historico.length < 4) {
                console.log('⚠️ Histórico curto, não gera resumo');
                return null;
            }
            
            // Pegar TODAS as mensagens do usuário (exceto saudações curtas)
            const mensagensUsuario = historico
                .filter(m => m.role === 'user')
                .map(m => m.content)
                .filter(msg => msg.length > 5); // Ignorar "oi", "olá", etc
            
            console.log('🧠 Mensagens do usuário:', mensagensUsuario.length);
            
            // Tentar API primeiro (ela analisa tudo e gera tema inteligente)
            try {
                const response = await fetch(`${API_URL}/api/gerar-resumo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ historico })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Resumo gerado via API:', data.resumo?.tema);
                    return data.resumo;
                }
            } catch (apiError) {
                console.log('⚠️ API falhou, usando fallback local:', apiError.message);
            }
            
            // Fallback: gerar resumo analisando TODA a conversa
            const resumoLocal = this.gerarResumoLocal(mensagensUsuario);
            console.log('💾 Resumo local gerado:', resumoLocal.tema);
            return resumoLocal;
            
        } catch (error) {
            console.error('❌ Erro ao gerar resumo:', error);
            return null;
        }
    },
    
    // Gerar resumo localmente analisando todas as mensagens
    gerarResumoLocal(mensagensUsuario) {
        // Juntar todas as mensagens significativas
        const textoCompleto = mensagensUsuario.join(' ').toLowerCase();
        
        // Detectar tema principal por palavras-chave
        const temas = [
            { palavras: ['filho', 'filha', 'filhos', 'filhas', 'criança', 'crianças', 'bebê', 'neto', 'neta'], tema: 'seus filhos', emoji: '👶' },
            { palavras: ['marido', 'esposo', 'esposa', 'casamento', 'casado', 'casada', 'matrimônio'], tema: 'seu casamento', emoji: '💒' },
            { palavras: ['namorado', 'namorada', 'namoro', 'relacionamento', 'amor'], tema: 'seu relacionamento', emoji: '💑' },
            { palavras: ['trabalho', 'emprego', 'chefe', 'empresa', 'profissão', 'carreira', 'demitido', 'desemprego'], tema: 'seu trabalho', emoji: '💼' },
            { palavras: ['dinheiro', 'financeiro', 'dívida', 'conta', 'pagar', 'salário', 'renda'], tema: 'suas finanças', emoji: '💰' },
            { palavras: ['saúde', 'doente', 'doença', 'médico', 'hospital', 'exame', 'tratamento', 'cirurgia', 'dor'], tema: 'sua saúde', emoji: '🏥' },
            { palavras: ['mãe', 'pai', 'pais', 'família', 'irmão', 'irmã', 'parente'], tema: 'sua família', emoji: '👨‍👩‍👧' },
            { palavras: ['ansiedade', 'ansioso', 'ansiosa', 'nervoso', 'nervosa', 'preocupado', 'preocupada', 'medo', 'angústia'], tema: 'suas preocupações', emoji: '😰' },
            { palavras: ['triste', 'tristeza', 'deprimido', 'deprimida', 'chorar', 'chorando', 'sozinho', 'sozinha', 'solidão'], tema: 'um momento difícil', emoji: '😢' },
            { palavras: ['fé', 'deus', 'jesus', 'oração', 'rezar', 'igreja', 'missa', 'confessar', 'pecado'], tema: 'sua fé', emoji: '🙏' },
            { palavras: ['gratidão', 'agradecer', 'feliz', 'felicidade', 'bênção', 'graça', 'milagre'], tema: 'suas graças', emoji: '🙏' },
            { palavras: ['decisão', 'decidir', 'escolha', 'escolher', 'caminho', 'futuro', 'plano'], tema: 'uma decisão importante', emoji: '🤔' },
            { palavras: ['perdão', 'perdoar', 'culpa', 'arrependido', 'arrependida', 'errei', 'erro'], tema: 'perdão e reconciliação', emoji: '💛' },
            { palavras: ['luto', 'morte', 'morreu', 'faleceu', 'perdi', 'saudade'], tema: 'uma perda', emoji: '🕊️' },
            { palavras: ['estudo', 'escola', 'faculdade', 'prova', 'vestibular', 'concurso'], tema: 'seus estudos', emoji: '📚' }
        ];
        
        // Encontrar tema que mais combina
        let temaEncontrado = null;
        let maiorMatch = 0;
        
        for (const t of temas) {
            const matches = t.palavras.filter(p => textoCompleto.includes(p)).length;
            if (matches > maiorMatch) {
                maiorMatch = matches;
                temaEncontrado = t;
            }
        }
        
        // Detectar sentimento
        let sentimento = 'neutro';
        if (textoCompleto.match(/triste|chorar|difícil|problema|preocup|ansio|medo|angúst|sofr/)) {
            sentimento = 'preocupado';
        } else if (textoCompleto.match(/feliz|alegr|gratidão|agradeç|bom|ótimo|maravilh|bênção/)) {
            sentimento = 'grato';
        }
        
        // Gerar tema final
        let tema, resumo;
        if (temaEncontrado && maiorMatch >= 1) {
            tema = temaEncontrado.tema;
            resumo = `Você compartilhou sobre ${temaEncontrado.tema}`;
        } else {
            // Pegar a mensagem mais longa como referência (provavelmente a mais significativa)
            const msgMaisLonga = mensagensUsuario.sort((a, b) => b.length - a.length)[0] || '';
            tema = msgMaisLonga.substring(0, 50) + (msgMaisLonga.length > 50 ? '...' : '');
            resumo = 'Você compartilhou algo importante';
        }
        
        // Detectar pedido de oração
        let pedidoOracao = null;
        if (textoCompleto.match(/reza|ora|peço|intercede|ajuda/)) {
            pedidoOracao = 'Pediu orações';
        }
        
        return {
            tema,
            sentimento,
            resumo,
            pedidoOracao
        };
    },
    
    // Modal para escolher continuar conversa ou nova
    mostrarModalContinuar(tema, diasPassados, sentimento, onContinuar, onNova, onEsquecer) {
        const existente = document.getElementById('modal-memoria');
        if (existente) existente.remove();
        
        // Formatar sentimento
        let sentimentoTexto = 'conversando sobre';
        if (sentimento === 'preocupado' || sentimento === 'ansioso' || sentimento === 'triste') {
            sentimentoTexto = 'preocupado(a) com';
        } else if (sentimento === 'feliz' || sentimento === 'grato') {
            sentimentoTexto = 'feliz com';
        }

        // JOs 2026-06-03: quando o extrator de tema cai no fallback genérico
        // ('sua conversa anterior'), a frase ficava redundante e sem sentido:
        // "conversando sobre sua conversa anterior". Detectamos esse caso e
        // usamos uma frase neutra que faz sentido sem precisar do tema.
        const temaEhFallback = !tema || /^sua conversa anterior$/i.test(String(tema).trim());
        const fraseMemoria = temaEhFallback
            ? `Vamos retomar nossa conversa de onde paramos?`
            : `Em nossa última conversa, você estava ${sentimentoTexto} <strong class="text-yellow-400">${tema}</strong>.`;
        
        const modal = document.createElement('div');
        modal.id = 'modal-memoria';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.style.cssText = 'background: rgba(0,0,0,0.9);';
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-purple-500/30" style="animation: scaleIn 0.3s ease-out;">
                <div class="text-center mb-5">
                    <div class="text-4xl mb-3">💭</div>
                    <h3 class="text-xl font-bold text-white">Maria lembra de você!</h3>
                </div>
                
                <div class="bg-black/30 rounded-xl p-4 mb-5">
                    <p class="text-white/90 text-center leading-relaxed">
                        ${fraseMemoria}
                    </p>
                </div>
                
                <div class="space-y-3">
                    <button id="btn-continuar-conversa" class="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                        <span>💬</span> Quero continuar esse assunto
                    </button>
                    
                    <button id="btn-nova-conversa" class="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/20">
                        <span>✨</span> Começar conversa nova
                    </button>
                    
                    <button id="btn-esquecer" class="w-full py-3 bg-transparent hover:bg-red-500/10 text-red-400/70 hover:text-red-400 font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                        <span>🗑️</span> Esquecer isso (apagar)
                    </button>
                </div>
            </div>
            
            <style>
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(modal);
        
        // Eventos
        document.getElementById('btn-continuar-conversa').onclick = () => {
            modal.remove();
            if (onContinuar) onContinuar();
        };
        
        document.getElementById('btn-nova-conversa').onclick = () => {
            modal.remove();
            if (onNova) onNova();
        };
        
        document.getElementById('btn-esquecer').onclick = () => {
            modal.remove();
            if (onEsquecer) onEsquecer();
        };
    },
    
    // ========================================
    // INTERFACE - MODAIS
    // ========================================
    
    // Verificar e mostrar modal ao abrir chat
    async verificarEMostrar(onContinuar, onNova) {
        console.log('🧠 verificarEMostrar chamado');
        const memoria = this.obterMemoriaRecente();
        console.log('🧠 Memória encontrada:', memoria);
        
        // Só mostrar se tiver memória recente (menos de 30 dias)
        if (!memoria || memoria.diasPassados > 30) {
            console.log('🧠 Sem memória válida para mostrar');
            return false;
        }
        
        console.log('🧠 Mostrando modal de memória...');
        this.mostrarModal(memoria, onContinuar, onNova);
        return true;
    },
    
    // Modal de escolha
    mostrarModal(memoria, onContinuar, onNova) {
        const existente = document.getElementById('modal-memoria');
        if (existente) existente.remove();
        
        // Formatar tempo
        let tempoTexto = 'hoje';
        if (memoria.diasPassados === 1) tempoTexto = 'ontem';
        else if (memoria.diasPassados > 1) tempoTexto = `há ${memoria.diasPassados} dias`;
        
        // Emoji do sentimento
        const emojis = {
            'feliz': '😊', 'grato': '🙏', 'positivo': '😊',
            'triste': '😢', 'ansioso': '😰', 'preocupado': '😟',
            'negativo': '😢', 'neutro': '💭'
        };
        const emoji = emojis[memoria.sentimento?.toLowerCase()] || '💭';
        
        const modal = document.createElement('div');
        modal.id = 'modal-memoria';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.style.cssText = 'background: rgba(0,0,0,0.9);';
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-purple-500/30" style="animation: scaleIn 0.3s ease-out;">
                <div class="text-center mb-4">
                    <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                        <span class="text-3xl">🧠</span>
                    </div>
                    <h3 class="text-xl font-bold text-white">Maria lembra de você!</h3>
                    <p class="text-white/60 text-sm">${tempoTexto}</p>
                </div>
                
                <div class="bg-black/30 rounded-xl p-4 mb-4">
                    <div class="flex items-start gap-3">
                        <span class="text-2xl">${emoji}</span>
                        <div class="flex-1">
                            <p class="text-yellow-400 font-semibold text-sm mb-1">${memoria.tema}</p>
                            <p class="text-white/80 text-sm leading-relaxed">${memoria.resumo || 'Você compartilhou algo importante...'}</p>
                            ${memoria.pedidoOracao ? `<p class="text-purple-300 text-xs mt-2 italic">🙏 "${memoria.pedidoOracao}"</p>` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="space-y-2">
                    <button id="btn-memoria-continuar" class="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                        <span>💬</span> Continuar esse assunto
                    </button>
                    
                    <button id="btn-memoria-nova" class="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                        <span>✨</span> Começar conversa nova
                    </button>
                    
                    <button id="btn-memoria-esquecer" class="w-full py-2 text-white/50 hover:text-red-400 text-sm transition-all flex items-center justify-center gap-2">
                        <span>🗑️</span> Esquecer isso
                    </button>
                </div>
            </div>
            
            <style>
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(modal);
        
        // Eventos
        document.getElementById('btn-memoria-continuar').onclick = () => {
            this.memoriaAtual = memoria;
            this.usandoMemoria = true;
            modal.remove();
            if (onContinuar) onContinuar(memoria);
        };
        
        document.getElementById('btn-memoria-nova').onclick = () => {
            this.memoriaAtual = null;
            this.usandoMemoria = false;
            modal.remove();
            if (onNova) onNova();
        };
        
        document.getElementById('btn-memoria-esquecer').onclick = () => {
            if (confirm('Maria vai esquecer esta conversa. Tem certeza?')) {
                this.apagarMemoria(memoria.id);
                this.memoriaAtual = null;
                this.usandoMemoria = false;
                modal.remove();
                showToast('💭 Maria esqueceu esta conversa');
                if (onNova) onNova();
            }
        };
    },
    
    // Modal para salvar memória - REMOVIDO (salva automático agora)
    
    // Salvar memória automaticamente (sem perguntar)
    async salvarAutomatico(historico) {
        if (!historico || historico.length < 4) {
            console.log('⚠️ Conversa curta, não salva memória');
            return;
        }
        
        // Evitar salvar duplicado na mesma sessão
        if (this.jaSalvouNessaSessao) {
            console.log('⚠️ Já salvou memória nesta sessão');
            return;
        }
        
        console.log('💭 Salvando memória automaticamente...');
        const resumo = await this.gerarResumo(historico);
        
        if (resumo) {
            this.adicionarMemoria(resumo);
            this.jaSalvouNessaSessao = true;
            console.log('💛 Memória salva automaticamente!');
        }
    },
    
    // Flag para evitar salvar duplicado
    jaSalvouNessaSessao: false,
    
    // Resetar flag (chamar quando abre nova conversa)
    novaSessao() {
        this.jaSalvouNessaSessao = false;
    },
    
    // Limpar estado
    reset() {
        this.memoriaAtual = null;
        this.usandoMemoria = false;
        this.jaSalvouNessaSessao = false;
    }
};

window.MemoriaMaria = MemoriaMaria;
