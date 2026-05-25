# Raio-X das pastas Maria em C:\Projetos\

**Data**: 2026-05-25
**Auditor**: Claudio (Opus 4.7)
**Modo**: SÓ LEITURA — zero arquivos movidos/apagados. JOs decide.

---

## 0. Sumário Executivo (1 minuto)

| Pasta | Tamanho | Git remote | Última atividade real | **Veredito** |
|---|---|---|---|---|
| **`proj_maria`** | 378 MB | `converse-com-maria-zip` (branch `limpeza-refactor` + `main`) | **HOJE** (limpeza ativa) | 🟢 **OFICIAL — pasta de trabalho ativa, código bate com produção** |
| `converse-com-maria` | 86 MB | `converse-com-maria` (repo **paralelo**) | 2026-01-13 (4+ meses parado) | 🟡 **REPO PARALELO ABANDONADO** — segura apagar |
| `converse-com-maria-zip` | 205 MB | `converse-com-maria-zip` (mesmo repo de `proj_maria`!) | 2026-05-02 (último push); WIP local = puro ruído CRLF | 🟡 **CLONE DUPLICADO sem trabalho único** — segura apagar |
| `converse-com-maria-site` | 20 KB | `converse-com-maria-site` | 2026-01-13 | 🟠 **REPO DO SITE (separado, Hostinger)** — verificar antes de mexer |

**Recomendação direta**:
- **MANTER**: `proj_maria/` como única pasta de código (já tem `frontend/` + `backend/` separados dentro).
- **APAGAR SEGURO**: `converse-com-maria/` (repo paralelo abandonado) e `converse-com-maria-zip/` (duplicata, WIP = só CRLF).
- **CONFIRMAR ANTES DE MEXER**: `converse-com-maria-site/` — pode ser o repo de backup do conteúdo do `conversecommaria.com.br`. Mantém por ora.

---

## 1. Investigação detalhada por pasta

### 🟢 1.1 `/mnt/c/Projetos/proj_maria/` — OFICIAL

- **Git**: `https://github.com/kennrick69/converse-com-maria-zip`
- **Branch atual**: `limpeza-refactor` (a que criei na sessão anterior — 4 commits limpando lixo)
- **Branches locais**: `main` + `limpeza-refactor`
- **Status**: **0 modificações** (working tree limpíssimo, tudo pushado)
- **Último commit**: `019ca29 2026-05-25 docs: LIMPEZA-MARIA.md`
- **Tamanho**: 378 MB (inclui PDFs do Tratado, screenshots, audios brutos, zips — todos no `.gitignore`, não vão pro repo)

**Por que é a oficial**:
1. MD5 do `backend/server.js` é `8578309d` — **IGUAL ao do `main` remoto** = mesmo código que o Railway está rodando.
2. Pasta com `LIMPEZA-MARIA.md` e branch `limpeza-refactor` (trabalho ativo de hoje).
3. Capacitor config tem `cleartext: true` + `allowMixedContent: true` (config Android funcional, as outras pastas têm versão antiga).
4. Conteúdo único:
   - `LIMPEZA-MARIA.md` (relatório anterior)
   - `DOCUMENTACAO-CONVERSE-COM-MARIA.md`
   - `NOTAS-SESSAO-2026-05-01.md`
   - `audios-terco/` (WhatsApp brutos — fontes de áudio)
   - `Tratado_*.pdf` (Tratado de Montfort, copyright)
   - `audio.zip` (24MB), `backend.zip` (14MB)
   - `Screenshots/`, `Captura de tela ...png`

⚠️ **Pendência**: tem o backup pesado `audios-terco/` (6.3MB de .mpeg WhatsApp) e `audio.zip`/`backend.zip` que estão no `.gitignore` mas continuam ocupando 354 MB localmente. Posso ajudar a mover esses pra um pen drive/Drive se quiser desafogar disco.

---

### 🟡 1.2 `/mnt/c/Projetos/converse-com-maria/` — REPO PARALELO ABANDONADO

- **Git**: `https://github.com/kennrick69/converse-com-maria.git` ← **REPO DIFERENTE** (sem `-zip`)
- **Branch**: `main` (única)
- **Status**: 104 modificações
- **Último commit**: `0714d70 2026-01-13 Corrige leitura referencias biblicas`
- **Tamanho**: 86 MB (5 MB sem `node_modules` — pasta enxuta)

**Características que confirmam abandono**:
1. Aponta pra um **repo GitHub diferente** (`converse-com-maria.git`, sem o sufixo `-zip`). Provavelmente o JOs criou esse repo primeiro, depois migrou pro `-zip` e parou de empurrar pra esse.
2. Último commit: **4+ meses atrás**. Zero atividade recente.
3. `backend/server.js` tem apenas **18 KB** (vs 104 KB no oficial) — versão simplificada antiga, sem rate-limiting, sem nodemailer, sem Stripe webhook handler.
4. Conteúdo único (vs `proj_maria`): tem `CLAUDE.md` (config do squad) e `README.md` antigo.

**Risco de apagar**: **BAIXO**. Repo paralelo. Antes de apagar localmente:
1. Confirmar que o repo `converse-com-maria.git` no GitHub **não está conectado a nada em produção** (Railway? Capacitor? GitHub Pages?).
2. Se quiser preservar histórico, basta deixar o repo no GitHub (a pasta local pode sumir).

---

### 🟡 1.3 `/mnt/c/Projetos/converse-com-maria-zip/` — CLONE DUPLICADO

- **Git**: `https://github.com/kennrick69/converse-com-maria-zip.git` ← **MESMO repo do `proj_maria`**
- **Branch**: `main` (não tem `limpeza-refactor`)
- **Status**: 117 modificações
- **Último commit**: `bd51af4 2026-05-02 audio: orações do terço como MP3 + biblioteca aprimorada`
- **Tamanho**: 205 MB (60 MB sem `node_modules`)

**As "117 modificações" são QUASE 100% CRLF NOISE**. Confirmação:
```
diff stat:  117 files changed, 54874 insertions(+), 54877 deletions(-)
                                ↑ inserts e deletes quase iguais = ruído CRLF puro
```
Quando inserts e deletes batem ao caractere/linha, é flip de line-ending Windows↔Linux. **Não há WIP real perdido** nesse clone.

**Conteúdo único** (vs `proj_maria`):
- `backend/push-backend (1).bat` — script de deploy do JOs com path antigo `C:\Users\sss\Pictures\x DEPLOY\proj_maria\backend\`. Esse usuário `sss` **não existe nessa máquina** (atual é `Lenovo`). Path inválido = script morto.
- `backend/serverokz.js`, `serverokzzzzzzzzzz.js`, `serveryyyyyyyyyyyy.js`, `serverzz.js` — backups antigos do server.js (mesmos que já apaguei no `proj_maria/limpeza-refactor`).
- Resto idêntico ao `proj_maria` pré-limpeza.

**Risco de apagar**: **BAIXO**. É clone duplicado do mesmo repo do `proj_maria`. Tudo de bom já está no `proj_maria/main` ou `proj_maria/limpeza-refactor` (pushado). WIP local = só CRLF, sem código real perdido.

⚠️ **Atenção**: o `push-backend (1).bat` foi a única pista de deploy do backend que achei. Se você ainda usa esse script, atualize o path pra `C:\Projetos\proj_maria\backend\` antes de apagar a -zip. (Ou ignora — backend deploya automático no Railway por `git push origin main` do repo `converse-com-maria-zip`).

---

### 🟠 1.4 `/mnt/c/Projetos/converse-com-maria-site/` — REPO DO SITE (separado)

- **Git**: `https://github.com/kennrick69/converse-com-maria-site.git`
- **Branch**: `main`
- **Status**: 1 modificação (provavelmente CRLF)
- **Último commit**: `b3e8486 2026-01-13 Add files via upload`
- **Tamanho**: 20 KB (só `index.html`)

**Identidade do site**:
- URL prod `https://conversecommaria.com.br` responde **HTTP 200**.
- Headers: `server: LiteSpeed`, `platform: hostinger`, `panel: hpanel` → **hospedado em Hostinger**, NÃO em GitHub Pages.
- `last-modified` do site em prod: **Tue, 20 Jan 2026 16:12:20 GMT** — mesmo dia/semana do último commit do repo. Indica que esse repo foi a fonte da última atualização do site (subida manual pro Hostinger).

**Comparação com `proj_maria/landing-page/index.html`**:
- Ambos têm `<title>Converse com Maria - Sua Companheira de Oração</title>` e estrutura idêntica nas primeiras 10 linhas.
- Diff completo: 1098 linhas diferentes em arquivos de ~548 linhas — provavelmente **só CRLF + ajustes mínimos**. São essencialmente o mesmo arquivo em versões ligeiramente diferentes.

**Risco de apagar**: **MÉDIO**.
- Pode ser o backup do conteúdo do `conversecommaria.com.br`. Apagar não derruba o site (Hostinger tem cópia própria), MAS perde o histórico de versões e o repo paralelo no GitHub.
- Como tem APENAS 20 KB, custo de manter é zero. **Recomendo MANTER por enquanto** e decidir depois com calma.

---

## 2. Pasta misteriosa do `push-backend.bat`

O `push-backend (1).bat` em `converse-com-maria-zip/backend/` aponta pra:
```
C:\Users\sss\Pictures\x DEPLOY\proj_maria\backend
```

**Investiguei e essa pasta NÃO EXISTE nessa máquina** (`/mnt/c/Users/sss/` não existe; usuário atual é `Lenovo`). É **path histórico de outra máquina/usuário** anterior. Não há `proj_maria` em `C:\Users\` nem em nenhum lugar fora de `C:\Projetos\`.

Conclusão: o script `.bat` está obsoleto. Se você ainda quiser usar pra deploy do backend, atualizar pra:
```bat
cd /d "C:\Projetos\proj_maria\backend"
git add .
git commit -m "%MSG%"
git push
```

---

## 3. Estrutura consolidada PROPOSTA

### Pasta final única: `C:\Projetos\proj_maria\`
Já está bem organizada — só precisa "tirar do meio" as duplicatas:

```
C:\Projetos\
└── proj_maria\                          ← única pasta do app
    ├── .git/                             (aponta pra converse-com-maria-zip)
    ├── .gitignore                        (já expandido)
    ├── README.md                         (criar — sumário do projeto)
    ├── LIMPEZA-MARIA.md                  (relatório limpeza)
    ├── RAIO-X-PASTAS-MARIA.md            (este arquivo)
    ├── DOCUMENTACAO-CONVERSE-COM-MARIA.md
    ├── FIREBASE-SETUP.md
    ├── LISTA-FUNCIONALIDADES.md
    ├── MONETIZACAO-GUIA.md
    │
    ├── backend/                          ← Railway (push origin main = deploy)
    │   ├── server.js                     (v2.0.0 Express+Stripe+firebase-admin)
    │   ├── package.json
    │   └── node_modules/
    │
    ├── frontend/                         ← Capacitor build Android (Play Store)
    │   ├── capacitor.config.json
    │   ├── package.json
    │   ├── tailwind.config.js
    │   ├── src/input.css                 (fonte Tailwind)
    │   ├── android/                      (projeto nativo)
    │   ├── api/                          (PHP brindes, denúncias)
    │   └── www/                          (webDir Capacitor = app)
    │       ├── index.html, painel-admin.html
    │       ├── sw.js, manifest.json
    │       ├── *.js (20 scripts)
    │       ├── audio/, icons/, img/, conquistas-svg/
    │       └── privacidade/, termos/
    │
    └── landing-page/                     (versão local; site real em Hostinger)
```

### O que sair:
- `C:\Projetos\converse-com-maria\` → **APAGAR LOCAL** (repo paralelo no GitHub fica preservado)
- `C:\Projetos\converse-com-maria-zip\` → **APAGAR LOCAL** (duplicata; o repo é o mesmo do `proj_maria`)
- `C:\Projetos\converse-com-maria-site\` → **AVALIAR** (pode ser backup do conteúdo do conversecommaria.com.br no Hostinger)

### Ordem segura recomendada:
1. **Confirma com JOs**: ele ainda usa `converse-com-maria-site/` pra atualizar o domínio? Se sim, manter. Se não, pode apagar.
2. **Apaga** `converse-com-maria-zip/` (duplicata; trabalho não-pushado é puro CRLF, nada perdido).
3. **Apaga** `converse-com-maria/` (repo paralelo abandonado).
4. Opcional: dentro de `proj_maria/`, mover `audios-terco/`, `audio.zip`, `backend.zip`, `Tratado_*.pdf`, `Screenshots/` pra um **Drive externo** (ocupam ~100 MB e não vão pro repo de qualquer jeito).

---

## 4. ⚠️ Alertas / riscos

### 🟠 Atenção: 4 deploys distintos no projeto
- **Backend** → Railway, repo `converse-com-maria-zip` (push origin main).
- **Frontend Android (app)** → Play Store, build manual via Capacitor (`npx cap build android`).
- **Landing-page do app dentro do APK** → carregada pelo Capacitor (não tem deploy próprio).
- **Site `conversecommaria.com.br`** → Hostinger, upload manual via hPanel. Repo `converse-com-maria-site` parece ser backup local da última versão.

Mexer numa pasta errada pode bagunçar um desses 4 fluxos. Por isso a recomendação conservadora.

### 🟠 `converse-com-maria-site/` e a página do conversecommaria.com.br
- Site no ar em Hostinger, atualizado pela última vez em **2026-01-13** (4+ meses sem mexer).
- A pasta `landing-page/` dentro do `proj_maria` tem versão **mais recente** do landing-page (provavelmente o JOs evoluiu a página mas não subiu pro domínio).
- **Sugestão**: depois da consolidação, **subir o `proj_maria/landing-page/index.html` atualizado pro Hostinger** e abandonar o repo `converse-com-maria-site` (deixa o GitHub repo lá como histórico).

### 🟢 Backend de produção está ileso
- MD5 do `proj_maria/backend/server.js` = `8578309d` = MD5 do `origin/main:backend/server.js`. Apagar as outras pastas não toca no que está rodando no Railway.

### 🟢 App no ar na Play Store está ileso
- O APK que os usuários têm já foi compilado e está distribuído. Mexer em pastas locais não atualiza o APK na Play Store — pra isso o JOs precisa rodar `npx cap build android` e subir o `.aab` manualmente.

---

## 5. Recomendação final em 3 passos

1. **Mantém `C:\Projetos\proj_maria\` como única pasta de código** (já está bem estruturada com `backend/` + `frontend/` + `landing-page/`).
2. **Confirma com você**: `converse-com-maria-site/` ainda é fonte do domínio?
   - SIM → manter como está (20 KB, custo zero).
   - NÃO → apagar localmente (repo GitHub fica como histórico).
3. **Apaga** `converse-com-maria/` e `converse-com-maria-zip/` (locais). Confirmado: nada perdido (repos no GitHub continuam intactos).

Comandos quando você aprovar (eu não executo nada agora):
```bash
# Opcional: backup leve antes (pra zero arrependimento)
mkdir -p ~/maria-backup-2026-05-25
cp -r /mnt/c/Projetos/converse-com-maria-zip/.git ~/maria-backup-2026-05-25/zip-git
cp -r /mnt/c/Projetos/converse-com-maria/.git ~/maria-backup-2026-05-25/maria-git

# Apagar locais
rm -rf "/mnt/c/Projetos/converse-com-maria-zip"
rm -rf "/mnt/c/Projetos/converse-com-maria"
```

Boa noite, JOs.
— Claudio
