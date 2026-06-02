/**
 * emoji-replacer.js — substitui emojis nativos por imagens personalizadas
 * em runtime, em todo o DOM do app Maria.
 *
 * Como funciona:
 *   - Define um mapa Unicode → URL de PNG personalizado
 *   - Na carga: varre todos os textNodes do body e substitui os emojis
 *     mapeados por <img class="emo-img"> dimensionada em 1em
 *   - Via MutationObserver: cobre HTML adicionado dinamicamente
 *     (modais, innerHTML, append etc.)
 *
 * O que NÃO é tocado:
 *   - <script>, <style>, <textarea>, <input>, <code>, <pre>, <option>
 *   - Qualquer elemento com classe `no-emo` ou `contenteditable`
 *   - Atributos (alt, title, placeholder) — só textNodes
 *   - Texto enviado pra share/clipboard/canvas (não passa pelo DOM)
 *
 * Pra desligar em dev: localStorage.setItem('disable-emoji-img', '1')
 */
(function () {
    'use strict';

    if (localStorage.getItem('disable-emoji-img') === '1') {
        console.log('[emoji-replacer] desligado via localStorage');
        return;
    }

    // Mapa emoji → asset. Inclui variantes com VS16 (U+FE0F).
    const MAP = {
        '🙏': 'icones/emoji-pray.png',
        '🌹': 'icones/emoji-rose.png',
        '✅': 'icones/emoji-check-green.png',
        '❌': 'icones/emoji-x-red.png',
        '✓': 'icones/emoji-check-thin.png',
        '✗': 'icones/emoji-x-thin.png',
        '✨': 'icones/emoji-sparkles.png',
        '★': 'icones/emoji-star.png',
        '✦': 'icones/emoji-star4.png',
        '🔔': 'icones/emoji-bell.png',
        '👑': 'icones/emoji-crown.png',
        '📱': 'icones/emoji-phone.png',
        '🔥': 'icones/emoji-fire.png',
        '⚠️': 'icones/emoji-warning.png',
        '⚠': 'icones/emoji-warning.png',
        '🕯️': 'icones/emoji-candle.png',
        '🕯': 'icones/emoji-candle.png',
        '📖': 'icones/emoji-book.png',
        '📚': 'icones/emoji-books.png',
        '🏅': 'icones/emoji-medal.png',
        '💬': 'icones/emoji-speech.png',
        '💭': 'icones/emoji-thought.png',
        '🗑️': 'icones/emoji-trash.png',
        '🗑': 'icones/emoji-trash.png',
        '📤': 'icones/emoji-outbox.png',
        '💾': 'icones/emoji-floppy.png',
        '📋': 'icones/emoji-clipboard.png',
        '🧠': 'icones/emoji-brain.png',
        '📺': 'icones/emoji-tv.png',
        '🔄': 'icones/emoji-refresh.png',
        '🔒': 'icones/emoji-lock.png',
        '🐑': 'icones/emoji-sheep.png'
    };

    // Chaves ordenadas pelo tamanho (variantes com VS16 primeiro pra match
    // antes que a versão sem VS16 consuma o caractere base)
    const KEYS = Object.keys(MAP).sort((a, b) => b.length - a.length);

    const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'OPTION', 'NOSCRIPT']);

    function deveSkiparNode(node) {
        let p = node.parentElement;
        while (p) {
            if (SKIP_TAGS.has(p.tagName)) return true;
            if (p.classList && p.classList.contains('no-emo')) return true;
            if (p.isContentEditable) return true;
            p = p.parentElement;
        }
        return false;
    }

    function textoTemEmoji(texto) {
        for (let i = 0; i < KEYS.length; i++) {
            if (texto.indexOf(KEYS[i]) !== -1) return true;
        }
        return false;
    }

    function processarTextNode(textNode) {
        const texto = textNode.nodeValue;
        if (!texto || !textoTemEmoji(texto)) return;

        // Split-by-emoji preservando ordem
        let segs = [{ t: 't', v: texto }];
        for (const chave of KEYS) {
            const novos = [];
            for (const s of segs) {
                if (s.t === 'i') { novos.push(s); continue; }
                if (s.v.indexOf(chave) === -1) { novos.push(s); continue; }
                const partes = s.v.split(chave);
                for (let i = 0; i < partes.length; i++) {
                    if (i > 0) novos.push({ t: 'i', e: chave });
                    if (partes[i]) novos.push({ t: 't', v: partes[i] });
                }
            }
            segs = novos;
        }

        if (segs.length === 1 && segs[0].t === 't') return; // nenhuma substituição

        const frag = document.createDocumentFragment();
        for (const s of segs) {
            if (s.t === 'i') {
                const img = document.createElement('img');
                img.src = MAP[s.e];
                img.alt = s.e;
                img.className = 'emo-img';
                img.draggable = false;
                img.loading = 'lazy';
                img.decoding = 'async';
                frag.appendChild(img);
            } else {
                frag.appendChild(document.createTextNode(s.v));
            }
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
            {
                acceptNode: function (n) {
                    if (deveSkiparNode(n)) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        const lote = [];
        let n;
        while ((n = walker.nextNode())) {
            if (n.nodeValue && textoTemEmoji(n.nodeValue)) lote.push(n);
        }
        for (let i = 0; i < lote.length; i++) processarTextNode(lote[i]);
    }

    function injetarCSS() {
        if (document.getElementById('emo-img-style')) return;
        const style = document.createElement('style');
        style.id = 'emo-img-style';
        style.textContent =
            'img.emo-img{display:inline-block;height:1em;width:auto;vertical-align:-0.125em;margin:0 0.05em;user-select:none;-webkit-user-drag:none;pointer-events:none;object-fit:contain;}' +
            'img.emo-img.emo-big{height:1.4em;}' +
            '.no-emo img.emo-img{display:none;}';
        (document.head || document.documentElement).appendChild(style);
    }

    function init() {
        injetarCSS();
        if (document.body) varrer(document.body);

        // Observador pra DOM dinâmico (modais, innerHTML, append)
        const obs = new MutationObserver(function (muts) {
            for (let i = 0; i < muts.length; i++) {
                const mut = muts[i];
                if (mut.type === 'characterData') {
                    if (mut.target.nodeType === 3 && !deveSkiparNode(mut.target)) {
                        processarTextNode(mut.target);
                    }
                    continue;
                }
                const adicionados = mut.addedNodes;
                for (let j = 0; j < adicionados.length; j++) {
                    const node = adicionados[j];
                    if (node.nodeType === 3) {
                        if (!deveSkiparNode(node)) processarTextNode(node);
                    } else if (node.nodeType === 1) {
                        if (!deveSkiparNode(node)) varrer(node);
                    }
                }
            }
        });
        obs.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
