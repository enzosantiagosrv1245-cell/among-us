// client/src/game/entities/DeadBodySprite.ts
import Phaser from 'phaser';
import { PlayerColor } from '@shared/types';

export class DeadBodySprite extends Phaser.GameObjects.Container {
  private bodySprite: Phaser.GameObjects.Image;
  private bloodPool: Phaser.GameObjects.Image;
  
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: PlayerColor
  ) {
    super(scene, x, y);
    
    // Add blood pool underneath
    this.bloodPool = scene.add.image(0, 10, 'blood-splatter');
    this.bloodPool.setScale(0.8);
    this.bloodPool.setAlpha(0.7);
    this.bloodPool.setTint(0x8B0000);
    this.add(this.bloodPool);
    
    // Add dead body sprite
    this.bodySprite = scene.add.image(0, 0, `body-${color}`);
    this.bodySprite.setScale(1.2);
    this.add(this.bodySprite);
    
    // Animation for appearing
    this.setScale(0);
    scene.tweens.add({
      targets: this,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });
    
    // Set depth
    this.setDepth(y - 10);
    
    scene.add.existing(this);
  }
}