// shared/src/types.ts
export enum GamePhase {
  LOBBY = 'LOBBY',
  STARTING = 'STARTING',
  ROLE_REVEAL = 'ROLE_REVEAL',
  DAILY_VOTING = 'DAILY_VOTING',
  TASKS = 'TASKS',
  EMERGENCY_MEETING = 'EMERGENCY_MEETING',
  ELIMINATION_VOTING = 'ELIMINATION_VOTING',
  EJECTION = 'EJECTION',
  DAY_END = 'DAY_END',
  GAME_OVER = 'GAME_OVER'
}

export enum PlayerRole {
  INNOCENT = 'INNOCENT',
  IMPOSTOR = 'IMPOSTOR',
  MEDIUM = 'MEDIUM',         // Neutro do Bem - ID: 65023974
  GHOST_THIEF = 'GHOST_THIEF', // Ladrão Fantasma - ID: 93563514
  CLOWN = 'CLOWN'            // Palhaço - ID: 80273514
}

export enum PlayerColor {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  PINK = 'pink',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  BLACK = 'black',
  WHITE = 'white',
  PURPLE = 'purple',
  BROWN = 'brown',
  CYAN = 'cyan',
  LIME = 'lime',
  MAROON = 'maroon',
  ROSE = 'rose',
  BANANA = 'banana',
  GRAY = 'gray',
  TAN = 'tan',
  CORAL = 'coral'
}

export enum MapType {
  THE_SKELD = 'THE_SKELD',
  MIRA_HQ = 'MIRA_HQ',
  POLUS = 'POLUS',
  THE_AIRSHIP = 'THE_AIRSHIP',
  THE_FUNGLE = 'THE_FUNGLE'
}

export enum TaskType {
  // The Skeld Tasks
  SWIPE_CARD = 'SWIPE_CARD',
  FIX_WIRING = 'FIX_WIRING',
  UPLOAD_DATA = 'UPLOAD_DATA',
  DOWNLOAD_DATA = 'DOWNLOAD_DATA',
  CALIBRATE_DISTRIBUTOR = 'CALIBRATE_DISTRIBUTOR',
  CHART_COURSE = 'CHART_COURSE',
  CLEAN_O2_FILTER = 'CLEAN_O2_FILTER',
  CLEAR_ASTEROIDS = 'CLEAR_ASTEROIDS',
  DIVERT_POWER = 'DIVERT_POWER',
  EMPTY_GARBAGE = 'EMPTY_GARBAGE',
  FUEL_ENGINES = 'FUEL_ENGINES',
  INSPECT_SAMPLE = 'INSPECT_SAMPLE',
  PRIME_SHIELDS = 'PRIME_SHIELDS',
  STABILIZE_STEERING = 'STABILIZE_STEERING',
  START_REACTOR = 'START_REACTOR',
  SUBMIT_SCAN = 'SUBMIT_SCAN',
  UNLOCK_MANIFOLDS = 'UNLOCK_MANIFOLDS',
  
  // Fungle Specific
  COLLECT_SAMPLES = 'COLLECT_SAMPLES',
  WATER_PLANTS = 'WATER_PLANTS',
  CATCH_FISH = 'CATCH_FISH',
  GRIND_GEMS = 'GRIND_GEMS',
  HARVEST_MUSHROOMS = 'HARVEST_MUSHROOMS'
}

export enum SabotageType {
  REACTOR_MELTDOWN = 'REACTOR_MELTDOWN',
  O2_DEPLETION = 'O2_DEPLETION',
  COMMUNICATIONS = 'COMMUNICATIONS',
  LIGHTS = 'LIGHTS',
  DOORS = 'DOORS'
}

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  oderId: string; // ID especial para roles
  socketId: string;
  name: string;
  color: PlayerColor;
  role: PlayerRole;
  isAlive: boolean;
  isHost: boolean;
  position: Position;
  velocity: Position;
  currentRoom: string;
  tasksCompleted: string[];
  tasksAssigned: string[];
  canDoTaskToday: boolean;
  hatId?: string;
  skinId?: string;
  petId?: string;
  votedFor?: string;
  votesReceived: number;
}

export interface DeadBody {
  id: string;
  playerId: string;
  color: PlayerColor;
  position: Position;
  reportedBy?: string;
}

export interface Task {
  id: string;
  type: TaskType;
  room: string;
  position: Position;
  isCompleted: boolean;
  assignedTo?: string;
  hasBomb: boolean; // Impostor pode colocar bomba
  bombPlacedBy?: string;
}

export interface TrapBomb {
  id: string;
  taskId: string;
  placedBy: string;
  position: Position;
  isActive: boolean;
}

export interface Vote {
  oderId: string; // quem votou
  targetId: string; // em quem votou
  timestamp: number;
}

export interface DailyTaskVote {
  oderId: string;
  targets: string[]; // 3 pessoas votadas
  day: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  isGhostChat: boolean;
  isMediumChat: boolean;
}

export interface VoiceState {
  oderId: string;
  isTalking: boolean;
  isMuted: boolean;
  isDeafened: boolean;
}

export interface GameSettings {
  map: MapType;
  maxPlayers: number;
  impostorCount: number;
  confirmEjects: boolean;
  emergencyMeetings: number;
  emergencyCooldown: number;
  discussionTime: number;
  votingTime: number;
  anonymousVotes: boolean;
  playerSpeed: number;
  crewmateVision: number;
  impostorVision: number;
  killCooldown: number;
  killDistance: 'short' | 'medium' | 'long';
  visualTasks: boolean;
  taskBarUpdates: 'always' | 'meetings' | 'never';
  commonTasks: number;
  longTasks: number;
  shortTasks: number;
  gameDuration: number; // 15 dias
  tasksPerDay: number; // 3 tarefas por dia
}

export interface GameState {
  id: string;
  code: string;
  phase: GamePhase;
  settings: GameSettings;
  players: Map<string, Player>;
  deadBodies: DeadBody[];
  tasks: Task[];
  traps: TrapBomb[];
  currentDay: number;
  totalDays: number;
  tasksCompleted: number;
  tasksTotal: number;
  dailyTaskVotes: DailyTaskVote[];
  selectedForTasks: string[]; // 3 pessoas selecionadas hoje
  sabotageActive?: SabotageType;
  sabotageTimer?: number;
  meetingCaller?: string;
  votes: Vote[];
  chatMessages: ChatMessage[];
  winner?: 'crewmates' | 'impostors' | 'medium' | 'clown' | 'ghost_thief';
  startTime?: number;
  dayStartTime?: number;
}

export interface Room {
  id: string;
  name: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  connectedRooms: string[];
  hasVent: boolean;
  ventConnections?: string[];
}

export interface MapData {
  type: MapType;
  name: string;
  width: number;
  height: number;
  spawnPoint: Position;
  meetingPoint: Position;
  rooms: Room[];
  tasks: {
    type: TaskType;
    room: string;
    position: Position;
  }[];
  vents: {
    id: string;
    room: string;
    position: Position;
    connections: string[];
  }[];
  cameras: {
    id: string;
    position: Position;
    viewArea: { x: number; y: number; width: number; height: number };
  }[];
  doors: {
    id: string;
    position: Position;
    rooms: [string, string];
    isOpen: boolean;
  }[];
}

// Role-specific data
export interface MediumData {
  hasCompletedTaskToday: boolean;
  canTalkToGhosts: boolean;
  discoveredImpostor: boolean;
}

export interface GhostThiefData {
  discoveredRoles: { oderId: string; role: PlayerRole }[];
  stolenRole?: PlayerRole;
  dailyDiscoveryUsed: boolean;
}

export interface ClownData {
  isSuspected: boolean;
  votesReceivedTotal: number;
}

export interface ImpostorData {
  kills: number;
  bombsPlaced: number;
  sabotagesStarted: number;
}

export const PLAYER_COLORS: Array<{id: string; name: string; hex: string; rgb: string}> = [
  { id: 'red', name: 'Vermelho', hex: '#c51111', rgb: 'rgb(197, 17, 17)' },
  { id: 'blue', name: 'Azul', hex: '#132ed1', rgb: 'rgb(19, 46, 209)' },
  { id: 'green', name: 'Verde', hex: '#117f2d', rgb: 'rgb(17, 127, 45)' },
  { id: 'pink', name: 'Rosa', hex: '#ed54ba', rgb: 'rgb(237, 84, 186)' },
  { id: 'orange', name: 'Laranja', hex: '#ef7d0d', rgb: 'rgb(239, 125, 13)' },
  { id: 'yellow', name: 'Amarelo', hex: '#f5f557', rgb: 'rgb(245, 245, 87)' },
  { id: 'black', name: 'Preto', hex: '#3f474e', rgb: 'rgb(63, 71, 78)' },
  { id: 'white', name: 'Branco', hex: '#d7daff', rgb: 'rgb(215, 218, 255)' },
  { id: 'purple', name: 'Roxo', hex: '#6b2fbb', rgb: 'rgb(107, 47, 187)' },
  { id: 'brown', name: 'Marrom', hex: '#71491e', rgb: 'rgb(113, 73, 30)' },
  { id: 'cyan', name: 'Ciano', hex: '#38fedc', rgb: 'rgb(56, 254, 220)' },
  { id: 'lime', name: 'Lima', hex: '#50ef39', rgb: 'rgb(80, 239, 57)' }
];