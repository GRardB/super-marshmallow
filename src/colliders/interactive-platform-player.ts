import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { InteractivePlatform } from '../entities/platforms'
import { GameState } from '../globals/GameState'

export const handleInteractivePlatformPlayerCollision = (
  gameState: GameState,
  enemies: Phaser.Physics.Arcade.Group,
  player: Player,
  interactivePlatform: InteractivePlatform,
) => {
  interactivePlatform.handlePlayerCollision(player, enemies, gameState)
}
