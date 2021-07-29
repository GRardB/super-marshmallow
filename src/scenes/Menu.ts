import Phaser from 'phaser'
import { SceneKey } from '../globals/SceneKeys'

export class Menu extends Phaser.Scene {
  constructor() {
    super(SceneKey.MENU)
  }

  create() {
    this.add.dom(
      this.scale.width * 0.5,
      this.scale.height * 0.5,
      'div',
      '',
      'Press SPACE to play',
    )

    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start(SceneKey.LEVEL, { gameState: undefined })
    })
  }
}
