import Phaser from 'phaser'
import { ResourceKey } from '../../../globals/ResourceKeys'

export enum JellyAnimation {
  JELLY_DIE = 'JELLY_DIE',
  JELLY_WALK = 'JELLY_WALK',
}

export const createJellyAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: JellyAnimation.JELLY_DIE,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'jelly-die.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: JellyAnimation.JELLY_WALK,
    frames: [
      ...scene.anims.generateFrameNames(ResourceKey.ENTITIES, {
        prefix: 'jelly-walk-',
        start: 1,
        end: 2,
        suffix: '.png',
      }),
    ],
    frameRate: 5,
    repeat: -1,
    yoyo: true,
  })
}
