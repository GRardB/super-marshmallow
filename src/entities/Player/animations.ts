import Phaser from 'phaser'
import { ResourceKey } from '../../globals/ResourceKeys'

export enum PlayerAnimation {
  STAND = 'STAND',
  WALK = 'WALK',
  RUN = 'RUN',
  JUMP = 'JUMP',
  DIE = 'DIE',
}

export const createPlayerAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: PlayerAnimation.STAND,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'marshmallow-walk-1.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: PlayerAnimation.JUMP,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'marshmallow-jump.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: PlayerAnimation.DIE,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'marshmallow-die.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: PlayerAnimation.WALK,
    frames: [
      ...scene.anims.generateFrameNames(ResourceKey.ENTITIES, {
        prefix: 'marshmallow-walk-',
        start: 2,
        end: 4,
        suffix: '.png',
      }),
      { key: ResourceKey.ENTITIES, frame: 'marshmallow-walk-1.png' },
    ],
    frameRate: 10,
    repeat: -1,
  })

  scene.anims.create({
    key: PlayerAnimation.RUN,
    frames: [
      ...scene.anims.generateFrameNames(ResourceKey.ENTITIES, {
        prefix: 'marshmallow-walk-',
        start: 2,
        end: 4,
        suffix: '.png',
      }),
      { key: ResourceKey.ENTITIES, frame: 'marshmallow-walk-1.png' },
    ],
    frameRate: 20,
    repeat: -1,
  })
}
