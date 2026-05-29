# 🔒 Backup das Firestore Rules — antes da revisão

**Data**: 2026-05-28
**Projeto Firebase**: `converse-com-maria`
**Capturada por**: JOs colou no chat durante review de mudanças

> Este é o **estado anterior** das regras, antes da revisão de hoje. Mantido pra rollback caso a nova versão dê problema.

---

## Conteúdo

```javascript
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

    // CONTEÚDO - LIVROS (app lê, só admin escreve)
    match /conteudo_livros/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.email in ['kennrick@gmail.com', 'rickboypoke@gmail.com'];
    }

    // CONTEÚDO - MÚSICAS (app lê, só admin escreve)
    match /conteudo_musicas/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.email in ['kennrick@gmail.com', 'rickboypoke@gmail.com'];
    }

    // CONTEÚDO - FRASES (app lê, só admin escreve)
    match /conteudo_frases/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.email in ['kennrick@gmail.com', 'rickboypoke@gmail.com'];
    }

    // QA CHECKLIST (teste — qualquer usuário logado)
    match /qa_checklist/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## ⚠️ Pontos de atenção identificados na revisão

### 1. SEM `default deny`
A versão atual NÃO bloqueia collections futuras. Se aparecer uma collection nova (ex: `comentarios`, `feedbacks`) sem regra explícita, o Firestore Default Behavior é **abrir tudo** (legacy) ou **fechar tudo** (modern security mode). Depende da configuração do projeto na criação.

**Risco real**: collection nova fica acessível por qualquer um.

**Fix**: adicionar `match /{document=**}` com `allow read, write: if false;` no final.

### 2. `qa_checklist` aberto pra qualquer usuário logado
Qualquer pessoa logada no app pode escrever em `qa_checklist`. Se for collection só pro JOs marcar testes, deveria ser restrita a admin.

**Risco**: usuários comuns descobrem a collection (via inspetor Firebase) e poluem.

**Fix**: trocar `if request.auth != null` por `if isAdmin()` (helper precisa ser definido).

### 3. `velas` e `intencoes` — update sem restrição de dono
Qualquer usuário logado pode atualizar QUALQUER vela ou intenção (não só a própria). Pode reescrever intenções dos outros.

**Fix**: restringir update ao dono (`resource.data.usuarioId == request.auth.uid`) ou admin.

---

## 🆕 Versão NOVA proposta (após review JOs)

Ver arquivo `INSTRUCAO-FIREBASE-CONSOLE.md` — bloco no passo 4.
