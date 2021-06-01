import Phaser from 'phaser'
import { ResourceKey } from '../../../globals/ResourceKeys'

export enum TankAnimation {
  TANK_DRIVE = 'TANK_DRIVE',
  TANK_LAUNCH_MISSLE = 'TANK_LAUNCH_MISSLE',
}

export const createTankAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: TankAnimation.TANK_DRIVE,
    frames: scene.anims.generateFrameNames(ResourceKey.ENTITIES, {
      prefix: 'tank-',
      start: 1,
      end: 2,
      suffix: '.png',
    }),
    frameRate: 3,
    repeat: -1,
  })

  scene.anims.create({
    key: TankAnimation.TANK_LAUNCH_MISSLE,
    frames: scene.anims.generateFrameNames(ResourceKey.ENTITIES, {
      prefix: 'smoke-',
      start: 1,
      end: 5,
      suffix: '.png',
    }),
    frameRate: 15,
    repeat: 0,
  })
}
