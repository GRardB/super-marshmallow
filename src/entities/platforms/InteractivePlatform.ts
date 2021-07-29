import Phaser from 'phaser'
import { Player } from '../Player'
import { GameState } from '../../globals/GameState'

export interface InteractivePlatform {
  handlePlayerCollision(
    player: Player,
    enemies: Phaser.Physics.Arcade.Group,
    gameState: GameState,
  ): void
}
