// ========================================
// 💬 FRASES DO DIA (F1 — 2026-05-25)
// Gerenciado pelo JOs via painel admin (collection: conteudo_frases)
// Cache local em localStorage pra funcionar offline.
// API pública: FrasesDoDia.fraseDeHoje() → { texto, autor }
// ========================================

const FrasesDoDia = {
    _cache: null,
    _carregadas: false,

    // Fallback estável caso Firestore vazio/offline
    fallback: [
        { texto: 'Não temas, eu estou contigo.', autor: 'Isaías 41,10' },
        { texto: 'Eis a serva do Senhor; faça-se em mim segundo a tua palavra.', autor: 'Lucas 1,38' },
        { texto: 'Façam tudo o que ele lhes disser.', autor: 'Maria (Jo 2,5)' },
        { texto: 'A minha alma engrandece o Senhor.', autor: 'Magnificat (Lc 1,46)' },
        { texto: 'Em todas as coisas dai graças.', autor: '1Tessalonicenses 5,18' },
    ],

    async carregar() {
        try {
            const local = localStorage.getItem('frasesDoDia');
            if (local) this._cache = JSON.parse(local);
        } catch (e) {}

        try {
            if (!window.firebase || !firebase.firestore) {
                if (!this._cache) this._cache = this.fallback;
                this._carregadas = true;
                return this._cache;
            }
            const snap = await firebase.firestore()
                .collection('conteudo_frases')
                .where('ativo', '!=', false)
                .get();
            if (!snap.empty) {
                this._cache = snap.docs.map(d => {
                    const data = d.data();
                    return { texto: data.texto, autor: data.autor || 'Anônimo' };
                });
                try { localStorage.setItem('frasesDoDia', JSON.stringify(this._cache)); } catch (e) {}
            }
        } catch (e) {
            console.warn('[frasesDia] Firestore falhou, usa cache/fallback:', e.message);
        }

        if (!this._cache || !this._cache.length) this._cache = this.fallback;
        this._carregadas = true;
        return this._cache;
    },

    // Frase determinística do dia (mesma frase pra todos usuários no mesmo dia).
    // Usa dia-do-ano + ano como semente — assim a frase só muda à meia-noite.
    fraseDeHoje() {
        const list = this._cache || this.fallback;
        if (!list.length) return { texto: '', autor: '' };
        const hoje = new Date();
        const inicioAno = new Date(hoje.getFullYear(), 0, 0);
        const diff = hoje - inicioAno;
        const diaDoAno = Math.floor(diff / (1000 * 60 * 60 * 24));
        const seed = (diaDoAno + hoje.getFullYear() * 1000) % list.length;
        return list[seed];
    },

    // Frase aleatória (não-determinística) — pra refresh manual
    fraseAleatoria() {
        const list = this._cache || this.fallback;
        return list[Math.floor(Math.random() * list.length)];
    },

    // Helper: renderiza no DOM um elemento com a frase
    // Uso: FrasesDoDia.renderEm('#minha-div')
    async renderEm(seletor) {
        if (!this._carregadas) await this.carregar();
        const el = document.querySelector(seletor);
        if (!el) return;
        const f = this.fraseDeHoje();
        el.innerHTML = `
            <blockquote style="font-style:italic;color:#444;line-height:1.5;margin:0;padding:12px 16px;border-left:3px solid #fbbf24;background:rgba(251,191,36,0.05);border-radius:6px;">
                "${f.texto}"
                <footer style="font-size:13px;color:#888;margin-top:6px;">— ${f.autor}</footer>
            </blockquote>
        `;
    }
};

// Auto-load no boot
if (typeof window !== 'undefined') {
    window.FrasesDoDia = FrasesDoDia;
    document.addEventListener('DOMContentLoaded', () => { FrasesDoDia.carregar(); });
}
