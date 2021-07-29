import Phaser from 'phaser'

import { createCactusAnimations } from './entities/enemies/Cactus/animations'
import { createCoinAnimations } from './entities/Coin/animations'
import { createCrumblingPlatformAnimations } from './entities/platforms/CrumblingPlatform/animations'
import { createDaikonAnimations } from './entities/enemies/Daikon/animations'
import { createEyeAnimations } from './entities/enemies/Eye/animations'
import { createFlyingRadishAnimations } from './entities/enemies/FlyingRadish/animations'
import { createJellyAnimations } from './entities/enemies/Jelly/animations'
import { createPlayerAnimations } from './entities/Player/animations'
import { createRadishAnimations } from './entities/enemies/Radish/animations'
import { createSoldierAnimations } from './entities/enemies/Soldier/animations'
import { createSquashAnimations } from './entities/enemies/Squash/animations'
import { createTankAnimations } from './entities/enemies/Tank/animations'

export const createAnimations = (scene: Phaser.Scene) => {
  createCactusAnimations(scene)
  createCoinAnimations(scene)
  createCrumblingPlatformAnimations(scene)
  createDaikonAnimations(scene)
  createEyeAnimations(scene)
  createFlyingRadishAnimations(scene)
  createJellyAnimations(scene)
  createPlayerAnimations(scene)
  createRadishAnimations(scene)
  createSoldierAnimations(scene)
  createSquashAnimations(scene)
  createTankAnimations(scene)
}
