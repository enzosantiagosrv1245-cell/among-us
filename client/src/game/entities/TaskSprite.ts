// client/src/game/entities/TaskSprite.ts
import Phaser from 'phaser';
import { Task, TaskType } from '@shared/types';

export class TaskSprite extends Phaser.GameObjects.Container {
  private iconSprite: Phaser.GameObjects.Image;
  private glowSprite: Phaser.GameObjects.Image;
  private highlightTween?: Phaser.Tweens.Tween;
  
  public taskData: Task;
  
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    task: Task
  ) {
    super(scene, x, y);
    
    this.taskData = task;
    
    // Add glow effect
    this.glowSprite = scene.add.image(0, 0, 'task-glow');
    this.glowSprite.setScale(1.5);
    this.glowSprite.setAlpha(0);
    this.glowSprite.setTint(0xffff00);
    this.add(this.glowSprite);
    
    // Add task icon
    const iconKey = this.getTaskIcon(task.type);
    this.iconSprite = scene.add.image(0, 0, iconKey);
    this.iconSprite.setScale(0.8);
    this.add(this.iconSprite);
    
    // If task is assigned to player, add highlight
    if (task.assignedTo) {
      this.addHighlight();
    }
    
    // Set depth
    this.setDepth(y);
    
    scene.add.existing(this);
  }
  
  private getTaskIcon(type: TaskType): string {
    const icons: Record<TaskType, string> = {
      [TaskType.SWIPE_CARD]: 'task-icon-card',
      [TaskType.FIX_WIRING]: 'task-icon-wires',
      [TaskType.UPLOAD_DATA]: 'task-icon-download',
      [TaskType.DOWNLOAD_DATA]: 'task-icon-download',
      [TaskType.CALIBRATE_DISTRIBUTOR]: 'task-icon-calibrate',
      [TaskType.CHART_COURSE]: 'task-icon-navigation',
      [TaskType.CLEAN_O2_FILTER]: 'task-icon-o2',
      [TaskType.CLEAR_ASTEROIDS]: 'task-icon-asteroids',
      [TaskType.DIVERT_POWER]: 'task-icon-power',
      [TaskType.EMPTY_GARBAGE]: 'task-icon-garbage',
      [TaskType.FUEL_ENGINES]: 'task-icon-fuel',
      [TaskType.INSPECT_SAMPLE]: 'task-icon-sample',
      [TaskType.PRIME_SHIELDS]: 'task-icon-shields',
      [TaskType.STABILIZE_STEERING]: 'task-icon-steering',
      [TaskType.START_REACTOR]: 'task-icon-reactor',
      [TaskType.SUBMIT_SCAN]: 'task-icon-scan',
      [TaskType.UNLOCK_MANIFOLDS]: 'task-icon-manifolds',
      [TaskType.COLLECT_SAMPLES]: 'task-icon-sample',
      [TaskType.WATER_PLANTS]: 'task-icon-plants',
      [TaskType.CATCH_FISH]: 'task-icon-fish',
      [TaskType.GRIND_GEMS]: 'task-icon-gems',
      [TaskType.HARVEST_MUSHROOMS]: 'task-icon-mushroom'
    };
    
    return icons[type] || 'task-icon-generic';
  }
  
  private addHighlight(): void {
    this.glowSprite.setAlpha(0.5);
    
    this.highlightTween = this.scene.tweens.add({
      targets: this.glowSprite,
      alpha: { from: 0.3, to: 0.7 },
      scale: { from: 1.3, to: 1.7 },
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }
  
  public setCompleted(): void {
    this.taskData.isCompleted = true;
    
    // Stop highlight
    if (this.highlightTween) {
      this.highlightTween.stop();
    }
    
    // Add completion effect
    this.glowSprite.setTint(0x00ff00);
    this.scene.tweens.add({
      targets: this.glowSprite,
      alpha: 0,
      scale: 2,
      duration: 500
    });
    
    // Fade icon
    this.scene.tweens.add({
      targets: this.iconSprite,
      alpha: 0.3,
      duration: 500
    });
  }
  
  public showBombWarning(): void {
    // Flash red to indicate bomb
    this.scene.tweens.add({
      targets: this.glowSprite,
      tint: { from: 0xffff00, to: 0xff0000 },
      duration: 200,
      yoyo: true,
      repeat: 5
    });
  }
}