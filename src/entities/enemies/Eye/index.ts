import Phaser from 'phaser'
import { EyeAnimation } from './animations'
import { MAP_TILE_SIZE } from '../../../globals/Map'
import { ResourceKey } from '../../../globals/ResourceKeys'
import { isOffScreen } from '../../../lib/util'
import { Killable } from '../../Killable'
import { LayerOrder } from '../../../globals/LayerOrder'

const FALL_SPEED = 10 * MAP_TILE_SIZE
const CANNON_BALL_SPEED = 3 * MAP_TILE_SIZE
const ROTATION_INTERVAL = 1 * 1000
const SHOOT_INTERVAL = 3 * 1000

export class Eye extends Phaser.GameObjects.Container implements Killable {
  public body: Phaser.Physics.Arcade.Body
  private sprite: Phaser.GameObjects.Sprite
  private isDead = false
  private target: Phaser.GameObjects.Container
  private cannonBalls: Phaser.Physics.Arcade.Group
  private tween: Phaser.Tweens.Tween

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    cannonBalls: Phaser.Physics.Arcade.Group,
  ) {
    super(scene, x, y)
    this.cannonBalls = cannonBalls

    this.sprite = this.createSprite()
    this.setSize(this.sprite.width, this.sprite.height)
      // This is needed because all characters have a pivot point of
      // bottom/center, which is not ideal for a floating, rotating object
      .setY(this.y - 0.5 * this.sprite.height)
      .add(this.sprite)
      .addPhysics()

    this.tween = this.scene.add.tween({
      targets: this,
      rotation: Phaser.Math.DegToRad(360),
      duration: ROTATION_INTERVAL,
      ease: 'Linear',
      repeat: 0,
      paused: true,
    })

    this.shootCannonBall()
  }

  preUpdate(time: number, deltaTime: number) {
    if (this.isDead) {
      if (isOffScreen(this)) {
        this.destroy()
      } else {
        this.setPosition(this.x, this.y + (FALL_SPEED * deltaTime) / 1000)
      }
    }
  }

  public setTarget = (target: Phaser.GameObjects.Container) => {
    this.target = target

    return this
  }

  public die = () => {
    this.isDead = true
    this.body.checkCollision.none = true
  }

  private shootCannonBall = () => {
    if (this.isDead) return

    if (this.target) {
      if (!this.target.active) {
        return
      }

      this.sprite.play(EyeAnimation.EYE_SHOOT_CANNON_BALL, true)
      this.tween
        .resume()
        .restart()
        .on('complete', () => {
          if (this.isDead || !this.target.active) return

          const direction = Math.sign(this.x - this.target.x)
          const targetAngle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            this.target.x,
            this.target.y,
          )

          const shootVector = new Phaser.Math.Vector2(
            -direction * CANNON_BALL_SPEED,
            CANNON_BALL_SPEED,
          ).setAngle(targetAngle)

          const cannonBall: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody =
            this.cannonBalls.get(
              this.x,
              this.y,
              ResourceKey.ENTITIES,
              'cannon-ball.png',
            )

          cannonBall
            .enableBody(false, 0, 0, true, true)
            .setVelocity(shootVector.x, shootVector.y)
            .setImmovable(true)
            .setDepth(LayerOrder.PROJECTILES)

          cannonBall.body.setAllowGravity(false).setFriction(0, 0)
          this.sprite.play(EyeAnimation.EYE_FLOAT, true)
        })
    }

    this.scene.time.addEvent({
      delay: SHOOT_INTERVAL,
      callback: this.shootCannonBall,
    })
  }

  private createSprite = () => {
    const sprite = this.scene.add.sprite(0, 0, ResourceKey.ENTITIES)

    sprite
      .play(EyeAnimation.EYE_FLOAT, true)
      .setPosition(0, 0.5 * sprite.height)

    return sprite
  }

  private addPhysics = () => {
    return this.scene.physics.add.existing(this, true)
  }
}
