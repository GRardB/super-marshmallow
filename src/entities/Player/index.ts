import Phaser from 'phaser'
import { ResourceKey } from '../../globals/ResourceKeys'
import { ExtendedCursorKeys } from '../../lib/input'
import { PlayerAnimation } from './animations'
import { PlayerState } from './state'

export enum PlayerEvent {
  DIE = 'DIE',
}

export class Player extends Phaser.GameObjects.Container {
  public body: Phaser.Physics.Arcade.Body
  private sprite: Phaser.GameObjects.Sprite
  private playerState: PlayerState
  private cursorKeys: ExtendedCursorKeys

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    cursorKeys: ExtendedCursorKeys,
  ) {
    super(scene, x, y)

    this.sprite = this.createSprite()
    this.setSize(this.sprite.width * 0.7, this.sprite.height * 0.75)

    this.addPhysics()

    this.add(this.sprite)

    this.cursorKeys = cursorKeys
    this.playerState = PlayerState.getDefault(this)
  }

  preUpdate(time: number, deltaTime: number) {
    this.playerState = this.playerState.handleInput(this.cursorKeys)
    this.playerState.update(time, deltaTime)
  }

  preDestroy() {
    this.emit(PlayerEvent.DIE)
  }

  public setFlipX = (value: boolean) => {
    this.sprite.setFlipX(value)

    return this
  }

  public getFlipX = () => {
    return this.sprite.flipX
  }

  public animate = (animationKey: PlayerAnimation) => {
    this.sprite.play(animationKey, true)
  }

  public bounce = () => {
    this.playerState.bounce()
  }

  public die = () => {
    this.playerState.die()
  }

  private createSprite = () => {
    return this.scene.add
      .sprite(0, 0, ResourceKey.ENTITIES)
      .play(PlayerAnimation.STAND)
  }

  private addPhysics = () => {
    this.scene.physics.add.existing(this)

    this.body.setOffset(0, -this.height * 0.5).setCollideWorldBounds(true)
    this.body.onWorldBounds = true
  }
}
