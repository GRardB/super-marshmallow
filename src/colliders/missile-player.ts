import Phaser from 'phaser'
import { Player } from '../entities/Player'

const MISSILE_DIP_SPEED = 50

export const handleMissilePlayerCollision = (
  player: Player,
  missile: Phaser.Physics.Arcade.Sprite,
) => {
  if (missile.body.touching.up) {
    player.bounce()
    missile.setVelocity(0, MISSILE_DIP_SPEED)
  } else {
    player.die()
  }
}
