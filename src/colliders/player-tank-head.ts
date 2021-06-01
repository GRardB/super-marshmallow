import Phaser from 'phaser'
import { Tank } from '../entities/enemies'
import { Player } from '../entities/Player'

export const handlePlayerTankHeadCollision = (
  player: Player,
  tankHead: Phaser.GameObjects.GameObject,
) => {
  ;(tankHead.parentContainer as Tank).die()
  player.bounce()
}
