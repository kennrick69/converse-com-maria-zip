# 🙏 Converse com Maria

Chatbot espiritual que personifica Maria, Mãe de Jesus Cristo.

---

## 📁 Estrutura do Projeto

```
converse-com-maria/
├── backend/
│   ├── server.js      ← Servidor Node.js
│   ├── package.json   ← Dependências
│   └── .env           ← API Key (não compartilhe!)
├── frontend/
│   └── index.html     ← Interface do app
└── README.md          ← Este arquivo
```

---

## 🚀 Como Rodar o Projeto

### Passo 1: Abrir o Terminal na pasta backend

1. Abra o Explorador de Arquivos
2. Navegue até a pasta `converse-com-maria/backend`
3. Clique na barra de endereço e digite `cmd` e aperte Enter
   (Isso abre o terminal já na pasta certa)

### Passo 2: Instalar as dependências

No terminal, digite:
```
npm install
```
Aguarde terminar (pode demorar alguns segundos).

### Passo 3: Iniciar o servidor

No terminal, digite:
```
npm start
```

Você verá:
```
========================================
🙏 CONVERSE COM MARIA - BACKEND
========================================
✅ Servidor rodando em: http://localhost:3000
========================================
```

### Passo 4: Abrir o App

1. Vá na pasta `frontend`
2. Clique duas vezes no arquivo `index.html`
3. O app vai abrir no navegador!

---

## ✅ Testando se está funcionando

1. Acesse no navegador: http://localhost:3000/api/status
2. Deve aparecer: `{"status":"online","message":"🙏 Servidor Converse com Maria está funcionando!"}`

---

## 🛑 Para Parar o Servidor

No terminal onde está rodando, aperte `Ctrl + C`

---

## 🔧 Configurações

O arquivo `.env` contém:
- `GEMINI_API_KEY` - Sua chave da API do Google Gemini
- `PORT` - Porta do servidor (padrão: 3000)

---

## 📞 Suporte

Qualquer dúvida, volte ao Claude! 🙏
