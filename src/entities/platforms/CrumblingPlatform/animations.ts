import Phaser from 'phaser'
import { ResourceKey } from '../../../globals/ResourceKeys'

export enum CrumblingPlatformAnimation {
  CRUMBLING = 'CRUMBLING',
}

export const createCrumblingPlatformAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: CrumblingPlatformAnimation.CRUMBLING,
    frames: [
      ...scene.anims.generateFrameNames(ResourceKey.MAP_TILES, {
        prefix: 'block-concrete-',
        start: 1,
        end: 3,
        suffix: '.png',
      }),
    ],
    frameRate: 2,
    repeat: 0,
  })
}
