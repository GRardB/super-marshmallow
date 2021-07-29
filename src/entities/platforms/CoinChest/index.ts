import Phaser from 'phaser'
import { Player } from '../../Player'
import { ResourceKey } from '../../../globals/ResourceKeys'
import { mapObjectTypeToFrame } from '../../../globals/AtlasFrames'
import { MAP_TILE_SIZE } from '../../../globals/Map'
import { GameState } from '../../../globals/GameState'
import { InteractivePlatform } from '../InteractivePlatform'
import { getTiledProperty, TiledProperties } from '../../../lib/util'
import { Coin } from '../../Coin'
import { CoinAnimation } from '../../Coin/animations'

const BUDGE_DISTANCE = 0.5 * MAP_TILE_SIZE
const BUDGE_DURATION = 0.1 * 1000
const COIN_JUMP_DURATION = 0.3 * 1000
const COIN_JUMP_FRAMERATE = 20
const COIN_MARGIN_BOTTOM = 2 // pixels

export class CoinChest
  extends Phaser.Physics.Arcade.Sprite
  implements InteractivePlatform
{
  body: Phaser.Physics.Arcade.StaticBody
  private numCoins: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: string,
    properties: TiledProperties,
  ) {
    super(scene, x, y, ResourceKey.MAP_TILES, mapObjectTypeToFrame(type))

    this.setOrigin(0, 1)
    this.numCoins = getTiledProperty(properties, 'numCoins')
  }

  public handlePlayerCollision = (
    player: Player,
    _enemies: Phaser.Physics.Arcade.Group,
    gameState: GameState,
  ) => {
    if (
      this.numCoins > 0 &&
      this.body.touching.down &&
      player.body.blocked.up
    ) {
      this.budge()
      this.displayCoin()

      gameState.incrementCoins()
      this.numCoins--

      if (this.numCoins === 0) {
        this.setPipeline(ResourceKey.PIPELINE_GRAYSCALE)
      }
    }
  }

  private budge = () => {
    this.scene.tweens.add({
      targets: this,
      y: this.y - BUDGE_DISTANCE,
      duration: BUDGE_DURATION,
      ease: 'Linear',
      repeat: 0,
      yoyo: true,
    })
  }

  private displayCoin = () => {
    const coin = this.scene.add
      .existing(new Coin(this.scene, this.x + this.width * 0.5, this.y))
      .setDepth(this.depth - 1)

    coin.play({
      key: CoinAnimation.COIN_ROTATE,
      frameRate: COIN_JUMP_FRAMERATE,
    })

    this.scene.tweens.add({
      targets: coin,
      y: this.y - this.height - COIN_MARGIN_BOTTOM,
      duration: COIN_JUMP_DURATION,
      ease: 'Linear',
      repeat: 0,
      onComplete() {
        coin.destroy()
      },
    })
  }
}
