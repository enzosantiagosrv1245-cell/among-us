// client/src/game/scenes/PreloadScene.ts
import Phaser from 'phaser';
import { PLAYER_COLORS } from '@shared/constants';

export class PreloadScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Graphics;
  private progressBar!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;
  
  constructor() {
    super({ key: 'PreloadScene' });
  }
  
  preload(): void {
    this.createLoadingScreen();
    this.loadAssets();
  }
  
  private createLoadingScreen(): void {
    const { width, height } = this.cameras.main;
    
    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a);
    
    // Loading bar background
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x1a1a3e, 1);
    this.loadingBar.fillRoundedRect(width / 2 - 250, height / 2 - 15, 500, 30, 15);
    
    // Progress bar
    this.progressBar = this.add.graphics();
    
    // Loading text
    this.loadingText = this.add.text(width / 2, height / 2 + 50, 'Carregando...', {
      fontFamily: 'Among Us',
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Progress events
    this.load.on('progress', (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x38fedc, 1);
      this.progressBar.fillRoundedRect(
        width / 2 - 245, 
        height / 2 - 10, 
        490 * value, 
        20, 
        10
      );
      this.loadingText.setText(`Carregando... ${Math.round(value * 100)}%`);
    });
    
    this.load.on('complete', () => {
      this.loadingText.setText('Pronto!');
    });
  }
  
  private loadAssets(): void {
    // ==================== UI ASSETS ====================
    this.load.image('logo', '/assets/ui/logo.png');
    this.load.image('button-kill', '/assets/ui/button-kill.png');
    this.load.image('button-report', '/assets/ui/button-report.png');
    this.load.image('button-use', '/assets/ui/button-use.png');
    this.load.image('button-vent', '/assets/ui/button-vent.png');
    this.load.image('button-sabotage', '/assets/ui/button-sabotage.png');
    this.load.image('button-map', '/assets/ui/button-map.png');
    this.load.image('button-admin', '/assets/ui/button-admin.png');
    this.load.image('button-security', '/assets/ui/button-security.png');
    this.load.image('taskbar-bg', '/assets/ui/taskbar-bg.png');
    this.load.image('taskbar-fill', '/assets/ui/taskbar-fill.png');
    this.load.image('meeting-table', '/assets/ui/meeting-table.png');
    this.load.image('vote-panel', '/assets/ui/vote-panel.png');
    this.load.image('eject-bg', '/assets/ui/eject-bg.png');
    
    // ==================== CHARACTER SPRITESHEETS ====================
    PLAYER_COLORS.forEach(color => {
      // Walking animations
      this.load.spritesheet(`char-${color.id}-walk`, `/assets/sprites/characters/${color.id}/walk.png`, {
        frameWidth: 64,
        frameHeight: 64
      });
      
      // Idle animation
      this.load.spritesheet(`char-${color.id}-idle`, `/assets/sprites/characters/${color.id}/idle.png`, {
        frameWidth: 64,
        frameHeight: 64
      });
      
      // Ghost sprite
      this.load.spritesheet(`char-${color.id}-ghost`, `/assets/sprites/characters/${color.id}/ghost.png`, {
        frameWidth: 64,
        frameHeight: 64
      });
      
      // Kill animation
      this.load.spritesheet(`char-${color.id}-kill`, `/assets/sprites/characters/${color.id}/kill.png`, {
        frameWidth: 128,
        frameHeight: 128
      });
      
      // Dead body
      this.load.image(`body-${color.id}`, `/assets/sprites/characters/${color.id}/body.png`);
      
      // Mini avatar for UI
      this.load.image(`avatar-${color.id}`, `/assets/sprites/characters/${color.id}/avatar.png`);
    });
    
    // ==================== MAP ASSETS - THE SKELD ====================
    this.load.image('skeld-bg', '/assets/maps/the-skeld/background.png');
    this.load.image('skeld-walls', '/assets/maps/the-skeld/walls.png');
    this.load.image('skeld-collision', '/assets/maps/the-skeld/collision.png');
    this.load.tilemapTiledJSON('skeld-map', '/assets/maps/the-skeld/tilemap.json');
    this.load.image('skeld-minimap', '/assets/maps/the-skeld/minimap.png');
    
    // Skeld room details
    this.load.image('skeld-cafeteria', '/assets/maps/the-skeld/rooms/cafeteria.png');
    this.load.image('skeld-admin', '/assets/maps/the-skeld/rooms/admin.png');
    this.load.image('skeld-storage', '/assets/maps/the-skeld/rooms/storage.png');
    this.load.image('skeld-electrical', '/assets/maps/the-skeld/rooms/electrical.png');
    this.load.image('skeld-medbay', '/assets/maps/the-skeld/rooms/medbay.png');
    this.load.image('skeld-reactor', '/assets/maps/the-skeld/rooms/reactor.png');
    this.load.image('skeld-security', '/assets/maps/the-skeld/rooms/security.png');
    this.load.image('skeld-weapons', '/assets/maps/the-skeld/rooms/weapons.png');
    this.load.image('skeld-navigation', '/assets/maps/the-skeld/rooms/navigation.png');
    this.load.image('skeld-o2', '/assets/maps/the-skeld/rooms/o2.png');
    this.load.image('skeld-shields', '/assets/maps/the-skeld/rooms/shields.png');
    this.load.image('skeld-communications', '/assets/maps/the-skeld/rooms/communications.png');
    this.load.image('skeld-engines', '/assets/maps/the-skeld/rooms/engines.png');
    
    // ==================== MAP ASSETS - MIRA HQ ====================
    this.load.image('mira-bg', '/assets/maps/mira-hq/background.png');
    this.load.image('mira-walls', '/assets/maps/mira-hq/walls.png');
    this.load.tilemapTiledJSON('mira-map', '/assets/maps/mira-hq/tilemap.json');
    this.load.image('mira-minimap', '/assets/maps/mira-hq/minimap.png');
    
    // ==================== MAP ASSETS - POLUS ====================
    this.load.image('polus-bg', '/assets/maps/polus/background.png');
    this.load.image('polus-walls', '/assets/maps/polus/walls.png');
    this.load.tilemapTiledJSON('polus-map', '/assets/maps/polus/tilemap.json');
    this.load.image('polus-minimap', '/assets/maps/polus/minimap.png');
    
    // ==================== MAP ASSETS - AIRSHIP ====================
    this.load.image('airship-bg', '/assets/maps/airship/background.png');
    this.load.image('airship-walls', '/assets/maps/airship/walls.png');
    this.load.tilemapTiledJSON('airship-map', '/assets/maps/airship/tilemap.json');
    this.load.image('airship-minimap', '/assets/maps/airship/minimap.png');
    
    // ==================== MAP ASSETS - THE FUNGLE ====================
    this.load.image('fungle-bg', '/assets/maps/fungle/background.png');
    this.load.image('fungle-walls', '/assets/maps/fungle/walls.png');
    this.load.tilemapTiledJSON('fungle-map', '/assets/maps/fungle/tilemap.json');
    this.load.image('fungle-minimap', '/assets/maps/fungle/minimap.png');
    
    // Fungle specific assets (mushrooms, etc)
    this.load.image('mushroom-red', '/assets/maps/fungle/props/mushroom-red.png');
    this.load.image('mushroom-blue', '/assets/maps/fungle/props/mushroom-blue.png');
    this.load.image('mushroom-green', '/assets/maps/fungle/props/mushroom-green.png');
    this.load.image('mushroom-glow', '/assets/maps/fungle/props/mushroom-glow.png');
    this.load.image('vine', '/assets/maps/fungle/props/vine.png');
    this.load.image('rock', '/assets/maps/fungle/props/rock.png');
    
    // ==================== VENT ASSETS ====================
    this.load.spritesheet('vent', '/assets/sprites/vent.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    
    // ==================== TASK ASSETS ====================
    // Wiring
    this.load.image('task-wiring-bg', '/assets/tasks/wiring/background.png');
    this.load.image('wire-red', '/assets/tasks/wiring/wire-red.png');
    this.load.image('wire-blue', '/assets/tasks/wiring/wire-blue.png');
    this.load.image('wire-yellow', '/assets/tasks/wiring/wire-yellow.png');
    this.load.image('wire-pink', '/assets/tasks/wiring/wire-pink.png');
    
    // Card Swipe
    this.load.image('task-cardswipe-bg', '/assets/tasks/cardswipe/background.png');
    this.load.image('card', '/assets/tasks/cardswipe/card.png');
    this.load.image('card-reader', '/assets/tasks/cardswipe/reader.png');
    
    // Download/Upload
    this.load.image('task-download-bg', '/assets/tasks/download/background.png');
    this.load.image('download-bar', '/assets/tasks/download/bar.png');
    
    // Asteroids
    this.load.image('task-asteroids-bg', '/assets/tasks/asteroids/background.png');
    this.load.spritesheet('asteroid', '/assets/tasks/asteroids/asteroid.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.image('crosshair', '/assets/tasks/asteroids/crosshair.png');
    
    // Reactor (Simon Says)
    this.load.image('task-reactor-bg', '/assets/tasks/reactor/background.png');
    this.load.image('reactor-button', '/assets/tasks/reactor/button.png');
    this.load.image('reactor-button-lit', '/assets/tasks/reactor/button-lit.png');
    
    // Medbay Scan
    this.load.image('task-medbay-bg', '/assets/tasks/medbay/background.png');
    this.load.image('scan-platform', '/assets/tasks/medbay/platform.png');
    
    // Empty Garbage
    this.load.image('task-garbage-bg', '/assets/tasks/garbage/background.png');
    this.load.image('garbage-lever', '/assets/tasks/garbage/lever.png');
    this.load.spritesheet('garbage-items', '/assets/tasks/garbage/items.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    
    // ==================== SABOTAGE ASSETS ====================
    this.load.image('sabotage-reactor-bg', '/assets/sabotage/reactor/background.png');
    this.load.image('sabotage-o2-bg', '/assets/sabotage/o2/background.png');
    this.load.image('sabotage-lights-bg', '/assets/sabotage/lights/background.png');
    this.load.image('sabotage-comms-bg', '/assets/sabotage/comms/background.png');
    this.load.spritesheet('hand-scanner', '/assets/sabotage/reactor/hand-scanner.png', {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.image('keypad', '/assets/sabotage/o2/keypad.png');
    this.load.image('light-switch', '/assets/sabotage/lights/switch.png');
    
    // ==================== EFFECTS ====================
    this.load.spritesheet('kill-animation', '/assets/effects/kill-animation.png', {
      frameWidth: 256,
      frameHeight: 256
    });
    this.load.spritesheet('explosion', '/assets/effects/explosion.png', {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('smoke', '/assets/effects/smoke.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.image('blood-splatter', '/assets/effects/blood-splatter.png');
    this.load.spritesheet('sparkle', '/assets/effects/sparkle.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    
    // ==================== AUDIO ====================
    // Music
    this.load.audio('music-game', '/assets/audio/music/game.mp3');
    this.load.audio('music-meeting', '/assets/audio/music/meeting.mp3');
    this.load.audio('music-victory', '/assets/audio/music/victory.mp3');
    this.load.audio('music-defeat', '/assets/audio/music/defeat.mp3');
    this.load.audio('music-suspense', '/assets/audio/music/suspense.mp3');
    
    // Sound effects
    this.load.audio('sfx-footstep', '/assets/audio/sfx/footstep.mp3');
    this.load.audio('sfx-kill', '/assets/audio/sfx/kill.mp3');
    this.load.audio('sfx-report', '/assets/audio/sfx/report.mp3');
    this.load.audio('sfx-emergency', '/assets/audio/sfx/emergency.mp3');
    this.load.audio('sfx-vent-open', '/assets/audio/sfx/vent-open.mp3');
    this.load.audio('sfx-vent-close', '/assets/audio/sfx/vent-close.mp3');
    this.load.audio('sfx-vent-move', '/assets/audio/sfx/vent-move.mp3');
    this.load.audio('sfx-task-complete', '/assets/audio/sfx/task-complete.mp3');
    this.load.audio('sfx-task-fail', '/assets/audio/sfx/task-fail.mp3');
    this.load.audio('sfx-sabotage-alarm', '/assets/audio/sfx/sabotage-alarm.mp3');
    this.load.audio('sfx-vote', '/assets/audio/sfx/vote.mp3');
    this.load.audio('sfx-eject', '/assets/audio/sfx/eject.mp3');
    this.load.audio('sfx-chat', '/assets/audio/sfx/chat.mp3');
    this.load.audio('sfx-explosion', '/assets/audio/sfx/explosion.mp3');
    this.load.audio('sfx-countdown', '/assets/audio/sfx/countdown.mp3');
  }
  
  create(): void {
    // Create animations for all characters
    this.createCharacterAnimations();
    
    // Create other animations
    this.createEffectAnimations();
    
    // Start the game scene
    this.scene.start('GameScene');
    this.scene.launch('UIScene');
  }
  
  private createCharacterAnimations(): void {
    PLAYER_COLORS.forEach(color => {
      // Walk animation
      this.anims.create({
        key: `${color.id}-walk`,
        frames: this.anims.generateFrameNumbers(`char-${color.id}-walk`, { start: 0, end: 11 }),
        frameRate: 12,
        repeat: -1
      });
      
      // Idle animation
      this.anims.create({
        key: `${color.id}-idle`,
        frames: this.anims.generateFrameNumbers(`char-${color.id}-idle`, { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1
      });
      
      // Ghost animation
      this.anims.create({
        key: `${color.id}-ghost`,
        frames: this.anims.generateFrameNumbers(`char-${color.id}-ghost`, { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
      });
      
      // Kill animation
      this.anims.create({
        key: `${color.id}-kill`,
        frames: this.anims.generateFrameNumbers(`char-${color.id}-kill`, { start: 0, end: 15 }),
        frameRate: 20,
        repeat: 0
      });
    });
  }
  
  private createEffectAnimations(): void {
    // Vent animation
    this.anims.create({
      key: 'vent-open',
      frames: this.anims.generateFrameNumbers('vent', { start: 0, end: 5 }),
      frameRate: 15,
      repeat: 0
    });
    
    this.anims.create({
      key: 'vent-close',
      frames: this.anims.generateFrameNumbers('vent', { start: 5, end: 0 }),
      frameRate: 15,
      repeat: 0
    });
    
    // Explosion animation
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 11 }),
      frameRate: 20,
      repeat: 0
    });
    
    // Kill effect
    this.anims.create({
      key: 'kill-effect',
      frames: this.anims.generateFrameNumbers('kill-animation', { start: 0, end: 19 }),
      frameRate: 24,
      repeat: 0
    });
    
    // Sparkle effect
    this.anims.create({
      key: 'sparkle',
      frames: this.anims.generateFrameNumbers('sparkle', { start: 0, end: 7 }),
      frameRate: 12,
      repeat: 0
    });
  }
}