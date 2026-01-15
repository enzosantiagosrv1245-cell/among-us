// client/src/services/SocketService.ts
import { io, Socket } from 'socket.io-client';
import { ClientEvents, ServerEvents } from '@shared/events';
import {
  Player,
  GameState,
  GameSettings,
  PlayerColor,
  ChatMessage,
  DeadBody,
  Task,
  GamePhase,
  PlayerRole
} from '@shared/types';
import { useGameStore } from '../stores/gameStore';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;
  
  private constructor() {}
  
  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }
  
  public connect(serverUrl: string = ''): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = serverUrl || (
        import.meta.env.PROD 
          ? window.location.origin 
          : 'http://localhost:3001'
      );
      
      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
      
      this.socket.on('connect', () => {
        console.log('Connected to server:', this.socket?.id);
        useGameStore.getState().setConnected(true, this.socket?.id);
        this.setupEventListeners();
        resolve();
      });
      
      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        useGameStore.getState().setConnected(false);
        reject(error);
      });
      
      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
        useGameStore.getState().setConnected(false);
      });
    });
  }
  
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  private setupEventListeners(): void {
    if (!this.socket) return;
    
    const store = useGameStore.getState();
    
    // Room events
    this.socket.on(ServerEvents.ROOM_CREATED, (data: { code: string }) => {
      store.setRoom(data.code, true);
    });
    
    this.socket.on(ServerEvents.ROOM_JOINED, (data: { 
      code: string; 
      players: Player[];
      settings: GameSettings;
      isHost: boolean;
    }) => {
      store.setRoom(data.code, data.isHost);
      const playersMap = new Map(data.players.map(p => [p.id, p]));
      store.setPlayers(playersMap);
      store.updateSettings(data.settings);
    });
    
    this.socket.on(ServerEvents.PLAYER_JOINED, (player: Player) => {
      store.updatePlayer(player.id, player);
    });
    
    this.socket.on(ServerEvents.PLAYER_LEFT, (playerId: string) => {
      const players = new Map(useGameStore.getState().players);
      players.delete(playerId);
      store.setPlayers(players);
    });
    
    // Game state events
    this.socket.on(ServerEvents.GAME_STARTED, (data: {
      gameState: GameState;
      localPlayer: Player;
    }) => {
      store.setGameState(data.gameState);
      store.setLocalPlayer(data.localPlayer);
      store.setPhase(GamePhase.ROLE_REVEAL);
    });
    
    this.socket.on(ServerEvents.ROLE_ASSIGNED, (data: { role: PlayerRole }) => {
      store.setRole(data.role);
    });
    
    this.socket.on(ServerEvents.PHASE_CHANGED, (data: { phase: GamePhase }) => {
      store.setPhase(data.phase);
      
      if (data.phase === GamePhase.DAILY_VOTING) {
        store.setVotingActive(true);
      } else if (data.phase === GamePhase.TASKS) {
        store.setVotingActive(false);
      } else if (data.phase === GamePhase.EMERGENCY_MEETING) {
        store.setMeetingActive(true);
      }
    });
    
    this.socket.on(ServerEvents.GAME_STATE_UPDATE, (state: Partial<GameState>) => {
      store.setGameState(state);
    });
    
    // Player movement
    this.socket.on(ServerEvents.PLAYER_MOVED, (data: {
      playerId: string;
      position: { x: number; y: number };
      velocity: { x: number; y: number };
    }) => {
      store.updatePlayer(data.playerId, {
        position: data.position,
        velocity: data.velocity
      });
    });
    
    // Task events
    this.socket.on(ServerEvents.TASK_COMPLETED, (data: { 
      taskId: string;
      playerId: string;
      tasksCompleted: number;
      tasksTotal: number;
    }) => {
      store.completeTask(data.taskId);
    });
    
    this.socket.on(ServerEvents.BOMB_TRIGGERED, (data: {
      taskId: string;
      playerId: string;
      playerKilled: boolean;
    }) => {
      // Handle bomb explosion
      console.log('Bomb triggered!', data);
    });
    
    // Voting events
    this.socket.on(ServerEvents.DAILY_VOTING_RESULTS, (data: {
      selectedPlayers: string[];
      day: number;
    }) => {
      const isSelected = data.selectedPlayers.includes(store.playerId!);
      store.setCanDoTaskToday(isSelected);
    });
    
    this.socket.on(ServerEvents.VOTING_RESULTS, (data: {
      ejectedPlayer: string | null;
      wasImpostor: boolean;
      votes: { oderId: string; votedFor: string }[];
    }) => {
      // Handle voting results
    });
    
    // Kill events
    this.socket.on(ServerEvents.PLAYER_KILLED, (data: {
      killerId: string;
      victimId: string;
      body: DeadBody;
    }) => {
      store.updatePlayer(data.victimId, { isAlive: false });
      store.addDeadBody(data.body);
    });
    
    // Meeting events
    this.socket.on(ServerEvents.MEETING_CALLED, (data: {
      callerId: string;
      reason: 'emergency' | 'body';
      body?: DeadBody;
    }) => {
      store.setMeetingActive(true);
    });
    
    // Chat events
    this.socket.on(ServerEvents.MESSAGE_RECEIVED, (message: ChatMessage) => {
      store.addMessage(message);
    });
    
    this.socket.on(ServerEvents.GHOST_MESSAGE_RECEIVED, (message: ChatMessage) => {
      store.addGhostMessage(message);
    });
    
    // Day system
    this.socket.on(ServerEvents.NEW_DAY_STARTED, (data: { day: number }) => {
      store.setGameState({ currentDay: data.day });
      store.setPhase(GamePhase.DAILY_VOTING);
    });
    
    // Game over
    this.socket.on(ServerEvents.GAME_OVER, (data: {
      winner: 'crewmates' | 'impostors' | 'medium' | 'clown' | 'ghost_thief';
      players: Player[];
    }) => {
      store.setPhase(GamePhase.GAME_OVER);
      store.setGameState({ winner: data.winner });
    });
    
    // Error handling
    this.socket.on(ServerEvents.ERROR, (error: { message: string }) => {
      console.error('Server error:', error.message);
    });
  }
  
  // Emit methods
  public createRoom(playerName: string, oderId: string, color: PlayerColor): void {
    this.emit(ClientEvents.CREATE_ROOM, { playerName, oderId, color });
  }
  
  public joinRoom(code: string, playerName: string, oderId: string, color: PlayerColor): void {
    this.emit(ClientEvents.JOIN_ROOM, { code, playerName, oderId, color });
  }
  
  public leaveRoom(): void {
    this.emit(ClientEvents.LEAVE_ROOM, {});
  }
  
  public changeColor(color: PlayerColor): void {
    this.emit(ClientEvents.CHANGE_COLOR, { color });
  }
  
  public changeSettings(settings: Partial<GameSettings>): void {
    this.emit(ClientEvents.CHANGE_SETTINGS, { settings });
  }
  
  public startGame(): void {
    this.emit(ClientEvents.START_GAME, {});
  }
  
  public movePlayer(position: { x: number; y: number }, velocity: { x: number; y: number }): void {
    this.emit(ClientEvents.PLAYER_MOVE, { position, velocity });
  }
  
  public stopPlayer(position: { x: number; y: number }): void {
    this.emit(ClientEvents.PLAYER_STOP, { position });
  }
  
  public startTask(taskId: string): void {
    this.emit(ClientEvents.START_TASK, { taskId });
  }
  
  public completeTask(taskId: string): void {
    this.emit(ClientEvents.COMPLETE_TASK, { taskId });
  }
  
  public submitDailyVote(targets: string[]): void {
    this.emit(ClientEvents.SUBMIT_DAILY_VOTE, { targets });
  }
  
  public submitEliminationVote(targetId: string | null): void {
    this.emit(ClientEvents.SUBMIT_ELIMINATION_VOTE, { targetId });
  }
  
  public skipVote(): void {
    this.emit(ClientEvents.SKIP_VOTE, {});
  }
  
  public killPlayer(targetId: string): void {
    this.emit(ClientEvents.KILL_PLAYER, { targetId });
  }
  
  public placeBomb(taskId: string): void {
    this.emit(ClientEvents.PLACE_BOMB, { taskId });
  }
  
  public useVent(ventId: string, targetVentId: string): void {
    this.emit(ClientEvents.USE_VENT, { ventId, targetVentId });
  }
  
  public startSabotage(type: string): void {
    this.emit(ClientEvents.START_SABOTAGE, { type });
  }
  
  public reportBody(bodyId: string): void {
    this.emit(ClientEvents.REPORT_BODY, { bodyId });
  }
  
  public callEmergency(): void {
    this.emit(ClientEvents.CALL_EMERGENCY, {});
  }
  
  public sendMessage(content: string): void {
    this.emit(ClientEvents.SEND_MESSAGE, { content });
  }
  
  public sendGhostMessage(content: string): void {
    this.emit(ClientEvents.SEND_GHOST_MESSAGE, { content });
  }
  
  // Medium specific
  public mediumTalkToGhosts(): void {
    this.emit(ClientEvents.MEDIUM_TALK_TO_GHOSTS, {});
  }
  
  // Ghost Thief specific
  public discoverRole(deadPlayerId: string): void {
    this.emit(ClientEvents.DISCOVER_ROLE, { deadPlayerId });
  }
  
  public stealRole(deadPlayerId: string): void {
    this.emit(ClientEvents.STEAL_ROLE, { deadPlayerId });
  }

  public moveToVent(ventId: string): void {
    this.emit(ClientEvents.USE_VENT, { ventId });
  }
  
  private emit(event: ClientEvents, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  }
  
  public getSocket(): Socket | null {
    return this.socket;
  }
  
  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = SocketService.getInstance();
export default socketService;