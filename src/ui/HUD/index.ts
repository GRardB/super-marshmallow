import Phaser from 'phaser'
import { DEFAULT_NUM_LIVES } from '../../globals/GameState'

const SIDE_MARGIN_PIXELS = 4

export class HUD extends Phaser.GameObjects.Container {
  private lives: Phaser.GameObjects.DOMElement
  private coins: Phaser.GameObjects.DOMElement
  private score: Phaser.GameObjects.DOMElement
  private time: Phaser.GameObjects.DOMElement

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.scene.add
      .dom(0, 0, 'div')
      .setClassName('hud-bg')
      .setOrigin(0,0)
      .setScrollFactor(0, 0)

    this.lives = this.scene.add
      .dom(SIDE_MARGIN_PIXELS, 0, 'div')
      .setClassName('hud lives')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)

    this.coins = this.scene.add
      .dom(this.scene.scale.width * 0.33, 0, 'p')
      .setClassName('hud coins')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)

    this.time = this.scene.add
      .dom(this.scene.scale.width * 0.66, 0, 'p')
      .setClassName('hud time')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)

    this.score = this.scene.add
      .dom(this.scene.scale.width - SIDE_MARGIN_PIXELS, 0, 'p')
      .setClassName('hud score')
      .setOrigin(1, 0)
      .setScrollFactor(0, 0)

    this.add([this.lives, this.coins, this.score, this.time])
  }

  public updateLives = (numLives: number) => {
    this.lives.node.setAttribute('data-lives', numLives.toString())
    if (numLives > DEFAULT_NUM_LIVES) {
      this.lives.setText(`+${numLives - DEFAULT_NUM_LIVES}`)
    } else {
      this.lives.setText('')
    }
  }

  public updateCoins = (numCoins: number) => {
    this.coins.setText(numCoins.toString())
  }

  public updateScore = (score: number) => {
    this.score.setText(score.toString())
  }

  public updateTime = (numSeconds: number) => {
    const minutes = Math.floor(numSeconds / 60)
    const seconds = numSeconds % 60

    let time = minutes > 0 ? `${minutes}m` : ''
    time += `${seconds}s`

    this.time.setText(time)
  }
}
