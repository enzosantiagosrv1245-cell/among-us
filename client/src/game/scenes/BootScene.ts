// client/src/game/scenes/BootScene.ts
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }
  
  preload(): void {
    // Load minimal assets needed for preload screen
    this.load.image('loading-bg', '/assets/ui/loading-bg.png');
    this.load.image('loading-bar-bg', '/assets/ui/loading-bar-bg.png');
    this.load.image('loading-bar-fill', '/assets/ui/loading-bar-fill.png');
  }
  
  create(): void {
    this.scene.start('PreloadScene');
  }
}