import Phaser from 'phaser'
import { MoveablePlatform } from './MoveablePlatform'
import { MovingPlatform } from './MovingPlatform'
import { CrumblingPlatform } from './CrumblingPlatform'
import { CoinChest } from './CoinChest'
import { TiledProperties } from '../../lib/util'

export { InteractivePlatform } from './InteractivePlatform'

type InteractivePlatformClass =
  | typeof MoveablePlatform
  | typeof MovingPlatform
  | typeof CrumblingPlatform
  | typeof CoinChest

const mappings: [prefix: string, cl: InteractivePlatformClass][] = [
  ['MOVEABLE', MoveablePlatform],
  ['MOVING', MovingPlatform],
  ['CRUMBLING', CrumblingPlatform],
  ['COIN_CHEST', CoinChest],
]

export const createInteractivePlatform = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  type: string,
  properties: TiledProperties,
) => {
  for (let i = 0; i < mappings.length; i++) {
    const [prefix, PlatformClass] = mappings[i]

    if (type.startsWith(prefix)) {
      return new PlatformClass(scene, x, y, type, properties)
    }
  }
}
