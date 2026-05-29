// ========================================
// 🔒 REGRAS DE SEGURANÇA DO FIRESTORE
// ========================================
// 
// INSTRUÇÕES:
// 1. Vá no Firebase Console > Firestore Database
// 2. Clique na aba "Rules" (Regras)
// 3. Cole o conteúdo abaixo
// 4. Clique em "Publish" (Publicar)
//
// ========================================

/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Admin = JOs + rickboy
    function isAdmin() {
      return request.auth != null
        && request.auth.token.email != null
        && request.auth.token.email in [
          'kennrick@gmail.com',
          'rickboypoke@gmail.com'
        ];
    }
    function isOwner(uid) {
      return request.auth != null && request.auth.uid == uid;
    }

    // USUÁRIOS
    match /usuarios/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create, update: if isOwner(userId);
      allow delete: if isAdmin();
    }

    // VELAS — qualquer um lê; logado cria; só dono ou admin edita/deleta
    match /velas/{velaId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if isAdmin() ||
        (request.auth != null && resource.data.usuarioId == request.auth.uid) ||
        // permite só incrementar rezasPorEla (qualquer logado)
        (request.auth != null &&
         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['rezasPorEla']));
      allow delete: if isAdmin();
    }

    // INTENÇÕES — mesma lógica das velas
    match /intencoes/{intencaoId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if isAdmin() ||
        (request.auth != null && resource.data.usuarioId == request.auth.uid) ||
        (request.auth != null &&
         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['rezasPorEla']));
      allow delete: if isAdmin();
    }

    // DENÚNCIAS — só admin lê/gerencia
    match /denuncias/{denunciaId} {
      allow read: if isAdmin();
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }

    // CONTEÚDO ADMINISTRATIVO — app lê (precisa login), só admin escreve
    // LIVROS: doc principal embarca cap1; subcol /capitulos/{numero} tem caps 2+
    match /conteudo_livros/{docId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();

      match /capitulos/{numero} {
        allow read: if request.auth != null;
        allow write: if isAdmin();
      }
    }
    match /conteudo_musicas/{docId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    match /conteudo_frases/{docId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }

    // FEEDBACKS da Maria — qualquer logado pode CRIAR (👍/👎), só admin lê.
    // Não permite update/delete pelo user (evita manipulação retroativa).
    match /feedbacks_maria/{docId} {
      allow read: if isAdmin();
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }

    // DEFAULT DENY — qualquer collection futura sem regra fica BLOQUEADA
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
*/

// ========================================
// 📋 ÍNDICES NECESSÁRIOS
// ========================================
// 
// O Firebase vai pedir para criar índices quando você
// fizer queries compostas. Quando aparecer o erro,
// clique no link que ele fornece para criar automaticamente.
//
// Índices que provavelmente serão necessários:
//
// 1. velas: ativa (ASC), expiraEm (ASC), acesaEm (DESC)
// 2. intencoes: ativa (ASC), publicadaEm (DESC)
// 3. usuarios: estatisticas.ultimaAtividade (DESC)
//
// ========================================

console.log('📋 Regras do Firestore - copie o conteúdo comentado para o console do Firebase');
