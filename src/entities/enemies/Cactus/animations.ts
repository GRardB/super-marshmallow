import Phaser from 'phaser'
import { ResourceKey } from '../../../globals/ResourceKeys'

export enum CactusAnimation {
  CACTUS_DIE = 'CACTUS_DIE',
  CACTUS_FULL_WALK = 'CACTUS_FULL_WALK',
  CACTUS_HALF_WALK = 'CACTUS_HALF_WALK',
}

export const createCactusAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: CactusAnimation.CACTUS_DIE,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'cactus-die.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: CactusAnimation.CACTUS_FULL_WALK,
    frames: scene.anims.generateFrameNames(ResourceKey.ENTITIES, {
      prefix: 'cactus-full-walk-',
      start: 1,
      end: 3,
      suffix: '.png',
    }),
    frameRate: 5,
    repeat: -1,
    yoyo: true,
  })

  scene.anims.create({
    key: CactusAnimation.CACTUS_HALF_WALK,
    frames: scene.anims.generateFrameNames(ResourceKey.ENTITIES, {
      prefix: 'cactus-half-walk-',
      start: 1,
      end: 2,
      suffix: '.png',
    }),
    frameRate: 5,
    repeat: -1,
    yoyo: true,
  })
}
