// client/src/stores/gameStore.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  GameState,
  GamePhase,
  Player,
  PlayerColor,
  PlayerRole,
  GameSettings,
  MapType,
  ChatMessage,
  Task,
  DeadBody
} from '@shared/types';
import { DEFAULT_GAME_SETTINGS } from '@shared/constants';

interface GameStore {
  // Connection state
  isConnected: boolean;
  socketId: string | null;
  
  // Player state
  playerId: string | null;
  playerName: string;
  oderId: string; // ID especial
  playerColor: PlayerColor;
  playerRole: PlayerRole | null;
  
  // Room state
  currentRoom: string | null;
  isHost: boolean;
  
  // Game state
  gameState: GameState | null;
  phase: GamePhase;
  currentDay: number;
  
  // Players
  players: Map<string, Player>;
  localPlayer: Player | null;
  
  // Tasks
  tasks: Task[];
  myTasks: Task[];
  canDoTaskToday: boolean;
  
  // Game Results
  eliminatedPlayer: Player | null;
  gameResult: { winner: string; reason: string } | null;
  
  // Voting
  dailyVotes: string[]; // 3 player IDs
  eliminationVote: string | null;
  votingResults: { playerId: string; votes: number }[];
  
  // Chat
  messages: ChatMessage[];
  ghostMessages: ChatMessage[];
  
  // Dead bodies
  deadBodies: DeadBody[];
  
  // UI state
  isTaskOpen: boolean;
  currentTask: Task | null;
  isMeetingActive: boolean;
  isVotingActive: boolean;
  showKillButton: boolean;
  showReportButton: boolean;
  showVentButton: boolean;
  showSabotageMenu: boolean;
  
  // Settings
  settings: GameSettings;
  
  // Actions
  setConnected: (connected: boolean, socketId?: string) => void;
  setPlayerInfo: (name: string, oderId: string, color: PlayerColor) => void;
  setRoom: (roomCode: string | null, isHost?: boolean) => void;
  setGameState: (state: Partial<GameState>) => void;
  setPhase: (phase: GamePhase) => void;
  setRole: (role: PlayerRole) => void;
  setPlayers: (players: Map<string, Player>) => void;
  updatePlayer: (playerId: string, data: Partial<Player>) => void;
  setLocalPlayer: (player: Player) => void;
  setTasks: (tasks: Task[]) => void;
  completeTask: (taskId: string) => void;
  setCanDoTaskToday: (can: boolean) => void;
  addDailyVote: (playerId: string) => void;
  removeDailyVote: (playerId: string) => void;
  setEliminationVote: (playerId: string | null) => void;
  addMessage: (message: ChatMessage) => void;
  addGhostMessage: (message: ChatMessage) => void;
  addDeadBody: (body: DeadBody) => void;
  removeDeadBody: (bodyId: string) => void;
  setTaskOpen: (open: boolean, task?: Task) => void;
  setMeetingActive: (active: boolean) => void;
  setVotingActive: (active: boolean) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetGame: () => void;
}

const initialState = {
  isConnected: false,
  socketId: null,
  playerId: null,
  playerName: '',
  oderId: '',
  playerColor: PlayerColor.RED,
  playerRole: null,
  currentRoom: null,
  isHost: false,
  gameState: null,
  phase: GamePhase.LOBBY,
  currentDay: 0,
  players: new Map(),
  localPlayer: null,
  tasks: [],
  myTasks: [],
  canDoTaskToday: false,
  eliminatedPlayer: null,
  gameResult: null,
  dailyVotes: [],
  eliminationVote: null,
  votingResults: [],
  messages: [],
  ghostMessages: [],
  deadBodies: [],
  isTaskOpen: false,
  currentTask: null,
  isMeetingActive: false,
  isVotingActive: false,
  showKillButton: false,
  showReportButton: false,
  showVentButton: false,
  showSabotageMenu: false,
  settings: DEFAULT_GAME_SETTINGS
};

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,
    
    setConnected: (connected, socketId) => set({ 
      isConnected: connected, 
      socketId: socketId || null 
    }),
    
    setPlayerInfo: (name, oderId, color) => set({ 
      playerName: name, 
      oderId, 
      playerColor: color 
    }),
    
    setRoom: (roomCode, isHost = false) => set({ 
      currentRoom: roomCode, 
      isHost 
    }),
    
    setGameState: (state) => set((prev) => ({
      gameState: prev.gameState ? { ...prev.gameState, ...state } : state as GameState
    })),
    
    setPhase: (phase) => set({ phase }),
    
    setRole: (role) => set({ playerRole: role }),
    
    setPlayers: (players) => set({ players }),
    
    updatePlayer: (playerId, data) => set((prev) => {
      const newPlayers = new Map(prev.players);
      const player = newPlayers.get(playerId);
      if (player) {
        newPlayers.set(playerId, { ...player, ...data });
      }
      return { players: newPlayers };
    }),
    
    setLocalPlayer: (player) => set({ 
      localPlayer: player,
      playerId: player.id
    }),
    
    setTasks: (tasks) => {
      const myTasks = tasks.filter(t => t.assignedTo === get().playerId);
      set({ tasks, myTasks });
    },
    
    completeTask: (taskId) => set((prev) => ({
      tasks: prev.tasks.map(t => 
        t.id === taskId ? { ...t, isCompleted: true } : t
      ),
      myTasks: prev.myTasks.map(t => 
        t.id === taskId ? { ...t, isCompleted: true } : t
      )
    })),
    
    setCanDoTaskToday: (can) => set({ canDoTaskToday: can }),
    
    addDailyVote: (playerId) => set((prev) => {
      if (prev.dailyVotes.length >= 3) return prev;
      if (prev.dailyVotes.includes(playerId)) return prev;
      return { dailyVotes: [...prev.dailyVotes, playerId] };
    }),
    
    removeDailyVote: (playerId) => set((prev) => ({
      dailyVotes: prev.dailyVotes.filter(id => id !== playerId)
    })),
    
    setEliminationVote: (playerId) => set({ eliminationVote: playerId }),
    
    addMessage: (message) => set((prev) => ({
      messages: [...prev.messages, message]
    })),
    
    addGhostMessage: (message) => set((prev) => ({
      ghostMessages: [...prev.ghostMessages, message]
    })),
    
    addDeadBody: (body) => set((prev) => ({
      deadBodies: [...prev.deadBodies, body]
    })),
    
    removeDeadBody: (bodyId) => set((prev) => ({
      deadBodies: prev.deadBodies.filter(b => b.id !== bodyId)
    })),
    
    setTaskOpen: (open, task) => set({ 
      isTaskOpen: open, 
      currentTask: task || null 
    }),
    
    setMeetingActive: (active) => set({ isMeetingActive: active }),
    
    setVotingActive: (active) => set({ isVotingActive: active }),
    
    updateSettings: (settings) => set((prev) => ({
      settings: { ...prev.settings, ...settings }
    })),
    
    resetGame: () => set({
      ...initialState,
      isConnected: get().isConnected,
      socketId: get().socketId
    })
  }))
);