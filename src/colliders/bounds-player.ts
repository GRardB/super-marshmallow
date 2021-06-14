import { Player } from '../entities/Player'
import { GameState } from '../globals/GameState'

export const handlePlayerOutOfBounds = (
  gameState: GameState,
  player: Player,
  down: boolean,
) => {
  if (down) {
    gameState.decrementLives()
    player.die()
  }
}
