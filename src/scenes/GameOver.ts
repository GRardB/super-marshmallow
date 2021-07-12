import Phaser from 'phaser'
import { SceneKey } from '../globals/SceneKeys'

export class GameOver extends Phaser.Scene {
  constructor() {
    super(SceneKey.GAME_OVER)
  }

  create() {
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start(SceneKey.LEVEL, { gameState: undefined })
    })
  }
}
