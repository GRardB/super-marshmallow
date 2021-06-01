import Phaser from 'phaser'
import { CactusAnimation } from './animations'
import { MAP_TILE_SIZE } from '../../../globals/Map'
import { ResourceKey } from '../../../globals/ResourceKeys'
import { isOffScreen } from '../../../lib/util'
import { Killable } from '../../Killable'
import { AtlasFrames } from '../../../globals/AtlasFrames'
import { LayerOrder } from '../../../globals/LayerOrder'

const JUMP_SPEED = 100
const WALK_SPEED = 2 * MAP_TILE_SIZE
const MOVEMENT_INTERVAL = 3 * 1000

export class Cactus extends Phaser.GameObjects.Container implements Killable {
  public body: Phaser.Physics.Arcade.Body
  private sprite: Phaser.GameObjects.Sprite
  private health = 2
  private cactusTops: Phaser.Physics.Arcade.Group

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    cactusTops: Phaser.Physics.Arcade.Group,
  ) {
    super(scene, x, y)
    this.cactusTops = cactusTops

    this.sprite = this.createSprite()
    this.setSize(this.sprite.width, this.sprite.height)

    this.addPhysics()

    this.add(this.sprite)

    this.walk()
  }

  preUpdate() {
    if (this.isDead() && isOffScreen(this)) {
      this.destroy()
    }
  }

  public die = () => {
    this.health--

    if (this.isDead()) {
      this.sprite.play(CactusAnimation.CACTUS_DIE, true)
      this.body.checkCollision.none = true
      this.body.setCollideWorldBounds(false).setVelocity(0, -JUMP_SPEED)
    } else if (this.health === 1) {
      this.breakInHalf()
    }
  }

  private breakInHalf = () => {
    this.cactusTops
      .get(this.x, this.body.y, ResourceKey.ENTITIES, AtlasFrames.CACTUS_TOP)
      .setFlipX(this.sprite.flipX)
      .setOrigin(0.5, 0)
      .setDepth(LayerOrder.CHARACTERS)

    this.sprite.play(CactusAnimation.CACTUS_HALF_WALK, true)
    this.setSize(this.sprite.width, this.sprite.height)
    this.body
      .setOffset(0, -this.height * 0.5)
      .setSize(this.sprite.width, this.sprite.height)
  }

  private walk = () => {
    if (this.isDead()) return

    this.sprite.setFlipX(Math.random() > 0.5)

    const direction = this.sprite.flipX ? 1 : -1

    this.body.setVelocityX(direction * WALK_SPEED)

    this.scene.time.addEvent({
      delay: MOVEMENT_INTERVAL,
      callback: this.walk,
    })
  }

  private isDead = () => this.health === 0

  private createSprite = () => {
    const sprite = this.scene.add.sprite(0, 0, ResourceKey.ENTITIES)

    sprite.play(CactusAnimation.CACTUS_FULL_WALK)

    return sprite
  }

  private addPhysics = () => {
    this.scene.physics.add.existing(this)

    this.body.setOffset(0, -this.height * 0.5).setCollideWorldBounds(true)
  }
}
