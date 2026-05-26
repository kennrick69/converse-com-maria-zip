# Investigação — "sumiu o login do app Maria"

**Data**: 2026-05-26
**Status**: SÓ INVESTIGAÇÃO — **nada revertido ainda**, aguardando JOs decidir.
**Branch examinada**: `limpeza-refactor` (a `main` está intocada local + remota em `bd51af4`).

---

## TL;DR

1. **NÃO há nenhuma contaminação do LocaCar (magic link/login admin/etc.) no Maria.** Confirmei com grep recursivo de todos os termos: silêncio total.
2. **`firebase-auth-ui.js` foi modificado** entre `origin/main` e `limpeza-refactor` (58 inserts/34 deletes ignorando CRLF). MAS essas alterações **eram WIP do JOs** que estavam no working tree no momento que comecei. Eu commitei junto na Fase 0 como rede de segurança ("chore(fase0): rede de segurança — preserva estado pre-limpeza").
3. **Eu não escrevi código de auth/login.** As mudanças no `firebase-auth-ui.js` têm comentários `"✅ CORRIGIDO: await no syncCloudToLocal"` — vocabulário do JOs, não meu.
4. **Apaguei `auth.js`** na Fase 2 da limpeza (`ff1d7da`). Verificado: `auth.js` (`SistemaAuth`) não era usado por nada do `frontend/www/` atual. Só aparece em `frontend/android/.../public/auth.js` (build antigo do Capacitor, sincronizado por `npx cap sync`).
5. **Hipótese do bug "sumiu login"**: NÃO é por magic link nem por algo do LocaCar. Mais provável: o WIP do JOs em `firebase-auth-ui.js` (`onLoginSuccess` virou `async` + `await syncCloudToLocal()`) está em estado intermediário — se o sync falha (rules Firestore, network, qualquer coisa), o `await` trava o pós-login.

---

## Verificações que fiz

### 1. Contaminação do LocaCar — ZERO
```
grep -rln "magic-link\|magicLink\|MagicLink\|magic_link\|LoginSenha\|MagicLinkConsume\|ADMIN_EMAILS\|admin-emails" frontend/www/ backend/ frontend/api/
→ (silêncio total)
```
Nenhum arquivo do Maria menciona qualquer um desses termos do LocaCar.

### 2. Arquivos de auth/login do Maria que MUDARAM (branch vs main)
- `frontend/www/firebase-auth-ui.js`: **mexido** (autor do commit: Claudio Fase 0; mas o conteúdo é WIP do JOs)
- `frontend/www/firebase-config.js`: **mexido** (idem)
- `frontend/www/auth.js`: **DELETADO** por mim no commit `ff1d7da` da Fase 2 (limpeza). Era código antigo (`SistemaAuth`, "sem senha — apenas código por email/SMS").

### 3. `auth.js` apagado — era usado?
- Conteúdo: sistema de auth próprio (`window.SistemaAuth`), 637 linhas.
- Refs no `frontend/www/` atual: **ZERO**.
- Refs em build Android compilado (`frontend/android/app/.../public/auth.js`): aparece como cópia automática do build velho do Capacitor (será reescrita no próximo `npx cap sync`).
- **Veredito**: era código abandonado, substituído por `firebase-auth-ui.js`. Apagar foi correto. NÃO é causa do bug.

### 4. WIP do JOs em `firebase-auth-ui.js` (que eu commitei na Fase 0)
Trechos do diff vs `origin/main`:
```diff
+// ✅ CORRIGIDO: await no syncCloudToLocal
...
-onLoginSuccess(user) {
+async onLoginSuccess(user) {
   console.log('✅ Login success:', user.displayName || user.email);
-  UserDataService.syncCloudToLocal();
+  await UserDataService.syncCloudToLocal();
+  const userData = await UserDataService.getUserData();
```
**Esse é o trabalho do JOs.** Eu não criei isso. Só commitei o estado WIP na Fase 0.

### 5. UserDataService — existe?
- Definido em `frontend/www/firebase-config.js:236` (e `window.UserDataService = ...` em :782). ✅ existe.
- Usado em `estatisticas.js`, `conquistas.js`, `firebase-auth-ui.js`.
- Se `syncCloudToLocal()` falha (exception ou timeout), o `await` no `onLoginSuccess` **trava** o fluxo pós-login → "parece que sumiu" (na verdade ficou pendurado).

### 6. Produção intocada
- `main` local: `bd51af4`
- `main` remoto: `bd51af4`
- Toda mudança está em `limpeza-refactor`. APK na Play Store já distribuído.

---

## Hipóteses do que pode estar quebrando

| # | Hipótese | Probabilidade | Como confirmar |
|---|---|---|---|
| A | WIP do JOs em `firebase-auth-ui.js` está incompleto/quebrado (await trava sync) | **alta** | abrir Chrome DevTools → Console enquanto roda; vai aparecer erro do `await` ou do `syncCloudToLocal` |
| B | Cache do app/PWA segurando versão antiga incompatível com nova | média | hard reload (Ctrl+Shift+R) no navegador; em APK: `npx cap sync android` |
| C | Rules Firestore aplicadas no console bloqueando leitura que o `syncCloudToLocal()` precisa | média | DevTools → Network → ver requests pra `firestore.googleapis.com` → status |
| D | `UserDataService.syncCloudToLocal()` não retorna Promise (cast `await x` quando x não é Promise → ok, mas pode haver outro bug interno) | baixa-média | abrir `firebase-config.js:236` e ler o método |

**Nenhuma hipótese** é "magic link do LocaCar no Maria" — isso não existe no código.

---

## Opções de ação (JOs escolhe — NÃO MEXI EM NADA)

### Opção 1 — Reverter `firebase-auth-ui.js` ao estado de `origin/main` (mais conservador)
```bash
cd /mnt/c/Projetos/proj_maria
git checkout origin/main -- frontend/www/firebase-auth-ui.js
git commit -m "revert: firebase-auth-ui.js volta ao estado main (descarta WIP do JOs)"
```
**Prós**: garante que o login volta ao comportamento original que estava na main (bd51af4, "primeiro commit" + atualizações até audio MP3).
**Contras**: **descarta o trabalho do JOs** que tinha o `await syncCloudToLocal` (a "correção" mencionada nos comentários). Se essa correção era importante, JOs vai precisar refazer.

### Opção 2 — Reverter TUDO de auth/login (firebase-auth-ui + firebase-config) ao estado main
```bash
git checkout origin/main -- frontend/www/firebase-auth-ui.js frontend/www/firebase-config.js
git commit -m "revert: auth/login do Maria volta ao main"
```
**Prós**: estado 100% igual ao do main. Login funciona como sempre funcionou.
**Contras**: descarta WIP do JOs em 2 arquivos. Se `firebase-config.js` tinha alguma melhora (URL nova, novo método etc.), perde.

### Opção 3 — Restaurar `auth.js` deletado (por precaução, mesmo sem refs)
```bash
git checkout main -- frontend/www/auth.js
git commit -m "restore: auth.js (precaução)"
```
**Prós**: zero risco. Volta o arquivo, ele é carregado se algum HTML referenciar.
**Contras**: arquivo continua sem refs aparentes. Custo praticamente zero, mas não resolve nada por si só.

### Opção 4 — JOs investiga DevTools antes de qualquer reversão
Abre Chrome → carrega `http://localhost:8080/index.html` (com servidor local) → DevTools → Console + Network. Olha o que dá erro. Me manda o print → eu identifico exato.

### Opção 5 — Combinação: Opção 2 + Opção 3 (reset completo do auth)
Mais conservadora possível. Reverte os 2 JS + restaura o `auth.js` apagado. Estado pré-tudo da Fase 0.

---

## Recomendação

**Opção 4 primeiro** (DevTools) — leva 2 minutos e diagnostica de verdade. Se aparecer erro relacionado a `await syncCloudToLocal`, é hipótese A → resolve com Opção 1.

Se você prefere **agir já sem investigar** → **Opção 2** (reverter os 2 JS de auth ao estado main) é o mais seguro: volta o login a exatamente o que estava antes de qualquer coisa.

**NÃO vou fazer NADA sem você confirmar.** Quero parar de errar no Maria.

---

## Sobre o equívoco de você ter achado que era "magic link"

Posso ter dado essa impressão sem perceber. **O magic link admin que fiz foi 100% no LocaCar** (`/mnt/c/Projetos/locacar/`), nunca no Maria. As únicas coisas que toquei no Maria nas sessões foram:
- Limpeza de arquivos mortos (Fase 2)
- Painel admin: 3 abas novas + checklist QA (`painel-admin.html`)
- Adapters Firebase em `biblioteca.js`, `musicas.js`, `frases-dia.js`
- `firestore.rules` versionado
- Docs (.md)

**Nada de magic link.** Talvez o seu sintoma (login não funciona) tenha gerado a impressão de que eu tinha mexido no fluxo de login — mas o que eu fiz no painel admin (login Firebase do admin com `kennrick@gmail.com`) usa o **mesmo Firebase Auth do app**. Não criei sistema paralelo.
