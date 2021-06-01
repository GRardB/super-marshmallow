import Phaser from 'phaser'
import { ResourceKey } from '../../../globals/ResourceKeys'

export enum EyeAnimation {
  EYE_FLOAT = 'EYE_FLOAT',
  EYE_SHOOT_CANNON_BALL = 'EYE_SHOOT_CANNON_BALL',
}

export const createEyeAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: EyeAnimation.EYE_FLOAT,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'eye-1.png' }],
    repeat: 0,
  })

  scene.anims.create({
    key: EyeAnimation.EYE_SHOOT_CANNON_BALL,
    frames: [{ key: ResourceKey.ENTITIES, frame: 'eye-2.png' }],
    repeat: 0,
  })
}
