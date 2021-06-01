import Phaser from 'phaser'
import { ResourceKey } from '../../../globals/ResourceKeys'

export enum DaikonAnimation {
  DAIKON_DIE = 'DAIKON_DIE',
  DAIKON_JUMP = 'DAIKON_JUMP',
  DAIKON_FALL = 'DAIKON_FALL',
}

export const createDaikonAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: DaikonAnimation.DAIKON_JUMP,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'daikon-jump.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: DaikonAnimation.DAIKON_DIE,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'daikon-die.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: DaikonAnimation.DAIKON_FALL,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'daikon-fall.png' }],
    repeat: 0,
  })
}
