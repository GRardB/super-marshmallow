import Phaser from 'phaser'
import { RadishAnimation } from './animations'
import { MAP_TILE_SIZE } from '../../../globals/Map'
import { ResourceKey } from '../../../globals/ResourceKeys'
import { isOffScreen } from '../../../lib/util'
import { Killable } from '../../Killable'
import { EventNames } from '../../../globals/EventNames'

const LUNGE_SPEED = 4 * MAP_TILE_SIZE
const JUMP_SPEED = 150
const JUMP_INTERVAL = 2 * 1000
const SCORE_VALUE = 40

export class Radish extends Phaser.GameObjects.Container implements Killable {
  public body: Phaser.Physics.Arcade.Body
  private sprite: Phaser.GameObjects.Sprite
  private isDead = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.sprite = this.createSprite()
    this.setSize(this.sprite.width, this.sprite.height)

    this.addPhysics()

    this.add(this.sprite)

    this.on(EventNames.SPAWN, this.jump)
  }

  preUpdate() {
    if (this.isDead) {
      if (isOffScreen(this)) {
        this.destroy()
      }
    } else if (this.isAirborne()) {
      this.sprite.play(RadishAnimation.RADISH_JUMP, true)
    } else {
      this.body.setVelocity(0, 0)
      this.sprite.play(RadishAnimation.RADISH_STAND, true)
    }
  }

  public getScoreValue = () => SCORE_VALUE

  private jump = () => {
    if (this.isDead) return

    if (this.active) {
      const isFlipped = this.sprite.flipX
      this.body.setVelocity(isFlipped ? -LUNGE_SPEED : LUNGE_SPEED, -JUMP_SPEED)
      this.sprite.setFlipX(!isFlipped)
    }

    this.scene.time.addEvent({
      delay: JUMP_INTERVAL,
      callback: this.jump,
    })
  }

  public die = () => {
    this.isDead = true
    this.sprite.play(
      this.isAirborne()
        ? RadishAnimation.RADISH_JUMP_DIE
        : RadishAnimation.RADISH_DIE,
      true,
    )
    this.body.checkCollision.none = true
    this.body.setCollideWorldBounds(false).setVelocity(0, -JUMP_SPEED)
  }

  private isAirborne = () =>
    !this.body.blocked.down || this.body.velocity.y !== 0

  private createSprite = () => {
    const sprite = this.scene.add.sprite(0, 0, ResourceKey.ENTITIES)

    sprite.play(RadishAnimation.RADISH_STAND, true)

    return sprite
  }

  private addPhysics = () => {
    this.scene.physics.add.existing(this)

    this.body.setOffset(0, -this.height * 0.5).setCollideWorldBounds(true)
  }
}
