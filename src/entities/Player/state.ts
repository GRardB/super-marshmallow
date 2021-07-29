import { Player } from '.'
import { MAP_TILE_SIZE } from '../../globals/Map'
import { ExtendedCursorKeys } from '../../lib/input'
import { Direction } from '../../types/Direction'
import { PlayerAnimation } from './animations'
import { isOffScreen } from '../../lib/util'

const WALK_SPEED = 3 * MAP_TILE_SIZE
const RUN_SPEED = 2 * WALK_SPEED
const JUMP_SPEED = 200
const BOUNCE_SPEED = 0.5 * JUMP_SPEED

export enum PlayerEvent {
  DIE = 'DIE',
}

export abstract class PlayerState {
  protected player: Player
  protected forceState: () => PlayerState

  constructor(player: Player) {
    this.player = player
  }

  public static getDefault(player: Player): PlayerState {
    return new PlayerStanding(player).enter()
  }

  public abstract enter(): this
  public abstract handleInput(input: ExtendedCursorKeys): PlayerState
  public abstract update(time?: number, deltaTime?: number): void

  public bounce() {
    const nextState = new PlayerJumping(this.player)
    this.forceState = nextState.enter.bind(nextState, BOUNCE_SPEED)
  }

  public die() {
    const nextState = new PlayerDead(this.player)
    this.forceState = nextState.enter.bind(nextState)
  }
}

class PlayerStanding extends PlayerState {
  public enter(): this {
    this.player.animate(PlayerAnimation.STAND)
    this.player.body.setVelocity(0, 0)

    return this
  }

  public handleInput(input: ExtendedCursorKeys): PlayerState {
    if (this.forceState) return this.forceState()

    if (isWalking(input)) {
      return new PlayerWalking(this.player, input).enter()
    }

    if (isRunning(input)) {
      return new PlayerRunning(this.player, input).enter()
    }

    if (isJumping(input)) {
      return new PlayerJumping(this.player).enter()
    }

    if (this.player.body.velocity.y > 0) {
      return new PlayerFalling(this.player).enter()
    }

    return this
  }

  update() {}
}

class PlayerWalking extends PlayerState {
  private direction: Direction

  constructor(player: Player, input: ExtendedCursorKeys) {
    super(player)
    this.direction = isLeft(input) ? Direction.LEFT : Direction.RIGHT
  }

  public enter(): this {
    this.player.animate(PlayerAnimation.WALK)

    return this
  }

  public handleInput(input: ExtendedCursorKeys): PlayerState {
    if (this.forceState) return this.forceState()

    if (isStanding(input)) {
      return new PlayerStanding(this.player).enter()
    }

    if (isLeft(input)) {
      this.direction = Direction.LEFT
    } else if (isRight(input)) {
      this.direction = Direction.RIGHT
    }

    if (isRunning(input)) {
      return new PlayerRunning(this.player, input).enter()
    }

    if (isJumping(input)) {
      return new PlayerJumping(this.player).enter()
    }

    if (this.player.body.velocity.y > 0) {
      return new PlayerFalling(this.player).enter()
    }

    return this
  }

  public update() {
    this.player.setFlipX(this.direction === Direction.LEFT)
    this.player.body.setVelocity(
      this.direction === Direction.LEFT ? -WALK_SPEED : WALK_SPEED,
      0,
    )
  }
}

class PlayerRunning extends PlayerState {
  private direction: Direction

  constructor(player: Player, input: ExtendedCursorKeys) {
    super(player)
    this.direction = isLeft(input) ? Direction.LEFT : Direction.RIGHT
  }

  public enter(): this {
    this.player.animate(PlayerAnimation.RUN)

    return this
  }

  public handleInput(input: ExtendedCursorKeys): PlayerState {
    if (this.forceState) return this.forceState()

    if (isStanding(input)) {
      return new PlayerStanding(this.player).enter()
    }

    if (isLeft(input)) {
      this.direction = Direction.LEFT
    } else if (isRight(input)) {
      this.direction = Direction.RIGHT
    }

    if (isWalking(input)) {
      return new PlayerWalking(this.player, input).enter()
    }

    if (isJumping(input)) {
      return new PlayerJumping(this.player).enter()
    }

    if (this.player.body.velocity.y > 0) {
      return new PlayerFalling(this.player).enter()
    }

    return this
  }

  public update() {
    this.player.setFlipX(this.direction === Direction.LEFT)
    this.player.body.setVelocity(
      this.direction === Direction.LEFT ? -RUN_SPEED : RUN_SPEED,
      0,
    )
  }
}

class PlayerJumping extends PlayerState {
  private direction: Direction
  private isMovingHorizontally: boolean
  private isFast: boolean

  public enter(speed: number = JUMP_SPEED): this {
    this.player.animate(PlayerAnimation.JUMP)
    this.direction = this.player.getFlipX() ? Direction.LEFT : Direction.RIGHT
    this.isMovingHorizontally = false
    this.isFast = false
    this.player.body.setVelocityY(-speed)

    return this
  }

  public handleInput(input: ExtendedCursorKeys): PlayerState {
    if (this.forceState) return this.forceState()

    if (this.player.body.velocity.y >= 0) {
      return new PlayerFalling(this.player).enter()
    }

    this.isFast = input.shift.isDown
    if (isLeft(input)) {
      this.direction = Direction.LEFT
      this.isMovingHorizontally = true
    } else if (isRight(input)) {
      this.isMovingHorizontally = true
      this.direction = Direction.RIGHT
    } else {
      this.isMovingHorizontally = false
    }

    return this
  }

  public update() {
    this.player.setFlipX(this.direction === Direction.LEFT)

    if (this.isMovingHorizontally) {
      const speed = this.isFast ? RUN_SPEED : WALK_SPEED
      this.player.body.setVelocityX(
        this.direction === Direction.LEFT ? -speed : speed,
      )
    } else {
      this.player.body.setVelocityX(0)
    }
  }
}

class PlayerFalling extends PlayerState {
  private direction: Direction
  private isMovingHorizontally: boolean
  private isFast: boolean

  public enter(): this {
    this.player.animate(PlayerAnimation.JUMP)
    this.direction = this.player.getFlipX() ? Direction.LEFT : Direction.RIGHT
    this.isMovingHorizontally = false
    this.isFast = false

    return this
  }

  public handleInput(input: ExtendedCursorKeys): PlayerState {
    if (this.forceState) return this.forceState()

    if (this.player.body.blocked.down) {
      if (isStanding(input)) {
        return new PlayerStanding(this.player).enter()
      }

      if (isWalking(input)) {
        return new PlayerWalking(this.player, input).enter()
      }

      if (isRunning(input)) {
        return new PlayerRunning(this.player, input).enter()
      }

      if (isJumping(input)) {
        return new PlayerJumping(this.player).enter()
      }
    }

    this.isFast = input.shift.isDown
    if (isLeft(input)) {
      this.direction = Direction.LEFT
      this.isMovingHorizontally = true
    } else if (isRight(input)) {
      this.isMovingHorizontally = true
      this.direction = Direction.RIGHT
    } else {
      this.isMovingHorizontally = false
    }

    return this
  }

  public update() {
    this.player.setFlipX(this.direction === Direction.LEFT)

    if (this.isMovingHorizontally) {
      const speed = this.isFast ? RUN_SPEED : WALK_SPEED
      this.player.body.setVelocityX(
        this.direction === Direction.LEFT ? -speed : speed,
      )
    } else {
      this.player.body.setVelocityX(0)
    }
  }
}

class PlayerDead extends PlayerState {
  public enter(): this {
    this.player.animate(PlayerAnimation.DIE)

    this.player.body.checkCollision.none = true
    this.player.body
      .setCollideWorldBounds(false)
      .setAccelerationY(0)
      .setVelocity(0, -JUMP_SPEED)

    return this
  }

  public handleInput(): PlayerState {
    return this
  }

  public update() {
    if (isOffScreen(this.player)) {
      this.player.emit(PlayerEvent.DIE)
      this.player.destroy()
    }
  }
}

const isStanding = (input: ExtendedCursorKeys) => {
  return !isJumping(input) && !isLeft(input) && !isRight(input)
}

const isJumping = (input: ExtendedCursorKeys) => {
  const { w, up, space } = input
  return w.isDown || up.isDown || space.isDown
}

const isWalking = (input: ExtendedCursorKeys) => {
  return (
    input.shift.isUp && !isJumping(input) && (isLeft(input) || isRight(input))
  )
}

const isRunning = (input: ExtendedCursorKeys) => {
  return (
    input.shift.isDown && !isJumping(input) && (isLeft(input) || isRight(input))
  )
}

const isLeft = (input: ExtendedCursorKeys) => {
  return input.a.isDown || input.left.isDown
}

const isRight = (input: ExtendedCursorKeys) => {
  return input.d.isDown || input.right.isDown
}
