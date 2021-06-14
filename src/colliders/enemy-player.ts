import { Killable } from '../entities/Killable'
import { Player } from '../entities/Player'
import { GameState } from '../globals/GameState'
import { getBodyBounds } from '../lib/util'

export const handleEnemyPlayerCollision = <
  T extends Killable & Phaser.GameObjects.Container,
>(
  gameState: GameState,
  enemy: T,
  player: Player,
) => {
  const enemyBounds = getBodyBounds(enemy.body as Phaser.Physics.Arcade.Body)
  const topOfEnemy = enemyBounds.top + enemyBounds.height * 0.33

  if (player.y < topOfEnemy) {
    gameState.addToScore(enemy.getScoreValue())
    enemy.die()
    player.bounce()
  } else {
    gameState.decrementLives()
    player.die()
  }
}
