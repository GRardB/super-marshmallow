import Phaser from 'phaser'
import { SceneKey } from '../globals/SceneKeys'

export class Menu extends Phaser.Scene {
  constructor() {
    super(SceneKey.MENU)
  }

  create() {
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start(SceneKey.LEVEL, { gameState: undefined })
    })
  }
}
