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
            categoria: 'silencio',
            autor: null
        },
        {
            id: 'ave_maria_instrumental',
            nome: 'Ave Maria (Instrumental)',
            descricao: 'Melodia suave',
            icone: '🎻',
            url: 'audio/ave_maria.mp3',
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            categoria: 'sacra',
            autor: 'thenonvisibles',
            autorUrl: 'https://pixabay.com/users/thenonvisibles-44907842/',
            licencaCompleta: `PIXABAY LICENSE CERTIFICATE
==============================================

Audio File Title: Ave Maria (Instrumental)
Audio File URL: https://pixabay.com/music/religious-theme-ave-maria-instrumental-224083/
Audio File ID: 224083

Licensor's Username:
https://pixabay.com/users/thenonvisibles-44907842/

This document confirms the download of an audio file pursuant to the Content License as defined in the Pixabay Terms of Service available at https://pixabay.com/service/terms/

Pixabay, a Canva Germany GmbH brand
Pappelallee 78/79, 10437 Berlin, Germany`
        },
        {
            id: 'sinos_de_fatima',
            nome: 'Sinos de Fátima',
            descricao: 'Gravação real do som dos sinos na Catedral de Fátima em Portugal',
            icone: '🎻',
            url: 'audio/sinos_fatima.mp3',
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            categoria: 'sacra',
            autor: 'Antônio Garrido',
            autorUrl: 'https://www.instagram.com/ajtgarrido/'
        },
        {
            id: 'canto_gregoriano',
            nome: 'Pai Nosso Gregoriano',
            descricao: 'Canto Gregoriano em Espanhol',
            icone: '⛪',
            url: 'audio/canto_gregoriano.mp3',
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            categoria: 'sacra',
            autor: 'nickpanek',
            autorUrl: 'https://pixabay.com/users/nickpanek-38266323/',
            licencaCompleta: `PIXABAY LICENSE CERTIFICATE
==============================================

Audio File Title: Spanish Our Father Gregorian Chant
Audio File URL: https://pixabay.com/music/choir-spanish-our-father-gregorian-chant-228748/
Audio File ID: 228748

Licensor's Username:
https://pixabay.com/users/nickpanek-38266323/

This document confirms the download of an audio file pursuant to the Content License as defined in the Pixabay Terms of Service available at https://pixabay.com/service/terms/

Pixabay, a Canva Germany GmbH brand
Pappelallee 78/79, 10437 Berlin, Germany`
        },
        {
            id: 'piano_meditacao',
            nome: 'Piano Meditativo',
            descricao: 'Piano suave para reflexão',
            icone: '🎹',
            url: 'audio/piano_meditacao.mp3',
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            categoria: 'instrumental',
            autor: 'antonio jade',
            autorUrl: 'https://pixabay.com/users/fasttech123-47311951/'
        },
        {
            id: 'natureza_passaros',
            nome: 'Natureza - Pássaros',
            descricao: 'Cantos de pássaros ao amanhecer',
            icone: '🐦',
            url: 'audio/passaros.mp3',
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
            categoria: 'natureza',
            autor: 'Shiden Beats Music',
            autorUrl: 'https://pixabay.com/users/shidenbeatsmusic-25676252/'
        },
        {
            id: 'natureza_chuva',
            nome: 'Natureza - Chuva',
            descricao: 'Som de chuva suave',
            icone: '🌧️',
            url: 'audio/chuva.mp3',
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
            categoria: 'natureza',
            autor: 'LAURENT BUCZEK',
            autorUrl: 'https://pixabay.com/users/lorenzobuczek-16982400/'
        },
        {
            id: 'sinos_igreja',
            nome: 'Jingle Bells',
            descricao: 'Tocado em violão',
            icone: '🔔',
            url: 'audio/sinos.mp3',
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
            categoria: 'instrumental',
            autor: 'music_for_video',
            autorUrl: 'https://pixabay.com/users/music_for_video-22579021/'
        },
        {
            id: 'harpa_celestial',
            nome: 'Harpa Celestial',
            descricao: 'Melodia angelical de harpa',
            icone: '🪕',
            url: 'audio/harpa.mp3',
            urlFallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
            categoria: 'instrumental',
            autor: 'MountainDweller',
            autorUrl: 'https://pixabay.com/users/mountaindweller-16471232/'
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

    // Pool com músicas administradas pelo painel (Firestore: conteudo_musicas)
    // Concatenadas às hardcoded. Estrutura esperada no Firestore:
    //   titulo, artista, urlAudio, duracao (esses campos do painel-admin.html)
    // Convertidos pra formato local {id, nome, descricao, icone, url, ...}
    _musicasFirestore: [],

    async _loadMusicasFromFirestore() {
        // Cache 24h
        try {
            const raw = localStorage.getItem('maria_musicas_pool');
            if (raw) {
                const cache = JSON.parse(raw);
                if (cache && cache.timestamp && (Date.now() - cache.timestamp < 24 * 60 * 60 * 1000)) {
                    this._musicasFirestore = cache.lista || [];
                    this._mergeFirestoreMusicas();
                    return;
                }
            }
        } catch (e) {}

        if (!window.firebase || !firebase.firestore) return;
        try {
            const snap = await firebase.firestore().collection('conteudo_musicas').get();
            const lista = [];
            snap.forEach(doc => {
                const d = doc.data();
                if (!d.titulo || !d.urlAudio) return; // ignora docs incompletos
                lista.push({
                    id: 'fs_' + doc.id,
                    nome: d.titulo,
                    descricao: d.artista ? ('Por ' + d.artista) : '',
                    icone: '🎵',
                    url: d.urlAudio,
                    urlFallback: null,
                    categoria: d.categoria || 'sacra',
                    autor: d.artista || '',
                    autorUrl: d.autorUrl || '',
                    duracao: d.duracao || null,
                    _fromFirestore: true
                });
            });
            this._musicasFirestore = lista;
            localStorage.setItem('maria_musicas_pool', JSON.stringify({ timestamp: Date.now(), lista }));
            console.log('🎵 Músicas do painel carregadas:', lista.length);
            this._mergeFirestoreMusicas();
        } catch (e) {
            console.warn('🎵 Falha lendo conteudo_musicas:', e.message);
        }
    },

    // Mescla músicas do Firestore com as hardcoded (sem duplicar nomes)
    _mergeFirestoreMusicas() {
        if (!this._musicasFirestore || this._musicasFirestore.length === 0) return;
        // Remove qualquer entrada anterior do Firestore (idempotente)
        this.musicas = this.musicas.filter(m => !m._fromFirestore);
        // Adiciona logo após "Silêncio" pra dar destaque às curadas pelo JOs
        const idxSilencio = this.musicas.findIndex(m => m.id === 'silencio');
        const insertAt = idxSilencio >= 0 ? idxSilencio + 1 : 0;
        this.musicas.splice(insertAt, 0, ...this._musicasFirestore);
    },

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

        // Injetar CSS da animação
        this.injetarCSS();

        // Carrega músicas do painel admin em background (não bloqueia init)
        this._loadMusicasFromFirestore().catch(e => console.warn('Músicas FS falhou:', e.message));
    },
    
    // Injetar CSS necessário
    injetarCSS() {
        if (document.getElementById('musica-css')) return;
        
        const style = document.createElement('style');
        style.id = 'musica-css';
        style.textContent = `
            @keyframes musicPulse {
                0%, 100% { box-shadow: 0 4px 15px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3); }
                50% { box-shadow: 0 4px 25px rgba(255, 165, 0, 0.7), 0 0 35px rgba(255, 215, 0, 0.5); }
            }
            
            #btn-musica-flutuante {
                transition: all 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
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
            this.atualizarBotaoModal(); // Atualiza o botão no modal também
        }
    },
    
    // Atualizar botão play/pause dentro do modal
    atualizarBotaoModal() {
        const btnToggle = document.querySelector('#modal-musicas button[onclick="SistemaMusicasFundo.toggle()"]');
        if (btnToggle) {
            btnToggle.style.background = this.tocando ? '#dc2626' : '#16a34a';
            btnToggle.innerHTML = this.tocando ? '⏸️ Pausar' : '▶️ Tocar';
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
                btn.innerHTML = this.getIconeCarregando();
            } else {
                btn.innerHTML = this.getIconeSVG();
            }
            
            // Efeito visual quando tocando
            if (this.tocando) {
                btn.style.background = 'linear-gradient(145deg, #FFD700, #FFA500)';
                btn.style.animation = 'musicPulse 1.5s ease-in-out infinite';
            } else {
                btn.style.background = 'linear-gradient(145deg, #E8D5B7, #D4B896)';
                btn.style.animation = 'none';
            }
        }
    },
    
    // Ícone de carregando
    getIconeCarregando() {
        return `<svg width="28" height="28" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="20" stroke="#B8860B" stroke-width="4" fill="none" opacity="0.3"/>
            <path d="M32 12 A20 20 0 0 1 52 32" stroke="#B8860B" stroke-width="4" fill="none" stroke-linecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="1s" repeatCount="indefinite"/>
            </path>
        </svg>`;
    },

    // Criar botão flutuante
    criarBotaoFlutuante() {
        if (document.getElementById('btn-musica-flutuante')) return;
        
        const btn = document.createElement('button');
        btn.id = 'btn-musica-flutuante';
        // Posição: canto superior direito, abaixo do header para não cobrir o foguinho
        btn.style.cssText = `
            position: fixed !important;
            top: 145px !important;
            right: 16px !important;
            width: 44px !important;
            height: 44px !important;
            border-radius: 50% !important;
            background: linear-gradient(145deg, #E8D5B7, #D4B896) !important;
            border: 2px solid #B8860B !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
            padding: 0 !important;
            z-index: 50 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        `;
        btn.innerHTML = this.getIconeSVG();
        btn.title = 'Música de Fundo';
        btn.onclick = () => this.abrir();
        
        // Hover effect
        btn.onmouseenter = () => {
            btn.style.transform = 'scale(1.1)';
            btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
        };
        btn.onmouseleave = () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        };
        
        document.body.appendChild(btn);
    },
    
    // Ícone SVG colorido para o botão de música
    getIconeSVG() {
        if (this.tocando) {
            // Ícone tocando - notas musicais animadas
            return `<svg width="28" height="28" viewBox="0 0 64 64" fill="none">
                <defs>
                    <linearGradient id="mNote" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#8B4513"/>
                        <stop offset="100%" style="stop-color:#5D3A1A"/>
                    </linearGradient>
                    <linearGradient id="mHeart" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FF69B4"/>
                        <stop offset="100%" style="stop-color:#FF1493"/>
                    </linearGradient>
                    <linearGradient id="mWave" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFD700"/>
                        <stop offset="100%" style="stop-color:#FFA500"/>
                    </linearGradient>
                </defs>
                <!-- Ondas sonoras animadas -->
                <path d="M10 28 Q14 32 10 36" stroke="url(#mWave)" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1s" repeatCount="indefinite"/>
                </path>
                <path d="M54 28 Q50 32 54 36" stroke="url(#mWave)" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1s" repeatCount="indefinite"/>
                </path>
                <!-- Notas musicais -->
                <rect x="22" y="20" width="4" height="22" rx="2" fill="url(#mNote)"/>
                <rect x="38" y="24" width="4" height="18" rx="2" fill="url(#mNote)"/>
                <path d="M24 20 Q31 16 40 24" stroke="url(#mNote)" stroke-width="4" stroke-linecap="round" fill="none"/>
                <ellipse cx="20" cy="44" rx="6" ry="4" fill="url(#mNote)" transform="rotate(-20 20 44)"/>
                <ellipse cx="36" cy="44" rx="6" ry="4" fill="url(#mNote)" transform="rotate(-20 36 44)"/>
                <!-- Coração -->
                <path d="M48 12 Q48 8 51 8 Q53 8 53 11 Q53 8 55 8 Q58 8 58 12 Q58 16 53 20 Q48 16 48 12Z" fill="url(#mHeart)">
                    <animate attributeName="transform" values="scale(1);scale(1.1);scale(1)" dur="0.8s" repeatCount="indefinite" additive="sum"/>
                </path>
                <!-- Brilhos -->
                <circle cx="14" cy="16" r="2" fill="#FFD700" opacity="0.9"/>
                <circle cx="50" cy="48" r="1.5" fill="#FFD700" opacity="0.8"/>
            </svg>`;
        } else {
            // Ícone silêncio - mais suave
            return `<svg width="28" height="28" viewBox="0 0 64 64" fill="none">
                <defs>
                    <linearGradient id="mNoteOff" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#A08060"/>
                        <stop offset="100%" style="stop-color:#806040"/>
                    </linearGradient>
                </defs>
                <!-- Notas musicais (mais opacas) -->
                <rect x="22" y="20" width="4" height="22" rx="2" fill="url(#mNoteOff)" opacity="0.6"/>
                <rect x="38" y="24" width="4" height="18" rx="2" fill="url(#mNoteOff)" opacity="0.6"/>
                <path d="M24 20 Q31 16 40 24" stroke="url(#mNoteOff)" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.6"/>
                <ellipse cx="20" cy="44" rx="6" ry="4" fill="url(#mNoteOff)" opacity="0.6" transform="rotate(-20 20 44)"/>
                <ellipse cx="36" cy="44" rx="6" ry="4" fill="url(#mNoteOff)" opacity="0.6" transform="rotate(-20 36 44)"/>
                <!-- Linha de "mudo" -->
                <line x1="12" y1="52" x2="52" y2="12" stroke="#B8860B" stroke-width="4" stroke-linecap="round"/>
            </svg>`;
        }
    },

    // Abrir seletor de músicas
    abrir() {
        const modal = document.createElement('div');
        modal.id = 'modal-musicas';
        // Usando estilos inline para garantir posicionamento correto
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0,0,0,0.7) !important;
            z-index: 9999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 20px !important;
        `;
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(to bottom right, #1f2937, rgba(88, 28, 135, 0.9));
                backdrop-filter: blur(10px);
                border-radius: 24px;
                width: 100%;
                max-width: 400px;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                animation: slideUp 0.3s ease;
            ">
                <!-- Header -->
                <div style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                        <h2 style="color: white; font-size: 18px; font-weight: bold; display: flex; align-items: center; gap: 8px; margin: 0;">
                            <span>🎵</span>
                            <span>Música de Fundo</span>
                        </h2>
                        <button onclick="document.getElementById('modal-musicas').remove()" style="padding: 8px; background: rgba(255,255,255,0.1); border-radius: 50%; border: none; cursor: pointer;">
                            <svg style="width: 20px; height: 20px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    
                    <!-- Volume -->
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="color: rgba(255,255,255,0.6); font-size: 14px;">🔈</span>
                        <input type="range" min="0" max="100" value="${this.volume * 100}" 
                               onchange="SistemaMusicasFundo.setVolume(this.value / 100)"
                               style="flex: 1; height: 8px; background: rgba(255,255,255,0.2); border-radius: 9999px; cursor: pointer;">
                        <span style="color: rgba(255,255,255,0.6); font-size: 14px;">🔊</span>
                    </div>
                </div>
                
                <!-- Lista de músicas -->
                <div style="overflow-y: auto; flex: 1; padding: 16px;">
                    ${Object.entries(this.categorias).map(([catKey, cat]) => {
                        const musicasCategoria = this.musicas.filter(m => m.categoria === catKey);
                        if (musicasCategoria.length === 0) return '';
                        
                        return `
                            <div style="margin-bottom: 16px;">
                                <h3 style="color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;">
                                    <span>${cat.icone}</span>
                                    <span>${cat.nome}</span>
                                </h3>
                                <div style="display: flex; flex-direction: column; gap: 8px;">
                                    ${musicasCategoria.map(m => {
                                        const ativa = this.musicaAtual === m.id;
                                        const tocandoEsta = ativa && this.tocando;
                                        return `
                                            <button onclick="SistemaMusicasFundo.tocar('${m.id}'); document.getElementById('modal-musicas').remove();" 
                                                    style="
                                                        width: 100%;
                                                        display: flex;
                                                        align-items: center;
                                                        gap: 12px;
                                                        padding: 12px;
                                                        border-radius: 12px;
                                                        background: ${ativa ? '#7c3aed' : 'rgba(255,255,255,0.05)'};
                                                        border: none;
                                                        cursor: pointer;
                                                        text-align: left;
                                                        transition: all 0.2s;
                                                    ">
                                                <span style="font-size: 24px;">${m.icone}</span>
                                                <div style="flex: 1;">
                                                    <p style="color: white; font-weight: 600; font-size: 14px; margin: 0;">${m.nome}</p>
                                                    <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">${m.descricao}</p>
                                                </div>
                                                ${tocandoEsta ? '<span style="color: white;">♪</span>' : ''}
                                            </button>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <!-- Controles -->
                <div style="padding: 16px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 12px; flex-shrink: 0;">
                    <button onclick="SistemaMusicasFundo.toggle()" style="
                        flex: 1;
                        padding: 12px;
                        background: ${this.tocando ? '#dc2626' : '#16a34a'};
                        color: white;
                        font-weight: bold;
                        border-radius: 12px;
                        border: none;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">
                        ${this.tocando ? '⏸️ Pausar' : '▶️ Tocar'}
                    </button>
                </div>
                
                <!-- Créditos -->
                <div style="padding: 0 16px 16px; flex-shrink: 0;">
                    <button onclick="SistemaMusicasFundo.mostrarCreditos()" style="
                        width: 100%;
                        padding: 8px;
                        background: transparent;
                        color: rgba(255,255,255,0.5);
                        font-size: 12px;
                        border: none;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                    ">
                        <span>📝</span> Ver Créditos das Músicas
                    </button>
                </div>
            </div>
            
            <style>
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
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
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0,0,0,0.9) !important;
            z-index: 10000 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 16px !important;
        `;
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(to bottom right, #1f2937, rgba(88, 28, 135, 0.5));
                border-radius: 16px;
                width: 100%;
                max-width: 400px;
                max-height: 85vh;
                overflow: hidden;
                animation: slideUp 0.3s ease;
            ">
                <div style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <h2 style="color: white; font-size: 18px; font-weight: bold; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <span>📝</span> Créditos das Músicas
                    </h2>
                </div>
                
                <div style="overflow-y: auto; max-height: 60vh; padding: 16px;">
                    <p style="color: rgba(255,255,255,0.7); font-size: 14px; text-align: center; margin-bottom: 16px;">
                        Todas as músicas são livres de direitos autorais, licenciadas através do Pixabay.
                    </p>
                    
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        ${this.musicas.filter(m => m.url && m.autor).map(m => `
                            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 12px;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="font-size: 24px;">${m.icone}</span>
                                    <div style="flex: 1;">
                                        <p style="color: white; font-weight: 600; font-size: 14px; margin: 0;">${m.nome}</p>
                                        <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 4px 0 0 0;">
                                            ${m.autorUrl 
                                                ? `<a href="${m.autorUrl}" target="_blank" style="color: #a78bfa; text-decoration: underline;">${m.autor}</a>` 
                                                : m.autor
                                            }
                                            ${m.autorUrl ? ' • ' + (m.autorUrl.includes('instagram') ? 'Instagram' : 'Pixabay') : ''}
                                        </p>
                                    </div>
                                    ${m.licencaCompleta ? `
                                        <button onclick="SistemaMusicasFundo.mostrarLicenca('${m.id}')" style="
                                            padding: 6px 10px;
                                            background: rgba(167, 139, 250, 0.2);
                                            border: 1px solid rgba(167, 139, 250, 0.3);
                                            border-radius: 8px;
                                            color: #a78bfa;
                                            font-size: 11px;
                                            cursor: pointer;
                                        ">Ver Licença</button>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="margin-top: 24px; padding: 16px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.2); border-radius: 12px;">
                        <p style="color: #fcd34d; font-size: 12px; text-align: center;">
                            <strong>Licença:</strong> Pixabay Content License<br>
                            Uso comercial permitido • Sem necessidade de atribuição
                        </p>
                        <p style="color: rgba(255,255,255,0.5); font-size: 12px; text-align: center; margin-top: 8px;">
                            <a href="https://pixabay.com/service/terms/" target="_blank" style="text-decoration: underline; color: inherit;">Ver termos completos</a>
                        </p>
                    </div>
                </div>
                
                <div style="padding: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button onclick="document.getElementById('modal-creditos-musicas').remove(); SistemaMusicasFundo.abrir();" style="
                        width: 100%;
                        padding: 12px;
                        background: #7c3aed;
                        color: white;
                        font-weight: bold;
                        border-radius: 12px;
                        border: none;
                        cursor: pointer;
                    ">
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
    },
    
    // Mostrar licença completa de uma música
    mostrarLicenca(musicaId) {
        const musica = this.musicas.find(m => m.id === musicaId);
        if (!musica || !musica.licencaCompleta) return;
        
        const modal = document.createElement('div');
        modal.id = 'modal-licenca-musica';
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0,0,0,0.95) !important;
            z-index: 10001 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 16px !important;
        `;
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(to bottom right, #1f2937, rgba(30, 58, 95, 0.9));
                border-radius: 16px;
                width: 100%;
                max-width: 420px;
                max-height: 85vh;
                overflow: hidden;
                animation: slideUp 0.3s ease;
            ">
                <div style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <h2 style="color: white; font-size: 16px; font-weight: bold; display: flex; align-items: center; gap: 8px; margin: 0;">
                            <span>${musica.icone}</span>
                            <span>${musica.nome}</span>
                        </h2>
                        <button onclick="document.getElementById('modal-licenca-musica').remove()" style="
                            padding: 6px;
                            background: rgba(255,255,255,0.1);
                            border-radius: 50%;
                            border: none;
                            cursor: pointer;
                        ">
                            <svg style="width: 16px; height: 16px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div style="overflow-y: auto; max-height: 60vh; padding: 16px;">
                    <pre style="
                        background: rgba(0,0,0,0.3);
                        border-radius: 12px;
                        padding: 16px;
                        color: rgba(255,255,255,0.85);
                        font-size: 12px;
                        font-family: 'Courier New', monospace;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        line-height: 1.5;
                        margin: 0;
                    ">${musica.licencaCompleta}</pre>
                </div>
                
                <div style="padding: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button onclick="document.getElementById('modal-licenca-musica').remove()" style="
                        width: 100%;
                        padding: 12px;
                        background: #7c3aed;
                        color: white;
                        font-weight: bold;
                        border-radius: 12px;
                        border: none;
                        cursor: pointer;
                    ">
                        Fechar
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
