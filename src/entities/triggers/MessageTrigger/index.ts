import Phaser from 'phaser'
import { ResourceKey } from '../../../globals/ResourceKeys'
import { mapObjectTypeToFrame } from '../../../globals/AtlasFrames'
import { SceneKey } from '../../../globals/SceneKeys'
import { Trigger } from '../Trigger'
import { getTiledProperty, TiledProperties } from '../../../lib/util'

export class MessageTrigger
  extends Phaser.Physics.Arcade.Sprite
  implements Trigger
{
  private message: string

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: string,
    properties: TiledProperties,
  ) {
    super(scene, x, y, ResourceKey.ENTITIES, mapObjectTypeToFrame(type))

    this.message = getTiledProperty(properties, 'message')
  }

  public handlePlayerCollision = () => {
    this.body.enable = false

    this.scene.scene.pause()
    this.scene.scene.run(SceneKey.DIALOGUE, {
      message: this.message,
      onComplete: (dialogueScene: Phaser.Scene) => {
        dialogueScene.scene.stop()
        this.scene.scene.resume()
      },
    })
  }
}
