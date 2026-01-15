// client/src/game/entities/VentSprite.ts
import Phaser from 'phaser';

export class VentSprite extends Phaser.GameObjects.Container {
  private ventSprite: Phaser.GameObjects.Sprite;
  public id: string;
  public connections: string[];
  private isOpen: boolean = false;
  
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: string,
    connections: string[]
  ) {
    super(scene, x, y);
    
    this.id = id;
    this.connections = connections;
    
    // Add vent sprite
    this.ventSprite = scene.add.sprite(0, 0, 'vent', 0);
    this.ventSprite.setScale(1);
    this.add(this.ventSprite);
    
    // Set depth (slightly below players)
    this.setDepth(y - 20);
    
    scene.add.existing(this);
  }
  
  public open(): void {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.ventSprite.play('vent-open');
  }
  
  public close(): void {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.ventSprite.play('vent-close');
  }
  
  public isVentOpen(): boolean {
    return this.isOpen;
  }
}