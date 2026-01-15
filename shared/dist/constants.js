// shared/src/constants.ts
import { PlayerRole, MapType } from './types';
export const SPECIAL_IDS = {
    MEDIUM: '65023974',
    GHOST_THIEF: '93563514',
    CLOWN: '80273514'
};
export const DEFAULT_GAME_SETTINGS = {
    map: MapType.THE_SKELD,
    maxPlayers: 15,
    impostorCount: 2,
    confirmEjects: true,
    emergencyMeetings: 1,
    emergencyCooldown: 15,
    discussionTime: 15,
    votingTime: 120,
    anonymousVotes: false,
    playerSpeed: 1.0,
    crewmateVision: 1.0,
    impostorVision: 1.5,
    killCooldown: 30,
    killDistance: 'medium',
    visualTasks: true,
    taskBarUpdates: 'always',
    commonTasks: 1,
    longTasks: 1,
    shortTasks: 2,
    gameDuration: 15,
    tasksPerDay: 3
};
export const PLAYER_COLORS = [
    { id: 'red', hex: '#C51111', name: 'Red' },
    { id: 'blue', hex: '#132ED1', name: 'Blue' },
    { id: 'green', hex: '#117F2D', name: 'Green' },
    { id: 'pink', hex: '#ED54BA', name: 'Pink' },
    { id: 'orange', hex: '#EF7D0D', name: 'Orange' },
    { id: 'yellow', hex: '#F5F557', name: 'Yellow' },
    { id: 'black', hex: '#3F474E', name: 'Black' },
    { id: 'white', hex: '#D6E0F0', name: 'White' },
    { id: 'purple', hex: '#6B2FBB', name: 'Purple' },
    { id: 'brown', hex: '#71491E', name: 'Brown' },
    { id: 'cyan', hex: '#38FEDC', name: 'Cyan' },
    { id: 'lime', hex: '#50EF39', name: 'Lime' },
    { id: 'maroon', hex: '#6B2C2C', name: 'Maroon' },
    { id: 'rose', hex: '#ECC0D3', name: 'Rose' },
    { id: 'banana', hex: '#FFFEBE', name: 'Banana' },
    { id: 'gray', hex: '#708496', name: 'Gray' },
    { id: 'tan', hex: '#928776', name: 'Tan' },
    { id: 'coral', hex: '#EC7578', name: 'Coral' }
];
export const ROLE_COLORS = {
    [PlayerRole.INNOCENT]: '#00FF00',
    [PlayerRole.IMPOSTOR]: '#FF0000',
    [PlayerRole.MEDIUM]: '#00FFFF',
    [PlayerRole.GHOST_THIEF]: '#808080',
    [PlayerRole.CLOWN]: '#FF00FF'
};
export const MOVEMENT_SPEED = 200;
export const KILL_DISTANCE = {
    short: 100,
    medium: 150,
    long: 200
};
export const TASK_INTERACTION_DISTANCE = 50;
export const VENT_INTERACTION_DISTANCE = 50;
export const REPORT_DISTANCE = 100;
//# sourceMappingURL=constants.js.map