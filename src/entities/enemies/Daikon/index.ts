import Phaser from 'phaser'
import { DaikonAnimation } from './animations'
import { MAP_TILE_SIZE } from '../../../globals/Map'
import { ResourceKey } from '../../../globals/ResourceKeys'
import { isOffScreen } from '../../../lib/util'
import { Killable } from '../../Killable'

const JUMP_SPEED = 150
const SCORE_VALUE = 30

export class Daikon extends Phaser.GameObjects.Container implements Killable {
  public body: Phaser.Physics.Arcade.Body
  private sprite: Phaser.GameObjects.Sprite
  private isDead = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.sprite = this.createSprite()
    this.setSize(this.sprite.width, this.sprite.height)

    this.addPhysics()

    this.add(this.sprite)
  }

  preUpdate() {
    if (this.isDead) {
      if (isOffScreen(this)) {
        this.destroy()
      }
    } else if (this.isFalling()) {
      this.sprite.play(DaikonAnimation.DAIKON_FALL, true)
    } else if (this.isJumping()) {
      this.sprite.play(DaikonAnimation.DAIKON_JUMP, true)
    } else if (!this.isDead && this.body.blocked.down) {
      this.jump()
    }
  }

  public getScoreValue = () => SCORE_VALUE

  public die = () => {
    this.isDead = true
    this.sprite.play(DaikonAnimation.DAIKON_DIE, true)
    this.body.checkCollision.none = true
    this.body.setCollideWorldBounds(false).setVelocity(0, -JUMP_SPEED)
  }

  private jump = () => {
    this.body.setVelocityY(-JUMP_SPEED)
  }

  private createSprite = () => {
    const sprite = this.scene.add.sprite(0, 0, ResourceKey.ENTITIES)

    sprite.play(DaikonAnimation.DAIKON_JUMP)

    return sprite
  }

  private addPhysics = () => {
    this.scene.physics.add.existing(this)

    this.body.setOffset(0, -this.height * 0.5).setCollideWorldBounds(true)
  }

  private isJumping = () => {
    return this.body.velocity.y < 0
  }

  private isFalling = () => {
    return this.body.velocity.y > 0
  }
}
