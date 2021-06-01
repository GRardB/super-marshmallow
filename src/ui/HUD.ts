import Phaser from 'phaser'

export class HUD extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
  }
}
