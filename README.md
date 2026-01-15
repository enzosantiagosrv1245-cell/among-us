# Among Us 2.0 - Jogo Multiplayer

Um remake do jogo Among Us em TypeScript/React com Phaser 3 e Socket.io.

## 🚀 Instalação & Setup

### Dependências Principais

As dependências já foram instaladas! Aqui está o que foi instalado:

**Cliente:**
- `react` & `react-dom` - Framework UI
- `phaser` ^3.70.0 - Engine de jogos 2D
- `socket.io-client` ^4.7.2 - Comunicação em tempo real
- `zustand` - State management
- `framer-motion` - Animações
- `howler` - Audio management
- `sass` - Styling

**Servidor:**
- `express` - Framework web
- `socket.io` - WebSocket server
- `cors` - CORS middleware
- `uuid` - ID generation
- `typescript` - Type safety

## 📦 Scripts Disponíveis

```bash
# Instalação inicial (já feito!)
npm install

# Desenvolvimento - Roda client + server simultaneamente
npm run dev

# Build de produção
npm run build

# Apenas client
npm run dev:client

# Apenas server
npm run dev:server
```

## 🎮 Estrutura do Projeto

```
among-us/
├── client/              # Frontend React + Phaser
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── game/        # Cenas e entidades Phaser
│   │   ├── services/    # Socket.io client
│   │   ├── stores/      # Zustand state management
│   │   └── utils/       # Helpers e managers
│   └── public/          # Assets estáticos
├── server/              # Backend Node.js + Express
│   ├── src/
│   │   └── server.ts    # Servidor principal
│   └── .env             # Configurações
├── shared/              # Tipos e constantes compartilhadas
│   ├── src/
│   │   ├── types.ts     # Interfaces TypeScript
│   │   ├── events.ts    # Socket.io events
│   │   ├── constants.ts # Constantes globais
│   │   └── index.ts     # Exports
│   └── tsconfig.json
└── package.json         # Workspace root

```

## 🎯 Funcionalidades Implementadas

✅ **Lobby & Room Management**
- Criar/Entrar em salas
- Seleção de cores
- Configurações do jogo
- Chat de lobby

✅ **Game Mechanics**
- Movimentação 2D com Phaser
- Sistema de tarefas
- Reuniões de discussão/votação
- Sistema de morte (Impostores)
- Vents (Ventilação)

✅ **UI Components**
- Main Menu
- Lobby
- Game HUD
- Role Reveal
- Meeting UI
- Voting System
- Game Over Screen

✅ **Real-time Communication**
- Socket.io para sincronização
- Estado do jogo sincronizado
- Mensagens de chat

## 🔄 Como Rodar

### Modo Desenvolvimento

Terminal 1 - Cliente:
```bash
npm run dev:client
# Abre em http://localhost:3000
```

Terminal 2 - Servidor:
```bash
npm run dev:server
# Roda em http://localhost:3001
```

Ou ambos simultaneamente:
```bash
npm run dev
```

## 🎨 Assets Necessários

Os seguintes assets devem estar em `client/public/assets/`:

```
assets/
├── sprites/
│   ├── characters/
│   │   └── [color]/ (red, blue, green, etc)
│   │       ├── walk.png
│   │       ├── idle.png
│   │       ├── ghost.png
│   │       ├── kill.png
│   │       ├── body.png
│   │       └── avatar.png
│   └── effects/
│       └── blood-splatter.png
├── maps/
│   ├── the-skeld/
│   │   ├── background.png
│   │   ├── walls.png
│   │   ├── collision.png
│   │   ├── tilemap.json
│   │   ├── minimap.png
│   │   └── rooms/
│   └── [outros mapas...]
├── ui/
│   ├── button-*.png
│   ├── logo.png
│   ├── taskbar-*.png
│   └── loading-*.png
├── audio/
│   ├── music/
│   │   ├── music-menu.mp3
│   │   ├── music-lobby.mp3
│   │   └── music-game.mp3
│   └── sfx/
│       ├── button-click.mp3
│       ├── button-hover.mp3
│       ├── task-complete.mp3
│       ├── kill.mp3
│       ├── vent.mp3
│       └── explosion.mp3
```

## 📝 Tipos Principales

Veja `shared/src/types.ts` para todos os tipos disponíveis:

- `Player` - Informações do jogador
- `GameSettings` - Configurações do jogo
- `Task` - Definição de tarefas
- `GamePhase` - Estados do jogo
- `PlayerRole` - CREWMATE, IMPOSTOR
- `PlayerColor` - Cores dos personagens
- `MapType` - Mapas disponíveis

## 🔌 Socket.io Events

Cliente → Servidor:
- `create_room` - Criar sala
- `join_room` - Entrar em sala
- `change_color` - Mudar cor
- `change_settings` - Atualizar settings
- `start_game` - Iniciar jogo
- `player_move` - Mover personagem
- `complete_task` - Completar tarefa
- `kill_player` - Matar jogador (Impostor)
- `submit_vote` - Votar em votação

Servidor → Cliente:
- `players_updated` - Lista de jogadores atualizada
- `settings_updated` - Settings atualizadas
- `game_started` - Jogo iniciado
- `player_moved` - Jogador se moveu
- `player_died` - Jogador morreu
- `meeting_called` - Reunião chamada

## 🐛 Troubleshooting

**Erro: "Cannot find module 'react'"**
```bash
npm install
```

**Servidor não conecta**
- Verificar se porta 3001 está livre
- Verificar CORS em server.ts

**Assets não carregam**
- Verificar path em `client/public/assets/`
- Verificar console do browser

## 📚 Próximos Passos

1. **Criar/Adicionar Assets** - Sprites, maps, áudio
2. **Implementar GameScene** - Lógica completa de movimento
3. **Sistema de Sabotagem** - Lights, Reactor, O2
4. **Chat durante reuniões** - Discussão entre jogadores
5. **Voice Chat** - Audio comunicação (PeerJS integrado)
6. **Cosmetics** - Hats, skins, pets
7. **Persistência** - Banco de dados para stats

## 📄 Licença

Este é um projeto de estudo. Among Us é propriedade da Innersloth.

---

**Desenvolvido com ❤️ em TypeScript**
