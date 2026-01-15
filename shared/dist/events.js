// shared/src/events.ts
export var ClientEvents;
(function (ClientEvents) {
    // Connection
    ClientEvents["JOIN_ROOM"] = "join_room";
    ClientEvents["LEAVE_ROOM"] = "leave_room";
    ClientEvents["CREATE_ROOM"] = "create_room";
    // Lobby
    ClientEvents["CHANGE_COLOR"] = "change_color";
    ClientEvents["CHANGE_SETTINGS"] = "change_settings";
    ClientEvents["START_GAME"] = "start_game";
    ClientEvents["SET_COSMETICS"] = "set_cosmetics";
    // Game
    ClientEvents["PLAYER_MOVE"] = "player_move";
    ClientEvents["PLAYER_STOP"] = "player_stop";
    // Tasks
    ClientEvents["START_TASK"] = "start_task";
    ClientEvents["COMPLETE_TASK"] = "complete_task";
    ClientEvents["CANCEL_TASK"] = "cancel_task";
    // Voting
    ClientEvents["SUBMIT_DAILY_VOTE"] = "submit_daily_vote";
    ClientEvents["SUBMIT_ELIMINATION_VOTE"] = "submit_elimination_vote";
    ClientEvents["SKIP_VOTE"] = "skip_vote";
    // Impostor
    ClientEvents["KILL_PLAYER"] = "kill_player";
    ClientEvents["PLACE_BOMB"] = "place_bomb";
    ClientEvents["USE_VENT"] = "use_vent";
    ClientEvents["START_SABOTAGE"] = "start_sabotage";
    // Crewmate
    ClientEvents["REPORT_BODY"] = "report_body";
    ClientEvents["CALL_EMERGENCY"] = "call_emergency";
    ClientEvents["FIX_SABOTAGE"] = "fix_sabotage";
    // Chat
    ClientEvents["SEND_MESSAGE"] = "send_message";
    ClientEvents["SEND_GHOST_MESSAGE"] = "send_ghost_message";
    // Voice
    ClientEvents["VOICE_STATE_UPDATE"] = "voice_state_update";
    // Medium specific
    ClientEvents["MEDIUM_TALK_TO_GHOSTS"] = "medium_talk_to_ghosts";
    // Ghost Thief specific
    ClientEvents["DISCOVER_ROLE"] = "discover_role";
    ClientEvents["STEAL_ROLE"] = "steal_role";
    // System
    ClientEvents["PING"] = "ping";
})(ClientEvents || (ClientEvents = {}));
export var ServerEvents;
(function (ServerEvents) {
    // Connection
    ServerEvents["ROOM_JOINED"] = "room_joined";
    ServerEvents["ROOM_LEFT"] = "room_left";
    ServerEvents["ROOM_CREATED"] = "room_created";
    ServerEvents["PLAYER_JOINED"] = "player_joined";
    ServerEvents["PLAYER_LEFT"] = "player_left";
    ServerEvents["ERROR"] = "error";
    // Lobby
    ServerEvents["COLOR_CHANGED"] = "color_changed";
    ServerEvents["SETTINGS_CHANGED"] = "settings_changed";
    ServerEvents["COSMETICS_CHANGED"] = "cosmetics_changed";
    // Game State
    ServerEvents["GAME_STARTED"] = "game_started";
    ServerEvents["GAME_STATE_UPDATE"] = "game_state_update";
    ServerEvents["PHASE_CHANGED"] = "phase_changed";
    ServerEvents["ROLE_ASSIGNED"] = "role_assigned";
    // Player Updates
    ServerEvents["PLAYER_MOVED"] = "player_moved";
    ServerEvents["PLAYER_KILLED"] = "player_killed";
    ServerEvents["PLAYER_EJECTED"] = "player_ejected";
    // Tasks
    ServerEvents["TASK_STARTED"] = "task_started";
    ServerEvents["TASK_COMPLETED"] = "task_completed";
    ServerEvents["TASK_PROGRESS"] = "task_progress";
    ServerEvents["BOMB_TRIGGERED"] = "bomb_triggered";
    // Voting
    ServerEvents["DAILY_VOTING_STARTED"] = "daily_voting_started";
    ServerEvents["DAILY_VOTE_RECEIVED"] = "daily_vote_received";
    ServerEvents["DAILY_VOTING_RESULTS"] = "daily_voting_results";
    ServerEvents["ELIMINATION_VOTING_STARTED"] = "elimination_voting_started";
    ServerEvents["VOTE_RECEIVED"] = "vote_received";
    ServerEvents["VOTING_RESULTS"] = "voting_results";
    // Sabotage
    ServerEvents["SABOTAGE_STARTED"] = "sabotage_started";
    ServerEvents["SABOTAGE_FIXED"] = "sabotage_fixed";
    ServerEvents["SABOTAGE_FAILED"] = "sabotage_failed";
    // Meeting
    ServerEvents["MEETING_CALLED"] = "meeting_called";
    ServerEvents["BODY_REPORTED"] = "body_reported";
    // Chat
    ServerEvents["MESSAGE_RECEIVED"] = "message_received";
    ServerEvents["GHOST_MESSAGE_RECEIVED"] = "ghost_message_received";
    // Voice
    ServerEvents["VOICE_STATE_CHANGED"] = "voice_state_changed";
    // Day System
    ServerEvents["NEW_DAY_STARTED"] = "new_day_started";
    ServerEvents["DAY_ENDED"] = "day_ended";
    // Game End
    ServerEvents["GAME_OVER"] = "game_over";
    // Special Roles
    ServerEvents["MEDIUM_ENABLED"] = "medium_enabled";
    ServerEvents["ROLE_DISCOVERED"] = "role_discovered";
    ServerEvents["ROLE_STOLEN"] = "role_stolen";
    // System
    ServerEvents["PONG"] = "pong";
})(ServerEvents || (ServerEvents = {}));
//# sourceMappingURL=events.js.map