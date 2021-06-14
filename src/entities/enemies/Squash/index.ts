import Phaser from 'phaser'
import { SquashAnimation } from './animations'
import { MAP_TILE_SIZE } from '../../../globals/Map'
import { ResourceKey } from '../../../globals/ResourceKeys'
import { isOffScreen } from '../../../lib/util'
import { Direction } from '../../../types/Direction'
import { Killable } from '../../Killable'

const WALK_SPEED = 2 * MAP_TILE_SIZE
const JUMP_SPEED = 50
const WALK_TIME = 2.5 * 1000
const STAND_TIME = 1 * 1000
const SCORE_VALUE = 20

export class Squash extends Phaser.GameObjects.Container implements Killable {
  public body: Phaser.Physics.Arcade.Body
  private sprite: Phaser.GameObjects.Sprite
  private isDead = false
  private direction: Direction = Direction.LEFT

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.sprite = this.createSprite()
    this.setSize(this.sprite.width, this.sprite.height * 0.7)

    this.addPhysics()

    this.add(this.sprite)

    this.scene.time.addEvent({
      callback: this.changeDirection,
      delay: WALK_TIME,
    })
  }

  preUpdate() {
    if (this.isDead) {
      if (isOffScreen(this)) {
        this.destroy()
      }
    } else {
      this.walk()
    }
  }

  public getScoreValue = () => SCORE_VALUE

  public die = () => {
    this.isDead = true
    this.sprite.play(SquashAnimation.SQUASH_DIE, true)
    this.body.checkCollision.none = true
    this.body.setVelocity(0, -JUMP_SPEED).setCollideWorldBounds(false)
  }

  private walk = () => {
    if (this.direction === Direction.LEFT) {
      if (this.body.blocked.left || this.body.touching.left) {
        this.direction = Direction.RIGHT
      } else {
        this.body.setVelocityX(-WALK_SPEED)
        this.sprite.setFlipX(false).play(SquashAnimation.SQUASH_WALK, true)
      }
    } else if (this.direction === Direction.RIGHT) {
      if (this.body.blocked.right || this.body.touching.right) {
        this.direction = Direction.LEFT
      } else {
        this.body.setVelocityX(WALK_SPEED)
        this.sprite.setFlipX(true).play(SquashAnimation.SQUASH_WALK, true)
      }
    } else {
      this.sprite.play(SquashAnimation.SQUASH_STAND, true)
      this.body.setVelocityX(0)
    }
  }

  private changeDirection = () => {
    if (this.isDead) return

    this.direction = Phaser.Math.RND.pick([
      Direction.DOWN,
      Direction.LEFT,
      Direction.RIGHT,
    ])

    this.scene.time.addEvent({
      callback: this.changeDirection,
      delay: this.direction === Direction.DOWN ? STAND_TIME : WALK_TIME,
    })
  }

  private createSprite = () => {
    const sprite = this.scene.add.sprite(0, 0, ResourceKey.ENTITIES)

    sprite.play(SquashAnimation.SQUASH_STAND)

    return sprite
  }

  private addPhysics = () => {
    this.scene.physics.add.existing(this)

    this.body.setOffset(0, -this.height * 0.5).setCollideWorldBounds(true)
  }
}
