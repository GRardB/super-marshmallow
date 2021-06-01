import { Player } from '../entities/Player'

export const handleCannonBallPlayerCollision = (player: Player) => {
  player.die()
}
