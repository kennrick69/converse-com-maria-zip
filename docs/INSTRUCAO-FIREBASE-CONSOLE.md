# 🔥 Como aplicar as Firestore Rules no Firebase Console

> Tempo: ~2 minutos. Sem isso, as regras de segurança das collections novas (`conteudo_livros`, `conteudo_musicas`, `conteudo_frases`) não vão valer.

---

## Passo a passo

### 1. Abra o Firebase Console
Cole no navegador:

```
https://console.firebase.google.com/project/converse-com-maria/firestore/rules
```

Login com `kennrick@gmail.com`.

### 2. Você verá um editor de texto com as regras atuais
Vai parecer algo como `rules_version = '2'; ...`

### 3. APAGUE tudo que estiver lá
Selecionar tudo (Ctrl+A) → Delete

### 4. COLE o bloco abaixo

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper: admins autorizados
    function isAdmin() {
      return request.auth != null
        && request.auth.token.email != null
        && request.auth.token.email in [
          'kennrick@gmail.com',
          'rickboypoke@gmail.com'
        ];
    }

    // ========== USUÁRIOS ==========
    match /usuarios/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || isAdmin());
      allow create, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if isAdmin();
    }

    // ========== VELAS ==========
    match /velas/{velaId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.usuarioId ||
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['rezasPorEla'])
      );
      allow delete: if isAdmin();
    }

    // ========== INTENÇÕES (mural público) ==========
    match /intencoes/{intencaoId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.usuarioId ||
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['rezasPorEla'])
      );
      allow delete: if isAdmin();
    }

    // ========== DENÚNCIAS (só admin lê) ==========
    match /denuncias/{denunciaId} {
      allow read: if isAdmin();
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }

    // ========== PAGAMENTOS (servidor only) ==========
    match /pagamentos/{pagamentoId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.usuarioId;
      allow create, update, delete: if false;
    }

    // ========== ESTATÍSTICAS GLOBAIS ==========
    match /estatisticas_globais/{docId} {
      allow read: if true;
      allow write: if false;
    }

    // ========== CONTEÚDO ADMINISTRATIVO (Livros / Músicas / Frases) ==========
    // Open read — catálogo público. Escrita só admin.
    match /conteudo_livros/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /conteudo_musicas/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /conteudo_frases/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // ========== DEFAULT DENY ==========
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 5. Clique em **"Publicar"** (botão azul no canto superior direito)

Vai aparecer um aviso tipo:
> "Suas regras foram publicadas com sucesso"

### 6. Pronto!
A partir desse momento:
- Painel admin consegue criar/editar Livros, Músicas e Frases
- App cliente consegue listar o catálogo
- Tudo seguro

---

## ⚠️ Se aparecer erro de sintaxe

O editor do Firebase valida na hora. Se aparecer linha vermelha:
1. Confere se copiou desde `rules_version = '2';` até o `}` final
2. Se ainda der erro, manda print pro Claude que ajusto

---

## 🧪 Como confirmar que funcionou

Depois de publicar:
1. Vai no app (Chrome anônimo)
2. Abre o painel admin
3. Aba "📚 Livros" → "Novo Livro" → preenche título → Salva
4. Se aparecer toast verde "Criado!" → tudo certo
5. Se aparecer "❌ Erro: permission-denied" → regra não foi aplicada, reabre o passo 4
