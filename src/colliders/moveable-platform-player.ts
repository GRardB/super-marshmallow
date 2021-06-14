import Phaser from 'phaser'
import { Killable } from '../entities/Killable'
import { Player } from '../entities/Player'
import { GameState } from '../globals/GameState'
import { MAP_TILE_SIZE } from '../globals/Map'

const BUDGE_DISTANCE = 0.5 * MAP_TILE_SIZE
const BUDGE_DURATION = 0.1 * 1000

export const handleMoveablePlatformPlayerCollision = (
  gameState: GameState,
  enemies: Phaser.Physics.Arcade.Group,
  player: Player,
  moveablePlatform: Phaser.Physics.Arcade.Sprite,
) => {
  if (moveablePlatform.body.touching.down && player.body.blocked.up) {
    moveablePlatform.scene.tweens.add({
      targets: moveablePlatform,
      y: moveablePlatform.y - BUDGE_DISTANCE,
      duration: BUDGE_DURATION,
      ease: 'Linear',
      repeat: 0,
      yoyo: true,
    })

    if (moveablePlatform.body.touching.up) {
      const bounds = moveablePlatform.getBounds()

      enemies.children.each(
        // @ts-ignore
        (enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody & Killable) => {
          if (
            enemy.body.hitTest(bounds.left, bounds.top) ||
            enemy.body.hitTest(bounds.right, bounds.top) ||
            enemy.body.hitTest(0.5 * (bounds.left + bounds.right), bounds.top)
          ) {
            gameState.addToScore(enemy.getScoreValue())
            enemy.die()
          }
        },
      )
    }
  }
}
