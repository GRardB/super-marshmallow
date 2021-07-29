import { Player } from '../entities/Player'
import { Trigger } from '../entities/triggers'

export const handlePlayerTriggerCollision = (
  _player: Player,
  trigger: Trigger,
) => {
  trigger.handlePlayerCollision()
}
