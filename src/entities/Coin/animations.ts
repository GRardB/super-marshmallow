import Phaser from 'phaser'
import { ResourceKey } from '../../globals/ResourceKeys'

export enum CoinAnimation {
  COIN_ROTATE = 'COIN_ROTATE',
  COIN_VANISH = 'COIN_VANISH',
}

export const createCoinAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: CoinAnimation.COIN_ROTATE,
    frames: scene.anims.generateFrameNames(ResourceKey.ENTITIES, {
      prefix: 'coin-',
      start: 1,
      end: 4,
      suffix: '.png',
    }),
    frameRate: 5,
    repeat: -1,
  })

  scene.anims.create({
    key: CoinAnimation.COIN_VANISH,
    frames: [
      ...scene.anims.generateFrameNames(ResourceKey.ENTITIES, {
        prefix: 'stars-',
        start: 1,
        end: 4,
        suffix: '.png',
      }),
    ],
    frameRate: 8,
    repeat: 0,
  })
}
