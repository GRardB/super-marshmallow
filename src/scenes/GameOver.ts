import Phaser from 'phaser'
import { SceneKey } from '../globals/SceneKeys'

export class GameOver extends Phaser.Scene {
  constructor() {
    super(SceneKey.GAME_OVER)
  }

  create() {
    this.add.dom(
      this.scale.width * 0.5,
      this.scale.height * 0.5,
      'div',
      '',
      'Game over. Press SPACE to continue',
    )

    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start(SceneKey.MENU)
    })
  }
}
