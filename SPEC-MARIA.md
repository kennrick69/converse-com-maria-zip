# Converse com Maria — Especificação (ficha permanente)

> Documento de regras DURAS do projeto. Ler ANTES de mexer em qualquer coisa
> relacionada a auth/login/permissão/rules. Se algo aqui ficar desatualizado,
> ATUALIZAR — esta é a fonte da verdade.
>
> **Última atualização**: 2026-05-26 (após múltipla confusão da minha parte)

---

## ⚠️ REGRA DE OURO — APP e PAINEL são DOIS produtos separados

### 1. APP — `frontend/www/index.html`
| | |
|---|---|
| **O que é** | Produto que vai pra LOJA (Play Store hoje, App Store/iOS é objetivo final) |
| **Quem usa** | Usuários/fiéis (pessoas que rezam) |
| **Login** | **OBRIGATÓRIO** via Firebase Auth — sem fluxo público/anônimo |
| **Arquivos auth** | `frontend/www/firebase-auth-ui.js` + `firebase-config.js` |
| **Funcionalidades** | Terço, biblioteca, IA Maria (Groq), frase do dia, músicas, mural, velas, premium, AdMob |
| **Build** | Capacitor → APK Android (Play Store) |
| **Permissões usuário comum** | Lê conteúdo administrativo; cria intenção/vela; **não escreve** em livros/músicas/frases |

### 2. PAINEL DE CONTROLE — `frontend/www/painel-admin.html`
| | |
|---|---|
| **O que é** | Cockpit ADMINISTRATIVO. URL/HTML separados. **NÃO vai pra loja** |
| **Quem usa** | SÓ o JOs (e quem ele autorizar) |
| **Login** | Email + senha Firebase com email na lista hardcoded |
| **Admins autorizados** | `kennrick@gmail.com`, `rickboypoke@gmail.com` (linha 949 de `painel-admin.html`) |
| **Funcionalidades** | Gerenciar conteúdo do app (livros/músicas/frases), Dashboard, Usuários, Intenções, Velas, Checklist QA |
| **Permissões admin** | Escreve em qualquer collection administrativa, vê dados sensíveis (denúncias, leads) |

### O que NUNCA misturar:
- ❌ **NÃO existe magic link no Maria.** Magic link é fluxo do **LocaCar** (`/mnt/c/Projetos/locacar/`). Projeto diferente, regras diferentes.
- ❌ **NÃO existe sistema de auth próprio paralelo.** O `auth.js` antigo (`SistemaAuth`) já foi removido na limpeza — era código legado abandonado.
- ❌ **Auth do APP ≠ auth do PAINEL.** Decisão de permissão de um não se aplica ao outro.
- ❌ Quando JOs fala "o app", é o produto da Play Store (usuários). Quando fala "o painel/admin/controle", é o cockpit dele.

---

## Identidade do projeto
- **Nome**: Converse com Maria
- **Pasta**: `/mnt/c/Projetos/proj_maria/`
- **GitHub**: `kennrick69/converse-com-maria-zip`
- **Branch ativa de trabalho**: `limpeza-refactor` (não mergeada — JOs revisa)
- **Main**: `bd51af4` (intocada)
- **Stack**: Capacitor + HTML/JS vanilla + Node/Express backend + Firebase Auth/Firestore + Stripe + Groq

## URLs
- Backend (Railway): `https://converse-com-maria-production.up.railway.app`
- Site testers (Hostinger): `https://conversecommaria.com.br` — repo separado `converse-com-maria-site`
- Landing oficial: `proj_maria/landing-page/` (ainda não tem deploy)

## Regras DURAS (nunca violar sem JOs autorizar)
1. **APP exige login Firebase** (cadastro obrigatório). Sem fluxo anônimo.
2. **PAINEL** tem URL/HTML separado, email+senha admin.
3. **Produção real Play Store** com usuários rezando — não quebrar core (login, IA Maria, terço, biblioteca, velas, mural, premium, AdMob).
4. **Não copiar texto do PDF Tratado de Montfort** (copyright Editora Retornarei). Só ensinamentos em linguagem própria.
5. **Backend Railway** deploya via `git push origin main` no repo zip.
6. **Áudios do terço** (`frontend/www/audio/terco/*.mp3`) são vivos — nunca apagar.
7. **Firestore rules**: vivem no console Firebase (JOs aplica manualmente). Cópia versionada em `firestore.rules` na raiz. **Em 2026-05-26 JOs corrigiu pessoalmente no console — não mexer mais sem ele pedir.**

## Collections Firestore (resumo das rules atuais)
| Collection | Read | Write | Contexto |
|---|---|---|---|
| `usuarios/{uid}` | dono ou admin | dono ou admin | dado pessoal |
| `intencoes`, `velas` | autenticado | auth cria, dono/admin edita | social |
| `biblioteca`, `conteudo_livros`, `conteudo_musicas`, `conteudo_frases` | **autenticado** (app exige login) | **só admin** (via painel) | conteúdo |
| `denuncias` | só admin | autenticado cria | privacidade |
| `leads` | só admin | só admin (backend usa firebase-admin) | leads |
| `qa_checklist` | só admin | só admin | painel — uso interno |

> Como o admin é identificado: `request.auth.token.email` na lista hardcoded.

## Decisões irrevogáveis tomadas pelo JOs
- App nunca terá modo anônimo
- APP e PAINEL são contextos separados (regra de ouro)
- iOS é objetivo final (além da Play Store)
- Maria nunca cita Montfort por nome (ideia é dele, voz é dela)
- Personagens do escritório 3D (no projeto IMP, não no Maria) em T-pose é estado pré-existente, não regressão

---

## REGRA DE PROCESSO PRA CLAUDIO (e qualquer sessão futura)

**ANTES de mexer em qualquer coisa de auth/login/permissão/rules no Maria:**

1. **LER esta ficha primeiro** (`SPEC-MARIA.md` no repo OU `spec_maria.md` na memória persistente)
2. **Se a ficha não responde, PERGUNTAR ao JOs** — não inventar, não assumir.
3. **NÃO trazer lógica de outros projetos.** LocaCar tem magic link → isso é dele, não do Maria. Ultra Simples tem outros padrões → idem.
4. **Confirmar APP vs PAINEL** quando o assunto for auth/permissão. Se não estiver claro pela mensagem, perguntar: "está falando do APP (usuário) ou do PAINEL (admin)?"
5. **Não commitar WIP alheio sem confirmar.** Lição da Fase 0: commit que englobou `firebase-auth-ui.js` modificado pelo JOs sem perguntar levou a confusão depois.

## O que NUNCA fazer
- ❌ Inventar/portar fluxos do LocaCar (magic link etc.) pro Maria
- ❌ Afrouxar rules pra leitura pública — o app exige login
- ❌ Confundir auth do APP com auth do PAINEL
- ❌ Copiar texto do PDF Montfort
- ❌ Mergear `limpeza-refactor` na `main` sem JOs revisar
- ❌ Tocar console Firebase (JOs aplica rules manualmente)

---

## Histórico relevante
- 2026-05-25: limpeza de arquivos mortos (Fase 0/2) + painel admin com 3 abas novas (livros/músicas/frases) + Checklist QA + livros modernizados + proposta sabedoria mariana
- 2026-05-25/26: minha confusão com rules Firestore (afrouxei pra `if true` pensando que app não exigia login — JOs corrigiu)
- 2026-05-26: JOs corrigiu rules pessoalmente no console Firebase; aplicou regras admin email+senha (token.email) escreve, autenticado lê
- 2026-05-26: investigação do bug "sumiu login" descobriu que o `firebase-auth-ui.js` mexido era WIP do JOs (não meu), commitado por mim na Fase 0 — JOs decide se reverte
- 2026-05-26: esta ficha criada
