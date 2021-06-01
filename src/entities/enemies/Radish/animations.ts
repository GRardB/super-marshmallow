import Phaser from 'phaser'
import { ResourceKey } from '../../../globals/ResourceKeys'

export enum RadishAnimation {
  RADISH_STAND = 'RADISH_STAND',
  RADISH_JUMP = 'RADISH_JUMP',
  RADISH_DIE = 'RADISH_DIE',
  RADISH_JUMP_DIE = 'RADISH_JUMP_DIE',
}

export const createRadishAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: RadishAnimation.RADISH_STAND,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'radish-stand.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: RadishAnimation.RADISH_JUMP,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'radish-jump.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: RadishAnimation.RADISH_JUMP_DIE,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'radish-jumping-die.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: RadishAnimation.RADISH_DIE,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'radish-standing-die.png' }],
    repeat: 0,
  })
}
