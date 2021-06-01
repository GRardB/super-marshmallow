import Phaser from 'phaser'
import { JellyAnimation } from './animations'
import { MAP_TILE_SIZE } from '../../../globals/Map'
import { ResourceKey } from '../../../globals/ResourceKeys'
import { isOffScreen } from '../../../lib/util'
import { Killable } from '../../Killable'
import { Direction } from '../../../types/Direction'

const WALK_SPEED = MAP_TILE_SIZE
const JUMP_SPEED = 50

export class Jelly extends Phaser.GameObjects.Container implements Killable {
  public body: Phaser.Physics.Arcade.Body
  private sprite: Phaser.GameObjects.Sprite
  private isDead = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.sprite = this.createSprite()
    this.setSize(this.sprite.width, this.sprite.height)

    this.addPhysics()

    this.add(this.sprite)

    this.walk(Direction.LEFT)
  }

  preUpdate() {
    if (this.isDead) {
      if (isOffScreen(this)) {
        this.destroy()
      }
    } else if (this.body.blocked.left) {
      this.walk(Direction.RIGHT)
    } else if (this.body.blocked.right) {
      this.walk(Direction.LEFT)
    }
  }

  private walk = (direction: Direction) => {
    const isWalkingRight = direction === Direction.RIGHT
    this.sprite.setFlipX(isWalkingRight)
    this.body.setVelocityX(isWalkingRight ? WALK_SPEED : -WALK_SPEED)
  }

  public die = () => {
    this.isDead = true
    this.sprite.play(JellyAnimation.JELLY_DIE, true)
    this.body.checkCollision.none = true
    this.body.setCollideWorldBounds(false).setVelocity(0, -JUMP_SPEED)
  }

  private createSprite = () => {
    const sprite = this.scene.add.sprite(0, 0, ResourceKey.ENTITIES)

    sprite.play(JellyAnimation.JELLY_WALK, true)

    return sprite
  }

  private addPhysics = () => {
    this.scene.physics.add.existing(this)

    this.body.setOffset(0, -this.height * 0.5).setCollideWorldBounds(true)
  }
}
