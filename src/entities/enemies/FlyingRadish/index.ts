import Phaser from 'phaser'
import { FlyingRadishAnimation } from './animations'
import { MAP_TILE_SIZE } from '../../../globals/Map'
import { ResourceKey } from '../../../globals/ResourceKeys'
import {
  getTiledProperty,
  isOffScreen,
  TiledProperties,
} from '../../../lib/util'
import { Killable } from '../../Killable'

const FLY_SPEED = 2 * MAP_TILE_SIZE
const JUMP_SPEED = 150
const SCORE_VALUE = 50

export class FlyingRadish
  extends Phaser.GameObjects.Container
  implements Killable
{
  public body: Phaser.Physics.Arcade.Body
  private sprite: Phaser.GameObjects.Sprite
  private tween: Phaser.Tweens.Tween
  private isDead = false

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    properties: TiledProperties,
  ) {
    super(scene, x, y)

    this.sprite = this.createSprite()
    this.setSize(this.sprite.width, this.sprite.height)

    this.addPhysics()

    this.add(this.sprite)

    const range = getTiledProperty(properties, 'range') * MAP_TILE_SIZE

    if (range > 0) {
      this.tween = this.createAnimationTween(range)
    }
  }

  preUpdate() {
    if (this.isDead && isOffScreen(this)) {
      this.destroy()
    }
  }

  public getScoreValue = () => SCORE_VALUE

  public die = () => {
    this.tween?.stop()
    this.isDead = true
    this.sprite.play(FlyingRadishAnimation.FLYING_RADISH_DIE, true)
    this.body.checkCollision.none = true
    this.body
      .setCollideWorldBounds(false)
      .setVelocity(0, -JUMP_SPEED)
      .setAllowGravity(true)
  }

  private flip = () => {
    this.sprite.setFlipX(!this.sprite.flipX)
  }

  private createSprite = () => {
    const sprite = this.scene.add.sprite(0, 0, ResourceKey.ENTITIES)
    sprite.play(FlyingRadishAnimation.FLYING_RADISH_FLY, true)
    return sprite
  }

  private addPhysics = () => {
    this.scene.physics.add.existing(this)

    this.body
      .setCollideWorldBounds(true)
      .setAllowGravity(false)
      .setImmovable(true)
      .setOffset(0, -this.height * 0.4)
      .setSize(this.width, this.height * 0.6)
  }

  private createAnimationTween = (range: number) => {
    return this.scene.tweens.add({
      targets: this,
      x: this.x - range,
      duration: (range / FLY_SPEED) * 1000,
      ease: 'Linear',
      repeat: -1,
      yoyo: true,
      onYoyo: this.flip,
      onRepeat: this.flip,
    })
  }
}
