import { Killable } from '../entities/Killable'
import { Player } from '../entities/Player'
import { getBodyBounds } from '../lib/util'

export const handleEnemyPlayerCollision = <
  T extends Killable & Phaser.GameObjects.Container,
>(
  enemy: T,
  player: Player,
) => {
  const enemyBounds = getBodyBounds(enemy.body as Phaser.Physics.Arcade.Body)
  const topOfEnemy = enemyBounds.top + enemyBounds.height * 0.33

  if (player.y < topOfEnemy) {
    enemy.die()
    player.bounce()
  } else {
    player.die()
  }
}
