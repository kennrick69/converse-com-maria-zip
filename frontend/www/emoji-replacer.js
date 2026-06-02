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

    // ESCOPO ENXUTO — só devocionais centrais. Os 5 maiores PNGs (crown,
    // brain, book, sparkles, books) foram removidos do mapa porque pesam
    // 4MB+ e cobrem casos utilitários sem ganho devocional.
    const MAP = {
        '🙏': 'icones/emoji-pray.png',       // 30KB — mãos rezando (mais usado)
        '🌹': 'icones/emoji-rose.png',       // 38KB — rosa mariana
        '🕯️': 'icones/emoji-candle.png',     // 71KB — vela acesa
        '🕯': 'icones/emoji-candle.png',
        '🏅': 'icones/emoji-medal.png',      // 27KB — medalha de conquista
        '🐑': 'icones/emoji-sheep.png'       // 144KB — ovelha (Bom Pastor)
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
                img.className = ehGrande ? 'emo-img emo-big' : 'emo-img';
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
