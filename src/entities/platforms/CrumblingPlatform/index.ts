import Phaser from 'phaser'
import { Player } from '../../Player'
import { ResourceKey } from '../../../globals/ResourceKeys'
import { mapObjectTypeToFrame } from '../../../globals/AtlasFrames'
import { GameState } from '../../../globals/GameState'
import { InteractivePlatform } from '../InteractivePlatform'
import { TiledProperties } from '../../../lib/util'
import { CrumblingPlatformAnimation } from './animations'

const DESTROY_ANIMATION_INDEX = 3 // The frame on which we disable physics

export class CrumblingPlatform
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
  }

  public handlePlayerCollision = (
    player: Player,
    _enemies: Phaser.Physics.Arcade.Group,
    _gameState: GameState,
  ) => {
    if (this.body.touching.up && player.body.blocked.down) {
      this.play(CrumblingPlatformAnimation.CRUMBLING, true)
        .on(
          'animationupdate',
          (
            _animation: Phaser.Types.Animations.Animation,
            { index }: { index: number },
          ) => {
            if (index === DESTROY_ANIMATION_INDEX) {
              this.disableBody()
            }
          },
        )
        .on('animationcomplete', () => {
          this.destroy()
        })
    }
  }
}
