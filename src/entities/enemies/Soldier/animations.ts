import Phaser from 'phaser'
import { ResourceKey } from '../../../globals/ResourceKeys'

export enum SoldierAnimation {
  SOLDIER_DIE = 'SOLDIER_DIE',
  SOLDIER_STEP = 'SOLDIER_STEP',
  SOLDIER_STAND = 'SOLDIER_STAND',
}

export const createSoldierAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: SoldierAnimation.SOLDIER_DIE,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'soldier-die.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: SoldierAnimation.SOLDIER_STAND,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'soldier-stand.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: SoldierAnimation.SOLDIER_STEP,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'soldier-step.png' }],
    repeat: 0,
  })
}
