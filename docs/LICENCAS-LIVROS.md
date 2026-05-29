# 📜 Licenças dos Livros da Biblioteca

> Documentação de origem, licença e modernização dos textos cristãos disponíveis na biblioteca do app **"Converse com Maria"**.

---

## Status legal geral

Todas as obras da biblioteca estão em **domínio público** (autor falecido há mais de 70 anos, prazo da Lei nº 9.610/98 Art. 41). Portanto:

- ✅ Distribuição livre permitida
- ✅ Modernização linguística permitida
- ✅ Inclusão em app comercial permitida
- ✅ Sem royalties a terceiros

---

## Lista de livros

### 📖 Imitação de Cristo

| Item | Valor |
|---|---|
| **Autor** | Tomás de Kempis (1380–1471) |
| **Original** | latim, c. 1418–1427 |
| **Domínio público desde** | sempre (autor falecido há mais de 5 séculos) |
| **Texto base usado** | Tradução portuguesa clássica revista por Pe. Mariano Pinho (séc. XIX, domínio público) |
| **Modernização linguística** | adaptado pra português brasileiro contemporâneo |
| **Capítulos no app** | 25 (livro I completo + seleção dos demais) |

### 🕊️ Confissões de Santo Agostinho

| Item | Valor |
|---|---|
| **Autor** | Aurelius Augustinus Hipponensis (354–430) |
| **Original** | latim, c. 397–400 |
| **Domínio público desde** | sempre |
| **Texto base usado** | Tradução portuguesa clássica anônima do séc. XX (domínio público) |
| **Modernização linguística** | adaptado pra português brasileiro contemporâneo |
| **Status no app** | ⚠️ **PARCIAL** — apenas Livros I e II (de 13) estão no `confissoes-agostinho.json` |

### 🌷 Introdução à Vida Devota

| Item | Valor |
|---|---|
| **Autor** | São Francisco de Sales (1567–1622) |
| **Original** | francês, 1609 |
| **Domínio público desde** | sempre |
| **Texto base usado** | Tradução portuguesa Pe. Bento Beltrami (séc. XIX, domínio público) |
| **Modernização linguística** | adaptado pra português brasileiro contemporâneo |
| **Status no app** | ⚠️ **PARCIAL** — apenas 1 capítulo (de 130+) está no `vida-devota.json` |

---

## Sobre o termo "modernização linguística"

Os textos originais (mesmo as traduções clássicas em português) usam estruturas como:

- "Ide e pregai o Evangelho a todas as criaturas" → mantém
- "Mister é que tomemos o jugo do Senhor" → vira "Precisamos aceitar o caminho do Senhor"
- "Outrora, antanho, alfim" → trocado por equivalentes modernos
- Pontuação adaptada (`;` reduzido, frases curtas)
- Estrangeirismos latinos não traduzidos no original → traduzidos com nota

**A modernização preserva o significado teológico e a estrutura argumentativa.** Não há criação de conteúdo novo.

---

## Créditos da modernização

Por enquanto, a modernização é atribuída internamente como:

> "Adaptação do app *Converse com Maria*, baseada em tradução clássica em domínio público."

Esse texto deve aparecer no rodapé de cada livro no app. Quando o JOs decidir, pode adicionar nome de revisor humano ou indicar IA usada (ex: "revisão com auxílio de IA Claude").

---

## Arquivos JSON na pasta `frontend/www/livros-modernizados/`

```
imitacao-cristo.json           57 KB   ✅ Completo (25 capítulos)
confissoes-agostinho.json     3.7 KB   ⚠️ Parcial (Livros I-II de XIII)
vida-devota.json              3.2 KB   ⚠️ Parcial (Cap. I de 130+)
```

---

## 📦 Formato esperado para upload no Painel Admin

A partir de 2026-05-29, o painel `Livros` aceita upload de **pasta** (drag-drop) ou **arquivo ZIP** com a seguinte estrutura:

```
meu-livro/
├── titulo.txt          (obrigatório — primeira linha = título do livro)
├── autor.txt           (opcional — uma linha com o autor)
├── descricao.txt       (opcional — descrição/sinopse)
├── capa.jpg            (opcional — imagem da capa, ou .png/.webp)
├── capitulo-01.txt     (obrigatório — cap. 1, primeira linha = título do capítulo)
├── capitulo-02.txt     (...)
├── capitulo-03.txt
└── ...
```

### Regras do parser

- Os arquivos `capitulo-NN.txt` são ordenados pelo número (zero-padded ou não — `capitulo-1.txt` e `capitulo-01.txt` funcionam igual).
- **Primeira linha** de cada `capitulo-NN.txt` vira o **título do capítulo**. Linhas seguintes (separadas por linha em branco) viram parágrafos.
- Se `titulo.txt` não existir, o parser usa o nome da pasta/ZIP como título.
- Capa: se enviada, vira string base64 no doc (≤ 200KB recomendado) OU URL externa. Capítulo 1 fica **embedded** no doc principal pra leitura imediata; capítulos 2+ vão pra subcollection.

### Edição granular (a partir de 2026-05-29)

No painel, ao clicar **[Editar]** num livro já publicado:

- Tab **Geral**: edita título, autor, descrição, capa
- Tab **Capítulos (N)**: lista cada capítulo individualmente com:
  - ✏️ **Editar inline** — abre textarea com conteúdo do capítulo
  - 🔄 **Substituir arquivo** — drag-drop de novo `.txt` pra substituir só esse cap
  - 🗑️ **Excluir** — apaga só esse capítulo
  - **+ Adicionar capítulo** — append no fim

Cada edição granular = 1 write no Firestore. Não precisa re-uploadar o livro todo.

---

## Pendências

1. **Completar** os JSONs de Confissões e Vida Devota — fica como tarefa de conteúdo (não-código)
2. **Adicionar rodapé de licença** na renderização de cada livro no app (TODO em `biblioteca.js`)
3. **Migrar conteúdo** dos JSONs estáticos pra Firestore (collection `conteudo_livros`) quando a integração for feita — assim JOs edita pelo painel admin sem precisar de deploy

---

## Outras obras candidatas (Wishlist domínio público)

| Obra | Autor | Notas |
|---|---|---|
| Diário de Santa Faustina | Maria Faustina Kowalska (1905–1938) | ⚠️ ainda em copyright (até 2008+70=2078) — NÃO usar |
| Tratado da Verdadeira Devoção | São Luís de Montfort (1673–1716) | ✅ domínio público |
| Castelo Interior | Santa Teresa d'Ávila (1515–1582) | ✅ domínio público |
| Subida do Monte Carmelo | São João da Cruz (1542–1591) | ✅ domínio público |
| Filotéia | São Francisco de Sales | ✅ domínio público (variante da Introdução à Vida Devota) |
| Vida e Obras | Santa Teresinha do Menino Jesus (1873–1897) | ✅ domínio público |
