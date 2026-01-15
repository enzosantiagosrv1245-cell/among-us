// server/src/server.ts
import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling'] // Adicionar polling como fallback
});

// Middleware
app.use(cors());
app.use(express.json());

// IMPORTANTE: Servir arquivos estáticos do client/dist
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Store rooms and players
interface Room {
  code: string;
  host: string;
  players: Map<string, any>;
  settings: any;
  phase: string;
  started: boolean;
}

const rooms = new Map<string, Room>();
const playerRooms = new Map<string, string>();

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/rooms', (req: Request, res: Response) => {
  const activeRooms = Array.from(rooms.values()).map(room => ({
    code: room.code,
    playerCount: room.players.size,
    maxPlayers: 15,
    started: room.started
  }));
  res.json(activeRooms);
});

// Socket IO Events
io.on('connection', (socket) => {
  console.log(`[✓] Jogador conectado: ${socket.id}`);

  socket.on('create_room', (data, callback) => {
    const { playerName, playerId, color } = data;
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const room: Room = {
      code: roomCode,
      host: socket.id,
      players: new Map([
        [socket.id, { 
          id: socket.id, 
          name: playerName, 
          color, 
          playerId,
          isHost: true, 
          isAlive: true,
          role: null
        }]
      ]),
      settings: getDefaultSettings(),
      phase: 'LOBBY',
      started: false
    };
    
    rooms.set(roomCode, room);
    playerRooms.set(socket.id, roomCode);
    socket.join(roomCode);
    
    console.log(`[✓] Sala criada: ${roomCode}`);
    callback({ success: true, roomCode });
  });

  socket.on('join_room', (data, callback) => {
    const { roomCode, playerName, playerId, color } = data;
    const room = rooms.get(roomCode);
    
    if (!room) {
      callback({ success: false, error: 'Sala não encontrada' });
      return;
    }
    
    if (room.players.size >= 15) {
      callback({ success: false, error: 'Sala cheia' });
      return;
    }
    
    room.players.set(socket.id, {
      id: socket.id,
      name: playerName,
      color,
      playerId,
      isHost: false,
      isAlive: true,
      role: null
    });
    
    playerRooms.set(socket.id, roomCode);
    socket.join(roomCode);
    
    io.to(roomCode).emit('players_updated', Array.from(room.players.values()));
    console.log(`[✓] Jogador entrou na sala ${roomCode}`);
    callback({ success: true, players: Array.from(room.players.values()) });
  });

  socket.on('change_color', (data) => {
    const { roomCode, newColor } = data;
    const room = rooms.get(roomCode);
    
    if (!room) return;
    
    const player = room.players.get(socket.id);
    if (player) {
      player.color = newColor;
      io.to(roomCode).emit('players_updated', Array.from(room.players.values()));
    }
  });

  socket.on('change_settings', (data) => {
    const { roomCode, settings } = data;
    const room = rooms.get(roomCode);
    
    if (!room || room.host !== socket.id) return;
    
    room.settings = { ...room.settings, ...settings };
    io.to(roomCode).emit('settings_updated', room.settings);
  });

  socket.on('start_game', (data) => {
    const { roomCode } = data;
    const room = rooms.get(roomCode);
    
    if (!room || room.host !== socket.id) return;
    if (room.players.size < 4) {
      console.log(`[✗] Não há jogadores suficientes (${room.players.size}/4)`);
      return;
    }
    
    room.started = true;
    room.phase = 'ROLE_REVEAL';
    
    // Atribuir roles
    const playerArray = Array.from(room.players.values());
    const impostorCount = Math.min(room.settings.numImpostors || 1, Math.floor(playerArray.length / 3));
    
    // Embaralhar
    for (let i = playerArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [playerArray[i], playerArray[j]] = [playerArray[j], playerArray[i]];
    }
    
    // Atribuir roles
    playerArray.slice(0, impostorCount).forEach(p => p.role = 'IMPOSTOR');
    playerArray.slice(impostorCount).forEach(p => p.role = 'CREWMATE');
    
    io.to(roomCode).emit('game_started', {
      players: playerArray,
      settings: room.settings
    });
    
    console.log(`[✓] Jogo iniciado em ${roomCode}`);
  });

  socket.on('disconnect', () => {
    const roomCode = playerRooms.get(socket.id);
    if (roomCode) {
      const room = rooms.get(roomCode);
      if (room) {
        room.players.delete(socket.id);
        
        if (room.players.size === 0) {
          rooms.delete(roomCode);
          console.log(`[✓] Sala ${roomCode} deletada`);
        } else {
          io.to(roomCode).emit('players_updated', Array.from(room.players.values()));
        }
      }
      playerRooms.delete(socket.id);
    }
    console.log(`[✗] Jogador desconectado: ${socket.id}`);
  });
});

function getDefaultSettings() {
  return {
    map: 'THE_SKELD',
    numImpostors: 1,
    killCooldown: 30,
    taskBarUpdates: 'always',
    emergencyCooldown: 15,
    emergencyCalls: 1,
    discussionTime: 15,
    votingTime: 120,
    taskWinCondition: 100,
    confirmEjects: true,
    visualTasks: true,
    anonymousVotes: false
  };
}

// IMPORTANTE: Servir o index.html para todas as rotas não-API (SPA)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Start server
const PORT = parseInt(process.env.PORT || '3001', 10);
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎮 Servidor Among Us rodando em porta ${PORT}`);
  console.log(`📂 Servindo arquivos de: ${clientDistPath}\n`);
});

export default httpServer;