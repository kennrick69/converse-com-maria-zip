// ========================================
// 📚 BIBLIOTECA CRISTÃ - VERSÃO 11
// PEGA CANETA PRIMEIRO → SELECIONA → MARCA!
// ========================================

const BibliotecaCrista = {
    URL_BASE: 'https://conversecommaria.com.br/livros',
    
    config: { tamanhoFonte: 22, temaLeitor: 'sepia', posicoes: {}, marcadores: {} },
    catalogo: [],
    livrosCache: {},
    grifos: [],
    livroAtual: null,
    capituloAtual: 0,
    
    // CANETA
    canetaAtiva: null, // null = sem caneta, ou {nome, bg, texto}

    // Reduzido pra 2 cores (JOs 2026-05-29): amarelo + verde (clássico de caderno)
    cores: [
        { nome: 'Amarelo', bg: '#FEF08A', texto: '#713F12' },
        { nome: 'Verde', bg: '#BBF7D0', texto: '#14532D' }
    ],

    // Estado da régua de leitura e do modo "salvar onde parei"
    _reguaAtiva: false,
    _modoMarcadorAtivo: false,

    init() {
        try {
            const g = localStorage.getItem('biblioGrifos');
            if (g) this.grifos = JSON.parse(g);
            const c = localStorage.getItem('biblioCache');
            if (c) this.livrosCache = JSON.parse(c);
            const cat = localStorage.getItem('biblioCatalogo');
            if (cat) this.catalogo = JSON.parse(cat);
            const cfg = localStorage.getItem('biblioConfig');
            if (cfg) this.config = { ...this.config, ...JSON.parse(cfg) };
        } catch(e) {}
    },

    salvar() {
        localStorage.setItem('biblioGrifos', JSON.stringify(this.grifos));
        localStorage.setItem('biblioCache', JSON.stringify(this.livrosCache));
        localStorage.setItem('biblioConfig', JSON.stringify(this.config));
    },

    // F1 (2026-05-25): tenta carregar do Firestore primeiro (controle JOs via
    // painel admin). Se Firestore vazio/falha, fallback pro Hostinger (legado).
    //
    // Schema v2 (2026-05-29): doc principal embarca cap1 (leitura imediata, 1 read).
    // Capítulos 2+ ficam em subcol /capitulos/{numero} e carregam sob demanda.
    // Suporta também schema v1 (`capitulos: [...]` embedded) e v0 (`conteudo` string).
    async carregarCatalogoDoFirestore() {
        try {
            if (!window.firebase || !firebase.firestore) return null;
            let snap;
            try {
                snap = await firebase.firestore().collection('conteudo_livros').orderBy('ordem', 'asc').get();
            } catch (e) {
                snap = await firebase.firestore().collection('conteudo_livros').get();
            }
            if (snap.empty) return null;
            const livros = snap.docs.map(d => {
                const data = d.data();
                const capitulos = [];
                if (data.cap1 && typeof data.cap1 === 'object') {
                    // v2 — cap1 embedded + total
                    capitulos.push({ numero: 1, ...data.cap1 });
                    const total = Number(data.totalCapitulos) || 1;
                    for (let n = 2; n <= total; n++) {
                        capitulos.push({ numero: n, titulo: '', conteudo: '', _lazy: true });
                    }
                } else if (Array.isArray(data.capitulos) && data.capitulos.length) {
                    // v1 — array embedded inteiro
                    capitulos.push(...data.capitulos);
                } else if (data.conteudo) {
                    // v0 — campo único do CRUD genérico antigo
                    capitulos.push({ numero: 1, titulo: data.titulo || '', conteudo: String(data.conteudo) });
                }
                return {
                    id: data.id || d.id,
                    titulo: data.titulo,
                    autor: data.autor,
                    capa: data.capa || '📖',
                    descricao: data.descricao || '',
                    _fonteFirestore: true,
                    _docId: d.id,
                    _atualizadoEm: data.atualizadoEm || null,
                    _capitulos: capitulos,
                    _totalCapitulos: Number(data.totalCapitulos) || capitulos.length
                };
            });
            return livros;
        } catch (e) {
            console.warn('[biblioteca] Firestore catálogo falhou, fallback Hostinger:', e.message);
            return null;
        }
    },

    // Normaliza Firestore Timestamp / Date / string → ms (pra cache key).
    _stamp(ts) {
        if (!ts) return 'na';
        if (ts.toMillis) return ts.toMillis();
        if (ts.seconds) return ts.seconds * 1000;
        const p = Date.parse(ts);
        return isNaN(p) ? 'na' : p;
    },

    // Lazy load de capítulo individual da subcollection.
    // Cache key inclui `atualizadoEm` do doc principal — quando JOs edita pelo painel,
    // o stamp muda e a entrada antiga é descartada automaticamente.
    async _loadCapituloOnDemand(docId, numero, atualizadoEm) {
        const stamp = this._stamp(atualizadoEm);
        const cacheKey = 'biblioCap_' + docId + '_' + numero + '_' + stamp;
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                try { return JSON.parse(cached); } catch (e) {}
            }
        } catch (e) {}
        try {
            if (!window.firebase || !firebase.firestore) return null;
            const doc = await firebase.firestore()
                .collection('conteudo_livros').doc(docId)
                .collection('capitulos').doc(String(numero)).get();
            if (!doc.exists) return null;
            const data = doc.data();
            // Limpa caches velhos do mesmo (docId, numero) com stamps anteriores
            try {
                const prefix = 'biblioCap_' + docId + '_' + numero + '_';
                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const k = localStorage.key(i);
                    if (k && k.startsWith(prefix) && k !== cacheKey) localStorage.removeItem(k);
                }
            } catch (e) {}
            try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch (e) {}
            return data;
        } catch (e) {
            console.warn('[biblioteca] erro lazy cap', numero, e.message);
            return null;
        }
    },

    _avisoOffline() {
        try {
            const aviso = document.createElement('div');
            aviso.textContent = '⚠️ Sem conexão pra buscar este capítulo. Tente de novo quando estiver online.';
            aviso.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#ef4444;color:#fff;padding:14px 20px;border-radius:12px;z-index:10001;font-weight:600;max-width:90vw;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.3)';
            document.body.appendChild(aviso);
            setTimeout(() => aviso.remove(), 4000);
        } catch (e) {}
    },

    // Garante que livro.capitulos[idx] esteja carregado de verdade. Retorna true se sucesso.
    async _garantirCapitulo(idx) {
        const livro = this.livroAtual;
        if (!livro || !Array.isArray(livro.capitulos)) return true;
        const cap = livro.capitulos[idx];
        if (!cap || !cap._lazy) return true;
        if (!livro._docId) return true;
        const real = await this._loadCapituloOnDemand(livro._docId, cap.numero, livro._atualizadoEm);
        if (real) {
            livro.capitulos[idx] = { numero: cap.numero, ...real };
            return true;
        }
        return false;
    },

    async carregarCatalogo() {
        // 1) Firestore (gerenciado pelo JOs via painel admin)
        const fromFirestore = await this.carregarCatalogoDoFirestore();
        if (fromFirestore && fromFirestore.length > 0) {
            this.catalogo = fromFirestore;
            localStorage.setItem('biblioCatalogo', JSON.stringify(this.catalogo));
            return this.catalogo;
        }
        // 2) Fallback: Hostinger (legado — funciona mesmo se Firestore vazio)
        try {
            const r = await fetch(this.URL_BASE + '/catalogo.json?t=' + Date.now());
            const d = await r.json();
            this.catalogo = d.livros || [];
            localStorage.setItem('biblioCatalogo', JSON.stringify(this.catalogo));
        } catch(e) {}
        return this.catalogo;
    },

    async carregarLivro(id) {
        if (this.livrosCache[id]) return this.livrosCache[id];
        // 1) Firestore: vê se o item do catálogo veio do Firestore (tem _capitulos embedded/lazy)
        const meta = (this.catalogo || []).find(x => x.id === id);
        if (meta && meta._fonteFirestore && Array.isArray(meta._capitulos)) {
            const livro = {
                id: meta.id,
                _docId: meta._docId,
                _fonteFirestore: true,
                _atualizadoEm: meta._atualizadoEm,
                titulo: meta.titulo,
                autor: meta.autor,
                capa: meta.capa,
                descricao: meta.descricao || '',
                capitulos: meta._capitulos
            };
            this.livrosCache[id] = livro;
            return livro; // NÃO salvar livro com placeholders _lazy no cache localStorage
        }
        // 2) Fallback Hostinger
        const r = await fetch(this.URL_BASE + '/' + id + '.json');
        const livro = await r.json();
        this.livrosCache[id] = livro;
        this.salvar();
        return livro;
    },

    async abrir() {
        this.init();
        this.canetaAtiva = null;
        
        const modal = document.createElement('div');
        modal.id = 'biblio-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#1e1b4b;display:flex;flex-direction:column;';
        
        modal.innerHTML = `
            <div style="padding:16px;display:flex;justify-content:space-between;align-items:center;">
                <button onclick="BibliotecaCrista.fechar()" style="background:rgba(255,255,255,0.1);border:none;border-radius:50%;width:44px;height:44px;color:#fff;font-size:20px;">✕</button>
                <span style="color:#fff;font-size:18px;font-weight:bold;">📚 Biblioteca</span>
                <button onclick="BibliotecaCrista.meusGrifos()" style="background:rgba(255,255,255,0.1);border:none;border-radius:50%;width:44px;height:44px;font-size:20px;position:relative;color:#fff;">🖍️${this.grifos.length > 0 ? `<span style="position:absolute;top:-4px;right:-4px;background:#ef4444;color:#fff;font-size:11px;font-weight:bold;border-radius:10px;padding:2px 6px;min-width:20px;line-height:1;">${this.grifos.length}</span>` : ''}</button>
            </div>
            <div id="biblio-lista" style="flex:1;overflow-y:auto;padding:16px;"></div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        await this.carregarCatalogo();
        
        document.getElementById('biblio-lista').innerHTML = this.catalogo.map(l => {
            const ehImg = l.capa && (String(l.capa).startsWith('data:') || String(l.capa).startsWith('http'));
            const capaHtml = ehImg
                ? `<img src="${l.capa}" style="width:56px;height:80px;object-fit:cover;border-radius:6px;flex-shrink:0;box-shadow:0 4px 10px rgba(0,0,0,0.3);">`
                : `<span style="font-size:46px;width:56px;text-align:center;flex-shrink:0;">${l.capa || '📖'}</span>`;
            const desc = String(l.descricao || '').slice(0, 110);
            const totalCaps = l._totalCapitulos || (l._capitulos ? l._capitulos.length : 0);
            return `
                <div onclick="BibliotecaCrista.abrirLivro('${l.id}')" style="background:rgba(255,255,255,0.1);border-radius:16px;padding:14px;margin-bottom:12px;display:flex;gap:14px;align-items:flex-start;cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                    ${capaHtml}
                    <div style="flex:1;min-width:0;">
                        <div style="color:#fff;font-weight:bold;font-size:15px;line-height:1.3;">${l.titulo}</div>
                        <div style="color:#a5b4fc;font-size:13px;margin-top:2px;">${l.autor || ''}${totalCaps ? ` • ${totalCaps} cap${totalCaps !== 1 ? 's' : ''}` : ''}</div>
                        ${desc ? `<div style="color:rgba(255,255,255,0.7);font-size:12px;line-height:1.4;margin-top:6px;">${desc}${l.descricao && l.descricao.length > 110 ? '…' : ''}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    fechar() {
        document.getElementById('biblio-modal')?.remove();
        document.getElementById('info-modal')?.remove();
        document.getElementById('leitor-modal')?.remove();
        this.canetaAtiva = null;
        this._esconderRegua();
        this.desativarModoMarcador();
        this._reguaAtiva = false;
        document.body.style.overflow = '';
    },

    async abrirLivro(id) {
        this.livroAtual = await this.carregarLivro(id);
        this.canetaAtiva = null;
        this.renderInfoLivro();
    },

    // Encontra última posição salva pra esse livro (régua automática).
    // Retorna {capIdx, ratio, ts} ou null.
    _ultimaPosicaoLivro(livroId) {
        const p = this.config.posicoes || {};
        const prefixo = livroId + '::cap';
        let melhor = null;
        for (const chave of Object.keys(p)) {
            if (!chave.startsWith(prefixo)) continue;
            const capIdx = parseInt(chave.slice(prefixo.length), 10);
            if (isNaN(capIdx)) continue;
            const entry = p[chave];
            const ts = (typeof entry === 'number') ? 0 : (entry.ts || 0);
            const ratio = (typeof entry === 'number') ? entry : (entry.ratio || 0);
            if (!melhor || ts > melhor.ts) {
                melhor = { capIdx, ratio, ts };
            }
        }
        return melhor;
    },

    // Tela intermediária: capa + descrição + lista de capítulos clicável.
    // Substitui o comportamento antigo de ir direto pro cap 1.
    renderInfoLivro() {
        document.getElementById('biblio-modal')?.remove();
        document.getElementById('info-modal')?.remove();
        document.getElementById('leitor-modal')?.remove();

        const livro = this.livroAtual;
        const total = livro.capitulos.length;
        const ehImg = livro.capa && (String(livro.capa).startsWith('data:') || String(livro.capa).startsWith('http'));
        const capaHtml = ehImg
            ? `<img src="${livro.capa}" style="width:140px;height:200px;object-fit:cover;border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,0.4);">`
            : `<div style="width:140px;height:200px;background:rgba(255,255,255,0.12);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:80px;box-shadow:0 12px 30px rgba(0,0,0,0.4);">${livro.capa || '📖'}</div>`;

        // Marcador manual (bookmark) — diferente da régua automática
        const marcador = this.config.marcadores && this.config.marcadores[livro.id];
        const capMarcador = marcador ? livro.capitulos[marcador.capIdx] : null;
        const marcadorHtml = (marcador && capMarcador) ? `
            <div style="background:linear-gradient(135deg,rgba(239,68,68,0.18),rgba(220,38,38,0.12));border:1px solid rgba(239,68,68,0.4);border-radius:14px;padding:14px 16px;margin-bottom:14px;">
                <div style="color:#fca5a5;font-size:11px;text-transform:uppercase;letter-spacing:1.2px;font-weight:bold;margin-bottom:8px;">🔖 Seu marcador</div>
                <div style="color:#fff;font-size:14px;margin-bottom:10px;font-weight:600;">Capítulo ${capMarcador.numero}${capMarcador.titulo ? ' — ' + capMarcador.titulo : ''} • ${Math.round((marcador.ratio||0)*100)}%</div>
                <button onclick="BibliotecaCrista.iniciarLeitura(${marcador.capIdx})" style="width:100%;padding:12px;background:linear-gradient(135deg,#ef4444,#dc2626);border:none;border-radius:10px;color:#fff;font-weight:bold;font-size:14px;cursor:pointer;">Ir pro marcador →</button>
            </div>
        ` : '';

        // Régua: onde o leitor parou (tracking automático)
        const ult = this._ultimaPosicaoLivro(livro.id);
        const temProgresso = ult && ult.ratio > 0.02;
        const capProgresso = temProgresso ? livro.capitulos[ult.capIdx] : null;
        const continuarHtml = (temProgresso && capProgresso) ? `
            <div style="background:linear-gradient(135deg,rgba(251,191,36,0.18),rgba(245,158,11,0.12));border:1px solid rgba(251,191,36,0.4);border-radius:14px;padding:14px 16px;margin-bottom:20px;">
                <div style="color:#fbbf24;font-size:11px;text-transform:uppercase;letter-spacing:1.2px;font-weight:bold;margin-bottom:8px;">📍 Continuar de onde parou</div>
                <div style="color:#fff;font-size:14px;margin-bottom:4px;font-weight:600;">Capítulo ${capProgresso.numero}${capProgresso.titulo ? ' — ' + capProgresso.titulo : ''}</div>
                <div style="display:flex;align-items:center;gap:10px;margin:10px 0 12px;">
                    <div style="flex:1;height:6px;background:rgba(255,255,255,0.15);border-radius:3px;overflow:hidden;">
                        <div style="width:${Math.round(ult.ratio*100)}%;height:100%;background:linear-gradient(90deg,#fbbf24,#f59e0b);border-radius:3px;"></div>
                    </div>
                    <span style="color:#fbbf24;font-size:12px;font-weight:bold;min-width:38px;text-align:right;">${Math.round(ult.ratio*100)}%</span>
                </div>
                <button onclick="BibliotecaCrista.iniciarLeitura(${ult.capIdx})" style="width:100%;padding:13px;background:linear-gradient(135deg,#fbbf24,#f59e0b);border:none;border-radius:10px;color:#1e1b4b;font-weight:bold;font-size:14px;cursor:pointer;">Continuar lendo →</button>
            </div>
        ` : '';

        // Lista de capítulos (renderiza nomes; placeholders mostram nº só)
        const capsHtml = livro.capitulos.map((cap, idx) => {
            const ehLazy = cap._lazy;
            const ehAtual = ult && ult.capIdx === idx && ult.ratio > 0.02;
            const tit = ehLazy ? '<span style="opacity:0.55;font-style:italic;">capítulo ' + cap.numero + '</span>' : (cap.titulo || ('Capítulo ' + cap.numero));
            const bg = ehAtual ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.06)';
            const bgHover = ehAtual ? 'rgba(251,191,36,0.20)' : 'rgba(255,255,255,0.12)';
            const numBg = ehAtual ? 'rgba(251,191,36,0.35)' : 'rgba(165,180,252,0.2)';
            const numCor = ehAtual ? '#fbbf24' : '#a5b4fc';
            const marcador = ehAtual ? `<span style="color:#fbbf24;font-size:11px;font-weight:bold;margin-left:6px;">📍 ${Math.round(ult.ratio*100)}%</span>` : '';
            return `
                <div onclick="BibliotecaCrista.iniciarLeitura(${idx})" style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:${bg};border-radius:12px;margin-bottom:8px;cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background='${bgHover}'" onmouseout="this.style.background='${bg}'">
                    <div style="width:32px;height:32px;border-radius:50%;background:${numBg};color:${numCor};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:bold;flex-shrink:0;">${cap.numero}</div>
                    <div style="flex:1;color:#fff;font-size:14px;line-height:1.3;">${tit}${marcador}</div>
                    <div style="color:rgba(255,255,255,0.4);font-size:18px;">›</div>
                </div>
            `;
        }).join('');

        const modal = document.createElement('div');
        modal.id = 'info-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:linear-gradient(180deg, #1e1b4b 0%, #312e81 100%);display:flex;flex-direction:column;';

        modal.innerHTML = `
            <div style="padding:14px 16px;display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,0.2);">
                <button onclick="BibliotecaCrista.voltarParaCatalogo()" style="background:rgba(255,255,255,0.1);border:none;border-radius:50%;width:42px;height:42px;color:#fff;font-size:18px;cursor:pointer;">←</button>
                <span style="color:#fff;font-size:15px;font-weight:600;opacity:0.85;">Detalhes do livro</span>
                <div style="width:42px;"></div>
            </div>
            <div style="flex:1;overflow-y:auto;padding:24px 20px 80px;">
                <div style="display:flex;flex-direction:column;align-items:center;text-align:center;margin-bottom:24px;">
                    ${capaHtml}
                    <h2 style="color:#fff;font-size:22px;font-weight:bold;margin-top:18px;line-height:1.3;max-width:90%;">${livro.titulo}</h2>
                    <div style="color:#a5b4fc;font-size:14px;margin-top:6px;">${livro.autor || ''}</div>
                    <div style="color:rgba(255,255,255,0.5);font-size:12px;margin-top:4px;">${total} capítulo${total !== 1 ? 's' : ''}</div>
                </div>

                ${marcadorHtml}
                ${continuarHtml}

                ${livro.descricao ? `
                    <div style="background:rgba(255,255,255,0.06);border-radius:14px;padding:16px;margin-bottom:20px;">
                        <div style="color:#a5b4fc;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;font-weight:bold;">Sobre o livro</div>
                        <div style="color:rgba(255,255,255,0.85);font-size:14px;line-height:1.6;">${livro.descricao}</div>
                    </div>
                ` : ''}

                <button onclick="BibliotecaCrista.iniciarLeitura(0)" style="width:100%;padding:16px;background:${temProgresso ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#fbbf24,#f59e0b)'};border:${temProgresso ? '1px solid rgba(255,255,255,0.2)' : 'none'};border-radius:14px;color:${temProgresso ? '#fff' : '#1e1b4b'};font-size:15px;font-weight:bold;cursor:pointer;${temProgresso ? '' : 'box-shadow:0 8px 20px rgba(251,191,36,0.3);'}margin-bottom:24px;">
                    ${temProgresso ? '🔄 Começar do início' : '📖 Começar a ler'}
                </button>

                <div style="color:#a5b4fc;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;font-weight:bold;padding-left:4px;">Capítulos</div>
                ${capsHtml}
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    },

    voltarParaCatalogo() {
        document.getElementById('info-modal')?.remove();
        this.abrir();
    },

    // Inicia leitura num capítulo específico (idx 0-based).
    // Substitui o que o antigo abrirLivro fazia depois de carregar o livro.
    async iniciarLeitura(idx) {
        if (!this.livroAtual) return;
        this.capituloAtual = Math.max(0, Math.min(idx, this.livroAtual.capitulos.length - 1));
        this.canetaAtiva = null;
        const ok = await this._garantirCapitulo(this.capituloAtual);
        if (!ok) { this._avisoOffline(); return; }
        this.renderLeitor();
    },

    renderLeitor() {
        document.getElementById('biblio-modal')?.remove();
        document.getElementById('leitor-modal')?.remove();
        
        const livro = this.livroAtual;
        const cap = livro.capitulos[this.capituloAtual];
        
        const temas = {
            sepia: { bg: '#f5e6d3', cor: '#5c4033', header: '#e8d4b8' },
            claro: { bg: '#ffffff', cor: '#333333', header: '#f5f5f5' },
            escuro: { bg: '#1a1a1a', cor: '#e0e0e0', header: '#2a2a2a' }
        };
        const tema = temas[this.config.temaLeitor] || temas.sepia;
        
        const modal = document.createElement('div');
        modal.id = 'leitor-modal';
        modal.style.cssText = `position:fixed;inset:0;z-index:9999;background:${tema.bg};display:flex;flex-direction:column;`;
        
        modal.innerHTML = `
            <div style="padding:10px 16px;background:${tema.header};display:flex;justify-content:space-between;align-items:center;">
                <button onclick="BibliotecaCrista.voltar()" style="background:none;border:none;font-size:24px;">←</button>
                <div style="text-align:center;color:${tema.cor};">
                    <div style="font-weight:bold;font-size:14px;">${livro.titulo}</div>
                    <div style="font-size:11px;opacity:0.6;">Cap ${cap.numero}/${livro.capitulos.length} <span id="biblio-progresso-pct" style="margin-left:4px;color:#b8860b;font-weight:600;">0%</span></div>
                </div>
                <div style="display:flex;gap:4px;">
                    <button id="biblio-btn-regua" onclick="BibliotecaCrista.toggleRegua()" title="Régua de leitura — escurece embaixo, libera ao rolar" style="background:none;border:none;font-size:20px;cursor:pointer;opacity:${this._reguaAtiva ? '1' : '0.6'};">📏</button>
                    <button onclick="BibliotecaCrista.config()" style="background:none;border:none;font-size:20px;">⚙️</button>
                </div>
            </div>

            <!-- RÉGUA DE LEITURA (atualiza em tempo real conforme scroll) -->
            <div style="height:3px;background:rgba(0,0,0,0.08);position:relative;">
                <div id="biblio-progresso-fill" style="height:100%;width:0%;background:linear-gradient(90deg,#fbbf24,#f59e0b);transition:width 0.15s ease-out;box-shadow:0 0 6px rgba(251,191,36,0.6);"></div>
            </div>

            <!-- BARRA DA CANETA -->
            <div id="barra-caneta" style="display:none;padding:10px;text-align:center;font-weight:bold;">
                ✨ Toque no trecho que quer marcar
            </div>
            
            <div id="leitor-scroll" style="flex:1;overflow-y:auto;padding:20px 20px 180px 20px;">
                <h2 style="text-align:center;color:${tema.cor};font-size:18px;margin-bottom:20px;">${cap.titulo}</h2>
                <div id="texto-leitura" style="
                    color:${tema.cor};
                    font-size:${this.config.tamanhoFonte}px;
                    line-height:1.8;
                    text-align:justify;
                    -webkit-user-select: text;
                    user-select: text;
                    cursor: text;
                ">
                    ${this.renderTexto(cap.conteudo)}
                </div>
            </div>
            
            <!-- BARRA INFERIOR -->
            <div style="position:fixed;bottom:0;left:0;right:0;background:${tema.header};padding:12px 16px;box-shadow:0 -4px 20px rgba(0,0,0,0.15);">
                
                <!-- INSTRUÇÃO -->
                <div id="instrucao" style="text-align:center;margin-bottom:10px;font-size:13px;color:${tema.cor};">
                    👆 Toque numa cor para pegar a caneta
                </div>

                <!-- CANETAS (2 cores) + GUARDAR + SALVAR ONDE PAREI -->
                <div style="display:flex;justify-content:center;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
                    ${this.cores.map((c, i) => `
                        <button id="caneta-${i}" onclick="BibliotecaCrista.pegarCaneta(${i})" style="
                            width:46px;
                            height:46px;
                            border-radius:50%;
                            border:4px solid ${this.canetaAtiva?.nome === c.nome ? '#000' : 'transparent'};
                            background:${c.bg};
                            box-shadow:0 4px 12px rgba(0,0,0,0.25);
                            cursor:pointer;
                            transition: transform 0.2s, border 0.2s;
                            transform: ${this.canetaAtiva?.nome === c.nome ? 'scale(1.15)' : 'scale(1)'};
                        "></button>
                    `).join('')}

                    <!-- BOTÃO GUARDAR caneta -->
                    <button id="btn-guardar" onclick="BibliotecaCrista.guardarCaneta()" style="
                        width:46px;
                        height:46px;
                        border-radius:50%;
                        border:none;
                        background:${this.canetaAtiva ? '#ef4444' : '#e5e5e5'};
                        box-shadow:0 4px 12px rgba(0,0,0,0.15);
                        cursor:pointer;
                        font-size:18px;
                        display:${this.canetaAtiva ? 'flex' : 'none'};
                        align-items:center;
                        justify-content:center;
                        color:#fff;
                    ">✕</button>

                    <!-- SALVAR ONDE PAREI (abre modo lápis pra apontar) -->
                    <button onclick="BibliotecaCrista.ativarModoMarcador()" style="
                        padding:10px 14px;
                        background:linear-gradient(135deg,#ef4444,#dc2626);
                        border:none;
                        border-radius:22px;
                        color:#fff;
                        font-size:12px;
                        font-weight:600;
                        cursor:pointer;
                        box-shadow:0 4px 12px rgba(239,68,68,0.3);
                        display:flex;
                        align-items:center;
                        gap:5px;
                    ">📍 Salvar onde parei</button>
                </div>
                
                <!-- NAVEGAÇÃO -->
                <div style="display:flex;justify-content:space-between;">
                    <button onclick="BibliotecaCrista.capAnt()" style="padding:8px 16px;background:rgba(0,0,0,0.1);border:none;border-radius:16px;opacity:${this.capituloAtual===0?'0.3':'1'};" ${this.capituloAtual===0?'disabled':''}>← Ant</button>
                    <button onclick="BibliotecaCrista.capProx()" style="padding:8px 16px;background:rgba(0,0,0,0.1);border:none;border-radius:16px;opacity:${this.capituloAtual>=livro.capitulos.length-1?'0.3':'1'};" ${this.capituloAtual>=livro.capitulos.length-1?'disabled':''}>Próx →</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Restaurar grifos + posição salva (régua) + tracking de scroll
        setTimeout(() => this.restaurarGrifos(), 100);
        setTimeout(() => this._restaurarPosicaoLivro(), 250);
        this._iniciarTrackingScroll();

        // Restaurar régua se estava ativa
        if (this._reguaAtiva) setTimeout(() => this._mostrarRegua(), 50);

        // Se caneta estava ativa, reativar
        if (this.canetaAtiva) {
            this.atualizarUICaneta();
            this.ativarEventosSelecao();
        }
    },

    renderTexto(texto) {
        return texto.split('\n\n').map(p => 
            `<p style="margin-bottom:16px;text-indent:2em;">${p}</p>`
        ).join('');
    },

    // ========================================
    // PEGAR CANETA
    // ========================================

    pegarCaneta(corIndex) {
        const cor = this.cores[corIndex];
        
        // Se já está com essa cor, guarda
        if (this.canetaAtiva?.nome === cor.nome) {
            this.guardarCaneta();
            return;
        }
        
        // Pega a caneta
        this.canetaAtiva = cor;
        console.log('🖍️ Pegou caneta:', cor.nome);
        
        // Atualiza visual
        this.atualizarUICaneta();
        
        // Ativa eventos de seleção
        this.ativarEventosSelecao();
        
        this.toast('🖍️ Caneta ' + cor.nome + '! Toque no trecho pra marcar ✨');
    },

    guardarCaneta() {
        this.canetaAtiva = null;
        console.log('📥 Guardou caneta');
        
        // Atualiza visual
        this.atualizarUICaneta();
        
        // Remove eventos
        this.desativarEventosSelecao();
        
        // Limpa seleção
        window.getSelection()?.removeAllRanges();
    },

    atualizarUICaneta() {
        // Atualiza botões das canetas
        this.cores.forEach((c, i) => {
            const btn = document.getElementById('caneta-' + i);
            if (btn) {
                const ativa = this.canetaAtiva?.nome === c.nome;
                btn.style.border = ativa ? '4px solid #000' : '4px solid transparent';
                btn.style.transform = ativa ? 'scale(1.15)' : 'scale(1)';
            }
        });
        
        // Botão guardar
        const btnGuardar = document.getElementById('btn-guardar');
        if (btnGuardar) {
            btnGuardar.style.display = this.canetaAtiva ? 'flex' : 'none';
        }
        
        // Barra da caneta
        const barra = document.getElementById('barra-caneta');
        if (barra) {
            if (this.canetaAtiva) {
                barra.style.display = 'block';
                barra.style.background = this.canetaAtiva.bg;
                barra.style.color = this.canetaAtiva.texto;
                barra.textContent = '🖍️ Caneta ' + this.canetaAtiva.nome + '! Toque no trecho pra marcar ✨';
            } else {
                barra.style.display = 'none';
            }
        }
        
        // Instrução
        const instrucao = document.getElementById('instrucao');
        if (instrucao) {
            instrucao.textContent = this.canetaAtiva 
                ? '👆 Selecione o texto para marcar' 
                : '👆 Toque numa cor para pegar a caneta';
        }
    },

    // ========================================
    // EVENTOS DE SELEÇÃO - MARCA AUTOMÁTICO!
    // ========================================

    ativarEventosSelecao() {
        const container = document.getElementById('texto-leitura');
        if (!container) return;
        
        const self = this;
        
        // Função que marca quando soltar
        container._marcarAoSoltar = function(e) {
            if (!self.canetaAtiva) return;
            
            // Pequeno delay para garantir que a seleção está pronta
            setTimeout(() => {
                const selection = window.getSelection();
                if (!selection || selection.isCollapsed) return;
                
                const texto = selection.toString().trim();
                if (texto.length < 3) return;
                
                console.log('✅ Selecionou:', texto.substring(0, 30));
                
                // MARCA AUTOMATICAMENTE!
                self.marcarTexto(texto, selection);
            }, 50);
        };
        
        container.addEventListener('mouseup', container._marcarAoSoltar);
        container.addEventListener('touchend', container._marcarAoSoltar);
    },

    desativarEventosSelecao() {
        const container = document.getElementById('texto-leitura');
        if (!container || !container._marcarAoSoltar) return;
        
        container.removeEventListener('mouseup', container._marcarAoSoltar);
        container.removeEventListener('touchend', container._marcarAoSoltar);
        delete container._marcarAoSoltar;
    },

    marcarTexto(texto, selection) {
        if (!this.canetaAtiva) return;
        
        const cor = this.canetaAtiva;
        
        try {
            const range = selection.getRangeAt(0);
            
            // Cria o mark
            const mark = document.createElement('mark');
            mark.style.cssText = `background:${cor.bg};color:${cor.texto};padding:2px 4px;border-radius:4px;cursor:pointer;`;
            
            const grifoId = Date.now().toString();
            mark.dataset.grifoId = grifoId;
            mark.onclick = (e) => { e.stopPropagation(); this.clicarGrifo(grifoId); };
            
            // Envolve o texto
            range.surroundContents(mark);
            
            // Limpa seleção
            selection.removeAllRanges();
            
            // Salva
            const grifo = {
                id: grifoId,
                livroId: this.livroAtual.id,
                livroTitulo: this.livroAtual.titulo,
                autor: this.livroAtual.autor,
                capitulo: this.capituloAtual + 1,
                texto: texto.substring(0, 500),
                corBg: cor.bg,
                corTexto: cor.texto,
                corNome: cor.nome,
                data: new Date().toISOString()
            };
            
            this.grifos.push(grifo);
            this.salvar();
            this.salvarFirebase();

            console.log('✅ MARCADO!');
            this.toastComAcao('✅ Marcado!', '📤 Compartilhar', () => this.compartilharComoImagem(grifoId));

        } catch (e) {
            console.log('Usando fallback...');
            this.marcarFallback(texto, cor);
        }
    },

    // M6 (Eduardo): TreeWalker percorre nodes de TEXTO (não HTML), então
    // & < > acentos e caracteres especiais funcionam OK. Antes usava
    // innerHTML.replace(regex) que destruía HTML quando o texto tinha
    // entidades ou era escapado de jeito diferente. Bonus: não destrói
    // listeners de seleção (não substitui innerHTML inteiro).
    marcarFallback(texto, cor) {
        const container = document.getElementById('texto-leitura');
        if (!container) return;
        const alvo = (texto || '').trim();
        if (alvo.length < 3) return;
        const grifoId = Date.now().toString();

        // Percorre TODOS os text nodes procurando primeiro match case-insensitive
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
        let node, achouEm = null, achouIdx = -1;
        const alvoLower = alvo.toLowerCase();
        while ((node = walker.nextNode())) {
            const idx = node.nodeValue.toLowerCase().indexOf(alvoLower);
            if (idx >= 0) { achouEm = node; achouIdx = idx; break; }
        }

        if (!achouEm) {
            console.warn('marcarFallback: texto não encontrado, salvando grifo mesmo assim');
        } else {
            // Eduardo: surroundContents() lança InvalidStateError se range cruza
            // múltiplos nós (texto interrompido por <br>, <span>, etc). Trocamos
            // por extractContents()+insertNode() que funciona com qualquer DOM.
            const range = document.createRange();
            range.setStart(achouEm, achouIdx);
            range.setEnd(achouEm, achouIdx + alvo.length);
            const mark = document.createElement('mark');
            mark.setAttribute('data-grifo-id', grifoId);
            mark.style.cssText = `background:${cor.bg};color:${cor.texto};padding:2px 4px;border-radius:4px;cursor:pointer;`;
            mark.onclick = (e) => { e.stopPropagation(); this.clicarGrifo(grifoId); };
            try {
                const fragment = range.extractContents();
                mark.appendChild(fragment);
                range.insertNode(mark);
            } catch (e) {
                console.warn('marcarFallback: range manipulation falhou:', e.message);
                // Grifo continua salvo em this.grifos abaixo, aparece em Marcações
            }
        }

        const grifo = {
            id: grifoId,
            livroId: this.livroAtual.id,
            livroTitulo: this.livroAtual.titulo,
            autor: this.livroAtual.autor,
            capitulo: this.capituloAtual + 1,
            texto: alvo.substring(0, 500),
            corBg: cor.bg,
            corTexto: cor.texto,
            corNome: cor.nome,
            data: new Date().toISOString()
        };
        this.grifos.push(grifo);
        this.salvar();
        this.salvarFirebase();
        window.getSelection()?.removeAllRanges();
        // Listeners de seleção continuam vivos (não destruímos innerHTML)
        this.toastComAcao('✅ Marcado!', '📤 Compartilhar', () => this.compartilharComoImagem(grifoId));
    },

    restaurarGrifos() {
        const container = document.getElementById('texto-leitura');
        if (!container) return;
        
        const grifosCapitulo = this.grifos.filter(g => 
            g.livroId === this.livroAtual.id && 
            g.capitulo === this.capituloAtual + 1
        );
        
        grifosCapitulo.forEach(g => {
            const escaped = g.texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escaped})`, 'i');
            
            container.innerHTML = container.innerHTML.replace(regex, 
                `<mark data-grifo-id="${g.id}" onclick="event.stopPropagation();BibliotecaCrista.clicarGrifo('${g.id}')" style="background:${g.corBg};color:${g.corTexto};padding:2px 4px;border-radius:4px;cursor:pointer;">$1</mark>`
            );
        });
    },

    clicarGrifo(id) {
        const grifo = this.grifos.find(g => g.id === id);
        if (!grifo) return;
        
        const modal = document.createElement('div');
        modal.id = 'grifo-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:20px;';
        modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div style="background:#fff;border-radius:20px;padding:20px;max-width:320px;width:100%;">
                <div style="background:${grifo.corBg};color:${grifo.corTexto};padding:16px;border-radius:12px;margin-bottom:16px;">
                    <p style="margin:0;font-size:14px;line-height:1.5;">"${grifo.texto}"</p>
                </div>
                <button onclick="BibliotecaCrista.compartilharComoImagem('${id}')" style="width:100%;padding:14px;background:#4f46e5;color:#fff;border:none;border-radius:12px;font-weight:bold;margin-bottom:10px;">📤 Compartilhar</button>
                <button onclick="BibliotecaCrista.removerGrifo('${id}')" style="width:100%;padding:14px;background:#fee2e2;color:#dc2626;border:none;border-radius:12px;font-weight:bold;margin-bottom:10px;">🗑️ Remover</button>
                <button onclick="document.getElementById('grifo-modal').remove()" style="width:100%;padding:12px;background:#f3f4f6;color:#666;border:none;border-radius:12px;">Cancelar</button>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    compartilharGrifo(id) {
        const g = this.grifos.find(x => x.id === id);
        if (!g) return;
        const msg = `📖 Estou lendo "${g.livroTitulo}" de ${g.autor} no app Converse com Maria, e este trecho me tocou:\n\n"${g.texto}"\n\nQuer ler junto comigo? 👇\nhttps://play.google.com/store/apps/details?id=com.conversemaria.app`;
        if (navigator.share) navigator.share({ text: msg }).catch(() => {});
        else { navigator.clipboard.writeText(msg); this.toast('📋 Copiado!'); }
        document.getElementById('grifo-modal')?.remove();
    },

    removerGrifo(id) {
        this.grifos = this.grifos.filter(g => g.id !== id);
        this.salvar();
        this.salvarFirebase();
        
        const mark = document.querySelector(`[data-grifo-id="${id}"]`);
        if (mark) mark.replaceWith(mark.textContent);
        
        document.getElementById('grifo-modal')?.remove();
        this.toast('🗑️ Removido!');
    },

    // Premium-only sync na nuvem. Debounce 3s — se user marca 10 grifos
    // em sequência, só dispara UMA write batched ao final.
    salvarFirebase() {
        if (!this._isPremium()) return;
        if (this._saveTimer) clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(() => this._doSalvarFirebase(), 3000);
    },

    async _doSalvarFirebase() {
        if (!this._isPremium()) return;
        try {
            if (!window.firebase || !firebase.auth) return;
            const user = firebase.auth().currentUser;
            if (!user) return;
            await firebase.firestore()
                .collection('usuarios').doc(user.uid)
                .collection('biblioteca').doc('grifos')
                .set({ lista: this.grifos, atualizadoEm: new Date().toISOString() });
            this._retryCount = 0;
        } catch (e) {
            console.warn('[biblioteca] salvarFirebase falhou:', e.message);
            this._retryCount = (this._retryCount || 0) + 1;
            if (this._retryCount <= 3) {
                const delay = Math.pow(3, this._retryCount) * 5000; // 15s, 45s, 135s
                setTimeout(() => this._doSalvarFirebase(), delay);
            }
        }
    },

    // M7: paleta dinâmica do card de compartilhar baseada no tema do leitor.
    _paletteCardCompartilhar() {
        const tema = this.config.temaLeitor || 'sepia';
        const paletas = {
            sepia: {
                gradient: 'linear-gradient(135deg,#5b2206 0%,#a34b10 50%,#5b2206 100%)',
                glow: 'rgba(255,224,153,0.35)',
                accent: '#FFE08C',
                text: '#FFF8E7',
                titulo: '#FFE699',
                quote: 'rgba(255,215,0,0.6)',
                muted: 'rgba(255,248,231,0.65)'
            },
            claro: {
                // Eduardo: texto escuro sobre fundo dourado fica ilegível em sol direto.
                // Trocado pra branco com sombra escura (contraste WCAG AAA).
                gradient: 'linear-gradient(135deg,#fbbf24 0%,#f59e0b 50%,#b45309 100%)',
                glow: 'rgba(0,0,0,0.15)',
                accent: '#FFFFFF',
                text: '#FFFFFF',
                titulo: '#FFFFFF',
                quote: 'rgba(255,255,255,0.85)',
                muted: 'rgba(255,255,255,0.75)'
            },
            escuro: {
                gradient: 'linear-gradient(135deg,#3b1a52 0%,#2d1247 50%,#1a0a2e 100%)',
                glow: 'rgba(255,215,0,0.25)',
                accent: '#FFD700',
                text: '#fff',
                titulo: '#FFE699',
                quote: 'rgba(255,215,0,0.6)',
                muted: 'rgba(255,255,255,0.6)'
            }
        };
        return paletas[tema] || paletas.sepia;
    },

    // Premium check robusto. Eduardo apontou que pagamento.js salva como string
    // 'true' enquanto premium.js salva como JSON {ativo:true} — temos que aceitar
    // ambos sem explodir com TypeError no JSON.parse.
    _isPremium() {
        try {
            // Caminho preferido: API de TelaPremium
            if (window.TelaPremium && typeof TelaPremium.isPremium === 'function') {
                const r = TelaPremium.isPremium();
                if (r === true) return true;
                if (r === false) return false; // não cai pro fallback se função disse não
            }
            const p = localStorage.getItem('mariaPremium');
            if (!p) return false;
            if (p === 'true') return true;
            try {
                const obj = JSON.parse(p);
                return obj && obj.ativo === true;
            } catch (e) { return false; }
        } catch (e) { return false; }
    },

    // ============ RÉGUA (posição de leitura) ============
    _chaveLivroAtual() {
        if (!this.livroAtual) return null;
        return (this.livroAtual.id || this.livroAtual.titulo) + '::cap' + this.capituloAtual;
    },

    _restaurarPosicaoLivro() {
        const chave = this._chaveLivroAtual();
        if (!chave) return;
        const entry = this.config.posicoes && this.config.posicoes[chave];
        if (!entry) return;
        // Compat: pode ser shape antigo (number) OU novo ({ratio, ts})
        const ratio = (typeof entry === 'number') ? entry : entry.ratio;
        if (!ratio || ratio < 0.05) return;
        const scroll = document.getElementById('leitor-scroll');
        if (!scroll) return;
        const targetTop = (scroll.scrollHeight - scroll.clientHeight) * ratio;
        scroll.scrollTop = targetTop;
        this.toast('📖 Voltei pra onde você parou');
    },

    _iniciarTrackingScroll() {
        const scroll = document.getElementById('leitor-scroll');
        if (!scroll) return;
        // Remove listener anterior se existir (evita stacking)
        if (this._scrollHandler && this._scrollEl) {
            try { this._scrollEl.removeEventListener('scroll', this._scrollHandler); } catch(e) {}
        }
        let timer = null;
        this._scrollHandler = () => {
            // Atualização visual da régua é imediata (cada scroll event)
            this._atualizarReguaVisual();
            // Salvamento debounced em 1s (evita escrita excessiva no localStorage)
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => this._salvarPosicaoAtual(), 1000);
        };
        this._scrollEl = scroll;
        scroll.addEventListener('scroll', this._scrollHandler, { passive: true });
        // Atualiza visual logo no abrir (caso restauração já tenha posicionado)
        setTimeout(() => this._atualizarReguaVisual(), 300);
    },

    // ============ MARCADOR (bookmark manual) — modo "tap pra apontar" ============
    ativarModoMarcador() {
        if (this._modoMarcadorAtivo) { this.desativarModoMarcador(); return; }
        this._modoMarcadorAtivo = true;

        // Banner instrução no topo
        const banner = document.createElement('div');
        banner.id = 'biblio-modo-marcador-banner';
        banner.style.cssText = 'position:fixed;top:64px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;padding:12px 22px;border-radius:24px;font-weight:600;font-size:14px;box-shadow:0 8px 24px rgba(239,68,68,0.45);z-index:10001;max-width:90vw;text-align:center;';
        banner.innerHTML = '✏️ Toque onde você parou pra marcar';
        document.body.appendChild(banner);

        // Botão Cancelar acima do rodapé
        const cancel = document.createElement('button');
        cancel.id = 'biblio-cancelar-marcador';
        cancel.style.cssText = 'position:fixed;bottom:180px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:#fff;border:none;padding:10px 22px;border-radius:22px;cursor:pointer;font-size:13px;z-index:10001;';
        cancel.textContent = 'Cancelar';
        cancel.onclick = () => this.desativarModoMarcador();
        document.body.appendChild(cancel);

        // Cursor de lápis no texto
        const texto = document.getElementById('texto-leitura');
        if (texto) texto.style.cursor = 'crosshair';

        // Handler de tap (capture pra interceptar antes da caneta)
        this._modoMarcadorHandler = (e) => this._marcarNoTap(e);
        const scroll = document.getElementById('leitor-scroll');
        if (scroll) scroll.addEventListener('click', this._modoMarcadorHandler, true);
    },

    desativarModoMarcador() {
        this._modoMarcadorAtivo = false;
        document.getElementById('biblio-modo-marcador-banner')?.remove();
        document.getElementById('biblio-cancelar-marcador')?.remove();
        const texto = document.getElementById('texto-leitura');
        if (texto) texto.style.cursor = '';
        const scroll = document.getElementById('leitor-scroll');
        if (scroll && this._modoMarcadorHandler) {
            scroll.removeEventListener('click', this._modoMarcadorHandler, true);
        }
        this._modoMarcadorHandler = null;
    },

    _marcarNoTap(e) {
        e.stopPropagation();
        e.preventDefault();
        if (!this.livroAtual) return;
        const scroll = document.getElementById('leitor-scroll');
        if (!scroll) return;
        // Posição absoluta do tap dentro do scroll-content
        const tapAbsY = scroll.scrollTop + (e.clientY - scroll.getBoundingClientRect().top);
        // Ratio relativo ao total rolável (descontando viewport)
        const denom = scroll.scrollHeight - scroll.clientHeight;
        const ratio = denom > 0 ? Math.min(1, Math.max(0, (tapAbsY - scroll.clientHeight * 0.3) / denom)) : 0;

        if (!this.config.marcadores) this.config.marcadores = {};
        this.config.marcadores[this.livroAtual.id] = {
            capIdx: this.capituloAtual,
            ratio: ratio,
            ts: Date.now()
        };
        this.salvar();
        this.toast('🔖 Marcador colocado aqui!');
        this.desativarModoMarcador();
    },

    // ============ RÉGUA DE LEITURA (linha + escurecido abaixo) ============
    toggleRegua() {
        this._reguaAtiva = !this._reguaAtiva;
        if (this._reguaAtiva) this._mostrarRegua();
        else this._esconderRegua();
        this._atualizarBotaoRegua();
    },

    _mostrarRegua() {
        document.getElementById('biblio-regua-linha')?.remove();
        document.getElementById('biblio-regua-overlay')?.remove();

        const overlay = document.createElement('div');
        overlay.id = 'biblio-regua-overlay';
        overlay.style.cssText = 'position:fixed;left:0;right:0;top:calc(28vh + 4px);bottom:0;background:rgba(0,0,0,0.62);pointer-events:none;z-index:9998;transition:top 0.2s ease-out;';
        document.body.appendChild(overlay);

        const linha = document.createElement('div');
        linha.id = 'biblio-regua-linha';
        linha.style.cssText = 'position:fixed;left:0;right:0;top:28vh;height:4px;background:linear-gradient(90deg,transparent 0%,#b8860b 12%,#fbbf24 50%,#b8860b 88%,transparent 100%);box-shadow:0 0 14px rgba(251,191,36,0.7),0 0 28px rgba(251,191,36,0.4);pointer-events:none;z-index:9999;';
        document.body.appendChild(linha);

        this.toast('📏 Régua ligada — rola o texto pra ver o resto');
    },

    _esconderRegua() {
        document.getElementById('biblio-regua-linha')?.remove();
        document.getElementById('biblio-regua-overlay')?.remove();
    },

    _atualizarBotaoRegua() {
        const btn = document.getElementById('biblio-btn-regua');
        if (!btn) return;
        btn.style.opacity = this._reguaAtiva ? '1' : '0.6';
        btn.style.transform = this._reguaAtiva ? 'scale(1.15)' : 'scale(1)';
    },

    _atualizarReguaVisual() {
        const scroll = document.getElementById('leitor-scroll');
        const fill = document.getElementById('biblio-progresso-fill');
        const pct = document.getElementById('biblio-progresso-pct');
        if (!scroll) return;
        const denom = scroll.scrollHeight - scroll.clientHeight;
        const ratio = denom > 0 ? scroll.scrollTop / denom : 0;
        const p = Math.round(ratio * 100);
        if (fill) fill.style.width = p + '%';
        if (pct) pct.textContent = p + '%';
    },

    _salvarPosicaoAtual() {
        const scroll = document.getElementById('leitor-scroll');
        const chave = this._chaveLivroAtual();
        if (!scroll || !chave) return;
        const denom = (scroll.scrollHeight - scroll.clientHeight);
        const ratio = denom > 0 ? scroll.scrollTop / denom : 0;
        if (!this.config.posicoes) this.config.posicoes = {};
        // M8: posições agora guardam timestamp pra LRU cleanup
        this.config.posicoes[chave] = { ratio: ratio, ts: Date.now() };
        this._trimPosicoes();
        this.salvar();
        if (this._isPremium()) this._sincronizarPosicoesFirebase();
    },

    // M8: mantém só as últimas 50 posições (LRU por timestamp).
    // Evita o localStorage crescer indefinidamente com livros que o user
    // abriu uma única vez e nunca mais voltou.
    _trimPosicoes() {
        const MAX = 50;
        const p = this.config.posicoes || {};
        const keys = Object.keys(p);
        if (keys.length <= MAX) return;
        // Eduardo apontou bug: entradas em formato antigo (number puro) tinham
        // ts:0 e eram removidas PRIMEIRO — user perdia progresso de livros lidos
        // antes do upgrade. Fix: migra entradas legadas pra Date.now() antes de
        // ordenar, assim ficam preservadas e são tratadas como "recentes".
        const agora = Date.now();
        const ordenadas = keys.map(k => {
            const entry = p[k];
            if (entry == null) return { k: k, ts: 0 };
            if (typeof entry === 'number') {
                // Migra in-place pra novo formato
                p[k] = { ratio: entry, ts: agora };
                return { k: k, ts: agora };
            }
            return { k: k, ts: entry.ts || agora };
        }).sort((a, b) => a.ts - b.ts);
        const remover = ordenadas.slice(0, keys.length - MAX);
        remover.forEach(item => delete p[item.k]);
    },

    async _sincronizarPosicoesFirebase() {
        if (!this._isPremium()) return;
        try {
            if (!window.firebase || !firebase.auth) return;
            const user = firebase.auth().currentUser;
            if (!user) return;
            await firebase.firestore()
                .collection('usuarios').doc(user.uid)
                .collection('biblioteca').doc('posicoes')
                .set({ mapa: this.config.posicoes, atualizadoEm: new Date().toISOString() });
        } catch (e) {
            console.warn('[biblioteca] sync posições falhou:', e.message);
        }
    },

    // ============ PDF CADERNO ESPIRITUAL (Premium) ============
    exportarCadernoPDF() {
        if (!this._isPremium()) {
            this.toast('👑 Caderno em PDF é exclusivo Premium');
            setTimeout(() => {
                if (window.TelaPremium) TelaPremium.abrir('📒 Exporte seu Caderno Espiritual em PDF');
            }, 1200);
            return;
        }
        if (this.grifos.length === 0) {
            this.toast('Você ainda não fez marcações pra exportar');
            return;
        }

        // Agrupa grifos por livro
        const porLivro = {};
        this.grifos.forEach(g => {
            if (!porLivro[g.livroId]) porLivro[g.livroId] = { titulo: g.livroTitulo, lista: [] };
            porLivro[g.livroId].lista.push(g);
        });

        const dataFmt = new Date().toLocaleDateString('pt-BR', { year:'numeric', month:'long', day:'numeric' });
        const nomeUsuario = (() => {
            try {
                const p = JSON.parse(localStorage.getItem('maria_user_profile') || '{}');
                return p.apelido || p.nome || 'Devoto(a)';
            } catch(e) { return 'Devoto(a)'; }
        })();

        const html = '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Caderno Espiritual — ' + nomeUsuario + '</title>'
            + '<style>'
            + '@page { margin: 2cm 1.5cm; }'
            + 'body { font-family: Georgia, serif; max-width: 820px; margin: 0 auto; padding: 20px; line-height: 1.7; color: #2b1b12; background: #fef8eb; }'
            + 'h1 { color: #6b2d06; text-align: center; border-bottom: 3px double #d48a00; padding-bottom: 14px; margin-bottom: 4px; font-size: 28px; }'
            + '.sub { text-align: center; color: #8b6914; font-style: italic; margin-bottom: 30px; }'
            + 'h2 { color: #8b4513; margin-top: 36px; padding: 8px 14px; background: rgba(245, 201, 122, 0.4); border-radius: 8px; border-left: 5px solid #d48a00; }'
            + '.grifo { padding: 14px 16px; border-radius: 10px; margin: 10px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }'
            + '.cap { font-size: 12px; color: #8b6914; margin-top: 6px; font-style: italic; }'
            + '.rodape { text-align: center; margin-top: 50px; padding-top: 14px; border-top: 1px dashed #d4a574; color: #8b6914; font-size: 12px; }'
            + '@media print { body { background: white; } }'
            + '</style></head><body>'
            + '<h1>📒 Caderno Espiritual</h1>'
            + '<p class="sub">de <strong>' + nomeUsuario + '</strong> — ' + dataFmt + '</p>';

        let secoes = '';
        Object.values(porLivro).forEach(l => {
            secoes += '<h2>📖 ' + l.titulo + '</h2>';
            l.lista.forEach(g => {
                secoes += '<div class="grifo" style="background:' + (g.corBg || '#FEF08A') + ';color:' + (g.corTexto || '#713F12') + ';">'
                       + '"' + g.texto + '"'
                       + '<div class="cap">Capítulo ' + (g.capitulo || '?') + '</div>'
                       + '</div>';
            });
        });

        const finalHtml = html + secoes
            + '<div class="rodape">Marcações feitas no app <strong>Converse com Maria</strong><br>www.conversecommaria.com.br</div>'
            + '</body></html>';

        // Pop-up bloqueado em iOS PWA. Usa same-window overlay + iframe + botão claro.
        const overlay = document.createElement('div');
        overlay.id = 'biblio-pdf-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:1000000;background:#000;display:flex;flex-direction:column;';
        overlay.innerHTML =
            '<div style="background:linear-gradient(135deg,#5b2206,#a34b10);padding:14px 16px;display:flex;justify-content:space-between;align-items:center;color:#fff;">'
            + '  <button onclick="document.getElementById(\'biblio-pdf-overlay\').remove()" style="background:rgba(255,255,255,0.15);border:none;color:#fff;width:44px;height:44px;border-radius:50%;font-size:20px;">✕</button>'
            + '  <span style="font-weight:bold;">📒 Seu Caderno Espiritual</span>'
            + '  <button id="btn-imprimir-pdf" style="background:linear-gradient(135deg,#fbbf24,#d97706);border:none;color:#000;padding:10px 16px;border-radius:30px;font-weight:bold;font-size:14px;">🖨️ Salvar PDF</button>'
            + '</div>'
            + '<iframe id="iframe-pdf" style="flex:1;border:none;width:100%;background:#fef8eb;"></iframe>';
        document.body.appendChild(overlay);
        const iframe = document.getElementById('iframe-pdf');
        iframe.contentDocument.open();
        iframe.contentDocument.write(finalHtml);
        iframe.contentDocument.close();
        document.getElementById('btn-imprimir-pdf').onclick = () => {
            try { iframe.contentWindow.print(); } catch (e) { console.error(e); }
        };
        // Banner instruindo
        setTimeout(() => this.toast('🖨️ Toque em "Salvar PDF" no topo →'), 600);
    },

    // ============ COMPARTILHAR GRIFO COMO IMAGEM ============
    async compartilharComoImagem(grifoId) {
        // Bloqueia cliques múltiplos (html2canvas é pesado, leva 2-5s)
        if (this._compartilhando) return;
        this._compartilhando = true;

        const grifo = this.grifos.find(g => g.id === grifoId);
        if (!grifo) { this._compartilhando = false; return; }

        if (typeof html2canvas === 'undefined') {
            this._compartilhando = false;
            this.compartilharGrifo(grifoId);
            return;
        }

        // Spinner visual
        const spinner = document.createElement('div');
        spinner.id = 'biblio-spinner';
        spinner.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;';
        spinner.innerHTML = '<div style="width:48px;height:48px;border:4px solid rgba(255,255,255,0.2);border-top-color:#FFD700;border-radius:50%;animation:spin 1s linear infinite;"></div><p style="color:#fff;font-size:14px;">Preparando imagem...</p><style>@keyframes spin{to{transform:rotate(360deg);}}</style>';
        document.body.appendChild(spinner);

        // Cria card escondido com manto Maria de fundo
        // M7 (Camila/Eduardo): cores do card seguem o tema atual da biblioteca
        // pra ficar coerente com o que o user está vendo (sépia/claro/escuro).
        const palette = this._paletteCardCompartilhar();

        const card = document.createElement('div');
        card.style.cssText = 'position:fixed;left:-99999px;top:0;width:540px;padding:0;background:#000;font-family:Georgia,serif;';
        card.innerHTML =
            '<div style="position:relative;width:540px;height:720px;background:' + palette.gradient + ';overflow:hidden;">'
            + '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%, ' + palette.glow + ', transparent 60%);"></div>'
            + '<div style="position:absolute;top:32px;left:50%;transform:translateX(-50%);font-size:38px;">✨</div>'
            + '<div style="position:absolute;top:80px;left:30px;right:30px;text-align:center;color:' + palette.accent + ';font-style:italic;font-size:14px;letter-spacing:2px;">CONVERSE COM MARIA</div>'
            + '<div style="position:absolute;top:140px;left:48px;right:48px;color:' + palette.text + ';font-size:22px;line-height:1.6;text-align:center;text-shadow:0 2px 16px rgba(0,0,0,0.4);">'
            + '<div style="font-size:60px;color:' + palette.quote + ';line-height:1;margin-bottom:8px;">“</div>'
            + grifo.texto
            + '<div style="font-size:60px;color:' + palette.quote + ';line-height:1;margin-top:8px;">”</div>'
            + '</div>'
            + '<div style="position:absolute;bottom:90px;left:30px;right:30px;text-align:center;color:' + palette.titulo + ';font-size:16px;font-weight:bold;">' + grifo.livroTitulo + '</div>'
            + '<div style="position:absolute;bottom:60px;left:30px;right:30px;text-align:center;color:' + palette.muted + ';font-size:12px;">Capítulo ' + (grifo.capitulo || '') + '</div>'
            + '<div style="position:absolute;bottom:20px;left:0;right:0;text-align:center;color:' + palette.muted + ';font-size:11px;">www.conversecommaria.com.br</div>'
            + '</div>';
        document.body.appendChild(card);

        try {
            const canvas = await html2canvas(card, { scale: 2, backgroundColor: null, useCORS: true });
            document.body.removeChild(card);
            document.getElementById('biblio-spinner')?.remove();

            if (window.CompartilharService) {
                await CompartilharService.compartilharComImagem(canvas, 'Grifo de Maria', '"' + grifo.texto + '" — ' + grifo.livroTitulo);
            } else {
                const url = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = url;
                a.download = 'grifo-maria.png';
                a.click();
                this.toast('💾 Imagem baixada');
            }
        } catch (e) {
            console.error('compartilharComoImagem:', e);
            try { document.body.removeChild(card); } catch(_) {}
            document.getElementById('biblio-spinner')?.remove();
            this.toast('Erro ao gerar imagem');
        } finally {
            this._compartilhando = false;
        }
    },

    voltar() {
        this.guardarCaneta();
        document.getElementById('leitor-modal')?.remove();
        this.abrir();
    },

    async capAnt() {
        if (this.capituloAtual > 0) {
            this.capituloAtual--;
            const ok = await this._garantirCapitulo(this.capituloAtual);
            if (!ok) { this.capituloAtual++; this._avisoOffline(); return; }
            this.renderLeitor();
        } 
    },

    async capProx() {
        if (this.capituloAtual < this.livroAtual.capitulos.length - 1) {
            this.capituloAtual++;
            const ok = await this._garantirCapitulo(this.capituloAtual);
            if (!ok) { this.capituloAtual--; this._avisoOffline(); return; }
            this.renderLeitor();
        } 
    },

    meusGrifos() {
        document.getElementById('biblio-modal')?.remove();
        
        const porLivro = {};
        this.grifos.forEach(g => {
            if (!porLivro[g.livroId]) porLivro[g.livroId] = { titulo: g.livroTitulo, lista: [] };
            porLivro[g.livroId].lista.push(g);
        });
        
        const modal = document.createElement('div');
        modal.id = 'biblio-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#1e1b4b;display:flex;flex-direction:column;';
        
        modal.innerHTML = `
            <div style="padding:16px;display:flex;justify-content:space-between;align-items:center;">
                <button onclick="BibliotecaCrista.abrir()" style="background:rgba(255,255,255,0.1);border:none;border-radius:50%;width:44px;height:44px;color:#fff;font-size:20px;">←</button>
                <span style="color:#fff;font-size:18px;font-weight:bold;">🖍️ Marcações</span>
                <button onclick="BibliotecaCrista.exportarCadernoPDF()" aria-label="Exportar PDF" title="Exportar caderno em PDF (Premium)" style="background:linear-gradient(135deg,#fbbf24,#d97706);border:none;border-radius:50%;width:44px;height:44px;color:#000;font-size:18px;font-weight:bold;">📒</button>
            </div>
            <div style="flex:1;overflow-y:auto;padding:16px;">
                ${this.grifos.length === 0 ? '<p style="color:#fff;text-align:center;opacity:0.6;">Nenhuma marcação</p>' : 
                Object.entries(porLivro).map(([id, l]) => `
                    <div style="margin-bottom:20px;">
                        <div style="color:#fff;font-weight:bold;margin-bottom:10px;">${l.titulo}</div>
                        ${l.lista.map(g => `
                            <div onclick="BibliotecaCrista.clicarGrifo('${g.id}')" style="background:${g.corBg};color:${g.corTexto};padding:12px;border-radius:10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:flex-start;gap:10px;cursor:pointer;">
                                <p style="margin:0;font-size:14px;flex:1;">"${g.texto}"</p>
                                <button onclick="event.stopPropagation();BibliotecaCrista.compartilharComoImagem('${g.id}')" style="background:rgba(0,0,0,0.15);border:none;border-radius:50%;width:36px;height:36px;font-size:16px;cursor:pointer;color:${g.corTexto};flex-shrink:0;">📤</button>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    config() {
        const modal = document.createElement('div');
        modal.id = 'config-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.6);display:flex;align-items:flex-end;';
        modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div style="background:#fff;border-radius:24px 24px 0 0;padding:24px;width:100%;">
                <h3 style="text-align:center;margin:0 0 20px;">⚙️ Config</h3>
                <p style="margin:0 0 8px;">Fonte: ${this.config.tamanhoFonte}</p>
                <div style="display:flex;gap:10px;margin-bottom:20px;">
                    <button onclick="BibliotecaCrista.fonte(-2)" style="flex:1;padding:14px;border:none;background:#eee;border-radius:12px;font-size:18px;">A−</button>
                    <button onclick="BibliotecaCrista.fonte(2)" style="flex:1;padding:14px;border:none;background:#eee;border-radius:12px;font-size:18px;">A+</button>
                </div>
                <div style="display:flex;gap:8px;">
                    <button onclick="BibliotecaCrista.tema('sepia')" style="flex:1;padding:14px;border-radius:12px;border:2px solid ${this.config.temaLeitor==='sepia'?'#f59e0b':'#ddd'};background:#f5e6d3;">Sépia</button>
                    <button onclick="BibliotecaCrista.tema('claro')" style="flex:1;padding:14px;border-radius:12px;border:2px solid ${this.config.temaLeitor==='claro'?'#3b82f6':'#ddd'};background:#fff;">Claro</button>
                    <button onclick="BibliotecaCrista.tema('escuro')" style="flex:1;padding:14px;border-radius:12px;border:2px solid ${this.config.temaLeitor==='escuro'?'#8b5cf6':'#ddd'};background:#1a1a1a;color:#fff;">Escuro</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    fonte(d) {
        this.config.tamanhoFonte = Math.max(14, Math.min(32, this.config.tamanhoFonte + d));
        this.salvar();
        document.getElementById('config-modal')?.remove();
        this.renderLeitor();
    },

    tema(t) {
        this.config.temaLeitor = t;
        this.salvar();
        document.getElementById('config-modal')?.remove();
        this.renderLeitor();
    },

    toast(msg) {
        document.getElementById('toast')?.remove();
        const t = document.createElement('div');
        t.id = 'toast';
        t.textContent = msg;
        t.style.cssText = 'position:fixed;bottom:200px;left:50%;transform:translateX(-50%);background:#000;color:#fff;padding:12px 24px;border-radius:30px;z-index:999999;font-size:14px;';
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2000);
    },

    toastComAcao(msg, btnText, callback) {
        document.getElementById('toast')?.remove();
        const t = document.createElement('div');
        t.id = 'toast';
        t.style.cssText = 'position:fixed;bottom:200px;left:50%;transform:translateX(-50%);background:#000;color:#fff;padding:10px 14px;border-radius:30px;z-index:999999;font-size:14px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 20px rgba(0,0,0,0.3);';
        const span = document.createElement('span');
        span.textContent = msg;
        t.appendChild(span);
        const btn = document.createElement('button');
        btn.textContent = btnText;
        btn.style.cssText = 'background:#4f46e5;color:#fff;border:none;border-radius:20px;padding:6px 14px;font-size:13px;font-weight:bold;cursor:pointer;';
        btn.onclick = () => { t.remove(); callback(); };
        t.appendChild(btn);
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 5000);
    }
};

document.addEventListener('DOMContentLoaded', () => BibliotecaCrista.init());
window.BibliotecaCrista = BibliotecaCrista;
console.log('📚 Biblioteca v11 - PEGA CANETA PRIMEIRO!');
