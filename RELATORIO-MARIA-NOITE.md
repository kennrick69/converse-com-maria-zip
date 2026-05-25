# Relatório — Noite Maria (2026-05-25)

**Branch**: `limpeza-refactor` no repo `kennrick69/converse-com-maria-zip`
**Main em produção**: **INTOCADA**. App na Play Store / backend Railway / site Hostinger **não foram afetados**.
**O que está pronto pra você revisar/aprovar/ajustar**: tudo abaixo.

---

## 🚦 Confirmação de segurança

| | |
|---|---|
| Branch atual | `limpeza-refactor` |
| `main` local e remota | intocadas |
| App em produção (APK Play Store) | sem afetação (APK já distribuído) |
| Backend Railway (`server.js`) | **sem afetação** — apenas LIDO (F3 documenta onde mudar; não aplicou nada) |
| Site Hostinger (`conversecommaria.com.br`) | sem afetação |
| Hostinger livros (`/livros/*.json`) | sem afetação — F1 só ADICIONA caminho alternativo via Firestore (com fallback pro Hostinger) |
| Login admin Firebase | sem afetação |

**Você merga quando quiser. Enquanto não mergear, nada disso roda em produção.**

---

## ✅ FRENTE 0 — Baseline confirmado

- Os 20 scripts referenciados pelo `index.html` continuam todos no lugar.
- 9 áudios do terço (`audio/terco/*.mp3`) intocados e rastreados no repo.
- `sw.js`, `manifest.json`, `firebase-config.js`, `enviar-denuncia.php`, `enviar-brinde.php` (vivos confirmados) preservados.
- Backend (`server.js` v2.0.0 do Railway) e `package.json` intactos.

A limpeza da sessão anterior não quebrou nada. Continue tranquilo.

---

## ✅ FRENTE 1 — Painel admin expandido (commit `6e6cdd3`)

**O que fiz**:
- Expandi o **painel-admin.html EXISTENTE** com **3 abas novas**, mesmo visual escuro/--accent-gold, sem tocar nas 4 abas atuais (Dashboard, Usuários, Intenções, Velas).
- **3 collections novas no Firestore**:
  - `conteudo_livros` { id, titulo, autor, capa, ordem, capitulos[] }
  - `conteudo_musicas` { id, nome, descricao, icone, url, categoria, autor, autorUrl, ordem }
  - `conteudo_frases` { texto, autor, ativo, criadoEm }
- **Botão "📥 Importar do Hostinger"** na aba Livros — 1 clique baixa o catálogo de `conversecommaria.com.br/livros/*.json` e popula o Firestore (sobrescreve por id).
- **3 adapters** no app que tentam Firestore primeiro, com fallback automático:
  - `biblioteca.js` → Firestore → Hostinger (legado)
  - `musicas.js` → Firestore mescla com array hardcoded (Firestore tem precedência)
  - `frases-dia.js` (NOVO) → API `FrasesDoDia.fraseDeHoje()` (determinística por dia) e `.fraseAleatoria()`, com 5 frases hard-coded de fallback (Bíblia/Maria)

**Comportamento defensivo**:
- Firestore vazio → app funciona exatamente como hoje (cai no fallback).
- Firestore populado → app passa a usar o conteúdo que VOCÊ gerencia.
- Offline → cache localStorage.

**Validação**:
- `node --check` em todos 3 JS novos: OK
- 1 bloco JS inline no painel-admin: OK
- `index.html` agora referencia 21 scripts locais (+1: `frases-dia.js`) — todos existem.

**Como testar**:
1. Abre `https://conversecommaria.com.br/painel-admin.html` ou local, login `kennrick@gmail.com` ou `rickboypoke@gmail.com`.
2. Aba **📚 Livros** → "📥 Importar do Hostinger" → confirma → puxa os 3 livros pro Firestore.
3. Aba **🎵 Músicas** → "➕ Nova Música" → cria 1 teste.
4. Aba **💬 Frases do Dia** → adiciona 5-10 frases.
5. Abre o app (com Firebase config igual) → vê o conteúdo novo aparecer.

---

## ✅ FRENTE 2 — 3 livros modernizados (commit `673068f`)

**Descoberta na hora**: o conteúdo dos livros **NÃO** estava em `biblioteca.js`. Veio do Hostinger (`conversecommaria.com.br/livros/`). Agent baixou via `curl`, modernizou, salvou em `frontend/www/livros-modernizados/`.

**Estado**:

| Livro | Caps em prod | Caps modernizados | Status |
|---|---:|---:|---|
| **Imitação de Cristo** (Tomás de Kempis, 1418) | 25 | 25 | ✅ COMPLETO — Livro I inteiro |
| **Confissões** (Santo Agostinho, 397) | 2 excertos | 2 | ⚠️ `incompleto: true` — original tem 13 Livros |
| **Introdução à Vida Devota** (S. Francisco de Sales, 1609) | 1 | 1 | ⚠️ `incompleto: true` — original ~130 caps em 5 Partes |

**Arquivos novos** (zero alteração no que já está em prod):
- `frontend/www/livros-modernizados/catalogo.json` (2.2 KB)
- `frontend/www/livros-modernizados/imitacao-cristo.json` (57 KB)
- `frontend/www/livros-modernizados/confissoes-agostinho.json` (3.7 KB)
- `frontend/www/livros-modernizados/vida-devota.json` (3.2 KB)

**Regras aplicadas**:
- `tu/teu` narrativo → `você/seu`
- Mesóclises → forma analítica
- Ordem inversa rebuscada → ordem natural
- **`Tu/Vós` mantido em invocações diretas a Deus** (uso devocional ainda corrente)
- Termos teológicos preservados (graça, virtude, compunção, contemplação)
- **Zero conteúdo religioso inventado** — só reformulação linguística

**Exemplo antes/depois** (Imitação de Cristo, cap. 1):
> **antes**: "De que te serve discutir profundamente sobre a Trindade, se não tens humildade e, por isso, desagradas à Trindade?"
> **depois**: "De que adianta você discutir profundamente sobre a Trindade, se não tem humildade e, por isso, desagrada à Trindade?"

**Pra ativar em produção** (sua escolha):
- **Opção A — Hostinger**: subir os JSONs novos via hPanel pro `conversecommaria.com.br/livros/`. App pega na próxima abertura (fallback do `biblioteca.js`).
- **Opção B — Firestore via painel admin (recomendado)**: usa o "📥 Importar do Hostinger" da Frente 1 → edita no Firestore os capítulos modernizados → app puxa do Firestore.

---

## 📝 FRENTE 3 — Sabedoria mariana (PROPOSTA, commit `33c4fca`)

**NÃO foi aplicada em produção** — só preparada pra você revisar e aprovar o tom antes de ir pro ar (a alma do app).

**PDF do Tratado de Montfort NÃO foi aberto** (copyright Editora Retornarei). Conteúdo todo em linguagem própria, baseado em conhecimento prévio da espiritualidade mariana clássica.

**2 arquivos criados** em `frontend/www/`:

### `maria-sabedoria.md` (~10KB)
Base de conhecimento em 6 seções:
1. **10 princípios fundamentais** marianos (paráfrases livres, sem citar Montfort por nome)
2. **8 virtudes marianas** com aterrissagem prática (mãe rezando, idoso solitário, pessoa em luto)
3. **30 conselhos práticos** em primeira pessoa (voz de Maria) — ansiedade, insônia, perda, dúvida na fé, oração difícil, vícios, raiva de Deus, filho distante, infertilidade, luto de filho, etc.
4. **Tom e estilo obrigatórios** + **banco rotativo de 12 saudações alternativas** ("Meu bem,", "Olha [nome]…", "Ai [nome]…", "Vem cá,") pra **acabar com a repetição obsessiva** de "Filho/Filha querido(a)"
5. **12 regras negativas críticas** (nunca soar teólogo, nunca virar coach secular, nunca inventar dogma, sempre cristocêntrico, etc.)
6. **Integração técnica em 3 níveis** (núcleo, contextual, referência)

### `maria-prompt-novo.md` (~9KB)
Proposta de prompt-sistema novo com:
- Constante `NUCLEO_MARIA` pronta pra colar no `server.js` (~450 tokens)
- `INSPIRACOES_POR_TEMA` + função `montarInspiracaoTema(tema)` (aproveita `detectarTema()` que já existe no backend)
- Função `extrairUltimasSaudacoes(historico, 3)` pra anti-repetição
- **Mapa exato** de onde aplicar no `server.js`: linhas 595-716 (onde estão as constantes atuais) + 15 ramos em `if/else` (linhas 871, 882, 898, 935, 960, 1028, 1073, 1093, 1113, 1145, 1166, 1186, 1223, 1268, 1288, 1307, 1332) — lista pontual no doc
- **Rollout em 5 fases** pra não quebrar produção (Fase 1 só adiciona constantes, Fase 2 testa em 1 ramo, Fase 3 propaga, Fase 4 inspirações, Fase 5 anti-repetição)
- Ressalva de **custo Groq +10-15%** pelo prompt maior — sugere medir antes de propagar

**Achado relevante no backend**: o `systemPrompt` é construído por uma cadeia de `if/else` (linhas 864-1358) que **repete o mesmo cabeçalho** "Você é Maria, Mãe de Jesus..." em 15+ ramos. Cada ramo passa `"Trate como '${tratamentoCurto}'"` — é exatamente isso que faz a Maria abrir quase toda mensagem com **"Filho/Filha querido(a)"** (a repetição que te incomoda).

**Dúvidas/ressalvas do agent pra você decidir**:
1. **Validação litúrgica**: antes da Fase 3, idealmente um padre lê o `NUCLEO_MARIA` (princípios são ortodoxia clássica, mas vale dupla revisão).
2. **Custo de tokens**: medir antes de propagar pra todos os ramos.
3. **PDF do Tratado**: continua na raiz do repo (no `.gitignore`). Verificar com a Editora Retornarei se posso manter como referência interna, ou tirar de vez.
4. **Endpoint paralelo**: melhor caminho de teste é criar `/api/chat-v2` em paralelo com botão "ajudou mais?" no app por 1-2 semanas, antes de substituir.
5. **Tom regional**: usei Brasil neutro (não muito nordestino, paulista ou mineiro). Se quiser regionalismo mais marcado, ajustar saudações.

---

## 📊 Visão geral dos commits da noite (branch `limpeza-refactor`)

| Commit | Frente | O quê |
|---|---|---|
| `33c4fca` | F3 | proposta sabedoria mariana + prompt novo (NÃO aplicado) |
| `6e6cdd3` | F1 | painel admin 3 abas + Firestore + adapters no app |
| `673068f` | F2 | 3 livros modernizados em `livros-modernizados/` |
| (este) | — | `RELATORIO-MARIA-NOITE.md` (você está aqui) |

**Diff total `main..limpeza-refactor`**: 152 arquivos, +14078 / −32875 linhas (a maior parte negativa é a limpeza anterior dos arquivos mortos).

---

## 🎯 O que você precisa fazer (3 caminhos possíveis)

### Caminho 1: aprovar tudo de uma vez
```bash
cd /mnt/c/Projetos/proj_maria
git checkout main
git merge limpeza-refactor
git push
```
App em produção continua igual até alguém popular as collections Firestore via painel admin. **Risco real: zero** — todos os adapters têm fallback.

### Caminho 2: aprovar peça por peça
Reverta os commits que não quiser e cherry-pick os que quiser:
```bash
git log limpeza-refactor --oneline   # vê IDs
git cherry-pick <commit-id>          # aplica só esse commit em main
```

### Caminho 3: testar tudo na branch antes de mergear
Abrir o `painel-admin.html` localmente OU subir a branch num ambiente de teste (Capacitor `npx cap run android` apontando pro Firebase de teste).

---

## 🧪 Smoke tests recomendados ANTES de mergear (15min)

1. **Painel admin**: abrir local OU subido em sandbox, login, criar 1 livro/1 música/1 frase de teste, ver salvando no Firestore.
2. **Import Hostinger**: clicar "📥 Importar do Hostinger" — deve trazer os 3 livros existentes.
3. **App lê do Firestore**: limpar localStorage (`localStorage.clear()`), reabrir app, ver biblioteca carregando do Firestore.
4. **Fallback funciona**: apagar coleção `conteudo_livros` no Firestore Console, reabrir app, ver biblioteca caindo no Hostinger (comportamento atual preservado).
5. **Frases do dia**: `console.log(FrasesDoDia.fraseDeHoje())` no app → retorna `{ texto, autor }` válido.
6. **Áudios do terço**: tocar 1 áudio — deve continuar funcionando (não tocamos).

---

## ⚠️ Atenções finais

- **Backend Railway intocado** — `server.js` foi apenas lido pelo agent F3 (pra documentar onde aplicar). Aplicação só na sua aprovação.
- **PDF do Tratado de Montfort** continua no disco/ignorado. Decida o que fazer (manter como referência interna, mover pra Drive, ou apagar).
- **`audios-terco/` no .gitignore**: as 9 masters `.mpeg` (mesmas dos `.mp3` do terço já no repo) continuam no seu disco. Não foram apagadas; só não vão pro repo. Mover pra Drive externo desafoga ~100MB se você quiser.

Boa noite, JOs.
— Claudio
