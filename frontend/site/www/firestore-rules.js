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
    
    // ========================================
    // 👤 USUÁRIOS
    // ========================================
    match /usuarios/{userId} {
      // Usuário pode ler seus próprios dados
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Usuário pode criar/atualizar seus próprios dados
      allow create, update: if request.auth != null && request.auth.uid == userId;
      
      // Ninguém pode deletar (apenas admin via console)
      allow delete: if false;
    }
    
    // ========================================
    // 🕯️ VELAS
    // ========================================
    match /velas/{velaId} {
      // Qualquer um pode ler velas ativas
      allow read: if true;
      
      // Usuários logados podem criar velas
      allow create: if request.auth != null;
      
      // Apenas o dono pode atualizar (ou incrementar rezas)
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.usuarioId ||
        // Permitir incrementar rezasPorEla
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['rezasPorEla'])
      );
      
      // Ninguém pode deletar
      allow delete: if false;
    }
    
    // ========================================
    // 👥 INTENÇÕES DO MURAL
    // ========================================
    match /intencoes/{intencaoId} {
      // Qualquer um pode ler intenções ativas
      allow read: if true;
      
      // Usuários logados podem criar intenções
      allow create: if request.auth != null;
      
      // Apenas o dono pode atualizar (ou incrementar rezas)
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.usuarioId ||
        // Permitir incrementar rezasPorEla
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['rezasPorEla'])
      );
      
      // Ninguém pode deletar (moderação via console)
      allow delete: if false;
    }
    
    // ========================================
    // 🚨 DENÚNCIAS
    // ========================================
    match /denuncias/{denunciaId} {
      // Ninguém pode ler denúncias (apenas admin)
      allow read: if false;
      
      // Usuários logados podem criar denúncias
      allow create: if request.auth != null;
      
      // Ninguém pode atualizar ou deletar
      allow update, delete: if false;
    }
    
    // ========================================
    // 💰 PAGAMENTOS (para integração futura)
    // ========================================
    match /pagamentos/{pagamentoId} {
      // Usuário pode ler seus próprios pagamentos
      allow read: if request.auth != null && request.auth.uid == resource.data.usuarioId;
      
      // Apenas servidor pode criar/atualizar (via Admin SDK)
      allow create, update, delete: if false;
    }
    
    // ========================================
    // 📊 ESTATÍSTICAS GLOBAIS (público)
    // ========================================
    match /estatisticas_globais/{docId} {
      // Qualquer um pode ler
      allow read: if true;
      
      // Apenas servidor pode escrever
      allow write: if false;
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
