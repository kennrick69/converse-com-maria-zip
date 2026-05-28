// ========================================
// 📚 BIBLIOTECA CRISTÃ - VERSÃO 11
// PEGA CANETA PRIMEIRO → SELECIONA → MARCA!
// ========================================

const BibliotecaCrista = {
    URL_BASE: 'https://conversecommaria.com.br/livros',
    
    config: { tamanhoFonte: 20, temaLeitor: 'sepia' },
    catalogo: [],
    livrosCache: {},
    grifos: [],
    livroAtual: null,
    capituloAtual: 0,
    
    // CANETA
    canetaAtiva: null, // null = sem caneta, ou {nome, bg, texto}

    cores: [
        { nome: 'Amarelo', bg: '#FEF08A', texto: '#713F12' },
        { nome: 'Verde', bg: '#BBF7D0', texto: '#14532D' },
        { nome: 'Azul', bg: '#BFDBFE', texto: '#1E3A8A' },
        { nome: 'Rosa', bg: '#FBCFE8', texto: '#831843' },
        { nome: 'Laranja', bg: '#FED7AA', texto: '#7C2D12' }
    ],

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
    async carregarCatalogoDoFirestore() {
        try {
            if (!window.firebase || !firebase.firestore) return null;
            const snap = await firebase.firestore().collection('conteudo_livros').orderBy('ordem', 'asc').get();
            if (snap.empty) return null;
            const livros = snap.docs.map(d => {
                const data = d.data();
                return {
                    id: data.id || d.id,
                    titulo: data.titulo,
                    autor: data.autor,
                    capa: data.capa || '📖',
                    _fonteFirestore: true,
                    _docId: d.id,
                    _capitulos: data.capitulos || []
                };
            });
            return livros;
        } catch (e) {
            console.warn('[biblioteca] Firestore catálogo falhou, fallback Hostinger:', e.message);
            return null;
        }
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
        // 1) Firestore: vê se o item do catálogo veio do Firestore (tem _capitulos embedded)
        const meta = (this.catalogo || []).find(x => x.id === id);
        if (meta && meta._fonteFirestore && Array.isArray(meta._capitulos)) {
            const livro = {
                id: meta.id,
                titulo: meta.titulo,
                autor: meta.autor,
                capa: meta.capa,
                capitulos: meta._capitulos
            };
            this.livrosCache[id] = livro;
            this.salvar();
            return livro;
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
        
        document.getElementById('biblio-lista').innerHTML = this.catalogo.map(l => `
            <div onclick="BibliotecaCrista.abrirLivro('${l.id}')" style="background:rgba(255,255,255,0.1);border-radius:16px;padding:16px;margin-bottom:12px;display:flex;gap:12px;align-items:center;">
                <span style="font-size:40px;">${l.capa}</span>
                <div>
                    <div style="color:#fff;font-weight:bold;">${l.titulo}</div>
                    <div style="color:#a5b4fc;font-size:14px;">${l.autor}</div>
                </div>
            </div>
        `).join('');
    },

    fechar() {
        document.getElementById('biblio-modal')?.remove();
        document.getElementById('leitor-modal')?.remove();
        this.canetaAtiva = null;
        document.body.style.overflow = '';
    },

    async abrirLivro(id) {
        this.livroAtual = await this.carregarLivro(id);
        this.capituloAtual = 0;
        this.canetaAtiva = null;
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
                    <div style="font-size:11px;opacity:0.6;">Cap ${cap.numero}/${livro.capitulos.length}</div>
                </div>
                <button onclick="BibliotecaCrista.config()" style="background:none;border:none;font-size:20px;">⚙️</button>
            </div>
            
            <!-- BARRA DA CANETA -->
            <div id="barra-caneta" style="display:none;padding:10px;text-align:center;font-weight:bold;">
                🖍️ Caneta ativa! Selecione o texto
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
                
                <!-- CANETAS -->
                <div style="display:flex;justify-content:center;gap:10px;margin-bottom:12px;">
                    ${this.cores.map((c, i) => `
                        <button id="caneta-${i}" onclick="BibliotecaCrista.pegarCaneta(${i})" style="
                            width:50px;
                            height:50px;
                            border-radius:50%;
                            border:4px solid ${this.canetaAtiva?.nome === c.nome ? '#000' : 'transparent'};
                            background:${c.bg};
                            box-shadow:0 4px 12px rgba(0,0,0,0.25);
                            cursor:pointer;
                            transition: transform 0.2s, border 0.2s;
                            transform: ${this.canetaAtiva?.nome === c.nome ? 'scale(1.15)' : 'scale(1)'};
                        "></button>
                    `).join('')}
                    
                    <!-- BOTÃO GUARDAR -->
                    <button id="btn-guardar" onclick="BibliotecaCrista.guardarCaneta()" style="
                        width:50px;
                        height:50px;
                        border-radius:50%;
                        border:none;
                        background:${this.canetaAtiva ? '#ef4444' : '#e5e5e5'};
                        box-shadow:0 4px 12px rgba(0,0,0,0.15);
                        cursor:pointer;
                        font-size:20px;
                        display:${this.canetaAtiva ? 'flex' : 'none'};
                        align-items:center;
                        justify-content:center;
                        color:#fff;
                    ">✕</button>
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
        
        // Restaurar grifos
        setTimeout(() => this.restaurarGrifos(), 100);
        
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
        
        this.toast('🖍️ Caneta ' + cor.nome + '! Agora selecione o texto');
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
                barra.textContent = '🖍️ Caneta ' + this.canetaAtiva.nome + '! Selecione o texto';
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
            this.toastComAcao('✅ Marcado!', '📤 Compartilhar', () => this.compartilharGrifo(grifoId));

        } catch (e) {
            console.log('Usando fallback...');
            this.marcarFallback(texto, cor);
        }
    },

    marcarFallback(texto, cor) {
        const container = document.getElementById('texto-leitura');
        if (!container) return;
        
        const escaped = texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'i');
        const grifoId = Date.now().toString();
        
        container.innerHTML = container.innerHTML.replace(regex, 
            `<mark data-grifo-id="${grifoId}" onclick="event.stopPropagation();BibliotecaCrista.clicarGrifo('${grifoId}')" style="background:${cor.bg};color:${cor.texto};padding:2px 4px;border-radius:4px;cursor:pointer;">$1</mark>`
        );
        
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
        
        window.getSelection()?.removeAllRanges();
        
        // Reativa eventos (innerHTML destruiu os listeners)
        this.ativarEventosSelecao();

        this.toastComAcao('✅ Marcado!', '📤 Compartilhar', () => this.compartilharGrifo(grifoId));
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
                <button onclick="BibliotecaCrista.compartilharGrifo('${id}')" style="width:100%;padding:14px;background:#4f46e5;color:#fff;border:none;border-radius:12px;font-weight:bold;margin-bottom:10px;">📤 Compartilhar</button>
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

    async salvarFirebase() {
        try {
            if (!firebase?.auth) return;
            const user = firebase.auth().currentUser;
            if (!user) return;
            await firebase.firestore().collection('usuarios').doc(user.uid).collection('biblioteca').doc('grifos').set({ lista: this.grifos });
        } catch(e) {}
    },

    voltar() {
        this.guardarCaneta();
        document.getElementById('leitor-modal')?.remove();
        this.abrir();
    },

    capAnt() { 
        if (this.capituloAtual > 0) { 
            this.capituloAtual--; 
            this.renderLeitor(); 
        } 
    },

    capProx() { 
        if (this.capituloAtual < this.livroAtual.capitulos.length - 1) { 
            this.capituloAtual++; 
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
                <div style="width:44px;"></div>
            </div>
            <div style="flex:1;overflow-y:auto;padding:16px;">
                ${this.grifos.length === 0 ? '<p style="color:#fff;text-align:center;opacity:0.6;">Nenhuma marcação</p>' : 
                Object.entries(porLivro).map(([id, l]) => `
                    <div style="margin-bottom:20px;">
                        <div style="color:#fff;font-weight:bold;margin-bottom:10px;">${l.titulo}</div>
                        ${l.lista.map(g => `
                            <div onclick="BibliotecaCrista.clicarGrifo('${g.id}')" style="background:${g.corBg};color:${g.corTexto};padding:12px;border-radius:10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:flex-start;gap:10px;cursor:pointer;">
                                <p style="margin:0;font-size:14px;flex:1;">"${g.texto}"</p>
                                <button onclick="event.stopPropagation();BibliotecaCrista.compartilharGrifo('${g.id}')" style="background:rgba(0,0,0,0.15);border:none;border-radius:50%;width:36px;height:36px;font-size:16px;cursor:pointer;color:${g.corTexto};flex-shrink:0;">📤</button>
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
