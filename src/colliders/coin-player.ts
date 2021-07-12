import { Coin } from '../entities/Coin'
import { Player } from '../entities/Player'
import { GameState } from '../globals/GameState'

const COIN_SCORE_VALUE = 1

export const handleCoinPlayerCollision = (
  gameState: GameState,
  _player: Player,
  coin: Coin,
) => {
  ;(coin.body as Phaser.Physics.Arcade.StaticBody).enable = false
  gameState.addToScore(COIN_SCORE_VALUE)
  gameState.incrementCoins()
  coin.collect()
}
