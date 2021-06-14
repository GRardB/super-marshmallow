import Phaser from 'phaser'
import { SoldierAnimation } from './animations'
import { MAP_TILE_SIZE } from '../../../globals/Map'
import { ResourceKey } from '../../../globals/ResourceKeys'
import { isOffScreen } from '../../../lib/util'
import { Killable } from '../../Killable'

const JUMP_SPEED = 50
const STEP_SPEED = 2 * MAP_TILE_SIZE
const MOVEMENT_INTERVAL = 1.5 * 1000
const SCORE_VALUE = 10

export class Soldier extends Phaser.GameObjects.Container implements Killable {
  public body: Phaser.Physics.Arcade.Body
  private sprite: Phaser.GameObjects.Sprite
  private isDead = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.sprite = this.createSprite()
    this.setSize(this.sprite.width, this.sprite.height)

    this.addPhysics()

    this.add(this.sprite)

    this.move()
  }

  preUpdate() {
    if (this.isDead && isOffScreen(this)) {
      this.destroy()
    } else if (!this.isDead && this.body.velocity.y !== 0) {
      this.sprite.play(SoldierAnimation.SOLDIER_STEP, true)
    } else if (!this.isDead) {
      this.body.setVelocity(0, 0)
      this.sprite.play(SoldierAnimation.SOLDIER_STAND, true)
    }
  }

  public getScoreValue = () => SCORE_VALUE

  public die = () => {
    this.isDead = true
    this.sprite.play(SoldierAnimation.SOLDIER_DIE, true)
    this.body.checkCollision.none = true
    this.body.setCollideWorldBounds(false).setVelocity(0, -JUMP_SPEED)
  }

  private move = () => {
    if (this.isDead) return

    Phaser.Math.RND.weightedPick([this.step, this.flip])()

    this.scene.time.addEvent({
      delay: MOVEMENT_INTERVAL,
      callback: this.move,
    })
  }

  private step = () => {
    const direction = this.sprite.flipX ? -1 : 1

    this.body.setVelocity(direction * STEP_SPEED, -JUMP_SPEED)
    this.sprite.play(SoldierAnimation.SOLDIER_STEP, true)
  }

  private flip = () => {
    this.sprite.setFlipX(!this.sprite.flipX)
  }

  private createSprite = () => {
    const sprite = this.scene.add.sprite(0, 0, ResourceKey.ENTITIES)

    sprite.play(SoldierAnimation.SOLDIER_STAND, true)

    return sprite
  }

  private addPhysics = () => {
    this.scene.physics.add.existing(this)

    this.body.setOffset(0, -this.height * 0.5).setCollideWorldBounds(true)
  }
}
