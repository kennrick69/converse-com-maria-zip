/**
 * emoji-replacer.js — substitui emojis nativos por imagens personalizadas
 * em runtime no app Maria.
 *
 * ESCOPO ENXUTO (revisão da squad — Eduardo/Camila/Bruno/Patrícia):
 * - Mantemos APENAS os emojis devocionais centrais (5 PNGs)
 * - Utilitários (✅ ❌ 🔄 📋 🔒 etc) ficam emoji nativo
 * - Sparkles/crown/brain/book/books grandes (>250KB) ficam nativos
 * - Total de assets carregados: ~310KB (antes era 5.4MB)
 *
 * Como funciona:
 *   - Carrega 1 vez no app, define o mapa emoji → URL_PNG
 *   - 1ª passada (em requestIdleCallback): varre body e substitui textNodes
 *     com emojis mapeados por <img class="emo-img"> (height: 1em)
 *   - MutationObserver cobre HTML adicionado dinamicamente (modais, innerHTML)
 *
 * O que NÃO é tocado (por design):
 *   - <script>, <style>, <textarea>, <input>, <code>, <pre>, <option>
 *   - Elementos com classe `no-emo` ou `contenteditable`
 *   - Atributos (alt, title, placeholder)
 *   - Texto que NÃO passa pelo DOM (canvas.fillText, navigator.share,
 *     clipboard.writeText) — vai como emoji unicode pro destinatário
 *
 * Killswitch dev: localStorage.setItem('disable-emoji-img', '1')
 */
(function () {
    'use strict';

    try {
        if (localStorage.getItem('disable-emoji-img') === '1') {
            console.log('[emoji-replacer] desligado via localStorage');
            return;
        }
    } catch (_) { /* localStorage indisponível (modo privado iOS) — segue */ }

    // MAP COMPLETO — JOs (2026-06-02): "mapeie todos sem exceção"
    // Bundle total ~7MB. Eduardo já alertou sobre tamanho: idealmente
    // crown/brain/book/sparkles deveriam ser resize pra 128×128 (de
    // 2480×3508 etc), mas WSL não tem ferramenta de imagem. Por ora,
    // service worker cacheia pós-1ª carga.
    const MAP = {
        // === Devocional ===
        '🙏': 'icones/emoji-pray.png',         // 30KB — mãos rezando
        '🌹': 'icones/emoji-rose.png',         // 37KB — rosa mariana
        '🕯️': 'icones/emoji-candle.png',       // 70KB — vela acesa
        '🕯': 'icones/emoji-candle.png',
        '👑': 'icones/emoji-crown.png',        // 1.5MB — coroa Maria
        '✨': 'icones/emoji-sparkles.png',     // 463KB — brilho
        '🐑': 'icones/emoji-sheep.png',        // 144KB — Bom Pastor
        '✝️': 'icones/emoji-cruz.png',         // 3KB  — Cruz com coração (JOs 2026-06-03)
        '✝': 'icones/emoji-cruz.png',
        // === Conquistas / status ===
        '🏅': 'icones/emoji-medal.png',        // 26KB — medalha
        '⭐': 'icones/emoji-star.png',          // 94KB — estrela
        '★': 'icones/emoji-star.png',
        '✦': 'icones/emoji-star4.png',         // 24KB — estrela 4 pontas
        '🔥': 'icones/emoji-fire.png',         // 128KB — streak
        // === Marcações / status ===
        '✅': 'icones/emoji-check-green.png',  // 75KB — check verde
        '✓': 'icones/emoji-check-thin.png',    // 13KB — check fino
        '❌': 'icones/emoji-x-red.png',         // 64KB — X vermelho
        '✗': 'icones/emoji-x-thin.png',        // 25KB — X fino
        '⚠️': 'icones/emoji-warning.png',      // 49KB — aviso
        '⚠': 'icones/emoji-warning.png',
        '🔒': 'icones/emoji-lock.png',         // 26KB — cadeado
        '⚙️': 'icones/emoji-engrenagem.png',   // 2.6KB — engrenagem (JOs 2026-06-03)
        '⚙': 'icones/emoji-engrenagem.png',
        // === Leitura / app ===
        '📖': 'icones/emoji-book.png',         // 979KB — livro aberto
        '📚': 'icones/emoji-books.png',        // 270KB — pilha livros
        '🧠': 'icones/emoji-brain.png',        // 962KB — cérebro
        '💬': 'icones/emoji-speech.png',       // 18KB — balão fala
        '💭': 'icones/emoji-thought.png',      // 49KB — balão pensamento
        // === UI ===
        '🔔': 'icones/emoji-bell.png',         // 15KB — sino
        '📱': 'icones/emoji-phone.png',        // 13KB — celular
        '📤': 'icones/emoji-outbox.png',       // 48KB — caixa de saída
        '💾': 'icones/emoji-floppy.png',       // 8KB  — disquete
        '📋': 'icones/emoji-clipboard.png',    // 45KB — clipboard
        '📺': 'icones/emoji-tv.png',           // 40KB — TV (anúncios)
        '🔄': 'icones/emoji-refresh.png',      // 6KB  — refresh
        '🗑️': 'icones/emoji-trash.png',        // 11KB — lixeira
        '🗑': 'icones/emoji-trash.png'
    };

    // Chaves ordenadas por tamanho desc (variantes com VS16 primeiro)
    const KEYS = Object.keys(MAP).sort((a, b) => b.length - a.length);

    // Regex única (Bruno hotfix #4) pra substituir splits N-passes
    const RE_EMOJI = new RegExp(
        KEYS.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
        'gu'
    );

    const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'OPTION', 'NOSCRIPT']);

    // Cache de "este parent deve ser pulado?" — Bruno hotfix #3
    const skipCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;

    function deveSkiparNode(node) {
        let p = node.parentElement;
        if (!p) return false;
        if (skipCache && skipCache.has(p)) return skipCache.get(p);

        let cur = p, result = false;
        while (cur) {
            if (SKIP_TAGS.has(cur.tagName)) { result = true; break; }
            if (cur.classList && cur.classList.contains('no-emo')) { result = true; break; }
            if (cur.isContentEditable) { result = true; break; }
            cur = cur.parentElement;
        }
        if (skipCache) skipCache.set(p, result);
        return result;
    }

    function processarTextNode(textNode) {
        const texto = textNode.nodeValue;
        if (!texto) return;
        RE_EMOJI.lastIndex = 0;
        if (!RE_EMOJI.test(texto)) return;
        RE_EMOJI.lastIndex = 0;

        const frag = document.createDocumentFragment();
        const parentEl = textNode.parentElement;
        const fontSize = parentEl ? parseFloat(getComputedStyle(parentEl).fontSize) : 16;
        const ehGrande = fontSize >= 36;  // Camila top #2 — header grande

        // "emo-solo" quando o texto inteiro é só whitespace + emojis.
        // Caso típico: <div class="round bg-orange">🕯️</div> — sem essa
        // detecção, o margin lateral desloca o emoji pra direita do centro.
        const textoSemEmoji = texto.replace(RE_EMOJI, '').trim();
        const ehSolo = textoSemEmoji.length === 0;
        RE_EMOJI.lastIndex = 0;

        let cursor = 0;
        let m;
        while ((m = RE_EMOJI.exec(texto)) !== null) {
            if (m.index > cursor) {
                frag.appendChild(document.createTextNode(texto.slice(cursor, m.index)));
            }
            const emo = m[0];
            const url = MAP[emo];
            if (url) {
                const img = document.createElement('img');
                img.src = url;
                img.alt = emo;
                let cls = 'emo-img';
                if (ehGrande) cls += ' emo-big';
                if (ehSolo) cls += ' emo-solo';
                img.className = cls;
                img.draggable = false;
                if (ehGrande) {
                    img.decoding = 'sync';  // header above-the-fold
                } else {
                    img.loading = 'lazy';
                    img.decoding = 'async';
                }
                // Sentry-like fallback se PNG quebrar
                img.onerror = function () {
                    const fallback = document.createTextNode(emo);
                    if (img.parentNode) img.parentNode.replaceChild(fallback, img);
                };
                frag.appendChild(img);
            } else {
                frag.appendChild(document.createTextNode(emo));
            }
            cursor = m.index + emo.length;
        }
        if (cursor < texto.length) {
            frag.appendChild(document.createTextNode(texto.slice(cursor)));
        }
        if (textNode.parentNode) {
            textNode.parentNode.replaceChild(frag, textNode);
        }
    }

    function varrer(raiz) {
        if (!raiz || raiz.nodeType !== 1) return;
        const walker = document.createTreeWalker(
            raiz,
            NodeFilter.SHOW_TEXT,
            { acceptNode: function (n) {
                if (deveSkiparNode(n)) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }}
        );
        const lote = [];
        let n;
        while ((n = walker.nextNode())) {
            if (n.nodeValue && RE_EMOJI.test(n.nodeValue)) lote.push(n);
            RE_EMOJI.lastIndex = 0;
        }
        for (let i = 0; i < lote.length; i++) processarTextNode(lote[i]);
    }

    function injetarCSS() {
        if (document.getElementById('emo-img-style')) return;
        const style = document.createElement('style');
        style.id = 'emo-img-style';
        // Camila top #3: REMOVIDO user-select:none — permite copy de texto com emoji
        style.textContent =
            'img.emo-img{display:inline-block;height:1em;width:auto;vertical-align:-0.125em;margin:0 0.05em;pointer-events:none;object-fit:contain;}' +
            'img.emo-img.emo-big{vertical-align:baseline;margin:0;}' +
            // emo-solo: emoji é o único conteúdo do parent (ex: medalha redonda).
            // Zera margin e centraliza verticalmente — evita deslocamento horizontal
            // do ícone dentro de containers flex/grid centralizados.
            'img.emo-img.emo-solo{margin:0;vertical-align:middle;}' +
            '.no-emo img.emo-img{display:none;}';
        (document.head || document.documentElement).appendChild(style);
    }

    // Bruno hotfix #2 — varredura inicial via requestIdleCallback (tira jank)
    function agendarVarredura(cb) {
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(cb, { timeout: 1500 });
        } else {
            setTimeout(cb, 0);
        }
    }

    function init() {
        injetarCSS();
        if (document.body) {
            agendarVarredura(function () { varrer(document.body); });
        }

        const obs = new MutationObserver(function (muts) {
            for (let i = 0; i < muts.length; i++) {
                const mut = muts[i];
                if (mut.type === 'characterData') {
                    if (mut.target && mut.target.nodeType === 3 && mut.target.parentNode && !deveSkiparNode(mut.target)) {
                        processarTextNode(mut.target);
                    }
                    continue;
                }
                const adicionados = mut.addedNodes;
                for (let j = 0; j < adicionados.length; j++) {
                    const node = adicionados[j];
                    if (node.nodeType === 3) {
                        if (node.parentNode && !deveSkiparNode(node)) processarTextNode(node);
                    } else if (node.nodeType === 1) {
                        if (!deveSkiparNode(node)) varrer(node);
                    }
                }
            }
        });
        if (document.body) {
            obs.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
