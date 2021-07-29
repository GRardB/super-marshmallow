import Phaser from 'phaser'
import { NextLevelTrigger } from './NextLevelTrigger'
import { MessageTrigger } from './MessageTrigger'
import { getTiledProperty, TiledProperties } from '../../lib/util'

export { Trigger } from './Trigger'

type TriggerClass = typeof NextLevelTrigger | typeof MessageTrigger

const mappings: { [triggerType: string]: TriggerClass } = {
  NEXT_LEVEL: NextLevelTrigger,
  MESSAGE: MessageTrigger,
}

export const createTrigger = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  type: string,
  properties: TiledProperties,
) => {
  const triggerType = getTiledProperty(properties, 'triggerType')
  const Class = mappings[triggerType]

  return new Class(scene, x, y, type, properties)
}
