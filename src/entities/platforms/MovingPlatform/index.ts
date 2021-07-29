import Phaser from 'phaser'
import { Player } from '../../Player'
import { ResourceKey } from '../../../globals/ResourceKeys'
import { mapObjectTypeToFrame } from '../../../globals/AtlasFrames'
import { MAP_TILE_SIZE } from '../../../globals/Map'
import { GameState } from '../../../globals/GameState'
import { InteractivePlatform } from '../InteractivePlatform'
import { getTiledProperty, TiledProperties } from '../../../lib/util'

const X_DISTANCE = 2 * MAP_TILE_SIZE
const Y_DISTANCE = 2 * MAP_TILE_SIZE
const MOVEMENT_DURATION = 1 * 1000

export class MovingPlatform
  extends Phaser.Physics.Arcade.Sprite
  implements InteractivePlatform
{
  body: Phaser.Physics.Arcade.StaticBody
  private player: Player
  private lastX: number
  private lastY: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: string,
    properties: TiledProperties,
  ) {
    super(scene, x, y, ResourceKey.MAP_TILES, mapObjectTypeToFrame(type))

    this.setOrigin(0, 1)

    const direction = getTiledProperty(properties, 'direction')
    const tweenCoordinate = (() => {
      switch (direction) {
        case 'UP':
          return { y: this.y - Y_DISTANCE }
        case 'DOWN':
          return { y: this.y + Y_DISTANCE }
        case 'LEFT':
          return { x: this.x - X_DISTANCE }
        default:
          return { x: this.x + X_DISTANCE }
      }
    })()

    this.scene.tweens.add({
      ...tweenCoordinate,
      targets: this,
      duration: MOVEMENT_DURATION,
      ease: 'Linear',
      repeat: -1,
      yoyo: true,
    })

    this.lastX = this.x
    this.lastY = this.y
  }

  preUpdate() {
    this.body.updateFromGameObject()
    const { lastX, lastY, x, y } = this

    if (this.player) {
      if (this.body.touching.up && this.player.body.blocked.down) {
        this.player.x += x - lastX
        this.player.y += y - lastY
      } else {
        this.player = undefined
      }
    }

    this.lastX = x
    this.lastY = y
  }

  public handlePlayerCollision = (
    player: Player,
    _enemies: Phaser.Physics.Arcade.Group,
    _gameState: GameState,
  ) => {
    if (this.body.touching.up && player.body.blocked.down) {
      this.player = player
    }
  }
}
