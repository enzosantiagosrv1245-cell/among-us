# 🚀 Deploy no Render.com

Guia completo para fazer deploy do projeto Among Us no Render.

---

## 📋 Pré-requisitos

1. **Conta no Render**: https://render.com (criar conta gratuita)
2. **Repositório Git**: GitHub, GitLab ou Gitea
3. **Código commitado**: Todo código enviado ao repositório

---

## 🔐 Preparar Repositório Git

### 1. Inicializar Git (se não tiver)
```bash
cd /workspaces/among-us
git init
git add .
git commit -m "Initial commit - Among Us Game"
git remote add origin https://github.com/seu-usuario/among-us.git
git push -u origin main
```

### 2. Criar arquivo `.gitignore` (se não existir)
```
node_modules/
dist/
build/
*.log
.env
.env.local
.DS_Store
```

---

## 🌐 Deploy do Servidor (Express + Socket.io)

### Passo 1: Preparar arquivo `server/package.json`

Verifique se tem `"start"` script:

```json
{
  "name": "among-us-server",
  "version": "1.0.0",
  "main": "src/server.ts",
  "scripts": {
    "dev": "tsx src/server.ts",
    "start": "node dist/server.js",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0"
  }
}
```

### Passo 2: Criar `server/tsconfig.json` (se não tiver)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Passo 3: Atualizar `server/src/server.ts`

Certifique-se que está usando variáveis de ambiente:

```typescript
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// CORS para produção
app.use(cors({
  origin: CLIENT_URL,
  methods: ['GET', 'POST'],
  credentials: true
}));

const io = new Server(app, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ... resto do código

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em porta ${PORT}`);
});
```

### Passo 4: Criar `.env` do servidor

```
PORT=3001
CLIENT_URL=https://seu-cliente.onrender.com
NODE_ENV=production
```

### Passo 5: Deploy do Servidor no Render

1. **Acesse** https://render.com/dashboard
2. **Clique** em "New +" → "Web Service"
3. **Conecte** seu repositório GitHub/GitLab
4. **Preencha**:
   - **Name**: `among-us-server` (ou outro nome)
   - **Environment**: `Node`
   - **Build Command**: 
     ```
     npm install && npm run build --prefix server
     ```
   - **Start Command**: 
     ```
     node server/dist/server.js
     ```
5. **Environment Variables**:
   ```
   PORT=3001
   CLIENT_URL=https://seu-cliente.onrender.com
   NODE_ENV=production
   ```
6. **Plan**: Escolha "Free" (pode pausar, então reinicia manual)
7. **Clique** em "Create Web Service"
8. **Aguarde** o deploy (2-3 minutos)

Copie a URL do servidor (ex: `https://among-us-server.onrender.com`)

---

## 🎨 Deploy do Cliente (React + Vite)

### Passo 1: Atualizar `client/src/services/SocketService.ts`

Altere a URL do socket para apontar para o servidor em produção:

```typescript
const SOCKET_SERVER = import.meta.env.VITE_SOCKET_SERVER || 'http://localhost:3001';

class SocketService {
  private socket: Socket;
  
  constructor() {
    this.socket = io(SOCKET_SERVER, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
  }
  // ... resto do código
}
```

### Passo 2: Criar `client/.env.production`

```
VITE_SOCKET_SERVER=https://among-us-server.onrender.com
```

### Passo 3: Verificar `client/vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Passo 4: Preparar `client/package.json`

```json
{
  "name": "among-us-client",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### Passo 5: Deploy do Cliente no Render

#### Opção A: Como Static Site (Recomendado)

1. **Acesse** https://render.com/dashboard
2. **Clique** em "New +" → "Static Site"
3. **Conecte** seu repositório
4. **Preencha**:
   - **Name**: `among-us-client` (ou outro)
   - **Root Directory**: `client`
   - **Build Command**:
     ```
     npm install && npm run build
     ```
   - **Publish Directory**: `dist`
5. **Clique** em "Create Static Site"
6. **Aguarde** deploy (2-3 minutos)

Você receberá uma URL (ex: `https://among-us-client.onrender.com`)

#### Opção B: Como Web Service (Se precisar de backend customizado)

1. **Acesse** https://render.com/dashboard
2. **Clique** em "New +" → "Web Service"
3. **Conecte** repositório
4. **Preencha**:
   - **Name**: `among-us-client`
   - **Environment**: `Node`
   - **Build Command**:
     ```
     npm install && npm run build --prefix client
     ```
   - **Start Command**:
     ```
     npm install -g serve && serve -s client/dist -l 3000
     ```
5. **Clique** em "Create Web Service"

---

## 🔄 Atualizar URLs Após Deploy

### 1. Servidor - Atualizar CLIENT_URL

No dashboard do Render, vá ao Web Service do servidor:
- **Settings** → **Environment**
- Mude `CLIENT_URL` para a URL do cliente publicada

### 2. Cliente - Atualizar SOCKET_SERVER

No arquivo `client/.env.production`:
```
VITE_SOCKET_SERVER=https://seu-servidor.onrender.com
```

Ou no dashboard (se Web Service):
- **Settings** → **Environment**
- Adicione:
  ```
  VITE_SOCKET_SERVER=https://seu-servidor.onrender.com
  ```

---

## ✅ Testar Deployment

### 1. Verificar se servidor está online
```bash
curl https://seu-servidor.onrender.com
```

Deve retornar HTML ou JSON (não erro 503)

### 2. Acessar cliente no navegador
```
https://seu-cliente.onrender.com
```

Deve carregar o jogo normalmente

### 3. Abrir DevTools (F12)
- **Console**: Verificar erros de conexão com socket
- **Network**: Ver requisição ao servidor
- **Application**: Verificar cookies/storage

### 4. Testar criação de sala

1. Acesse o site
2. Clique em "Criar Sala"
3. Verifique no console se socket conectou
4. Copie código da sala
5. Abra em outra aba/navegador
6. Entrar na sala
7. Ambos devem aparecer na lista

---

## 🔧 Troubleshooting

| Problema | Solução |
|----------|---------|
| **Erro 503 no servidor** | Render pode estar inicializando (Free tier pausa após inatividade). Espere 30s e tente novamente. |
| **CORS error no console** | Verifique `CLIENT_URL` no servidor e `VITE_SOCKET_SERVER` no cliente. Devem ser as URLs corretas. |
| **Builds falhando** | Execute `npm run build` localmente primeiro para encontrar erros. |
| **Socket não conecta** | Verifique URL no DevTools. Servidor pode estar offline. |
| **Arquivo CSS/JS 404** | Pode ser cache. Faça hard refresh (Ctrl+Shift+R). |

---

## 📊 Monitorar Logs

### Servidor
1. Dashboard → Web Service (servidor)
2. **Clique** em "Logs"
3. Ver erros e mensagens em tempo real

### Cliente
1. Dashboard → Static Site (cliente)
2. **Clique** em "Logs"
3. Ver build logs e erros

---

## 💰 Plano Gratuito vs Pago

### Render Free Tier
- **Vantagens**: Grátis, sem cartão de crédito
- **Limitações**:
  - Aplicação pausa após 15 minutos de inatividade
  - Reinicia automaticamente quando recebe requisição (cold start ~30s)
  - 0.5 vCPU, 512 MB RAM
  - 100 GB de banda por mês

### Para produção (paid)
- **Starter** ($7/mês): 1 vCPU, 0.5 GB RAM, sempre ligado
- **Standard** ($12/mês): 2 vCPU, 4 GB RAM

---

## 🌍 Domain Customizado (Opcional)

1. **Comprar domínio**: GoDaddy, Namecheap, etc.
2. **No Render**:
   - Settings → Custom Domain
   - Adicione seu domínio
   - Siga as instruções de DNS

---

## 🚀 Pipeline Contínuo

Toda vez que você fazer push para `main`:

```bash
git add .
git commit -m "Atualizar jogo"
git push origin main
```

O Render **automaticamente**:
1. Puxa novo código
2. Roda `npm install`
3. Roda build commands
4. Faz deploy

---

## 📝 Arquivo `server/.env.example`

Crie este arquivo para documentar variáveis necessárias:

```
# Render Web Service
PORT=3001
NODE_ENV=production
CLIENT_URL=https://seu-cliente.onrender.com

# Opcional - Banco de dados
DATABASE_URL=postgresql://user:pass@host/db
```

---

## 🎯 Resumo dos Passos

1. ✅ Commit código no GitHub
2. ✅ Criar Web Service (servidor) no Render
3. ✅ Criar Static Site (cliente) no Render
4. ✅ Copiar URLs publicadas
5. ✅ Atualizar `CLIENT_URL` no servidor
6. ✅ Atualizar `VITE_SOCKET_SERVER` no cliente
7. ✅ Fazer novo push para triggerar deploy
8. ✅ Testar em https://seu-cliente.onrender.com

---

## 🆘 Contato & Suporte

- **Render Docs**: https://render.com/docs
- **Socket.io CORS**: https://socket.io/docs/v4/handling-cors/
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

**✨ Pronto! Seu jogo está no ar! 🎮**
