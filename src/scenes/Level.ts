import Phaser from 'phaser'
import { SceneKey } from '../globals/SceneKeys'
import { Player, PlayerEvent } from '../entities/Player'
import { createColliders } from '../colliders'
import { createCursorKeys, ExtendedCursorKeys } from '../lib/input'
import { createSpawner } from '../lib/spawner'
import { GameState, GameStateEvent } from '../globals/GameState'
import { HUD } from '../ui/HUD'
import { setUpLevel } from '../lib/level'

const DESPAWN_ZONE_MARGIN = 20

interface LevelConfig {
  gameState: GameState | null
  level: number
}

export class Level extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap
  private cursorKeys: ExtendedCursorKeys
  private player: Player
  private despawnZone: Phaser.Physics.Arcade.StaticGroup
  private spawnEnemiesInRange: () => void
  private gameState: GameState
  private hud: HUD

  constructor() {
    super(SceneKey.LEVEL)
  }

  init({ gameState, level = 1 }: LevelConfig) {
    this.gameState = gameState || new GameState()
  }

  create() {
    this.hud = this.createHUD()

    this.cursorKeys = createCursorKeys(this)

    const {
      backgroundPlatforms,
      cannonBalls,
      cactusTops,
      coins,
      enemies,
      map,
      enemyLedgeColliders,
      ground,
      missiles,
      moveablePlatforms,
      player,
    } = setUpLevel(this, this.cursorKeys)

    this.map = map
    this.player = player
    this.despawnZone = this.createDespawnZone()

    createColliders(this, {
      backgroundPlatforms,
      cannonBalls,
      cactusTops,
      coins,
      despawnZone: this.despawnZone,
      enemies,
      enemyLedgeColliders,
      gameState: this.gameState,
      ground,
      missiles,
      moveablePlatforms,
      player: this.player,
    })

    this.spawnEnemiesInRange = createSpawner(this, enemies)

    this.player.on(PlayerEvent.DIE, this.restartLevel)
  }

  update() {
    this.spawnEnemiesInRange()
    this.updateDespawnZonePosition()
  }

  private restartLevel = () => {
    this.gameState.off(GameStateEvent.COINS_UPDATE, this.hud.updateCoins)
    this.gameState.off(GameStateEvent.LIVES_UPDATE, this.hud.updateLives)
    this.gameState.off(GameStateEvent.SCORE_UPDATE, this.hud.updateScore)
    this.gameState.off(GameStateEvent.TIME_UPDATE, this.hud.updateTime)
    this.time.removeAllEvents()

    if (this.gameState.getNumLives() > 0) {
      this.scene.restart({ gameState: this.gameState })
    } else {
      this.scene.start(SceneKey.GAME_OVER)
    }
  }

  private updateDespawnZonePosition = () => {
    const diff =
      this.cameras.main.worldView.left -
      this.despawnZone.getChildren()[0].body.position.x -
      DESPAWN_ZONE_MARGIN

    this.despawnZone.children.each(({ body }) => (body.position.x += diff))
  }

  private createHUD = () => {
    const hud = this.add.existing(new HUD(this, 0, 0))
    this.gameState.on(GameStateEvent.COINS_UPDATE, hud.updateCoins)
    this.gameState.on(GameStateEvent.LIVES_UPDATE, hud.updateLives)
    this.gameState.on(GameStateEvent.SCORE_UPDATE, hud.updateScore)
    this.gameState.on(GameStateEvent.TIME_UPDATE, hud.updateTime)

    this.time.addEvent({
      callback: this.gameState.addToTime.bind(null, 1),
      delay: 1000,
      repeat: -1,
    })

    return hud
  }

  private createDespawnZone = () => {
    const despawnZoneHeight = this.scale.height + 2 * DESPAWN_ZONE_MARGIN
    const despawnZoneWidth = this.scale.width + 2 * DESPAWN_ZONE_MARGIN

    const left = {
      x: -DESPAWN_ZONE_MARGIN,
      y: -DESPAWN_ZONE_MARGIN,
      width: 1,
      height: despawnZoneHeight,
    }
    const top = {
      x: -DESPAWN_ZONE_MARGIN,
      y: -DESPAWN_ZONE_MARGIN,
      width: despawnZoneWidth,
      height: 1,
    }
    const bottom = {
      x: -DESPAWN_ZONE_MARGIN,
      y: despawnZoneHeight,
      width: despawnZoneWidth,
      height: 1,
    }
    const right = {
      x: despawnZoneWidth,
      y: -DESPAWN_ZONE_MARGIN,
      width: 1,
      height: despawnZoneHeight,
    }

    return this.physics.add.staticGroup().addMultiple(
      [left, top, bottom, right].map(({ x, y, width, height }) => {
        return this.add.rectangle(x, y, width, height, 0, 0).setOrigin(0, 0)
      }),
    )
  }
}
