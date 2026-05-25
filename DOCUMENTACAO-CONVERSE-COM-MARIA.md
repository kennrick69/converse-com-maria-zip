# 📱 Converse com Maria - Documentação Completa

> **Última atualização:** Janeiro 2026  
> **Desenvolvedor:** JOs  
> **Plataforma:** Android (Capacitor) + Web

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura Técnica](#arquitetura-técnica)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Funcionalidades](#funcionalidades)
5. [Banco de Dados (Firebase)](#banco-de-dados-firebase)
6. [Backend (Railway)](#backend-railway)
7. [Hospedagem Web (Hostinger)](#hospedagem-web-hostinger)
8. [Integrações de IA](#integrações-de-ia)
9. [Sistema de Pagamentos](#sistema-de-pagamentos)
10. [Problemas Resolvidos](#problemas-resolvidos)
11. [Deploy e Publicação](#deploy-e-publicação)
12. [Configurações Importantes](#configurações-importantes)
13. [Notas Técnicas](#notas-técnicas)

---

## 🎯 Visão Geral

**Converse com Maria** é um aplicativo católico devocional que simula conversas com a Virgem Maria usando IA. Voltado principalmente para o público católico brasileiro, especialmente idosos.

### Público-alvo
- Católicos brasileiros
- Faixa etária: principalmente idosos
- Pessoas buscando conforto espiritual

### Principais Features
- Chat com IA (Maria)
- Santo Terço guiado
- Santuário de Velas virtuais
- Mural de Intenções comunitário
- Versículo do dia
- Sistema de conquistas
- Estatísticas de oração

---

## 🏗️ Arquitetura Técnica

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUÁRIO (Android/Web)                     │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Capacitor + HTML/JS)                │
│                         www/index.html                           │
│                         www/js/*.js                              │
└─────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
┌──────────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   RAILWAY (Backend)  │ │ FIREBASE         │ │ HOSTINGER        │
│   Node.js + Express  │ │ - Auth           │ │ - Site/Landing   │
│   - Chat API         │ │ - Firestore      │ │ - PHP (emails)   │
│   - TTS (Google)     │ │ - Velas          │ │ - Políticas      │
│   - Groq LLM         │ │ - Intenções      │ │ - Denúncias      │
└──────────────────────┘ │ - Users          │ └──────────────────┘
                         └──────────────────┘
```

### Tecnologias

| Camada | Tecnologia |
|--------|------------|
| App Android | Capacitor 6 + WebView |
| Frontend | HTML5, TailwindCSS, JavaScript Vanilla |
| Backend | Node.js 18+, Express |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| IA/Chat | Groq API (Llama 3.3 70B) |
| TTS | Google Cloud Text-to-Speech |
| Hospedagem Backend | Railway |
| Hospedagem Web | Hostinger |
| Monetização | Google AdMob |

---

## 📁 Estrutura de Arquivos

```
converse-com-maria/
├── www/                          # Frontend (Capacitor)
│   ├── index.html                # App principal (193KB+)
│   ├── js/
│   │   ├── velas.js              # Santuário de Velas
│   │   ├── mural.js              # Mural de Intenções
│   │   ├── terco.js              # Santo Terço Guiado
│   │   ├── estatisticas.js       # Estatísticas de Oração
│   │   └── conquistas.js         # Sistema de Conquistas
│   ├── css/
│   └── img/
│       └── qrcode_pix.jpg        # QR Code para doações
│
├── android/                      # Projeto Android (Capacitor)
│   ├── app/
│   │   ├── build.gradle
│   │   ├── google-services.json  # Firebase config
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── res/
│   └── capacitor.config.ts
│
├── server/                       # Backend (Railway)
│   └── server.js                 # API principal (80KB+)
│
└── hostinger/                    # Site (Hostinger)
    ├── public_html/
    │   ├── index.html            # Landing page
    │   ├── privacidade.html      # Política de privacidade
    │   ├── termos.html           # Termos de uso
    │   └── enviar-denuncia.php   # Recebe denúncias
    └── ...
```

---

## ⚡ Funcionalidades

### 1. Chat com Maria (IA)

**Fluxo de mensagens:**
```
Usuário digita → Frontend → Railway API → Groq LLM → Resposta → Frontend
```

**Etapas do chat (por número de mensagem):**

| Msg # | Tipo | Descrição |
|-------|------|-----------|
| 1 | Acolhimento | Maria pergunta o nome e acolhe |
| 2 | Detecção de sentimento | Identifica: positivo/negativo/neutro |
| 3 | Aprofundamento | Continua conversa baseada no sentimento |
| 4 | Premium | Responde + agradecimento sutil |
| 5+ | Chat livre | Conversa natural (só Premium) |

**Limite gratuito:** 3 mensagens/dia  
**Premium:** Ilimitado

**Detecção de 3 sentimentos:**
- 😢 Negativo (tristeza, dor, medo, angústia)
- 😊 Positivo (alegria, gratidão, paz)
- 😐 Neutro (dúvidas, perguntas, reflexões)

### 2. Santo Terço Guiado

**Estrutura:**
```
Início → Orações iniciais → 5 Mistérios (10 Ave Marias cada) → Salve Rainha
```

**Mistérios por dia:**
- Segunda/Sábado: Gozosos
- Terça/Sexta: Dolorosos
- Quarta/Domingo: Gloriosos
- Quinta: Luminosos

**Barra de progresso:**
```
✝️ → 1 → 2 → 3 → 4 → 5 → 👑
```

**Comportamento:**
- Cruz destaca no 1º clique (quando dezenaAtual >= 1)
- Números 1-5 destacam nos mistérios
- Coroa destaca ao concluir
- Scroll volta ao topo ao clicar "Próximo"
- Contagem de Ave Marias (1-10) mantém posição

### 3. Santuário de Velas

**7 tipos de velas:**

| Tipo | Cor | Duração | Premium |
|------|-----|---------|---------|
| Branca | #FFFEF0 | 24h | ❌ Grátis |
| Azul | #87CEEB | 24h | ❌ Grátis |
| Rosa | #FFB6C1 | 48h | ✅ |
| Vermelha | #FF6B6B | 48h | ✅ |
| Verde | #90EE90 | 48h | ✅ |
| N.S. Aparecida | #1E90FF | 7 dias | ✅ Especial |
| N.S. Fátima | #FFFEF0 | 7 dias | ✅ Especial |

**Firebase Collection:** `velas`
```javascript
{
  odeferente: "Nome",
  intencao: "Texto da intenção",
  tipo: "branca",
  acesa: timestamp,
  expira: timestamp,
  visivel: true
}
```

**10 velas fake** pré-cadastradas para parecer comunidade ativa.

### 4. Mural de Intenções

**Categorias:**
- 🙏 Geral
- ❤️ Família
- 💪 Saúde
- 💼 Trabalho
- 📚 Estudos
- 🕊️ Luto
- 💑 Relacionamento
- 🌟 Gratidão

**Firebase Collection:** `intencoes`
```javascript
{
  autor: "Nome",
  texto: "Intenção",
  categoria: "familia",
  criadaEm: timestamp,
  rezando: 5,  // Contador compartilhado
  visivel: true
}
```

**12 intenções fake** pré-cadastradas.

**Botão "Rezar":**
- Incrementa contador no Firebase (real-time para todos)
- Atualiza só o card clicado (sem piscar lista)

### 5. Sistema de Denúncias

**Endpoint:** `https://conversecommaria.com.br/enviar-denuncia.php`

**Funciona para:**
- Velas (velaId)
- Intenções do mural (intencaoId)

**Email destino:** contato@conversecommaria.com.br

### 6. Áudio TTS (Text-to-Speech)

**Configuração:**
- Voz: `pt-BR-Chirp3-HD-Leda`
- Speaking Rate: `0.90`
- Pitch: `0`

**Rota:** `POST /api/tts`

### 7. Versículo do Dia

- Rotação de versículos baseada no dia do ano
- Compartilhamento como imagem (canvas)
- Streak de dias em oração

### 8. Conquistas e Estatísticas

**Conquistas desbloqueáveis:**
- Primeiros passos
- Devoto(a) fiel
- Terços completados
- Velas acesas
- etc.

**Estatísticas:**
- Dias em oração
- Terços rezados
- Velas acesas
- Mensagens enviadas

---

## 🔥 Banco de Dados (Firebase)

### Projeto Firebase
- **Console:** https://console.firebase.google.com
- **Projeto:** converse-com-maria (ou similar)

### Collections

#### `users`
```javascript
{
  nome: "Maria da Silva",
  email: "maria@email.com",
  telefone: "(11) 99999-9999",  // NOVO!
  genero: "feminino",
  idade: "60+",
  estadoCivil: "casada",
  religiao: "catolica",
  cadastroCompleto: true,
  dataCadastro: "2026-01-15T...",
  premium: {
    ativo: true,
    plano: "mensal",
    expiraEm: timestamp
  }
}
```

#### `velas`
```javascript
{
  odeferente: "João",
  intencao: "Pela saúde da minha mãe",
  tipo: "azul",
  acesa: 1705123456789,
  expira: 1705209856789,
  visivel: true
}
```

#### `intencoes`
```javascript
{
  autor: "Ana",
  texto: "Peço orações pelo meu filho",
  categoria: "familia",
  criadaEm: 1705123456789,
  rezando: 12,
  visivel: true
}
```

### Índices necessários

**Para velas:**
- `criadaEm` (DESC) + `visivel` - OU usar query simples

**Para intenções:**
- `criadaEm` (DESC) + `visivel` - OU usar query simples

**IMPORTANTE:** Queries com múltiplos `where()` precisam de índice composto. A solução atual usa query simples + filtro no cliente.

---

## 🚂 Backend (Railway)

### URL de Produção
```
https://converse-com-maria-production.up.railway.app
```

### Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/chat` | Chat com Maria (Groq) |
| POST | `/api/tts` | Text-to-Speech (Google) |
| POST | `/api/verify-purchase` | Verificar compra (Google Play) |
| POST | `/webhook/stripe` | Webhook Stripe |
| GET | `/health` | Health check |

### Variáveis de Ambiente (Railway)

```env
GROQ_API_KEY=gsk_...
GOOGLE_TTS_CREDENTIALS={"type":"service_account",...}
FIREBASE_ADMIN_CREDENTIALS={"type":"service_account",...}
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NODE_ENV=production
```

### server.js - Estrutura Principal

```javascript
// Rate limiting
const rateLimit = { windowMs: 60000, maxRequests: 30 };

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { mensagem, historico, messageNumber, userProfile } = req.body;
  
  // Detectar sentimento (msg 2)
  // Gerar resposta via Groq
  // Retornar com sentimento detectado
});

// TTS endpoint
app.post('/api/tts', async (req, res) => {
  // Google Cloud Text-to-Speech
  // Voz: pt-BR-Chirp3-HD-Leda
});
```

---

## 🌐 Hospedagem Web (Hostinger)

### Domínio
```
https://conversecommaria.com.br
```

### Estrutura

```
public_html/
├── index.html           # Landing page
├── privacidade.html     # Política de privacidade
├── termos.html          # Termos de uso
├── excluir-conta.html   # Instruções exclusão
└── enviar-denuncia.php  # Recebe denúncias por email
```

### enviar-denuncia.php

```php
<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Recebe POST com: motivo, velaId ou intencaoId
// Envia email para: contato@conversecommaria.com.br
// Usa mail() nativo do PHP (SMTP Hostinger não aceita conexões externas)
```

### IMPORTANTE sobre SMTP

⚠️ **O SMTP da Hostinger BLOQUEIA conexões externas!**

- ❌ Backend Railway → SMTP Hostinger = BLOQUEADO
- ✅ PHP na Hostinger → mail() = FUNCIONA

Por isso emails de denúncia são enviados via PHP na Hostinger, não pelo backend.

---

## 🤖 Integrações de IA

### Groq API

**Modelo:** `llama-3.3-70b-versatile`

**Configuração:**
```javascript
{
  model: 'llama-3.3-70b-versatile',
  messages: [...],
  max_tokens: 350,
  temperature: 0.85
}
```

**Persona Maria:**
- Fala português brasileiro natural
- Tom maternal e acolhedor
- Respostas curtas (2-4 frases)
- Máximo 1 emoji por mensagem
- Cita Bíblia quando apropriado

### Google Cloud TTS

**Voz configurada:**
```javascript
{
  voice: {
    languageCode: 'pt-BR',
    name: 'pt-BR-Chirp3-HD-Leda'
  },
  audioConfig: {
    audioEncoding: 'MP3',
    speakingRate: 0.90,
    pitch: 0
  }
}
```

---

## 💳 Sistema de Pagamentos

### Google Play Billing (Android)

- Assinaturas mensais/anuais
- Verificação via `/api/verify-purchase`

### Stripe (Web - Futuro)

- Webhook configurado
- Planos: mensal, anual, vitalício

### Pix (Doações)

**Chave Pix (copia e cola):**
```
00020126580014br.gov.bcb.pix0136d2a3b5eb-41a0-4204-9588-e938a23888c05204000053039865802BR5925JOSE RICARDO DOERNER NETO6014JARAGUA DO SUL62070503***6304D0E3
```

QR Code: `www/img/qrcode_pix.jpg`

---

## ✅ Problemas Resolvidos

### Performance

| Problema | Solução |
|----------|---------|
| App travando/lento | Removido `backdrop-filter: blur()` de TODOS lugares |
| Animações com frames | Trocado animações de `height` por `scaleY` (GPU) |
| Scroll lento | Adicionado `-webkit-overflow-scrolling: touch` |
| Event listeners pesados | Adicionado debounce + `{ passive: true }` |
| Muitas partículas | Reduzido de 20 para 8 partículas |

### UX - Piscadas/Flashes

| Problema | Solução |
|----------|---------|
| Terço pisca ao clicar Próximo | Atualiza só conteúdo interno, não recria modal |
| Velas pisca ao acender | `atualizarConteudoSantuario()` em vez de `fechar()+abrir()` |
| Mural pisca ao rezar | Atualiza só o card clicado + debounce no Firebase listener |
| Versículo pisca | Verifica `if (getElementById) return` antes de criar |
| Escolha vela pisca | Animação mais suave (0.2s, translateY 20px) |

### Firebase

| Problema | Solução |
|----------|---------|
| Velas não compartilham | Query simples + filtro `visivel` no cliente |
| Mural não compartilha | Mesma solução das velas |
| Índice composto necessário | Removido segundo `where()`, filtrar no JS |

### Chat

| Problema | Solução |
|----------|---------|
| Chat não cola no input (Android) | CSS `display:flex` + `flex-direction:column` + scroll automático |
| Msg 4 só agradece | Reformulado prompt para responder conteúdo PRIMEIRO |
| Detecção binária | Expandido para 3 sentimentos (positivo/negativo/neutro) |

### UI/Layout

| Problema | Solução |
|----------|---------|
| "Nossa Senhora" quebra linha | Adicionado `whitespace-nowrap` |
| Botão velas some | Mudado para `fixed bottom-6` (igual mural) |
| Texto "Acender Vela" quebra | `whitespace-nowrap` + texto menor |
| Formulário mural grande | Layout compacto, campos lado a lado |
| Terço não volta ao topo | `scrollTo({ top: 0, behavior: 'smooth' })` |
| Cruz não destaca 1º clique | Condição: `dezenaAtual >= 1 || misterioAtual > 0` |

### Emails

| Problema | Solução |
|----------|---------|
| SMTP Railway→Hostinger bloqueado | Usar PHP `mail()` na Hostinger |
| Encoding UTF-8 errado | Header `Content-Type: text/html; charset=utf-8` |

---

## 🚀 Deploy e Publicação

### Android (Capacitor)

```bash
# 1. Copiar arquivos para www/
cp index.html www/
cp *.js www/js/

# 2. Sync Capacitor
npx cap sync android

# 3. Build APK
cd android
./gradlew assembleDebug      # Debug
./gradlew bundleRelease      # Release (AAB para Play Store)

# 4. APK fica em:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Railway (Backend)

```bash
# Push para branch main = deploy automático
git add server.js
git commit -m "descrição"
git push origin main
```

### Hostinger (Site)

- Upload via File Manager ou FTP
- Arquivos vão em `public_html/`

### Google Play Console

1. Upload do AAB
2. Configurar ficha (screenshots, descrição)
3. Declaração de segurança de dados
4. Classificação de conteúdo
5. Revisão e publicação

---

## ⚙️ Configurações Importantes

### Hardware do Desenvolvedor

- **GPU:** RTX 3060 12GB VRAM
- **RAM:** 32GB
- **SO:** Windows

### Ollama (Local)

- Máximo 14B parâmetros para caber na VRAM
- Modelos recomendados: `qwen2.5-coder:14b`, `codellama:13b`
- `num_ctx: 8192` máximo
- Erro 500 = contexto muito grande ou modelo não cabe

### Links Úteis

| Recurso | URL |
|---------|-----|
| Firebase Console | https://console.firebase.google.com |
| Railway Dashboard | https://railway.app/dashboard |
| Google Play Console | https://play.google.com/console |
| Hostinger | https://hpanel.hostinger.com |
| Groq Console | https://console.groq.com |

### GitHub Raw Files

Para acessar arquivos diretamente:
```
github.com → raw.githubusercontent.com
Remover /blob do path
```

---

## 📝 Notas Técnicas

### Gradio 6.0 (JavaliAI)

- Formato messages padrão: `{"role":"...", "content":"..."}`
- Removidos: `bubble_full_width`, `show_copy_button`, `type`

### AdMob

- Banner na parte inferior
- Esconde quando teclado abre
- Configurar App ID no `AndroidManifest.xml`

### Capacitor

- Versão: 6.x
- Plugins: Firebase, AdMob, Share

### CSS Reset para Performance

```css
/* Desativa blur em mobile */
@media (max-width: 768px) {
  [style*="backdrop-filter"] {
    backdrop-filter: none !important;
  }
}

/* GPU acceleration */
.elemento-animado {
  transform: translateZ(0);
  will-change: transform;
}
```

### Checklist Pré-Deploy

- [ ] Sintaxe JS válida (`node --check arquivo.js`)
- [ ] URLs corretas (Railway, Hostinger)
- [ ] Firebase listeners com cleanup
- [ ] Sem console.log em produção
- [ ] Versão incrementada

---

## 🔮 Futuras Melhorias

- [ ] Áudio humano gravado para o Terço
- [ ] Push notifications
- [ ] Modo offline
- [ ] Sincronização entre dispositivos
- [ ] Comunidade de oração em grupo
- [ ] Novenas guiadas

---

## 📞 Contato

- **Email:** contato@conversecommaria.com.br
- **Site:** https://conversecommaria.com.br

---

*Documentação gerada em Janeiro de 2026*
