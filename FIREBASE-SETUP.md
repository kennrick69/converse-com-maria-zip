# 🔥 GUIA DE CONFIGURAÇÃO DO FIREBASE
## Converse com Maria

---

## 📋 PASSO 1: Criar Projeto no Firebase

1. Acesse: **https://console.firebase.google.com**
2. Clique em **"Adicionar projeto"** (ou "Add project")
3. Nome do projeto: **`converse-com-maria`**
4. Desative o Google Analytics (opcional para começar)
5. Clique em **"Criar projeto"**

---

## 📋 PASSO 2: Adicionar App Web

1. Na página inicial do projeto, clique no ícone **`</>`** (Web)
2. Apelido do app: **`Converse com Maria Web`**
3. ✅ Marque **"Configurar Firebase Hosting"** (opcional)
4. Clique em **"Registrar app"**
5. **COPIE** as credenciais que aparecerem:

```javascript
const firebaseConfig = {
    apiKey: "AIza...",
    authDomain: "converse-com-maria.firebaseapp.com",
    projectId: "converse-com-maria",
    storageBucket: "converse-com-maria.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

6. Cole essas credenciais no arquivo **`firebase-config.js`** (linhas 14-20)

---

## 📋 PASSO 3: Ativar Autenticação

1. No menu lateral, clique em **"Build" > "Authentication"**
2. Clique em **"Get started"** (Começar)
3. Na aba **"Sign-in method"**:

### Ativar Email/Senha:
   - Clique em **"Email/Senha"**
   - Ative o primeiro toggle **"Email/Senha"**
   - Clique em **"Salvar"**

### Ativar Google:
   - Clique em **"Google"**
   - Ative o toggle
   - Selecione um **email de suporte** (seu email)
   - Clique em **"Salvar"**

---

## 📋 PASSO 4: Criar Banco de Dados Firestore

1. No menu lateral, clique em **"Build" > "Firestore Database"**
2. Clique em **"Create database"** (Criar banco)
3. Selecione **"Start in production mode"** (modo produção)
4. Escolha a localização: **`southamerica-east1`** (São Paulo)
5. Clique em **"Enable"** (Ativar)

---

## 📋 PASSO 5: Configurar Regras de Segurança

1. No Firestore, clique na aba **"Rules"** (Regras)
2. **Substitua** todo o conteúdo por:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // USUÁRIOS
    match /usuarios/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
    
    // VELAS
    match /velas/{velaId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if false;
    }
    
    // INTENÇÕES
    match /intencoes/{intencaoId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if false;
    }
    
    // DENÚNCIAS
    match /denuncias/{denunciaId} {
      allow read: if false;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
  }
}
```

3. Clique em **"Publish"** (Publicar)

---

## 📋 PASSO 6: Adicionar Scripts ao HTML

No seu **`index.html`**, adicione ANTES dos outros scripts:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>

<!-- Nossos scripts Firebase -->
<script src="firebase-config.js" defer></script>
<script src="firebase-auth-ui.js" defer></script>
```

---

## 📋 PASSO 7: Testar

1. Abra o app no navegador
2. O Firebase deve inicializar (veja o console: "🔥 Firebase inicializado")
3. Teste criar uma conta
4. Teste fazer login
5. Teste o login com Google

---

## 🔧 ESTRUTURA DO BANCO DE DADOS

```
firestore/
├── usuarios/
│   └── {userId}/
│       ├── perfil: { nome, genero, estadoCivil, temFilhos }
│       ├── estatisticas: { mensagens, tercos, velas, streak... }
│       ├── conquistas: [ { id, desbloqueadaEm } ]
│       ├── premium: { ativo, plano, expiraEm }
│       └── preferencias: { tema, notificacoes, musica }
│
├── velas/
│   └── {velaId}/
│       ├── usuarioId, usuarioNome
│       ├── tipo, intencao, cor
│       ├── acesaEm, expiraEm
│       └── rezasPorEla, ativa
│
├── intencoes/
│   └── {intencaoId}/
│       ├── usuarioId, usuarioNome
│       ├── texto, categoria
│       ├── publicadaEm
│       └── rezasPorEla, ativa
│
└── denuncias/
    └── {denunciaId}/
        ├── intencaoId
        ├── denunciadoPor
        ├── motivo
        └── data
```

---

## 💰 CUSTOS (Plano Gratuito - Spark)

| Recurso | Limite Gratuito |
|---------|-----------------|
| Autenticação | Ilimitada |
| Firestore Leituras | 50.000/dia |
| Firestore Escritas | 20.000/dia |
| Firestore Deletes | 20.000/dia |
| Storage | 5 GB |
| Hosting | 10 GB/mês |

**Para um app começando, o plano gratuito é mais que suficiente!**

---

## ❓ PROBLEMAS COMUNS

### "Firebase não está definido"
- Verifique se os scripts do Firebase estão carregando antes dos seus scripts
- Use `defer` em todos os scripts

### "Permissão negada"
- Verifique se as regras do Firestore estão corretas
- Verifique se o usuário está logado

### "Login com Google não funciona"
- Adicione seu domínio em Authentication > Settings > Authorized domains
- Para localhost, já deve estar autorizado

---

## ✅ CHECKLIST FINAL

- [ ] Projeto criado no Firebase Console
- [ ] App Web registrado
- [ ] Credenciais copiadas para `firebase-config.js`
- [ ] Authentication ativado (Email + Google)
- [ ] Firestore Database criado
- [ ] Regras de segurança configuradas
- [ ] Scripts adicionados ao HTML
- [ ] Testado login/cadastro
- [ ] Testado sincronização de dados

---

**Pronto! Seu app agora tem banco de dados na nuvem! 🎉**
