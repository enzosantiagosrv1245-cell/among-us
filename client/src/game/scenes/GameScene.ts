// client/src/game/scenes/GameScene.ts
import Phaser from 'phaser';
import { useGameStore } from '../../stores/gameStore';
import { socketService } from '../../services/SocketService';
import { Player, MapType, PlayerColor, DeadBody, Task } from '@shared/types';
import { PLAYER_COLORS, MOVEMENT_SPEED, KILL_DISTANCE } from '@shared/constants';
import { PlayerSprite } from '../entities/PlayerSprite';
import { DeadBodySprite } from '../entities/DeadBodySprite';
import { VentSprite } from '../entities/VentSprite';
import { TaskSprite } from '../entities/TaskSprite';

export class GameScene extends Phaser.Scene {
  // Map
  private map!: Phaser.Tilemaps.Tilemap;
  private backgroundLayer!: Phaser.GameObjects.Image;
  private wallsLayer!: Phaser.GameObjects.Image;
  private collisionLayer!: Phaser.Tilemaps.TilemapLayer;
  
  // Player
  private localPlayer!: PlayerSprite;
  private remotePlayers: Map<string, PlayerSprite> = new Map();
  
  // Game objects
  private deadBodies: Map<string, DeadBodySprite> = new Map();
  private vents: VentSprite[] = [];
  private tasks: Map<string, TaskSprite> = new Map();
  
  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private joystick?: { x: number; y: number };
  
  // Camera
  private visionMask!: Phaser.GameObjects.Graphics;
  private visionRadius: number = 400;
  
  // State
  private lastPosition: { x: number; y: number } = { x: 0, y: 0 };
  private lastVelocity: { x: number; y: number } = { x: 0, y: 0 };
  private isInVent: boolean = false;
  private currentVent?: VentSprite;
  
  constructor() {
    super({ key: 'GameScene' });
  }
  
  create(): void {
    const store = useGameStore.getState();
    const settings = store.settings;
    
    // Setup map based on settings
    this.setupMap(settings.map);
    
    // Setup input
    this.setupInput();
    
    // Create local player
    this.createLocalPlayer();
    
    // Setup camera
    this.setupCamera();
    
    // Setup vision system
    if (store.playerRole !== 'IMPOSTOR') {
      this.setupVision();
    }
    
    // Subscribe to state changes
    this.subscribeToStateChanges();
    
    // Play game music
    this.sound.play('music-game', { loop: true, volume: 0.3 });
  }
  
  private setupMap(mapType: MapType): void {
    const mapKey = mapType.toLowerCase().replace('_', '-');
    
    // Add background
    this.backgroundLayer = this.add.image(0, 0, `${mapKey}-bg`).setOrigin(0, 0);
    
    // Load tilemap for collision
    if (this.cache.tilemap.exists(`${mapKey}-map`)) {
      this.map = this.make.tilemap({ key: `${mapKey}-map` });
      
      // Setup collision layer
      const tileset = this.map.addTilesetImage('collision-tileset', `${mapKey}-collision`);
      if (tileset) {
        this.collisionLayer = this.map.createLayer('collision', tileset, 0, 0)!;
        this.collisionLayer.setCollisionByProperty({ collides: true });
        this.collisionLayer.setVisible(false);
      }
    }
    
    // Add walls/foreground
    this.wallsLayer = this.add.image(0, 0, `${mapKey}-walls`).setOrigin(0, 0);
    this.wallsLayer.setDepth(100);
    
    // Setup vents
    this.setupVents(mapType);
    
    // Setup tasks
    this.setupTasks(mapType);
    
    // Set world bounds
    const mapWidth = this.backgroundLayer.width;
    const mapHeight = this.backgroundLayer.height;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
  }
  
  private setupVents(mapType: MapType): void {
    // Vent positions for each map
    const ventPositions: Record<MapType, { id: string; x: number; y: number; connections: string[] }[]> = {
      [MapType.THE_SKELD]: [
        { id: 'vent-admin', x: 1100, y: 600, connections: ['vent-cafeteria', 'vent-cafe-right'] },
        { id: 'vent-cafeteria', x: 700, y: 300, connections: ['vent-admin', 'vent-cafe-right'] },
        { id: 'vent-cafe-right', x: 900, y: 300, connections: ['vent-admin', 'vent-cafeteria'] },
        { id: 'vent-electrical', x: 300, y: 500, connections: ['vent-security', 'vent-medbay'] },
        { id: 'vent-security', x: 200, y: 400, connections: ['vent-electrical', 'vent-medbay'] },
        { id: 'vent-medbay', x: 500, y: 450, connections: ['vent-electrical', 'vent-security'] },
        { id: 'vent-reactor-upper', x: 100, y: 200, connections: ['vent-reactor-lower'] },
        { id: 'vent-reactor-lower', x: 100, y: 600, connections: ['vent-reactor-upper'] },
        { id: 'vent-weapons', x: 1400, y: 200, connections: ['vent-navigation'] },
        { id: 'vent-navigation', x: 1600, y: 300, connections: ['vent-weapons'] },
        { id: 'vent-shields', x: 1400, y: 700, connections: ['vent-navigation-lower'] },
        { id: 'vent-navigation-lower', x: 1600, y: 600, connections: ['vent-shields'] }
      ],
      [MapType.MIRA_HQ]: [],
      [MapType.POLUS]: [],
      [MapType.THE_AIRSHIP]: [],
      [MapType.THE_FUNGLE]: []
    };
    
    const vents = ventPositions[mapType] || [];
    vents.forEach(ventData => {
      const vent = new VentSprite(this, ventData.x, ventData.y, ventData.id, ventData.connections);
      this.vents.push(vent);
    });
  }
  
  private setupTasks(mapType: MapType): void {
    const store = useGameStore.getState();
    const gameTasks = store.tasks;
    
    gameTasks.forEach(task => {
      const taskSprite = new TaskSprite(this, task.position.x, task.position.y, task);
      this.tasks.set(task.id, taskSprite);
    });
  }
  
  private setupInput(): void {
    // Keyboard input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    
    // Touch input (virtual joystick)
    if (this.sys.game.device.input.touch) {
      this.setupTouchControls();
    }
    
    // Keyboard shortcuts
    this.input.keyboard!.on('keydown-E', () => this.handleUseAction());
    this.input.keyboard!.on('keydown-Q', () => this.handleKillAction());
    this.input.keyboard!.on('keydown-R', () => this.handleReportAction());
    this.input.keyboard!.on('keydown-V', () => this.handleVentAction());
  }
  
  private setupTouchControls(): void {
    const joystickArea = this.add.zone(150, this.cameras.main.height - 150, 200, 200);
    joystickArea.setScrollFactor(0);
    joystickArea.setDepth(1000);
    
    const joystickBase = this.add.circle(150, this.cameras.main.height - 150, 80, 0x000000, 0.3);
    joystickBase.setScrollFactor(0);
    joystickBase.setDepth(1000);
    
    const joystickThumb = this.add.circle(150, this.cameras.main.height - 150, 40, 0xffffff, 0.5);
    joystickThumb.setScrollFactor(0);
    joystickThumb.setDepth(1001);
    
    joystickArea.setInteractive();
    
    joystickArea.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.updateJoystick(pointer, joystickBase, joystickThumb);
    });
    
    joystickArea.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        this.updateJoystick(pointer, joystickBase, joystickThumb);
      }
    });
    
    joystickArea.on('pointerup', () => {
      this.joystick = undefined;
      joystickThumb.setPosition(joystickBase.x, joystickBase.y);
    });
  }
  
  private updateJoystick(pointer: Phaser.Input.Pointer, base: Phaser.GameObjects.Arc, thumb: Phaser.GameObjects.Arc): void {
    const dx = pointer.x - base.x;
    const dy = pointer.y - base.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 60;
    
    if (distance > maxDistance) {
      const angle = Math.atan2(dy, dx);
      thumb.setPosition(
        base.x + Math.cos(angle) * maxDistance,
        base.y + Math.sin(angle) * maxDistance
      );
      this.joystick = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
    } else {
      thumb.setPosition(pointer.x, pointer.y);
      this.joystick = {
        x: dx / maxDistance,
        y: dy / maxDistance
      };
    }
  }
  
  private createLocalPlayer(): void {
    const store = useGameStore.getState();
    const player = store.localPlayer;
    
    if (!player) return;
    
    const spawnPoint = this.getSpawnPoint();
    
    this.localPlayer = new PlayerSprite(
      this,
      spawnPoint.x,
      spawnPoint.y,
      player.color,
      player.name,
      true
    );
    
    // Enable physics
    this.physics.add.existing(this.localPlayer);
    (this.localPlayer.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    
    // Add collision with walls
    if (this.collisionLayer) {
      this.physics.add.collider(this.localPlayer, this.collisionLayer);
    }
    
    this.lastPosition = { x: this.localPlayer.x, y: this.localPlayer.y };
  }
  
  private getSpawnPoint(): { x: number; y: number } {
    const store = useGameStore.getState();
    const mapType = store.settings.map;
    
    const spawnPoints: Record<MapType, { x: number; y: number }> = {
      [MapType.THE_SKELD]: { x: 700, y: 350 },
      [MapType.MIRA_HQ]: { x: 1800, y: 500 },
      [MapType.POLUS]: { x: 1000, y: 600 },
      [MapType.THE_AIRSHIP]: { x: 1500, y: 800 },
      [MapType.THE_FUNGLE]: { x: 800, y: 400 }
    };
    
    return spawnPoints[mapType] || { x: 500, y: 500 };
  }
  
  private setupCamera(): void {
    this.cameras.main.startFollow(this.localPlayer, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.2);
    this.cameras.main.setBounds(0, 0, this.backgroundLayer.width, this.backgroundLayer.height);
  }
  
  private setupVision(): void {
    const store = useGameStore.getState();
    const visionMultiplier = store.playerRole === 'IMPOSTOR' 
      ? store.settings.impostorVision 
      : store.settings.crewmateVision;
    
    this.visionRadius = 400 * visionMultiplier;
    
    // Create vision mask
    this.visionMask = this.add.graphics();
    this.visionMask.setDepth(500);
    
    // Create a render texture for the fog of war
    const fogTexture = this.add.renderTexture(0, 0, this.backgroundLayer.width, this.backgroundLayer.height);
    fogTexture.setDepth(500);
    fogTexture.fill(0x000000, 0.7);
    
    // This will be updated each frame to create the vision effect
  }
  
  private subscribeToStateChanges(): void {
    // Subscribe to player updates
    useGameStore.subscribe(
      (state) => state.players,
      (players) => {
        this.updateRemotePlayers(players);
      }
    );
    
    // Subscribe to dead bodies
    useGameStore.subscribe(
      (state) => state.deadBodies,
      (bodies) => {
        this.updateDeadBodies(bodies);
      }
    );
    
    // Subscribe to phase changes
    useGameStore.subscribe(
      (state) => state.phase,
      (phase) => {
        this.handlePhaseChange(phase);
      }
    );
  }
  
  private updateRemotePlayers(players: Map<string, Player>): void {
    const localId = useGameStore.getState().playerId;
    
    players.forEach((player, id) => {
      if (id === localId) return;
      
      if (this.remotePlayers.has(id)) {
        // Update existing player
        const sprite = this.remotePlayers.get(id)!;
        sprite.updateFromServer(player.position, player.velocity);
        
        if (!player.isAlive && sprite.isAlive) {
          sprite.die();
        }
      } else {
        // Create new player
        const sprite = new PlayerSprite(
          this,
          player.position.x,
          player.position.y,
          player.color,
          player.name,
          false
        );
        this.remotePlayers.set(id, sprite);
      }
    });
    
    // Remove disconnected players
    this.remotePlayers.forEach((sprite, id) => {
      if (!players.has(id)) {
        sprite.destroy();
        this.remotePlayers.delete(id);
      }
    });
  }
  
  private updateDeadBodies(bodies: DeadBody[]): void {
    const currentBodyIds = new Set(bodies.map(b => b.id));
    
    // Remove old bodies
    this.deadBodies.forEach((sprite, id) => {
      if (!currentBodyIds.has(id)) {
        sprite.destroy();
        this.deadBodies.delete(id);
      }
    });
    
    // Add new bodies
    bodies.forEach(body => {
      if (!this.deadBodies.has(body.id)) {
        const sprite = new DeadBodySprite(this, body.position.x, body.position.y, body.color);
        this.deadBodies.set(body.id, sprite);
      }
    });
  }
  
  private handlePhaseChange(phase: string): void {
    if (phase === 'EMERGENCY_MEETING' || phase === 'ELIMINATION_VOTING') {
      // Teleport all players to meeting area
      const meetingPoint = this.getMeetingPoint();
      this.localPlayer.setPosition(meetingPoint.x, meetingPoint.y);
      
      // Disable movement
      this.localPlayer.setActive(false);
      
      // Play meeting music
      this.sound.stopAll();
      this.sound.play('music-meeting', { loop: true, volume: 0.4 });
    } else if (phase === 'TASKS') {
      // Enable movement
      this.localPlayer.setActive(true);
      
      // Resume game music
      this.sound.stopAll();
      this.sound.play('music-game', { loop: true, volume: 0.3 });
    }
  }
  
  private getMeetingPoint(): { x: number; y: number } {
    const store = useGameStore.getState();
    const mapType = store.settings.map;
    
    const meetingPoints: Record<MapType, { x: number; y: number }> = {
      [MapType.THE_SKELD]: { x: 700, y: 350 },
      [MapType.MIRA_HQ]: { x: 1100, y: 350 },
      [MapType.POLUS]: { x: 1000, y: 600 },
      [MapType.THE_AIRSHIP]: { x: 1500, y: 500 },
      [MapType.THE_FUNGLE]: { x: 800, y: 400 }
    };
    
    return meetingPoints[mapType] || { x: 500, y: 500 };
  }
  
  update(time: number, delta: number): void {
    if (!this.localPlayer || !this.localPlayer.active) return;
    
    // Handle movement
    this.handleMovement(delta);
    
    // Update remote players (interpolation)
    this.remotePlayers.forEach(player => player.update(time, delta));
    
    // Check interactions
    this.checkInteractions();
    
    // Send position to server if changed
    this.sendPositionUpdate();
    
    // Update vision mask
    if (this.visionMask) {
      this.updateVision();
    }
  }
  
  private handleMovement(delta: number): void {
    const store = useGameStore.getState();
    const speed = MOVEMENT_SPEED * store.settings.playerSpeed;
    
    let velocityX = 0;
    let velocityY = 0;
    
    // Keyboard input
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      velocityX = -speed;
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      velocityX = speed;
    }
    
    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      velocityY = -speed;
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      velocityY = speed;
    }
    
    // Touch/joystick input
    if (this.joystick) {
      velocityX = this.joystick.x * speed;
      velocityY = this.joystick.y * speed;
    }
    
    // Normalize diagonal movement
    if (velocityX !== 0 && velocityY !== 0) {
      const factor = 1 / Math.sqrt(2);
      velocityX *= factor;
      velocityY *= factor;
    }
    
    // Apply velocity
    const body = this.localPlayer.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(velocityX, velocityY);
    
    // Update animation
    if (velocityX !== 0 || velocityY !== 0) {
      this.localPlayer.walk(velocityX < 0);
    } else {
      this.localPlayer.idle();
    }
    
    this.lastVelocity = { x: velocityX, y: velocityY };
  }
  
  private checkInteractions(): void {
    const store = useGameStore.getState();
    const playerPos = { x: this.localPlayer.x, y: this.localPlayer.y };
    
    // Check for nearby tasks
    let nearTask: TaskSprite | null = null;
    this.tasks.forEach(task => {
      const distance = Phaser.Math.Distance.Between(playerPos.x, playerPos.y, task.x, task.y);
      if (distance < 80 && !task.taskData.isCompleted) {
        nearTask = task;
      }
    });
    
    // Check for nearby bodies
    let nearBody: DeadBodySprite | null = null;
    this.deadBodies.forEach(body => {
      const distance = Phaser.Math.Distance.Between(playerPos.x, playerPos.y, body.x, body.y);
      if (distance < 100) {
        nearBody = body;
      }
    });
    
    // Check for nearby vents (impostor only)
    let nearVent: VentSprite | null = null;
    if (store.playerRole === 'IMPOSTOR') {
      this.vents.forEach(vent => {
        const distance = Phaser.Math.Distance.Between(playerPos.x, playerPos.y, vent.x, vent.y);
        if (distance < 60) {
          nearVent = vent;
        }
      });
    }
    
    // Check for nearby players (for kill)
    let nearPlayer: PlayerSprite | null = null;
    if (store.playerRole === 'IMPOSTOR') {
      const killDist = KILL_DISTANCE[store.settings.killDistance];
      this.remotePlayers.forEach(player => {
        if (player.isAlive) {
          const distance = Phaser.Math.Distance.Between(playerPos.x, playerPos.y, player.x, player.y);
          if (distance < killDist) {
            nearPlayer = player;
          }
        }
      });
    }
    
    // Emit UI updates
    this.events.emit('interaction-update', {
      nearTask,
      nearBody,
      nearVent,
      nearPlayer
    });
  }
  
  private sendPositionUpdate(): void {
    const currentPos = { x: this.localPlayer.x, y: this.localPlayer.y };
    const threshold = 5;
    
    if (
      Math.abs(currentPos.x - this.lastPosition.x) > threshold ||
      Math.abs(currentPos.y - this.lastPosition.y) > threshold
    ) {
      socketService.movePlayer(currentPos, this.lastVelocity);
      this.lastPosition = currentPos;
    }
  }
  
  private updateVision(): void {
    // Clear previous mask
    this.visionMask.clear();
    
    // Create gradient vision effect
    const playerX = this.localPlayer.x;
    const playerY = this.localPlayer.y;
    
    this.visionMask.fillStyle(0x000000, 0.8);
    this.visionMask.fillRect(0, 0, this.backgroundLayer.width, this.backgroundLayer.height);
    
    // Cut out vision circle with gradient
    this.visionMask.fillStyle(0x000000, 0);
    this.visionMask.beginPath();
    this.visionMask.arc(playerX, playerY, this.visionRadius, 0, Math.PI * 2);
    this.visionMask.closePath();
    this.visionMask.fillPath();
  }
  
  // Action handlers
  private handleUseAction(): void {
    // Check for nearby task or interactive
    this.events.emit('use-action');
  }
  
  private handleKillAction(): void {
    const store = useGameStore.getState();
    if (store.playerRole !== 'IMPOSTOR') return;
    
    this.events.emit('kill-action');
  }
  
  private handleReportAction(): void {
    this.events.emit('report-action');
  }
  
  private handleVentAction(): void {
    const store = useGameStore.getState();
    if (store.playerRole !== 'IMPOSTOR') return;
    
    if (this.isInVent && this.currentVent) {
      this.exitVent();
    } else {
      this.events.emit('vent-action');
    }
  }
  
  public enterVent(vent: VentSprite): void {
    this.isInVent = true;
    this.currentVent = vent;
    
    // Play vent animation and sound
    vent.open();
    this.sound.play('sfx-vent-open');
    
    // Hide player
    this.localPlayer.setVisible(false);
    this.localPlayer.setActive(false);
    
    // Show vent navigation UI
    this.events.emit('show-vent-ui', vent.connections);
  }
  
  public exitVent(): void {
    if (!this.currentVent) return;
    
    this.isInVent = false;
    
    // Show player at vent position
    this.localPlayer.setPosition(this.currentVent.x, this.currentVent.y);
    this.localPlayer.setVisible(true);
    this.localPlayer.setActive(true);
    
    // Close vent animation
    this.currentVent.close();
    this.sound.play('sfx-vent-close');
    
    this.currentVent = undefined;
    this.events.emit('hide-vent-ui');
  }
  
  public moveToVent(targetVentId: string): void {
    const targetVent = this.vents.find(v => v.id === targetVentId);
    if (!targetVent) return;
    
    this.sound.play('sfx-vent-move');
    
    // Animate movement through vent
    this.time.delayedCall(300, () => {
      if (this.currentVent) this.currentVent.close();
      this.currentVent = targetVent;
      targetVent.open();
    });
  }
}