// shared/src/events.ts
export enum ClientEvents {
  // Connection
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  CREATE_ROOM = 'create_room',
  
  // Lobby
  CHANGE_COLOR = 'change_color',
  CHANGE_SETTINGS = 'change_settings',
  START_GAME = 'start_game',
  SET_COSMETICS = 'set_cosmetics',
  
  // Game
  PLAYER_MOVE = 'player_move',
  PLAYER_STOP = 'player_stop',
  
  // Tasks
  START_TASK = 'start_task',
  COMPLETE_TASK = 'complete_task',
  CANCEL_TASK = 'cancel_task',
  
  // Voting
  SUBMIT_DAILY_VOTE = 'submit_daily_vote',
  SUBMIT_ELIMINATION_VOTE = 'submit_elimination_vote',
  SKIP_VOTE = 'skip_vote',
  
  // Impostor
  KILL_PLAYER = 'kill_player',
  PLACE_BOMB = 'place_bomb',
  USE_VENT = 'use_vent',
  START_SABOTAGE = 'start_sabotage',
  
  // Crewmate
  REPORT_BODY = 'report_body',
  CALL_EMERGENCY = 'call_emergency',
  FIX_SABOTAGE = 'fix_sabotage',
  
  // Chat
  SEND_MESSAGE = 'send_message',
  SEND_GHOST_MESSAGE = 'send_ghost_message',
  
  // Voice
  VOICE_STATE_UPDATE = 'voice_state_update',
  
  // Medium specific
  MEDIUM_TALK_TO_GHOSTS = 'medium_talk_to_ghosts',
  
  // Ghost Thief specific
  DISCOVER_ROLE = 'discover_role',
  STEAL_ROLE = 'steal_role',
  
  // System
  PING = 'ping'
}

export enum ServerEvents {
  // Connection
  ROOM_JOINED = 'room_joined',
  ROOM_LEFT = 'room_left',
  ROOM_CREATED = 'room_created',
  PLAYER_JOINED = 'player_joined',
  PLAYER_LEFT = 'player_left',
  ERROR = 'error',
  
  // Lobby
  COLOR_CHANGED = 'color_changed',
  SETTINGS_CHANGED = 'settings_changed',
  COSMETICS_CHANGED = 'cosmetics_changed',
  
  // Game State
  GAME_STARTED = 'game_started',
  GAME_STATE_UPDATE = 'game_state_update',
  PHASE_CHANGED = 'phase_changed',
  ROLE_ASSIGNED = 'role_assigned',
  
  // Player Updates
  PLAYER_MOVED = 'player_moved',
  PLAYER_KILLED = 'player_killed',
  PLAYER_EJECTED = 'player_ejected',
  
  // Tasks
  TASK_STARTED = 'task_started',
  TASK_COMPLETED = 'task_completed',
  TASK_PROGRESS = 'task_progress',
  BOMB_TRIGGERED = 'bomb_triggered',
  
  // Voting
  DAILY_VOTING_STARTED = 'daily_voting_started',
  DAILY_VOTE_RECEIVED = 'daily_vote_received',
  DAILY_VOTING_RESULTS = 'daily_voting_results',
  ELIMINATION_VOTING_STARTED = 'elimination_voting_started',
  VOTE_RECEIVED = 'vote_received',
  VOTING_RESULTS = 'voting_results',
  
  // Sabotage
  SABOTAGE_STARTED = 'sabotage_started',
  SABOTAGE_FIXED = 'sabotage_fixed',
  SABOTAGE_FAILED = 'sabotage_failed',
  
  // Meeting
  MEETING_CALLED = 'meeting_called',
  BODY_REPORTED = 'body_reported',
  
  // Chat
  MESSAGE_RECEIVED = 'message_received',
  GHOST_MESSAGE_RECEIVED = 'ghost_message_received',
  
  // Voice
  VOICE_STATE_CHANGED = 'voice_state_changed',
  
  // Day System
  NEW_DAY_STARTED = 'new_day_started',
  DAY_ENDED = 'day_ended',
  
  // Game End
  GAME_OVER = 'game_over',
  
  // Special Roles
  MEDIUM_ENABLED = 'medium_enabled',
  ROLE_DISCOVERED = 'role_discovered',
  ROLE_STOLEN = 'role_stolen',
  
  // System
  PONG = 'pong'
}