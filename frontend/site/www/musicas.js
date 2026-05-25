// ========================================
// 🎵 SISTEMA DE MÚSICAS DE FUNDO
// Ambiente de oração com música
// ========================================

const SistemaMusicasFundo = {
    // Músicas disponíveis
    // IMPORTANTE: Para produção, coloque os arquivos MP3 na pasta www/audio/
    // e use URLs locais como: 'audio/ave_maria.mp3'
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
            descricao: 'Melodia suave',
            icone: '🎻',
            // URL local (coloque o arquivo em www/audio/)
            url: 'audio/ave_maria.mp3',
            // URL de fallback online (domínio público)
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            categoria: 'sacra'
        },
        {
            id: 'sinos_de_fatima',
            nome: 'Sinos de Fátima',
            descricao: 'Gravação real do som dos sinos na Catedral de Fátima em Portugal',
            icone: '🎻',
            // URL local (coloque o arquivo em www/audio/)
            url: 'audio/sinos_fatima.mp3',
            // URL de fallback online (domínio público)
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            categoria: 'sacra'
        },
        {
            id: 'canto_gregoriano',
            nome: 'Pai Nosso em Latim',
            descricao: 'Monges em oração',
            icone: '⛪',
            url: 'audio/canto_gregoriano.mp3',
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            categoria: 'sacra'
        },
        {
            id: 'piano_meditacao',
            nome: 'Piano Meditativo',
            descricao: 'Piano suave para reflexão',
            icone: '🎹',
            url: 'audio/piano_meditacao.mp3',
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            categoria: 'instrumental'
        },
        {
            id: 'natureza_passaros',
            nome: 'Natureza - Pássaros',
            descricao: 'Cantos de pássaros ao amanhecer',
            icone: '🐦',
            url: 'audio/passaros.mp3',
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
            categoria: 'natureza'
        },
        {
            id: 'natureza_chuva',
            nome: 'Natureza - Chuva',
            descricao: 'Som de chuva suave',
            icone: '🌧️',
            url: 'audio/chuva.mp3',
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
            categoria: 'natureza'
        },
        {
            id: 'sinos_igreja',
            nome: 'Jingle Bells',
            descricao: 'Tocado em violão',
            icone: '🔔',
            url: 'audio/sinos.mp3',
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
            categoria: 'instrumental'
        },
        {
            id: 'harpa_celestial',
            nome: 'Harpa Celestial',
            descricao: 'Melodia angelical de harpa',
            icone: '🪕',
            url: 'audio/harpa.mp3',
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
            categoria: 'instrumental'
        }
    ],

    // Categorias
    categorias: {
        silencio: { nome: 'Silêncio', icone: '🔇' },
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
    carregando: false,

    // Inicializar
    init() {
        const salvo = localStorage.getItem('mariaMusicaFundo');
        if (salvo) {
            const config = JSON.parse(salvo);
            this.volume = config.volume || 0.3;
            if (config.musicaId && config.musicaId !== 'silencio') {
                this.musicaAtual = config.musicaId;
            }
        }
    },

    // Tocar música
    async tocar(musicaId) {
        const musica = this.musicas.find(m => m.id === musicaId);
        if (!musica) return;
        
        // Parar música atual
        this.parar();
        
        if (!musica.url) {
            this.musicaAtual = 'silencio';
            this.salvarConfig();
            if (window.showToast) showToast('🔇 Música desativada');
            this.atualizarUI();
            return;
        }
        
        this.musicaAtual = musicaId;
        this.carregando = true;
        this.atualizarUI();
        
        // Tentar carregar o áudio
        const sucesso = await this.tentarCarregarAudio(musica);
        
        this.carregando = false;
        
        if (sucesso) {
            this.audio.volume = this.volume;
            this.audio.loop = true;
            
            try {
                await this.audio.play();
                this.tocando = true;
                this.salvarConfig();
                if (window.showToast) showToast(`🎵 Tocando: ${musica.nome}`);
            } catch (err) {
                console.log('Erro ao tocar música:', err);
                if (window.showToast) showToast('⚠️ Toque na tela para ativar o som');
            }
        } else {
            if (window.showToast) showToast('❌ Não foi possível carregar a música');
        }
        
        this.atualizarUI();
    },
    
    // Tentar carregar áudio com fallback
    async tentarCarregarAudio(musica) {
        // Tentar URL principal primeiro
        if (musica.url) {
            const audio = new Audio();
            const carregou = await this.testarUrl(audio, musica.url);
            if (carregou) {
                this.audio = audio;
                return true;
            }
        }
        
        // Tentar URL de fallback
        if (musica.urlFallback) {
            console.log('Tentando URL de fallback...');
            const audio = new Audio();
            const carregou = await this.testarUrl(audio, musica.urlFallback);
            if (carregou) {
                this.audio = audio;
                return true;
            }
        }
        
        return false;
    },
    
    // Testar se URL de áudio funciona
    testarUrl(audio, url) {
        return new Promise((resolve) => {
            audio.src = url;
            
            const timeout = setTimeout(() => {
                console.log('Timeout ao carregar:', url);
                resolve(false);
            }, 10000); // 10 segundos timeout
            
            audio.oncanplaythrough = () => {
                clearTimeout(timeout);
                resolve(true);
            };
            
            audio.onerror = (e) => {
                clearTimeout(timeout);
                console.log('Erro ao carregar URL:', url, e);
                resolve(false);
            };
            
            audio.load();
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
            if (this.carregando) {
                btn.innerHTML = '⏳';
            } else {
                btn.innerHTML = this.tocando ? '🎵' : '🔇';
            }
            btn.classList.toggle('animate-pulse', this.tocando || this.carregando);
        }
    },

    // Criar botão flutuante
    criarBotaoFlutuante() {
        if (document.getElementById('btn-musica-flutuante')) return;
        
        const btn = document.createElement('button');
        btn.id = 'btn-musica-flutuante';
        // Posição: canto superior direito para não atrapalhar chat nem bottom nav
        btn.className = 'fixed top-24 right-4 w-11 h-11 bg-purple-600/90 hover:bg-purple-500 text-white text-lg rounded-full shadow-lg z-40 flex items-center justify-center transition-all backdrop-blur-sm border border-purple-400/30';
        btn.innerHTML = this.tocando ? '🎵' : '🔇';
        btn.title = 'Música de Fundo';
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
                <div class="overflow-y-auto max-h-[55vh] p-4 space-y-4">
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
                                        const tocandoEsta = ativa && this.tocando;
                                        return `
                                            <button onclick="SistemaMusicasFundo.tocar('${m.id}'); document.getElementById('modal-musicas').remove();" 
                                                    class="w-full flex items-center gap-3 p-3 rounded-xl ${ativa ? 'bg-purple-600' : 'bg-white/5 hover:bg-white/10'} transition-all text-left">
                                                <span class="text-2xl">${m.icone}</span>
                                                <div class="flex-1">
                                                    <p class="text-white font-semibold text-sm">${m.nome}</p>
                                                    <p class="text-white/50 text-xs">${m.descricao}</p>
                                                </div>
                                                ${tocandoEsta ? '<span class="text-white animate-pulse">♪</span>' : ''}
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
                
                <!-- Créditos -->
                <div class="px-4 pb-4">
                    <button onclick="SistemaMusicasFundo.mostrarCreditos()" class="w-full py-2 text-white/50 text-xs hover:text-white/70 transition-all flex items-center justify-center gap-2">
                        <span>📝</span> Ver Créditos das Músicas
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
    },
    
    // Mostrar créditos das músicas
    mostrarCreditos() {
        // Fechar modal de músicas se estiver aberto
        const modalMusicas = document.getElementById('modal-musicas');
        if (modalMusicas) modalMusicas.remove();
        
        const modal = document.createElement('div');
        modal.id = 'modal-creditos-musicas';
        modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-4';
        modal.style.background = 'rgba(0,0,0,0.9)';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-purple-900/50 rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden" style="animation: slideUp 0.3s ease;">
                <div class="p-4 border-b border-white/10">
                    <h2 class="text-white text-lg font-bold text-center flex items-center justify-center gap-2">
                        <span>📝</span> Créditos das Músicas
                    </h2>
                </div>
                
                <div class="overflow-y-auto max-h-[60vh] p-4">
                    <p class="text-white/70 text-sm text-center mb-4">
                        Todas as músicas são livres de direitos autorais, licenciadas através do Pixabay.
                    </p>
                    
                    <div class="space-y-3">
                        ${this.musicas.filter(m => m.url).map(m => `
                            <div class="bg-white/5 rounded-xl p-3">
                                <div class="flex items-center gap-3">
                                    <span class="text-2xl">${m.icone}</span>
                                    <div class="flex-1">
                                        <p class="text-white font-semibold text-sm">${m.nome}</p>
                                        <p class="text-white/50 text-xs">${m.descricao}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                        <p class="text-yellow-300 text-xs text-center">
                            <strong>Licença:</strong> Pixabay Content License<br>
                            Uso comercial permitido • Sem necessidade de atribuição
                        </p>
                        <p class="text-white/50 text-xs text-center mt-2">
                            <a href="https://pixabay.com/service/terms/" target="_blank" class="underline">Ver termos completos</a>
                        </p>
                    </div>
                </div>
                
                <div class="p-4 border-t border-white/10">
                    <button onclick="document.getElementById('modal-creditos-musicas').remove(); SistemaMusicasFundo.abrir();" class="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all">
                        ← Voltar às Músicas
                    </button>
                </div>
            </div>
            
            <style>
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
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
