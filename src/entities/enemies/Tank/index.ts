import Phaser from 'phaser'
import { TankAnimation } from './animations'
import { MAP_TILE_SIZE } from '../../../globals/Map'
import { ResourceKey } from '../../../globals/ResourceKeys'
import { isOffScreen } from '../../../lib/util'
import { Killable } from '../../Killable'
import { LayerOrder } from '../../../globals/LayerOrder'
import { AtlasFrames } from '../../../globals/AtlasFrames'

const JUMP_SPEED = 50
const DRIVE_SPEED = 0.5 * MAP_TILE_SIZE
const FOLLOW_DISTANCE = 75
const SHOOT_DISTANCE = 150
const SHOOT_INTERVAL = 1.5 * 1000
const SMOKE_OFFSET_X = 3
const SMOKE_ROTATE_DURATION = 1 * 1000
const MISSILE_SPEED = 4 * MAP_TILE_SIZE
const MISSILE_OFFSET_X = -0.75 * MAP_TILE_SIZE
const MISSILE_OFFSET_Y = -0.5 * MAP_TILE_SIZE - 2
const SCORE_VALUE = 80

export class Tank extends Phaser.GameObjects.Container implements Killable {
  public body: Phaser.Physics.Arcade.Body
  public head: Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
  private sprite: Phaser.GameObjects.Sprite
  private isDead = false
  private target: Phaser.GameObjects.Container
  private missiles: Phaser.Physics.Arcade.Group

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    missiles: Phaser.Physics.Arcade.Group,
  ) {
    super(scene, x, y)
    this.missiles = missiles

    this.sprite = this.createSprite()
    this.setSize(this.sprite.width, this.sprite.height * 0.6)

    this.addPhysics()

    this.add(this.sprite)

    this.shootMissile()
  }

  preUpdate() {
    if (this.isDead && isOffScreen(this)) {
      this.destroy()
      this.head.destroy()
    } else {
      this.move()
    }
  }

  public getScoreValue = () => SCORE_VALUE

  public follow = (target: Phaser.GameObjects.Container) => {
    this.target = target

    return this
  }

  public die = () => {
    this.isDead = true
    this.head.body.checkCollision.none = true
    this.body.checkCollision.none = true
    this.body.setCollideWorldBounds(false).setVelocity(0, -JUMP_SPEED)
  }

  private shootMissile = () => {
    if (this.isDead) return

    if (this.target) {
      if (!this.target.active) {
        this.stop()
        return
      }

      const displacement = this.getTargetDisplacement()

      if (Math.abs(displacement) <= SHOOT_DISTANCE) {
        const direction = Math.sign(displacement)

        const x = this.x + direction * MISSILE_OFFSET_X
        const y = this.y + MISSILE_OFFSET_Y
        const isFlipped = displacement < 0

        const smoke = this.scene.add
          .sprite(x + direction * SMOKE_OFFSET_X, y, ResourceKey.ENTITIES)
          .setDepth(LayerOrder.PROJECTILES)
        const smokeTween = this.scene.tweens.add({
          targets: smoke,
          rotation: Phaser.Math.DegToRad(360),
          duration: SMOKE_ROTATE_DURATION,
          ease: 'Linear',
          repeat: 0,
        })

        smoke
          .play(TankAnimation.TANK_LAUNCH_MISSLE, true)
          .on('animationcomplete', () => {
            smoke.destroy()
            smokeTween.stop()
          })

        const missile: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody =
          this.missiles.get(x, y, ResourceKey.ENTITIES, AtlasFrames.MISSILE)

        missile
          .enableBody(false, 0, 0, true, true)
          .setFlipX(isFlipped)
          .setVelocity(-direction * MISSILE_SPEED, 0)
          .setImmovable(true)
          .setDepth(LayerOrder.PROJECTILES)

        missile.body.setAllowGravity(false)
      }
    }

    this.scene.time.addEvent({
      delay: SHOOT_INTERVAL,
      callback: this.shootMissile,
    })
  }

  private move = () => {
    if (this.isDead || !this.target?.active) return

    const displacement = this.getTargetDisplacement()

    this.sprite.setFlipX(displacement < 0)
    if (Math.abs(displacement) > FOLLOW_DISTANCE) {
      this.sprite.play(TankAnimation.TANK_DRIVE, true)
      this.body.setVelocityX(Math.sign(displacement) * -DRIVE_SPEED)
    } else {
      this.stop()
    }
  }

  private stop = () => {
    this.sprite.stop()
    this.body.setVelocityX(0)
  }

  private getTargetDisplacement = () => {
    if (!this.target) return Infinity

    return this.x - this.target.x
  }

  private createSprite = () => {
    const sprite = this.scene.add.sprite(0, 0, ResourceKey.ENTITIES).setDepth(1)

    sprite.play(TankAnimation.TANK_DRIVE, true)

    const head = this.scene.add
      .rectangle(0, -sprite.height + 5, 10, 10, 0, 0)
      .setDepth(100)
      .setData('parent', this)

    this.head = this.scene.physics.add.existing(
      head,
    ) as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
    this.head.body.setAllowGravity(false).setImmovable(true)
    this.head.parentContainer = this

    this.add(head)

    return sprite
  }

  private addPhysics = () => {
    this.scene.physics.add.existing(this)

    this.body.setOffset(0, -this.height * 0.5).setCollideWorldBounds(true)
  }
}
