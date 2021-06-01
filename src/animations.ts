import Phaser from 'phaser'

import { createCactusAnimations } from './entities/enemies/Cactus/animations'
import { createCoinAnimations } from './entities/Coin/animations'
import { createDaikonAnimations } from './entities/enemies/Daikon/animations'
import { createEyeAnimations } from './entities/enemies/Eye/animations'
import { createJellyAnimations } from './entities/enemies/Jelly/animations'
import { createSoldierAnimations } from './entities/enemies/Soldier/animations'
import { createSquashAnimations } from './entities/enemies/Squash/animations'
import { createTankAnimations } from './entities/enemies/Tank/animations'
import { createRadishAnimations } from './entities/enemies/Radish/animations'
import { createFlyingRadishAnimations } from './entities/enemies/FlyingRadish/animations'
import { createPlayerAnimations } from './entities/Player/animations'

export const createAnimations = (scene: Phaser.Scene) => {
  createCactusAnimations(scene)
  createCoinAnimations(scene)
  createDaikonAnimations(scene)
  createJellyAnimations(scene)
  createPlayerAnimations(scene)
  createSoldierAnimations(scene)
  createSquashAnimations(scene)
  createTankAnimations(scene)
  createEyeAnimations(scene)
  createRadishAnimations(scene)
  createFlyingRadishAnimations(scene)
}
