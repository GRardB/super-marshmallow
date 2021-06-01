import { Coin } from '../entities/Coin'
import { Player } from '../entities/Player'

export const handleCoinPlayerCollision = (player: Player, coin: Coin) => {
  coin.collect()
}
