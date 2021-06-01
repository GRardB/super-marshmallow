import Phaser from 'phaser'
import { ResourceKey } from '../../../globals/ResourceKeys'

export enum SquashAnimation {
  SQUASH_DIE = 'SQUASH_DIE',
  SQUASH_STAND = 'SQUASH_STAND',
  SQUASH_WALK = 'SQUASH_WALK',
}

export const createSquashAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: SquashAnimation.SQUASH_DIE,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'squash-die.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: SquashAnimation.SQUASH_STAND,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'squash-walk-2.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: SquashAnimation.SQUASH_WALK,
    frames: [
      ...scene.anims.generateFrameNames(ResourceKey.ENTITIES, {
        prefix: 'squash-walk-',
        start: 1,
        end: 3,
        suffix: '.png',
      }),
    ],
    frameRate: 10,
    repeat: -1,
    yoyo: true,
  })
}
