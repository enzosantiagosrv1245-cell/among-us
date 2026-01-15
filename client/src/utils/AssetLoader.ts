// client/src/utils/AssetLoader.ts
import Phaser from 'phaser';

interface AssetManifest {
  sprites: SpriteAsset[];
  spritesheets: SpritesheetAsset[];
  images: ImageAsset[];
  audio: AudioAsset[];
  tilemaps: TilemapAsset[];
}

interface SpriteAsset {
  key: string;
  path: string;
}

interface SpritesheetAsset {
  key: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
  frames?: number;
}

interface ImageAsset {
  key: string;
  path: string;
}

interface AudioAsset {
  key: string;
  path: string;
}

interface TilemapAsset {
  key: string;
  path: string;
}

const ASSET_MANIFEST: AssetManifest = {
  sprites: [
    { key: 'logo', path: '/assets/ui/logo.png' },
    { key: 'button-normal', path: '/assets/ui/button-normal.png' },
    { key: 'button-hover', path: '/assets/ui/button-hover.png' },
    { key: 'button-pressed', path: '/assets/ui/button-pressed.png' },
    { key: 'panel-bg', path: '/assets/ui/panel-bg.png' },
    { key: 'input-bg', path: '/assets/ui/input-bg.png' },
    
    // UI Elements
    { key: 'kill-button', path: '/assets/ui/kill-button.png' },
    { key: 'report-button', path: '/assets/ui/report-button.png' },
    { key: 'use-button', path: '/assets/ui/use-button.png' },
    { key: 'vent-button', path: '/assets/ui/vent-button.png' },
    { key: 'sabotage-button', path: '/assets/ui/sabotage-button.png' },
    { key: 'map-button', path: '/assets/ui/map-button.png' },
    { key: 'admin-button', path: '/assets/ui/admin-button.png' },
    { key: 'task-bar', path: '/assets/ui/task-bar.png' },
    { key: 'task-bar-fill', path: '/assets/ui/task-bar-fill.png' },
    
    // Voting UI
    { key: 'vote-panel', path: '/assets/ui/vote-panel.png' },
    { key: 'vote-button', path: '/assets/ui/vote-button.png' },
    { key: 'skip-button', path: '/assets/ui/skip-button.png' },
    
    // Dead body
    { key: 'dead-body', path: '/assets/sprites/dead-body.png' },
    
    // Effects
    { key: 'kill-effect', path: '/assets/effects/kill-effect.png' },
    { key: 'vent-effect', path: '/assets/effects/vent-effect.png' },
    { key: 'bomb-effect', path: '/assets/effects/bomb-effect.png' },
    
    // Icons
    { key: 'impostor-icon', path: '/assets/icons/impostor-icon.png' },
    { key: 'crewmate-icon', path: '/assets/icons/crewmate-icon.png' },
    { key: 'medium-icon', path: '/assets/icons/medium-icon.png' },
    { key: 'thief-icon', path: '/assets/icons/thief-icon.png' },
    { key: 'clown-icon', path: '/assets/icons/clown-icon.png' }
  ],
  
  spritesheets: [
    // Character spritesheets for each color
    { key: 'char-red', path: '/assets/sprites/characters/red.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-blue', path: '/assets/sprites/characters/blue.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-green', path: '/assets/sprites/characters/green.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-pink', path: '/assets/sprites/characters/pink.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-orange', path: '/assets/sprites/characters/orange.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-yellow', path: '/assets/sprites/characters/yellow.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-black', path: '/assets/sprites/characters/black.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-white', path: '/assets/sprites/characters/white.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-purple', path: '/assets/sprites/characters/purple.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-brown', path: '/assets/sprites/characters/brown.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-cyan', path: '/assets/sprites/characters/cyan.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-lime', path: '/assets/sprites/characters/lime.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-maroon', path: '/assets/sprites/characters/maroon.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-rose', path: '/assets/sprites/characters/rose.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-banana', path: '/assets/sprites/characters/banana.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-gray', path: '/assets/sprites/characters/gray.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-tan', path: '/assets/sprites/characters/tan.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    { key: 'char-coral', path: '/assets/sprites/characters/coral.png', frameWidth: 64, frameHeight: 64, frames: 24 },
    
    // Task minigame sprites
    { key: 'wires', path: '/assets/sprites/tasks/wires.png', frameWidth: 128, frameHeight: 128, frames: 8 },
    { key: 'card-swipe', path: '/assets/sprites/tasks/card-swipe.png', frameWidth: 256, frameHeight: 256, frames: 10 },
    { key: 'asteroids', path: '/assets/sprites/tasks/asteroids.png', frameWidth: 32, frameHeight: 32, frames: 4 },
    
    // Effects
    { key: 'explosion', path: '/assets/effects/explosion.png', frameWidth: 128, frameHeight: 128, frames: 12 },
    { key: 'ghost', path: '/assets/effects/ghost.png', frameWidth: 64, frameHeight: 64, frames: 8 }
  ],
  
  images: [
    // Maps
    { key: 'map-skeld', path: '/assets/maps/the-skeld/map.png' },
    { key: 'map-skeld-collision', path: '/assets/maps/the-skeld/collision.png' },
    { key: 'map-mira', path: '/assets/maps/mira-hq/map.png' },
// client/src/utils/AssetLoader.ts (continuação)
    { key: 'map-mira-collision', path: '/assets/maps/mira-hq/collision.png' },
    { key: 'map-polus', path: '/assets/maps/polus/map.png' },
    { key: 'map-polus-collision', path: '/assets/maps/polus/collision.png' },
    { key: 'map-airship', path: '/assets/maps/airship/map.png' },
    { key: 'map-airship-collision', path: '/assets/maps/airship/collision.png' },
    { key: 'map-fungle', path: '/assets/maps/fungle/map.png' },
    { key: 'map-fungle-collision', path: '/assets/maps/fungle/collision.png' },
    
    // Lobby spaceship
    { key: 'lobby-ship', path: '/assets/maps/lobby/spaceship.png' },
    { key: 'lobby-bg', path: '/assets/maps/lobby/background.png' },
    { key: 'stars-bg', path: '/assets/backgrounds/stars.png' },
    { key: 'space-bg', path: '/assets/backgrounds/space.png' },
    
    // Task backgrounds
    { key: 'task-bg-admin', path: '/assets/tasks/backgrounds/admin.png' },
    { key: 'task-bg-electrical', path: '/assets/tasks/backgrounds/electrical.png' },
    { key: 'task-bg-medbay', path: '/assets/tasks/backgrounds/medbay.png' },
    { key: 'task-bg-reactor', path: '/assets/tasks/backgrounds/reactor.png' },
    { key: 'task-bg-cafeteria', path: '/assets/tasks/backgrounds/cafeteria.png' },
    
    // Vent sprites
    { key: 'vent-closed', path: '/assets/sprites/vent-closed.png' },
    { key: 'vent-open', path: '/assets/sprites/vent-open.png' },
    
    // Sabotage icons
    { key: 'sabotage-reactor', path: '/assets/ui/sabotage/reactor.png' },
    { key: 'sabotage-o2', path: '/assets/ui/sabotage/o2.png' },
    { key: 'sabotage-lights', path: '/assets/ui/sabotage/lights.png' },
    { key: 'sabotage-comms', path: '/assets/ui/sabotage/comms.png' },
    { key: 'sabotage-doors', path: '/assets/ui/sabotage/doors.png' }
  ],
  
  audio: [
    // Music
    { key: 'music-menu', path: '/assets/audio/music/menu.mp3' },
    { key: 'music-lobby', path: '/assets/audio/music/lobby.mp3' },
    { key: 'music-game', path: '/assets/audio/music/game.mp3' },
    { key: 'music-meeting', path: '/assets/audio/music/meeting.mp3' },
    { key: 'music-victory', path: '/assets/audio/music/victory.mp3' },
    { key: 'music-defeat', path: '/assets/audio/music/defeat.mp3' },
    
    // Sound effects
    { key: 'sfx-button-click', path: '/assets/audio/sfx/button-click.mp3' },
    { key: 'sfx-button-hover', path: '/assets/audio/sfx/button-hover.mp3' },
    { key: 'sfx-join', path: '/assets/audio/sfx/join.mp3' },
    { key: 'sfx-leave', path: '/assets/audio/sfx/leave.mp3' },
    { key: 'sfx-game-start', path: '/assets/audio/sfx/game-start.mp3' },
    { key: 'sfx-kill', path: '/assets/audio/sfx/kill.mp3' },
    { key: 'sfx-report', path: '/assets/audio/sfx/report.mp3' },
    { key: 'sfx-emergency', path: '/assets/audio/sfx/emergency.mp3' },
    { key: 'sfx-vote', path: '/assets/audio/sfx/vote.mp3' },
    { key: 'sfx-eject', path: '/assets/audio/sfx/eject.mp3' },
    { key: 'sfx-task-complete', path: '/assets/audio/sfx/task-complete.mp3' },
    { key: 'sfx-sabotage', path: '/assets/audio/sfx/sabotage.mp3' },
    { key: 'sfx-vent', path: '/assets/audio/sfx/vent.mp3' },
    { key: 'sfx-footstep', path: '/assets/audio/sfx/footstep.mp3' },
    { key: 'sfx-bomb', path: '/assets/audio/sfx/bomb.mp3' },
    { key: 'sfx-chat', path: '/assets/audio/sfx/chat.mp3' },
    { key: 'sfx-role-reveal', path: '/assets/audio/sfx/role-reveal.mp3' },
    { key: 'sfx-timer-tick', path: '/assets/audio/sfx/timer-tick.mp3' },
    { key: 'sfx-timer-end', path: '/assets/audio/sfx/timer-end.mp3' }
  ],
  
  tilemaps: [
    { key: 'tilemap-skeld', path: '/assets/maps/the-skeld/tilemap.json' },
    { key: 'tilemap-mira', path: '/assets/maps/mira-hq/tilemap.json' },
    { key: 'tilemap-polus', path: '/assets/maps/polus/tilemap.json' },
    { key: 'tilemap-airship', path: '/assets/maps/airship/tilemap.json' },
    { key: 'tilemap-fungle', path: '/assets/maps/fungle/tilemap.json' }
  ]
};

export class AssetLoader {
  private static loadedAssets: Set<string> = new Set();
  private static totalAssets: number = 0;
  private static loadedCount: number = 0;
  
  public static async loadSprites(onProgress?: (progress: number) => void): Promise<void> {
    const assets = [...ASSET_MANIFEST.sprites, ...ASSET_MANIFEST.images];
    this.totalAssets = assets.length;
    this.loadedCount = 0;
    
    const promises = assets.map(async (asset) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          this.loadedAssets.add(asset.key);
          this.loadedCount++;
          onProgress?.(this.loadedCount / this.totalAssets);
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load asset: ${asset.path}`);
          this.loadedCount++;
          onProgress?.(this.loadedCount / this.totalAssets);
          resolve(); // Continue even if asset fails
        };
        img.src = asset.path;
      });
    });
    
    await Promise.all(promises);
  }
  
  public static async loadMaps(onProgress?: (progress: number) => void): Promise<void> {
    const tilemaps = ASSET_MANIFEST.tilemaps;
    let loaded = 0;
    
    for (const tilemap of tilemaps) {
      try {
        const response = await fetch(tilemap.path);
        if (response.ok) {
          this.loadedAssets.add(tilemap.key);
        }
      } catch (error) {
        console.warn(`Failed to load tilemap: ${tilemap.path}`);
      }
      loaded++;
      onProgress?.(loaded / tilemaps.length);
    }
  }
  
  public static async loadInPhaser(scene: Phaser.Scene, onProgress?: (progress: number) => void): Promise<void> {
    return new Promise((resolve) => {
      // Sprites
      ASSET_MANIFEST.sprites.forEach(asset => {
        scene.load.image(asset.key, asset.path);
      });
      
      // Images
      ASSET_MANIFEST.images.forEach(asset => {
        scene.load.image(asset.key, asset.path);
      });
      
      // Spritesheets
      ASSET_MANIFEST.spritesheets.forEach(asset => {
        scene.load.spritesheet(asset.key, asset.path, {
          frameWidth: asset.frameWidth,
          frameHeight: asset.frameHeight,
          endFrame: asset.frames
        });
      });
      
      // Audio
      ASSET_MANIFEST.audio.forEach(asset => {
        scene.load.audio(asset.key, asset.path);
      });
      
      // Tilemaps
      ASSET_MANIFEST.tilemaps.forEach(asset => {
        scene.load.tilemapTiledJSON(asset.key, asset.path);
      });
      
      scene.load.on('progress', (value: number) => {
        onProgress?.(value);
      });
      
      scene.load.on('complete', () => {
        resolve();
      });
      
      scene.load.start();
    });
  }
  
  public static isLoaded(key: string): boolean {
    return this.loadedAssets.has(key);
  }
  
  public static getManifest(): AssetManifest {
    return ASSET_MANIFEST;
  }
}