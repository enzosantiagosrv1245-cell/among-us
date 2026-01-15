// shared/src/types.ts
export var GamePhase;
(function (GamePhase) {
    GamePhase["LOBBY"] = "LOBBY";
    GamePhase["STARTING"] = "STARTING";
    GamePhase["ROLE_REVEAL"] = "ROLE_REVEAL";
    GamePhase["DAILY_VOTING"] = "DAILY_VOTING";
    GamePhase["TASKS"] = "TASKS";
    GamePhase["EMERGENCY_MEETING"] = "EMERGENCY_MEETING";
    GamePhase["ELIMINATION_VOTING"] = "ELIMINATION_VOTING";
    GamePhase["EJECTION"] = "EJECTION";
    GamePhase["DAY_END"] = "DAY_END";
    GamePhase["GAME_OVER"] = "GAME_OVER";
})(GamePhase || (GamePhase = {}));
export var PlayerRole;
(function (PlayerRole) {
    PlayerRole["INNOCENT"] = "INNOCENT";
    PlayerRole["IMPOSTOR"] = "IMPOSTOR";
    PlayerRole["MEDIUM"] = "MEDIUM";
    PlayerRole["GHOST_THIEF"] = "GHOST_THIEF";
    PlayerRole["CLOWN"] = "CLOWN"; // Palhaço - ID: 80273514
})(PlayerRole || (PlayerRole = {}));
export var PlayerColor;
(function (PlayerColor) {
    PlayerColor["RED"] = "red";
    PlayerColor["BLUE"] = "blue";
    PlayerColor["GREEN"] = "green";
    PlayerColor["PINK"] = "pink";
    PlayerColor["ORANGE"] = "orange";
    PlayerColor["YELLOW"] = "yellow";
    PlayerColor["BLACK"] = "black";
    PlayerColor["WHITE"] = "white";
    PlayerColor["PURPLE"] = "purple";
    PlayerColor["BROWN"] = "brown";
    PlayerColor["CYAN"] = "cyan";
    PlayerColor["LIME"] = "lime";
    PlayerColor["MAROON"] = "maroon";
    PlayerColor["ROSE"] = "rose";
    PlayerColor["BANANA"] = "banana";
    PlayerColor["GRAY"] = "gray";
    PlayerColor["TAN"] = "tan";
    PlayerColor["CORAL"] = "coral";
})(PlayerColor || (PlayerColor = {}));
export var MapType;
(function (MapType) {
    MapType["THE_SKELD"] = "THE_SKELD";
    MapType["MIRA_HQ"] = "MIRA_HQ";
    MapType["POLUS"] = "POLUS";
    MapType["THE_AIRSHIP"] = "THE_AIRSHIP";
    MapType["THE_FUNGLE"] = "THE_FUNGLE";
})(MapType || (MapType = {}));
export var TaskType;
(function (TaskType) {
    // The Skeld Tasks
    TaskType["SWIPE_CARD"] = "SWIPE_CARD";
    TaskType["FIX_WIRING"] = "FIX_WIRING";
    TaskType["UPLOAD_DATA"] = "UPLOAD_DATA";
    TaskType["DOWNLOAD_DATA"] = "DOWNLOAD_DATA";
    TaskType["CALIBRATE_DISTRIBUTOR"] = "CALIBRATE_DISTRIBUTOR";
    TaskType["CHART_COURSE"] = "CHART_COURSE";
    TaskType["CLEAN_O2_FILTER"] = "CLEAN_O2_FILTER";
    TaskType["CLEAR_ASTEROIDS"] = "CLEAR_ASTEROIDS";
    TaskType["DIVERT_POWER"] = "DIVERT_POWER";
    TaskType["EMPTY_GARBAGE"] = "EMPTY_GARBAGE";
    TaskType["FUEL_ENGINES"] = "FUEL_ENGINES";
    TaskType["INSPECT_SAMPLE"] = "INSPECT_SAMPLE";
    TaskType["PRIME_SHIELDS"] = "PRIME_SHIELDS";
    TaskType["STABILIZE_STEERING"] = "STABILIZE_STEERING";
    TaskType["START_REACTOR"] = "START_REACTOR";
    TaskType["SUBMIT_SCAN"] = "SUBMIT_SCAN";
    TaskType["UNLOCK_MANIFOLDS"] = "UNLOCK_MANIFOLDS";
    // Fungle Specific
    TaskType["COLLECT_SAMPLES"] = "COLLECT_SAMPLES";
    TaskType["WATER_PLANTS"] = "WATER_PLANTS";
    TaskType["CATCH_FISH"] = "CATCH_FISH";
    TaskType["GRIND_GEMS"] = "GRIND_GEMS";
    TaskType["HARVEST_MUSHROOMS"] = "HARVEST_MUSHROOMS";
})(TaskType || (TaskType = {}));
export var SabotageType;
(function (SabotageType) {
    SabotageType["REACTOR_MELTDOWN"] = "REACTOR_MELTDOWN";
    SabotageType["O2_DEPLETION"] = "O2_DEPLETION";
    SabotageType["COMMUNICATIONS"] = "COMMUNICATIONS";
    SabotageType["LIGHTS"] = "LIGHTS";
    SabotageType["DOORS"] = "DOORS";
})(SabotageType || (SabotageType = {}));
//# sourceMappingURL=types.js.map