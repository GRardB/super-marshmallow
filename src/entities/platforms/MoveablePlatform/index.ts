import Phaser from 'phaser'
import { Player } from '../../Player'
import { ResourceKey } from '../../../globals/ResourceKeys'
import { mapObjectTypeToFrame } from '../../../globals/AtlasFrames'
import { Killable } from '../../Killable'
import { MAP_TILE_SIZE } from '../../../globals/Map'
import { GameState } from '../../../globals/GameState'
import { InteractivePlatform } from '../InteractivePlatform'
import { TiledProperties } from '../../../lib/util'

const BUDGE_DISTANCE = 0.5 * MAP_TILE_SIZE
const BUDGE_DURATION = 0.1 * 1000

export class MoveablePlatform
  extends Phaser.Physics.Arcade.Sprite
  implements InteractivePlatform
{
  body: Phaser.Physics.Arcade.StaticBody

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: string,
    _properties: TiledProperties,
  ) {
    super(scene, x, y, ResourceKey.MAP_TILES, mapObjectTypeToFrame(type))

    this.setOrigin(0, 1)

    this.scene.events.once('update', () => {
      this.body.setSize(this.width, 0.5 * this.height).setOffset(0, 0)
    })
  }

  public handlePlayerCollision = (
    player: Player,
    enemies: Phaser.Physics.Arcade.Group,
    gameState: GameState,
  ) => {
    if (this.body.touching.down && player.body.blocked.up) {
      this.scene.tweens.add({
        targets: this,
        y: this.y - BUDGE_DISTANCE,
        duration: BUDGE_DURATION,
        ease: 'Linear',
        repeat: 0,
        yoyo: true,
      })

      if (this.body.touching.up) {
        const bounds = this.getBounds()

        enemies.children.each(
          (
            enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody & Killable,
          ) => {
            if (
              enemy.body.hitTest(bounds.left, bounds.top) ||
              enemy.body.hitTest(bounds.right, bounds.top) ||
              enemy.body.hitTest(0.5 * (bounds.left + bounds.right), bounds.top)
            ) {
              gameState.addToScore(enemy.getScoreValue())
              enemy.die()
            }
          },
        )
      }
    }
  }
}
