// client/src/game/entities/PlayerSprite.ts
import Phaser from 'phaser';
import { PlayerColor } from '@shared/types';
import { PLAYER_COLORS } from '@shared/constants';

export class PlayerSprite extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite;
  private nameText: Phaser.GameObjects.Text;
  private shadow: Phaser.GameObjects.Ellipse;
  
  public color: PlayerColor;
  public playerName: string;
  public isLocal: boolean;
  public isAlive: boolean = true;
  
  private targetPosition: { x: number; y: number } | null = null;
  private interpolationSpeed: number = 0.2;
  private lastDirection: 'left' | 'right' = 'right';
  
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: PlayerColor,
    name: string,
    isLocal: boolean
  ) {
    super(scene, x, y);
    
    this.color = color;
    this.playerName = name;
    this.isLocal = isLocal;
    
    // Add shadow
    this.shadow = scene.add.ellipse(0, 25, 40, 15, 0x000000, 0.3);
    this.add(this.shadow);
    
    // Add character sprite
    this.sprite = scene.add.sprite(0, 0, `char-${color}-idle`, 0);
    this.sprite.setScale(1.2);
    this.add(this.sprite);
    
    // Add name text
    this.nameText = scene.add.text(0, -50, name, {
      fontFamily: 'Among Us',
      fontSize: '16px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    this.add(this.nameText);
    
    // Play idle animation
    this.sprite.play(`${color}-idle`);
    
    // Add to scene
    scene.add.existing(this);
    
    // Set depth based on Y position
    this.setDepth(y);
  }
  
  public walk(flipLeft: boolean): void {
    if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim?.key !== `${this.color}-walk`) {
      this.sprite.play(`${this.color}-walk`);
    }
    
    this.sprite.setFlipX(flipLeft);
    this.lastDirection = flipLeft ? 'left' : 'right';
  }
  
  public idle(): void {
    if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim?.key !== `${this.color}-idle`) {
      this.sprite.play(`${this.color}-idle`);
      this.sprite.setFlipX(this.lastDirection === 'left');
    }
  }
  
  public die(): void {
    this.isAlive = false;
    
    // Switch to ghost sprite
    this.sprite.play(`${this.color}-ghost`);
    this.sprite.setAlpha(0.5);
    this.nameText.setAlpha(0.5);
    this.shadow.setAlpha(0);
  }
  
  public updateFromServer(position: { x: number; y: number }, velocity: { x: number; y: number }): void {
    if (this.isLocal) return;
    
    this.targetPosition = position;
    
    // Update animation based on velocity
    if (Math.abs(velocity.x) > 10 || Math.abs(velocity.y) > 10) {
      this.walk(velocity.x < 0);
    } else {
      this.idle();
    }
  }
  
  update(time: number, delta: number): void {
    // Interpolate position for remote players
    if (!this.isLocal && this.targetPosition) {
      this.x = Phaser.Math.Linear(this.x, this.targetPosition.x, this.interpolationSpeed);
      this.y = Phaser.Math.Linear(this.y, this.targetPosition.y, this.interpolationSpeed);
    }
    
    // Update depth based on Y position
    this.setDepth(this.y);
  }
  
  public setVisible(visible: boolean): this {
    this.sprite.setVisible(visible);
    this.nameText.setVisible(visible);
    this.shadow.setVisible(visible);
    return this;
  }
  
  public getColorHex(): string {
    return PLAYER_COLORS.find(c => c.id === this.color)?.hex || '#ffffff';
  }
}