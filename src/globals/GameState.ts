import Phaser from 'phaser'

const COINS_FOR_EXTRA_LIFE = 15
export const DEFAULT_NUM_LIVES = 3

export enum GameStateEvent {
  COINS_UPDATE = 'COINS_UPDATE',
  LIVES_UPDATE = 'LIVES_UPDATE',
  SCORE_UPDATE = 'SCORE_UPDATE',
  TIME_UPDATE = 'TIME_UPDATE',
}

export class GameState extends Phaser.Events.EventEmitter {
  private numCoins: number
  private numLives: number
  private score: number
  private time: number

  constructor() {
    super()

    this.numLives = DEFAULT_NUM_LIVES
    this.numCoins = 0
    this.score = 0
    this.time = 0
  }

  public on = (event: GameStateEvent, fn: Function, context?: any) => {
    super.on(event, fn, context)

    switch (event) {
      case GameStateEvent.COINS_UPDATE:
        this.emit(GameStateEvent.COINS_UPDATE, this.numCoins)
        break
      case GameStateEvent.LIVES_UPDATE:
        this.emit(GameStateEvent.LIVES_UPDATE, this.numLives)
        break
      case GameStateEvent.SCORE_UPDATE:
        this.emit(GameStateEvent.SCORE_UPDATE, this.score)
        break
      case GameStateEvent.TIME_UPDATE:
        this.emit(GameStateEvent.TIME_UPDATE, this.time)
        break
    }

    return this
  }

  public incrementLives = () => {
    this.numLives++
    this.emit(GameStateEvent.LIVES_UPDATE, this.numLives)
  }

  public decrementLives = () => {
    this.numLives--
    this.emit(GameStateEvent.LIVES_UPDATE, this.numLives)
  }

  public getNumLives = () => this.numLives

  public incrementCoins = () => {
    this.numCoins++

    if (this.numCoins >= COINS_FOR_EXTRA_LIFE) {
      this.numCoins = 0
      this.incrementLives()
    }

    this.emit(GameStateEvent.COINS_UPDATE, this.numCoins)
  }

  public addToScore = (addendum: number) => {
    this.score += addendum

    this.emit(GameStateEvent.SCORE_UPDATE, this.score)
  }

  public addToTime = (numSeconds: number) => {
    this.time += numSeconds

    this.emit(GameStateEvent.TIME_UPDATE, this.time)
  }
}
