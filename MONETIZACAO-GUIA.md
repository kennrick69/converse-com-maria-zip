# 💰 GUIA DE MONETIZAÇÃO - Converse com Maria

## 📋 Resumo do Sistema

Sistema completo de monetização implementado:

| Componente | Tecnologia | Status |
|------------|------------|--------|
| Pagamento Cartão | Stripe | ✅ Pronto |
| Pagamento PIX | Mercado Pago | ✅ Pronto |
| Anúncios Banner | Google AdMob | ✅ Pronto |
| Anúncios Interstitial | Google AdMob | ✅ Pronto |
| Sistema de Avaliação | Play Store + Premium grátis | ✅ Pronto |

---

## 🔧 PASSO 1: Criar Contas

### 1.1 Stripe (Pagamentos Internacionais)
1. Acesse: https://dashboard.stripe.com/register
2. Complete o cadastro com seus dados
3. Verifique a conta bancária
4. Vá em **Developers > API Keys**
5. Copie a **Secret Key** (começa com `sk_live_`)
6. Copie a **Publishable Key** (começa com `pk_live_`)

**Configurar Webhook:**
1. Vá em **Developers > Webhooks**
2. Clique em **Add endpoint**
3. URL: `https://seu-app.railway.app/api/webhook/stripe`
4. Eventos: Selecione `checkout.session.completed`
5. Copie o **Webhook signing secret** (começa com `whsec_`)

---

### 1.2 Mercado Pago (PIX - Brasil)
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Faça login ou crie conta
3. Crie uma aplicação
4. Vá em **Credenciais de Produção**
5. Copie o **Access Token** (começa com `APP_USR-`)

**Configurar Webhook:**
1. Vá em **Webhooks** na sua aplicação
2. URL: `https://seu-app.railway.app/api/webhook/mercadopago`
3. Eventos: `payment`

---

### 1.3 Google AdMob (Anúncios)
1. Acesse: https://admob.google.com
2. Crie conta com seu Google
3. Adicione seu app Android
4. Crie **Ad Units**:
   - **Banner**: Para footer (sempre visível)
   - **Interstitial**: Para tela cheia (entre conversas)
5. Anote os IDs:
   - App ID: `ca-app-pub-XXXX~YYYY`
   - Banner ID: `ca-app-pub-XXXX/ZZZZ`
   - Interstitial ID: `ca-app-pub-XXXX/WWWW`

---

## 🔧 PASSO 2: Configurar Backend

### 2.1 Criar arquivo `.env`

No diretório `backend/`, crie o arquivo `.env`:

```bash
# URL do seu app (Railway vai fornecer)
APP_URL=https://converse-maria-production.up.railway.app

# GROQ (Chat)
GROQ_API_KEY=gsk_sua_chave_groq

# ElevenLabs (Voz)
ELEVENLABS_API_KEY=sk_sua_chave_elevenlabs
ELEVENLABS_VOICE_ID=seu_voice_id

# STRIPE
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# MERCADO PAGO
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxx

# FIREBASE ADMIN (Opcional - para ativar premium automaticamente)
# Gere em: Console Firebase > Configurações > Contas de serviço
FIREBASE_ADMIN_KEY={"type":"service_account",...}
```

### 2.2 Instalar Dependências

```bash
cd backend
npm install
```

### 2.3 Testar Localmente

```bash
npm start
# Acesse: http://localhost:3000/api/status
```

---

## 🔧 PASSO 3: Configurar AdMob no App

### 3.1 Instalar Plugin Capacitor

```bash
npm install @capacitor-community/admob
npx cap sync
```

### 3.2 Configurar Android

Edite `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
  <application>
    <!-- Adicionar dentro de <application> -->
    <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ca-app-pub-XXXX~YYYY"/>
  </application>
</manifest>
```

### 3.3 Atualizar IDs no Frontend

Edite `frontend/admob.js`, linha ~8:

```javascript
config: {
    appId: 'ca-app-pub-SEU_APP_ID',
    bannerId: 'ca-app-pub-SEU_BANNER_ID',
    interstitialId: 'ca-app-pub-SEU_INTERSTITIAL_ID',
    // ...
}
```

---

## 🔧 PASSO 4: Deploy no Railway

### 4.1 Conectar GitHub
1. Acesse: https://railway.app
2. Clique em **New Project > Deploy from GitHub repo**
3. Selecione seu repositório

### 4.2 Configurar Variáveis de Ambiente
No Railway:
1. Clique no seu serviço
2. Vá em **Variables**
3. Adicione todas as variáveis do `.env`

### 4.3 Configurar Build
1. Vá em **Settings**
2. Root Directory: `backend`
3. Start Command: `npm start`

### 4.4 Obter URL
Após deploy, copie a URL fornecida (ex: `converse-maria-production.up.railway.app`)

---

## 🔧 PASSO 5: Atualizar Frontend

### 5.1 Configurar URL da API

Edite `frontend/pagamento.js` ou crie variável global:

```javascript
// No início do index.html ou em um config.js
window.API_URL = 'https://converse-maria-production.up.railway.app';
```

### 5.2 Atualizar Link Play Store

Edite `frontend/avaliacao.js`, linha ~10:

```javascript
playStoreUrl: 'https://play.google.com/store/apps/details?id=com.seupackage.app',
```

---

## 🔧 PASSO 6: Gerar APK de Produção

### 6.1 Build do Frontend
```bash
cd frontend
# O frontend já está pronto (HTML/CSS/JS)
```

### 6.2 Sync Capacitor
```bash
npx cap sync android
```

### 6.3 Build APK
```bash
cd android
./gradlew assembleRelease
```

O APK estará em: `android/app/build/outputs/apk/release/`

---

## 📊 Como Funciona

### Fluxo de Pagamento - Cartão (Stripe)
```
Usuário clica "Cartão" 
    → Frontend chama /api/pagamento/stripe/criar-sessao
    → Backend cria sessão Stripe
    → Usuário é redirecionado para Stripe Checkout
    → Usuário paga
    → Stripe envia webhook para /api/webhook/stripe
    → Backend ativa Premium no Firebase
    → Usuário volta para o app com Premium ativo
```

### Fluxo de Pagamento - PIX (Mercado Pago)
```
Usuário clica "PIX"
    → Frontend chama /api/pagamento/pix/criar
    → Backend cria pagamento e retorna QR Code
    → Modal exibe QR Code e código copia-cola
    → Usuário paga via app do banco
    → Frontend verifica status a cada 3s
    → Quando aprovado, ativa Premium localmente
    → Mercado Pago envia webhook
    → Backend confirma Premium no Firebase
```

### Fluxo de Anúncios (AdMob)
```
App inicia
    → Verifica se é Premium
    → Se NÃO Premium:
        → Exibe banner no footer
        → A cada 5 mensagens, exibe interstitial
    → Se Premium:
        → Nenhum anúncio exibido
```

### Fluxo de Avaliação (Play Store)
```
Após 3 dias de uso + 10 mensagens
    → Pop-up pergunta "Está gostando?"
    → Usuário clica "Sim! Quero Avaliar"
    → Abre Play Store
    → Usuário avalia com 5 estrelas
    → Volta ao app
    → Confirma avaliação
    → Ganha 30 dias de Premium GRÁTIS 🎁
```

---

## 💡 Dicas Importantes

### Testes
- **Stripe**: Use chaves de teste (`sk_test_`) antes de ir para produção
- **AdMob**: Use IDs de teste em desenvolvimento
- **PIX**: Mercado Pago tem sandbox para testes

### Segurança
- NUNCA exponha chaves secretas no frontend
- Sempre valide webhooks com signatures
- Use HTTPS em produção

### Monetização Eficiente
- Banner sempre visível = receita constante
- Interstitial estratégico = não irritar usuário
- NUNCA durante oração/terço = respeitar momento espiritual
- Premium acessível = R$19,90/mês ou R$119,90/ano

---

## 📁 Arquivos Modificados/Criados

```
backend/
├── server.js          # ✅ Atualizado (Stripe + MP)
├── package.json       # ✅ Atualizado (novas deps)
├── .env.example       # ✅ Criado (template)
└── server.js.bak      # Backup do original

frontend/
├── pagamento.js       # ✅ Criado (integração pagamentos)
├── admob.js           # ✅ Criado (sistema de anúncios)
├── avaliacao.js       # ✅ Criado (sistema avaliação)
├── premium.js         # ✅ Atualizado (usa PagamentoService)
└── index.html         # ✅ Atualizado (novos scripts)
```

---

## 🆘 Suporte

Problemas comuns:

| Problema | Solução |
|----------|---------|
| PIX não gera | Verificar Access Token do MP |
| Stripe erro 401 | Verificar Secret Key |
| Webhook não recebe | Verificar URL e secret |
| AdMob não carrega | Só funciona no app nativo |
| Premium não ativa | Verificar Firebase Admin |

---

## ✅ Checklist Final

- [ ] Conta Stripe criada e verificada
- [ ] Conta Mercado Pago criada
- [ ] Conta AdMob criada com ad units
- [ ] Backend deployado no Railway
- [ ] Variáveis de ambiente configuradas
- [ ] Webhooks configurados (Stripe + MP)
- [ ] Frontend com API_URL correto
- [ ] APK de produção gerado
- [ ] Testado fluxo completo de pagamento
- [ ] App publicado na Play Store

---

🙏 **Maria Premium está pronto para abençoar seus fiéis!**
