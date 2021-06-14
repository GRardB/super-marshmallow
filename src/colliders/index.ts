import Phaser from 'phaser'
import { Player } from '../entities/Player'
import {
  handleDespawnZoneCollisionDeactivation,
  handleDespawnZoneCollisionDestruction,
} from './despawn-zone'
import { handleEnemyPlayerCollision } from './enemy-player'
import { handleCoinPlayerCollision } from './coin-player'
import { Tank } from '../entities/enemies/Tank'
import { handlePlayerTankHeadCollision } from './player-tank-head'
import { handleMissilePlayerCollision } from './missile-player'
import { handleCannonBallPlayerCollision } from './cannon-ball-player'
import { handleMoveablePlatformPlayerCollision } from './moveable-platform-player'
import { Squash } from '../entities/enemies'
import { GameState } from '../globals/GameState'
import { handlePlayerOutOfBounds } from './bounds-player'

interface CollidableGameObjects {
  backgroundPlatforms: Phaser.Physics.Arcade.StaticGroup
  cannonBalls: Phaser.Physics.Arcade.Group
  cactusTops: Phaser.Physics.Arcade.Group
  coins: Phaser.Physics.Arcade.StaticGroup
  despawnZone: Phaser.Physics.Arcade.StaticGroup
  enemies: Phaser.GameObjects.Group
  enemyLedgeColliders: Phaser.Physics.Arcade.StaticGroup
  gameState: GameState
  ground: Phaser.Tilemaps.TilemapLayer
  missiles: Phaser.Physics.Arcade.Group
  moveablePlatforms: Phaser.Physics.Arcade.StaticGroup
  player: Player
}

export const createColliders = (
  scene: Phaser.Scene,
  {
    backgroundPlatforms,
    cannonBalls,
    cactusTops,
    coins,
    despawnZone,
    enemies,
    enemyLedgeColliders,
    gameState,
    ground,
    missiles,
    moveablePlatforms,
    player,
  }: CollidableGameObjects,
) => {
  scene.physics.add.collider(enemies, ground)
  scene.physics.add.collider(enemies, enemyLedgeColliders)

  scene.physics.add.collider(player, ground)

  scene.physics.add.collider(enemies, backgroundPlatforms)
  scene.physics.add.collider(player, backgroundPlatforms)

  scene.physics.add.collider(enemies, moveablePlatforms)
  scene.physics.add.collider(
    player,
    moveablePlatforms,
    // @ts-ignore
    handleMoveablePlatformPlayerCollision.bind(null, gameState, enemies),
  )

  scene.physics.add.collider(
    cannonBalls,
    player,
    // @ts-ignore
    handleCannonBallPlayerCollision,
  )

  // @ts-ignore
  scene.physics.add.collider(missiles, player, handleMissilePlayerCollision)

  // @ts-ignore
  scene.physics.add.overlap(
    coins,
    player,
    handleCoinPlayerCollision.bind(null, gameState),
  )

  // @ts-ignore
  scene.physics.add.overlap(
    enemies,
    player,
    handleEnemyPlayerCollision.bind(null, gameState),
  )

  scene.physics.world.on('worldbounds', (body, _up, down, _left, _right) => {
    if (body === player.body) {
      handlePlayerOutOfBounds(gameState, player, down)
    }
  })

  const tanks = scene.add.group(
    enemies.getChildren().filter((enemy) => enemy instanceof Tank),
  )
  const tankHeads = tanks.getChildren().map((tank) => (tank as Tank).head)
  // @ts-ignore
  scene.physics.add.collider(player, tankHeads, handlePlayerTankHeadCollision)

  const squashes = scene.add.group(
    enemies.getChildren().filter((enemy) => enemy instanceof Squash),
  )
  scene.physics.add.collider(squashes, squashes)

  // DESPAWN ZONE
  scene.physics.add.overlap(
    despawnZone,
    missiles,
    // @ts-ignore
    handleDespawnZoneCollisionDeactivation,
  )
  scene.physics.add.overlap(
    despawnZone,
    cactusTops,
    handleDespawnZoneCollisionDestruction,
  )
  scene.physics.add.overlap(
    despawnZone,
    cannonBalls,
    // @ts-ignore
    handleDespawnZoneCollisionDeactivation,
  )
}
