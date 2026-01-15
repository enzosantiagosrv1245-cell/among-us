// client/src/game/scenes/UIScene.ts
import Phaser from 'phaser';

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    // Esta cena é responsável pela UI do jogo
    // Ela fica sobre GameScene com o mesmo tamanho
    console.log('UIScene criada');
  }
}
