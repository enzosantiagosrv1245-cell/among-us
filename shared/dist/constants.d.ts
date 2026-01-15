import { GameSettings } from './types';
export declare const SPECIAL_IDS: {
    readonly MEDIUM: "65023974";
    readonly GHOST_THIEF: "93563514";
    readonly CLOWN: "80273514";
};
export declare const DEFAULT_GAME_SETTINGS: GameSettings;
export declare const PLAYER_COLORS: readonly [{
    readonly id: "red";
    readonly hex: "#C51111";
    readonly name: "Red";
}, {
    readonly id: "blue";
    readonly hex: "#132ED1";
    readonly name: "Blue";
}, {
    readonly id: "green";
    readonly hex: "#117F2D";
    readonly name: "Green";
}, {
    readonly id: "pink";
    readonly hex: "#ED54BA";
    readonly name: "Pink";
}, {
    readonly id: "orange";
    readonly hex: "#EF7D0D";
    readonly name: "Orange";
}, {
    readonly id: "yellow";
    readonly hex: "#F5F557";
    readonly name: "Yellow";
}, {
    readonly id: "black";
    readonly hex: "#3F474E";
    readonly name: "Black";
}, {
    readonly id: "white";
    readonly hex: "#D6E0F0";
    readonly name: "White";
}, {
    readonly id: "purple";
    readonly hex: "#6B2FBB";
    readonly name: "Purple";
}, {
    readonly id: "brown";
    readonly hex: "#71491E";
    readonly name: "Brown";
}, {
    readonly id: "cyan";
    readonly hex: "#38FEDC";
    readonly name: "Cyan";
}, {
    readonly id: "lime";
    readonly hex: "#50EF39";
    readonly name: "Lime";
}, {
    readonly id: "maroon";
    readonly hex: "#6B2C2C";
    readonly name: "Maroon";
}, {
    readonly id: "rose";
    readonly hex: "#ECC0D3";
    readonly name: "Rose";
}, {
    readonly id: "banana";
    readonly hex: "#FFFEBE";
    readonly name: "Banana";
}, {
    readonly id: "gray";
    readonly hex: "#708496";
    readonly name: "Gray";
}, {
    readonly id: "tan";
    readonly hex: "#928776";
    readonly name: "Tan";
}, {
    readonly id: "coral";
    readonly hex: "#EC7578";
    readonly name: "Coral";
}];
export declare const ROLE_COLORS: {
    readonly INNOCENT: "#00FF00";
    readonly IMPOSTOR: "#FF0000";
    readonly MEDIUM: "#00FFFF";
    readonly GHOST_THIEF: "#808080";
    readonly CLOWN: "#FF00FF";
};
export declare const MOVEMENT_SPEED = 200;
export declare const KILL_DISTANCE: {
    readonly short: 100;
    readonly medium: 150;
    readonly long: 200;
};
export declare const TASK_INTERACTION_DISTANCE = 50;
export declare const VENT_INTERACTION_DISTANCE = 50;
export declare const REPORT_DISTANCE = 100;
//# sourceMappingURL=constants.d.ts.map