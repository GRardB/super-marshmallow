import Phaser from 'phaser'
import { ResourceKey } from '../../globals/ResourceKeys'
import { CoinAnimation } from './animations'

export class Coin extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ResourceKey.ENTITIES)

    this.play(CoinAnimation.COIN_ROTATE, true)
  }

  public collect = () => {
    this.play(CoinAnimation.COIN_VANISH, true).on(
      'animationcomplete',
      this.destroy,
      this,
    )
  }
}
