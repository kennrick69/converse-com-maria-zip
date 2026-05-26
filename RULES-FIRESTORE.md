# Firestore Security Rules — Converse com Maria

**Data**: 2026-05-25
**Branch**: `limpeza-refactor` (não toca produção até você aplicar manualmente)

---

## 🐛 O bug que apareceu

`Erro: missing or insufficient permissions` ao tentar criar item no Checklist QA (ou usar abas novas do painel admin).

## 🔎 Causa

As 4 collections novas que criamos nas sessões anteriores **não têm regras de escrita** no Firestore:

| Collection | Onde é usada | Quem precisa escrever |
|---|---|---|
| `conteudo_livros` | F1 — aba 📚 Livros do painel | só admin |
| `conteudo_musicas` | F1 — aba 🎵 Músicas do painel | só admin |
| `conteudo_frases` | F1 — aba 💬 Frases do Dia do painel | só admin |
| `qa_checklist` | F-QA — aba ✅ Checklist QA | só admin |

Por padrão, o Firestore em modo "production" (ou após o "test mode" expirar) **NEGA tudo que não tem regra explícita**. Por isso até admin é bloqueado.

## ✅ Solução

Criei `firestore.rules` no repo (fonte da verdade versionada). **Mas a aplicação real é no console Firebase**. Passo a passo abaixo.

---

## 📋 PASSO A PASSO (faz no console — 3 minutos)

### 1. Abre o console Firebase
- URL: <https://console.firebase.google.com>
- Projeto: **converse-com-maria**

### 2. BACKUP das rules atuais (paranoia)
- Menu lateral → **Firestore Database** → aba **Rules**
- **Copia o conteúdo atual** e cola num bloco de notas local (só pra reverter se der ruim)

### 3. Cola as novas rules
- Abre o arquivo `frontend/firestore.rules` deste repo (na branch `limpeza-refactor`)
- Copia **TUDO** (a partir de `rules_version = '2';`)
- No console: cola substituindo o conteúdo da aba **Rules**
- Clica **"Publish"** (no canto superior direito)

### 4. Testa imediatamente
- Volta no `painel-admin.html`
- Aba **✅ Checklist QA** → clica **📋 Pré-popular padrão**
- Deve criar os 20 itens sem erro
- Aba **📚 Livros** → **📥 Importar do Hostinger** → idem
- Cria 1 frase, 1 música → idem

Se algo for negado por engano, reverte com o backup do passo 2 e me avisa.

---

## 📐 Decisões das rules (resumo)

| Collection | Read | Write | Lógica |
|---|---|---|---|
| `usuarios/{uid}` | dono ou admin | dono ou admin | privacidade básica |
| `intencoes` | autenticado | autenticado cria; dono/admin edita/deleta | mural social |
| `velas` | autenticado | autenticado cria; dono/admin edita/deleta | sala de velas |
| `biblioteca` (legado) | **público** (sem auth) | só admin | app carrega antes do login |
| `denuncias` | só admin | autenticado cria | privacidade — usuário não vê outros |
| `leads` | só admin | só admin | backend usa firebase-admin SDK (ignora rules) |
| `conteudo_livros` | **público** | só admin | app lê antes do login |
| `conteudo_musicas` | **público** | só admin | idem |
| `conteudo_frases` | **público** | só admin | idem |
| `qa_checklist` | só admin | só admin | uso interno do JOs |
| **qualquer outra** | NEGADO | NEGADO | default deny (segurança em primeiro lugar) |

### Por que conteúdo é leitura pública?
O app na Play Store carrega livros/músicas/frases **antes do usuário fazer login** (anônimo). Como não há dado sensível ali (textos religiosos, URLs públicas de áudio, frases curtas), abrir leitura pública é seguro e necessário pro fluxo do app funcionar.

### Por que `qa_checklist` é admin-only?
Os comentários e prints podem mostrar bugs com dados de usuário/email. Não expõe.

### Por que `denuncias` só admin lê?
Privacidade: usuário não pode ver as denúncias dos outros (que mostram conteúdo problemático + autor).

---

## ⚠️ Atenção sobre as rules existentes

Eu **não tenho acesso ao console** pra ver as rules atuais. Minha proposta cobre TODAS as collections que vi em uso no código:
- `usuarios, intencoes, velas, biblioteca, denuncias, leads` (já existentes)
- `conteudo_livros, conteudo_musicas, conteudo_frases, qa_checklist` (novas)

**Se as suas rules atuais tiverem alguma collection que eu não listei**, ela ficará bloqueada pelo `default deny` final. Cenários possíveis:
- `tercos`, `mensagens_maria`, `pagamentos`, `notificacoes`, etc. — se existir, **me diz quais** e eu adiciono à proposta.
- Por isso o **passo 2 (backup)** é importante: se algo quebrar, restaura.

---

## 🧪 Como confirmar que está OK

Após publicar as rules, testa cada aba:
- ✅ Login admin (`kennrick@gmail.com`)
- ✅ Aba Dashboard / Usuários / Intenções / Velas — devem carregar (read funcionando)
- ✅ Aba 📚 Livros → criar livro teste → SALVA
- ✅ Aba 🎵 Músicas → criar música teste → SALVA
- ✅ Aba 💬 Frases → criar frase teste → SALVA
- ✅ Aba ✅ Checklist QA → "📋 Pré-popular padrão" → cria 20 itens

Como usuário comum (app na Play Store):
- ✅ Login normal → lê biblioteca, frases do dia, músicas (read público funciona)
- ❌ Tentar criar livro/música/frase → BLOQUEADO (esperado — só admin)
- ✅ Criar intenção / vela → permitido (autenticado)

Se passar em todos esses, está OK.

---

## 📂 Versionamento

- `firestore.rules` na raiz do repo é a **fonte da verdade**.
- Toda vez que você editar no console, **sincronize de volta pra cá** e commite. Senão a próxima sessão minha vai partir de uma versão desatualizada.
- Sugestão: adicionar ao `README.md` da raiz um aviso "rules editadas no console; sync com firestore.rules antes de commit grande".

---

## Próximo passo (opcional, futuro)

Configurar **Firebase CLI** (`firebase init firestore`) pra poder fazer `firebase deploy --only firestore:rules` direto do terminal — fim do ciclo "edita console + sync repo na mão". Não é urgente agora.
