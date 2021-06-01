import Phaser from 'phaser'
import { ResourceKey } from '../../../globals/ResourceKeys'

export enum FlyingRadishAnimation {
  FLYING_RADISH_DIE = 'FLYING_RADISH_DIE',
  FLYING_RADISH_FLY = 'FLYING_RADISH_FLY',
}

export const createFlyingRadishAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: FlyingRadishAnimation.FLYING_RADISH_DIE,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'radish-jumping-die.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: FlyingRadishAnimation.FLYING_RADISH_FLY,
    frames: scene.anims.generateFrameNames(ResourceKey.ENTITIES, {
      prefix: 'radish-flying-fly-',
      start: 1,
      end: 2,
      suffix: '.png',
    }),
    frameRate: 5,
    repeat: -1,
  })
}
