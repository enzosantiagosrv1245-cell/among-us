# 🚀 GUIA RÁPIDO - COMEÇANDO A USAR O PROJETO

## 📍 Localização do Projeto
```
/workspaces/among-us
```

## ⚡ Começar Rapidamente

### **Opção 1: Rodar Ambos Simultaneamente**
```bash
cd /workspaces/among-us
npm run dev
```

Isto abre:
- **Cliente**: http://localhost:3000
- **Servidor**: http://localhost:3001

### **Opção 2: Rodar Separadamente**

Terminal 1 - Cliente:
```bash
cd /workspaces/among-us
npm run dev:client
```
→ Acesso: http://localhost:3000

Terminal 2 - Servidor:
```bash
cd /workspaces/among-us
npm run dev:server
```
→ Rodando em: http://localhost:3001

---

## 🏗️ Estrutura de Pastas

```
among-us/
│
├── 📁 client/                      # Frontend React + Phaser
│   ├── src/
│   │   ├── components/             # Componentes React
│   │   │   ├── Game/               # Componentes do jogo
│   │   │   ├── Lobby/              # Lobby da sala
│   │   │   ├── MainMenu/           # Menu principal
│   │   │   └── Tasks/              # Minigames de tarefas
│   │   │
│   │   ├── game/                   # Phaser (engine 2D)
│   │   │   ├── scenes/             # Cenas do jogo
│   │   │   ├── entities/           # Sprites/GameObjects
│   │   │   └── config.ts           # Configuração Phaser
│   │   │
│   │   ├── stores/                 # Zustand State Store
│   │   ├── services/               # Socket.io Client
│   │   ├── utils/                  # Helpers
│   │   ├── styles/                 # SCSS global
│   │   ├── App.tsx                 # App raiz
│   │   └── main.tsx                # Entry point
│   │
│   ├── public/                     # Assets estáticos
│   │   ├── index.html
│   │   └── assets/                 # Sprites, maps, áudio
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
│
├── 📁 server/                      # Backend Express + Socket.io
│   ├── src/
│   │   └── server.ts               # Servidor principal
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                        # Variáveis de ambiente
│   └── README.md
│
├── 📁 shared/                      # Tipos compartilhados
│   ├── src/
│   │   ├── types.ts                # TS interfaces
│   │   ├── events.ts               # Socket.io events
│   │   ├── constants.ts            # Constantes
│   │   └── index.ts                # Exports
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                    # Workspace config
├── README.md                       # Documentação
└── DEPENDENCIES.md                 # Este arquivo
```

---

## 📝 Editando Arquivos Importantes

### **1. Alterar Cores dos Jogadores**
Arquivo: `shared/src/types.ts`

```typescript
export const PLAYER_COLORS = [
  { id: 'red', name: 'Vermelho', hex: '#c51111', rgb: 'rgb(197, 17, 17)' },
  { id: 'blue', name: 'Azul', hex: '#132ed1', rgb: 'rgb(19, 46, 209)' },
  // ... Adicionar mais cores aqui
];
```

### **2. Adicionar Socket.io Event**
Arquivo: `shared/src/events.ts`

```typescript
export enum ClientEvents {
  MEU_NOVO_EVENT = 'meu_novo_event',
  // ... mais eventos
}
```

E em `client/src/services/SocketService.ts`:
```typescript
public meuNovoEvent(data: any): void {
  this.emit(ClientEvents.MEU_NOVO_EVENT, data);
}
```

### **3. Adicionar Estado Global**
Arquivo: `client/src/stores/gameStore.ts`

```typescript
interface GameStore {
  minhaNovaPropriedade: string;
  setMinhaPropriedade: (valor: string) => void;
  // ...
}

// No create/set:
setMinhaPropriedade: (valor) => set({ minhaNovaPropriedade: valor })
```

### **4. Adicionar Handler de Socket no Server**
Arquivo: `server/src/server.ts`

```typescript
socket.on('meu_novo_event', (data) => {
  console.log('Evento recebido:', data);
  io.to(roomCode).emit('meu_novo_event_resposta', { resultado: 'ok' });
});
```

---

## 🎮 Fluxo do Jogo

```
MainMenu
   ↓
   ├→ CreateRoom (Socket: create_room)
   └→ JoinRoom (Socket: join_room)
   ↓
Lobby (Selecionar cor, configurações)
   ↓
   └→ StartGame (Socket: start_game)
   ↓
Game Scene
   ├→ RoleReveal (Mostrar seu role)
   ├→ Playing (Movimentar, fazer tarefas)
   ├→ Emergency/Meeting (Votação)
   ├→ Results (Mostrar eliminado)
   └→ GameOver
   ↓
Menu (Voltar ao menu principal)
```

---

## 🔌 Socket.io - Eventos Principais

### Cliente enviando (Client → Server)
```typescript
socketService.createRoom(name, playerId, color);
socketService.joinRoom(code, name, playerId, color);
socketService.changeColor(newColor);
socketService.changeSettings(settings);
socketService.startGame();
socketService.movePlayer(position, velocity);
socketService.completeTask(taskId);
socketService.killPlayer(targetId);    // Impostor
socketService.reportBody(bodyId);      // Crewmate
socketService.submitVote(targetId);    // Votação
```

### Servidor respondendo (Server → Client)
```typescript
'players_updated'      // Lista de jogadores atualizada
'settings_updated'     // Configurações mudaram
'game_started'         // Jogo iniciou
'player_moved'         // Jogador se moveu
'player_killed'        // Alguém foi morto
'player_voted'         // Alguém votou
'game_over'            // Jogo terminou
```

---

## 🔧 Desenvolvimento Local

### Compilar apenas:
```bash
npm run build
```

### Compilar Shared (tipos):
```bash
npm run build:shared
```

### Build para produção:
```bash
npm run build:client
npm run build:server
```

---

## 🐛 Debugging

### Ver console do servidor:
```
Terminal com `npm run dev:server`
```

### Ver console do navegador:
```
F12 → Console
```

### Verificar Socket.io:
```
http://localhost:3001
```

---

## 📱 Testar Multiplayer Local

### Abra 2 navegadores apontando para http://localhost:3000

1. **Janela 1**: Criar sala e selecionar cor
2. **Janela 2**: Entrar na mesma sala e selecionar outra cor
3. Ambos aparecem na lista de jogadores
4. Host clica em "Começar Jogo"
5. Jogo inicia para ambos (sincronizado)

---

## ⚙️ Configuração de Variáveis

### Client - Configurar porta:
Arquivo: `client/vite.config.ts`
```typescript
server: {
  port: 3000,  // Mudar aqui
}
```

### Server - Configurar porta:
Arquivo: `server/src/server.ts`
```typescript
const PORT = process.env.PORT || 3001;  // Mudar aqui
```

Ou via `.env`:
```
PORT=3001
CLIENT_URL=http://localhost:3000
```

---

## 📚 Documentação Relevante

- [Phaser Docs](https://photonstorm.github.io/phaser3-docs/)
- [Socket.io Docs](https://socket.io/docs/v4/socket-io-protocol/)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Docs](https://github.com/pmndrs/zustand)

---

## ✅ Checklist de Setup

- [x] Node.js instalado
- [x] npm/yarn funcionando
- [x] Dependências instaladas
- [x] TypeScript compilando
- [x] Vite servindo
- [x] Socket.io respondendo
- [x] Componentes React renderizando

---

## 🆘 Troubleshooting Rápido

| Erro | Solução |
|------|---------|
| `Cannot find module 'react'` | `npm install` |
| `Port 3000 already in use` | Mude porta em `vite.config.ts` |
| `Socket connection refused` | Server não está rodando |
| `TypeScript errors` | `npm run build:shared` |
| `CORS error` | Verificar `server.ts` CORS config |

---

**🎮 Pronto para jogar! Boa sorte com o desenvolvimento!**
