// ========================================
// 🎵 SISTEMA DE MÚSICAS DE FUNDO
// Ambiente de oração com música
// ========================================

const SistemaMusicasFundo = {
    // Músicas disponíveis (URLs de áudio livre de direitos autorais)
    // Na produção, substituir por URLs reais hospedadas
    musicas: [
        {
            id: 'silencio',
            nome: 'Silêncio',
            descricao: 'Sem música',
            icone: '🔇',
            url: null,
            categoria: 'silencio'
        },
        {
            id: 'ave_maria_instrumental',
            nome: 'Ave Maria (Instrumental)',
            descricao: 'Melodia suave de Schubert',
            icone: '🎻',
            // URL de exemplo - substituir por URL real
            url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Franz_Schubert_-_Ave_Maria.ogg',
            categoria: 'classica'
        },
        {
            id: 'canto_gregoriano',
            nome: 'Canto Gregoriano',
            descricao: 'Monges em oração',
            icone: '⛪',
            url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Graduale_Romanum_-_Adoro_te_devote.ogg',
            categoria: 'sacra'
        },
        {
            id: 'piano_meditacao',
            nome: 'Piano Meditativo',
            descricao: 'Piano suave para reflexão',
            icone: '🎹',
            url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Chopin_-_Nocturne_Op._9_No._2.ogg',
            categoria: 'instrumental'
        },
        {
            id: 'natureza_passaros',
            nome: 'Natureza - Pássaros',
            descricao: 'Cantos de pássaros ao amanhecer',
            icone: '🐦',
            url: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Dawn_Chorus_-_Woodland_Birds.ogg',
            categoria: 'natureza'
        },
        {
            id: 'natureza_chuva',
            nome: 'Natureza - Chuva',
            descricao: 'Som de chuva suave',
            icone: '🌧️',
            url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Rain_on_roof.ogg',
            categoria: 'natureza'
        },
        {
            id: 'sinos_igreja',
            nome: 'Sinos de Igreja',
            descricao: 'Sinos distantes chamando à oração',
            icone: '🔔',
            url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Church_bells.ogg',
            categoria: 'sacra'
        },
        {
            id: 'harpa_celestial',
            nome: 'Harpa Celestial',
            descricao: 'Melodia angelical de harpa',
            icone: '🪕',
            url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Harp_glissando.ogg',
            categoria: 'instrumental'
        },
        {
            id: 'oracao_pelo_sinal',
            nome: 'Pelo Sinal da Santa Cruz',
            descricao: 'Voz suave conduzindo a oração',
            icone: '✝️',
            url: 'audio/terco/pelo-sinal.mp3',
            categoria: 'oracoes',
            autor: 'Letícia Klee'
        },
        {
            id: 'oracao_sinal_da_cruz',
            nome: 'Sinal da Cruz',
            descricao: 'Em nome do Pai, do Filho e do Espírito Santo',
            icone: '✝️',
            url: 'audio/terco/sinal-da-cruz.mp3',
            categoria: 'oracoes',
            autor: 'Letícia Klee'
        },
        {
            id: 'oracao_oferecimento',
            nome: 'Oferecimento do Terço',
            descricao: 'Divino Jesus, nós Vos oferecemos este terço',
            icone: '🙏',
            url: 'audio/terco/oferecimento.mp3',
            categoria: 'oracoes',
            autor: 'Letícia Klee'
        },
        {
            id: 'oracao_creio',
            nome: 'Credo Apostólico',
            descricao: 'Creio em Deus Pai Todo-Poderoso',
            icone: '📜',
            url: 'audio/terco/creio.mp3',
            categoria: 'oracoes',
            autor: 'Letícia Klee'
        },
        {
            id: 'oracao_pai_nosso',
            nome: 'Pai Nosso',
            descricao: 'A oração que Jesus nos ensinou',
            icone: '🙏',
            url: 'audio/terco/pai-nosso.mp3',
            categoria: 'oracoes',
            autor: 'Letícia Klee'
        },
        {
            id: 'oracao_ave_maria',
            nome: 'Ave Maria',
            descricao: 'Ave Maria, cheia de graça',
            icone: '🌹',
            url: 'audio/terco/ave-maria.mp3',
            categoria: 'oracoes',
            autor: 'Letícia Klee'
        },
        {
            id: 'oracao_gloria',
            nome: 'Glória ao Pai',
            descricao: 'Glória ao Pai, ao Filho e ao Espírito Santo',
            icone: '✨',
            url: 'audio/terco/gloria.mp3',
            categoria: 'oracoes',
            autor: 'Letícia Klee'
        },
        {
            id: 'oracao_fatima',
            nome: 'Oração de Fátima',
            descricao: 'Ó meu Jesus, perdoai-nos',
            icone: '🌟',
            url: 'audio/terco/fatima.mp3',
            categoria: 'oracoes',
            autor: 'Letícia Klee'
        },
        {
            id: 'oracao_salve_rainha',
            nome: 'Salve Rainha',
            descricao: 'Salve Rainha, Mãe de misericórdia',
            icone: '👑',
            url: 'audio/terco/salve-rainha.mp3',
            categoria: 'oracoes',
            autor: 'Letícia Klee'
        }
    ],

    // Categorias
    categorias: {
        silencio: { nome: 'Silêncio', icone: '🔇' },
        oracoes: { nome: 'Orações do Terço', icone: '🙏' },
        sacra: { nome: 'Música Sacra', icone: '⛪' },
        classica: { nome: 'Clássica', icone: '🎻' },
        instrumental: { nome: 'Instrumental', icone: '🎹' },
        natureza: { nome: 'Sons da Natureza', icone: '🌿' }
    },

    // Estado
    musicaAtual: null,
    audio: null,
    volume: 0.3,
    tocando: false,

    // Inicializar
    init() {
        const salvo = localStorage.getItem('mariaMusicaFundo');
        if (salvo) {
            const config = JSON.parse(salvo);
            this.volume = config.volume || 0.3;
            if (config.musicaId && config.musicaId !== 'silencio') {
                // Não auto-play por políticas de navegador
                this.musicaAtual = config.musicaId;
            }
        }
    },

    // Tocar música
    tocar(musicaId) {
        const musica = this.musicas.find(m => m.id === musicaId);
        if (!musica) return;
        
        // Parar música atual
        this.parar();
        
        if (!musica.url) {
            this.musicaAtual = 'silencio';
            this.salvarConfig();
            if (window.showToast) showToast('🔇 Música desativada');
            return;
        }
        
        this.musicaAtual = musicaId;
        this.audio = new Audio(musica.url);
        this.audio.volume = musica.categoria === 'oracoes' ? Math.max(this.volume, 0.8) : this.volume;
        this.audio.loop = true;

        this.audio.play().then(() => {
            this.tocando = true;
            this.salvarConfig();
            if (window.showToast) showToast(`🎵 Tocando: ${musica.nome}`);
            this.atualizarUI();
        }).catch(err => {
            console.log('Erro ao tocar música:', err);
            if (window.showToast) showToast('⚠️ Toque na tela para ativar o som');
        });
    },

    // Parar música
    parar() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio = null;
        }
        this.tocando = false;
        this.atualizarUI();
    },

    // Toggle play/pause
    toggle() {
        if (!this.audio && this.musicaAtual && this.musicaAtual !== 'silencio') {
            this.tocar(this.musicaAtual);
        } else if (this.audio) {
            if (this.tocando) {
                this.audio.pause();
                this.tocando = false;
            } else {
                this.audio.play();
                this.tocando = true;
            }
            this.atualizarUI();
        }
    },

    // Alterar volume
    setVolume(valor) {
        this.volume = Math.max(0, Math.min(1, valor));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
        this.salvarConfig();
    },

    // Salvar configuração
    salvarConfig() {
        localStorage.setItem('mariaMusicaFundo', JSON.stringify({
            musicaId: this.musicaAtual,
            volume: this.volume
        }));
    },

    // Atualizar UI (botão flutuante)
    atualizarUI() {
        const btn = document.getElementById('btn-musica-flutuante');
        if (btn) {
            btn.innerHTML = this.tocando ? '🎵' : '🔇';
            btn.classList.toggle('animate-pulse', this.tocando);
        }
    },

    // Criar botão flutuante
    criarBotaoFlutuante() {
        if (document.getElementById('btn-musica-flutuante')) return;
        
        const btn = document.createElement('button');
        btn.id = 'btn-musica-flutuante';
        btn.className = 'fixed bottom-32 right-4 w-12 h-12 bg-purple-600 hover:bg-purple-500 text-white text-xl rounded-full shadow-lg z-40 flex items-center justify-center transition-all';
        btn.innerHTML = this.tocando ? '🎵' : '🔇';
        btn.onclick = () => this.abrir();
        
        document.body.appendChild(btn);
    },

    // Abrir seletor de músicas
    abrir() {
        const modal = document.createElement('div');
        modal.id = 'modal-musicas';
        modal.className = 'fixed inset-0 z-[60] flex items-end justify-center';
        modal.style.background = 'rgba(0,0,0,0.7)';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-purple-900/90 backdrop-blur rounded-t-3xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-slide-up">
                <!-- Header -->
                <div class="p-4 border-b border-white/10">
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-white text-lg font-bold flex items-center gap-2">
                            <span>🎵</span>
                            <span>Música de Fundo</span>
                        </h2>
                        <button onclick="document.getElementById('modal-musicas').remove()" class="p-2 bg-white/10 rounded-full">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    
                    <!-- Volume -->
                    <div class="flex items-center gap-3">
                        <span class="text-white/60 text-sm">🔈</span>
                        <input type="range" min="0" max="100" value="${this.volume * 100}" 
                               onchange="SistemaMusicasFundo.setVolume(this.value / 100)"
                               class="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-purple-500">
                        <span class="text-white/60 text-sm">🔊</span>
                    </div>
                </div>
                
                <!-- Lista de músicas -->
                <div class="overflow-y-auto max-h-[60vh] p-4 space-y-4">
                    ${Object.entries(this.categorias).map(([catKey, cat]) => {
                        const musicasCategoria = this.musicas.filter(m => m.categoria === catKey);
                        if (musicasCategoria.length === 0) return '';
                        
                        return `
                            <div>
                                <h3 class="text-white/60 text-xs font-semibold mb-2 flex items-center gap-1">
                                    <span>${cat.icone}</span>
                                    <span>${cat.nome}</span>
                                </h3>
                                <div class="space-y-2">
                                    ${musicasCategoria.map(m => {
                                        const ativa = this.musicaAtual === m.id;
                                        return `
                                            <button onclick="SistemaMusicasFundo.tocar('${m.id}'); document.getElementById('modal-musicas').remove();" 
                                                    class="w-full flex items-center gap-3 p-3 rounded-xl ${ativa ? 'bg-purple-600' : 'bg-white/5 hover:bg-white/10'} transition-all text-left">
                                                <span class="text-2xl">${m.icone}</span>
                                                <div class="flex-1">
                                                    <p class="text-white font-semibold text-sm">${m.nome}</p>
                                                    <p class="text-white/50 text-xs">${m.descricao}</p>
                                                    ${m.autor ? `<p class="text-yellow-400/80 text-[10px] italic mt-0.5">🎙️ Voz: ${m.autor}</p>` : ''}
                                                </div>
                                                ${ativa && this.tocando ? '<span class="text-white animate-pulse">♪</span>' : ''}
                                            </button>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <!-- Controles -->
                <div class="p-4 border-t border-white/10 flex gap-3">
                    <button onclick="SistemaMusicasFundo.toggle()" class="flex-1 py-3 ${this.tocando ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'} text-white font-bold rounded-xl transition-all">
                        ${this.tocando ? '⏸️ Pausar' : '▶️ Tocar'}
                    </button>
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
    }
};

// Inicializar ao carregar
document.addEventListener('DOMContentLoaded', () => {
    SistemaMusicasFundo.init();
    SistemaMusicasFundo.criarBotaoFlutuante();
});

window.SistemaMusicasFundo = SistemaMusicasFundo;
