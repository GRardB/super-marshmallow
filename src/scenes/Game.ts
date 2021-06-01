import Phaser from 'phaser'
import { ResourceKey } from '../globals/ResourceKeys'
import { SceneKey } from '../globals/SceneKeys'
import { MapKeys } from '../globals/Map'
import { Player } from '../entities/Player'
import { groupBy } from '../lib/util'
import { Coin } from '../entities/Coin'
import { createColliders } from '../colliders'
import {
  Cactus,
  Daikon,
  Jelly,
  Soldier,
  Squash,
  Tank,
  Eye,
  Radish,
  FlyingRadish,
} from '../entities/enemies'
import { LayerOrder } from '../globals/LayerOrder'
import { createCursorKeys, ExtendedCursorKeys } from '../lib/input'
import { createSpawner } from '../lib/spawner'
import { mapObjectTypeToFrame } from '../globals/AtlasFrames'

const HUD_HEIGHT = 16
const CAMERA_X_OFFSET_PERCENT = 0.1
const CAMERA_DEADZONE_PERCENT = 0.05
const DESPAWN_ZONE_MARGIN = 20

export class Game extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap
  private cursorKeys: ExtendedCursorKeys
  private player: Player
  private despawnZone: Phaser.Physics.Arcade.StaticGroup
  private spawnEnemiesInRange: () => void

  constructor() {
    super(SceneKey.GAME)
  }

  create() {
    const { map, ground } = this.createMap()
    this.map = map

    this.setBackground(this.map.widthInPixels)
    this.cursorKeys = createCursorKeys(this)

    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels,
    )

    this.player = this.createPlayer()

    this.despawnZone = this.createDespawnZone()
    const cactusTops = this.physics.add.group()
    const backgroundPlatforms = this.createBackgroundPlatforms()
    const enemyLedgeColliders = this.createEnemyLedgeColliders()
    const moveablePlatforms = this.createMoveablePlatforms()
    const missiles = this.physics.add.group()
    const cannonBalls = this.physics.add.group()
    const enemies = this.createEnemies({
      cannonBalls,
      cactusTops,
      missiles,
      player: this.player,
    })
    const coins = this.createCoins()

    createColliders(this, {
      backgroundPlatforms,
      cannonBalls,
      cactusTops,
      coins,
      despawnZone: this.despawnZone,
      enemies,
      enemyLedgeColliders,
      ground,
      missiles,
      moveablePlatforms,
      player: this.player,
    })

    this.setUpCamera()

    this.spawnEnemiesInRange = createSpawner(this, enemies)

    this.createMessages()
  }

  update() {
    this.spawnEnemiesInRange()
    this.updateDespawnZonePosition()
  }

  private updateDespawnZonePosition = () => {
    const diff =
      this.cameras.main.worldView.left -
      this.despawnZone.getChildren()[0].body.position.x -
      DESPAWN_ZONE_MARGIN

    this.despawnZone.children.each(({ body }) => (body.position.x += diff))
  }

  private createMap = () => {
    const map = this.make.tilemap({
      key: ResourceKey.LEVEL_1,
    })

    const tileset = map.addTilesetImage(
      MapKeys.TILESET_NAME,
      ResourceKey.MAP_TILES,
    )

    map.createLayer(MapKeys.WATER, tileset).setDepth(LayerOrder.MAP_TILES)

    const ground = map
      .createLayer(MapKeys.GROUND, tileset)
      .setDepth(LayerOrder.MAP_TILES)
      .setCollisionByProperty({ collides: true })

    map
      .createLayer(MapKeys.DECORATIONS, tileset)
      .setDepth(LayerOrder.MAP_DECORATIONS)

    return { map, ground }
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

  private createBackgroundPlatforms = () => {
    const platforms = this.physics.add.staticGroup(
      this.map
        .getObjectLayer(MapKeys.BACKGROUND_PLATFORM_COLLIDERS)
        .objects.map(({ x, y, width, height }) => {
          return this.add.rectangle(x, y, width, height, 0, 0).setOrigin(0, 0)
        }),
    )

    platforms.children.each((platform) => {
      const body = platform.body as Phaser.Physics.Arcade.Body
      body.checkCollision.left = false
      body.checkCollision.right = false
      body.checkCollision.down = false
    })

    return platforms
  }

  private createEnemyLedgeColliders = () => {
    const enemyLedgeColliders = this.physics.add.staticGroup(
      this.map
        .getObjectLayer(MapKeys.ENEMY_LEDGE_COLLIDERS)
        .objects.map(({ x, y, width, height }) => {
          return this.add.rectangle(x, y, width, height, 0, 0).setOrigin(0, 0)
        }),
    )

    return enemyLedgeColliders
  }

  private createMoveablePlatforms = () => {
    const moveablePlatforms = this.physics.add
      .staticGroup(
        this.map
          .getObjectLayer(MapKeys.MOVABLE_PLATFORMS)
          .objects.map(({ x, y, type }) => {
            return this.add
              .sprite(x, y, ResourceKey.MAP_TILES, mapObjectTypeToFrame(type))
              .setOrigin(0, 1)
          }),
      )
      .setDepth(LayerOrder.MAP_TILES)

    moveablePlatforms.children.each(
      // @ts-ignore
      (moveablePlatform: Phaser.Physics.Arcade.Sprite) => {
        moveablePlatform.body
          .setSize(moveablePlatform.width, 0.5 * moveablePlatform.height)
          .setOffset(0, 0)
      },
    )

    return moveablePlatforms
  }

  private setBackground = (width: number) => {
    this.add
      .tileSprite(
        0,
        HUD_HEIGHT,
        width,
        this.scale.height - HUD_HEIGHT,
        ResourceKey.BACKGROUND_1,
      )
      .setOrigin(0, 0)
      .setDepth(LayerOrder.BACKGROUND)
  }

  private createPlayer = () => {
    const { x, y } = this.map
      .getObjectLayer(MapKeys.SPAWN_POINTS)
      .objects.find((object) => object.type === MapKeys.PLAYER_SPAWN)

    const player = new Player(this, x, y, this.cursorKeys)

    this.add.existing(player).setDepth(LayerOrder.CHARACTERS)

    return player
  }

  private createEnemies = ({
    cactusTops,
    missiles,
    cannonBalls,
    player,
  }: {
    cactusTops: Phaser.Physics.Arcade.Group
    missiles: Phaser.Physics.Arcade.Group
    cannonBalls: Phaser.Physics.Arcade.Group
    player: Player
  }) => {
    const spawnPoints = groupBy(
      this.map.getObjectLayer(MapKeys.SPAWN_POINTS).objects,
      'type',
    )

    return this.add
      .group()
      .addMultiple(
        (spawnPoints[MapKeys.TANK_SPAWN] || []).map(({ x, y }) => {
          const tank = new Tank(this, x, y, missiles)
          tank.follow(player)

          return this.add.existing(tank)
        }),
      )
      .addMultiple(
        (spawnPoints[MapKeys.DAIKON_SPAWN] || []).map(({ x, y }) =>
          this.add.existing(new Daikon(this, x, y)),
        ),
      )
      .addMultiple(
        (spawnPoints[MapKeys.SQUASH_SPAWN] || []).map(({ x, y }) =>
          this.add.existing(new Squash(this, x, y)),
        ),
      )
      .addMultiple(
        (spawnPoints[MapKeys.JELLY_SPAWN] || []).map(({ x, y }) =>
          this.add.existing(new Jelly(this, x, y)),
        ),
      )
      .addMultiple(
        (spawnPoints[MapKeys.SOLDIER_SPAWN] || []).map(({ x, y }) =>
          this.add.existing(new Soldier(this, x, y)),
        ),
      )
      .addMultiple(
        (spawnPoints[MapKeys.RADISH_SPAWN] || []).map(({ x, y }) =>
          this.add.existing(new Radish(this, x, y)),
        ),
      )
      .addMultiple(
        (spawnPoints[MapKeys.FLYING_RADISH_SPAWN] || []).map(({ x, y }) =>
          this.add.existing(new FlyingRadish(this, x, y)),
        ),
      )
      .addMultiple(
        (spawnPoints[MapKeys.CACTUS_SPAWN] || []).map(({ x, y }) =>
          this.add.existing(new Cactus(this, x, y, cactusTops)),
        ),
      )
      .addMultiple(
        (spawnPoints[MapKeys.EYE_SPAWN] || []).map(({ x, y }) => {
          const eye = new Eye(this, x, y, cannonBalls)
          eye.setTarget(player)

          return this.add.existing(eye)
        }),
      )
      .setDepth(LayerOrder.CHARACTERS)
  }

  private createCoins = () => {
    return this.physics.add
      .staticGroup(
        this.map
          .getObjectLayer(MapKeys.COINS)
          .objects.map(({ x, y }) => this.add.existing(new Coin(this, x, y))),
      )
      .setDepth(LayerOrder.COINS)
  }

  private createMessages = () => {
    this.map
      .getObjectLayer(MapKeys.MESSAGES)
      .objects.forEach(({ x, y, text, type }) => {
        if (text) {
          const element = this.add.dom(x, y, 'p', null, text.text)
          element.setPosition(x + 0.5 * element.width, y + 0.5 * element.height)
        } else {
          this.add
            .image(x, y, ResourceKey.KEYS, mapObjectTypeToFrame(type))
            .setDepth(LayerOrder.MESSAGES)
        }
      })
  }

  private setUpCamera = () => {
    this.cameras.main.startFollow(
      this.player,
      false,
      1,
      1,
      -CAMERA_X_OFFSET_PERCENT * this.scale.width,
    )
    this.cameras.main.setDeadzone(CAMERA_DEADZONE_PERCENT * this.scale.width)
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels,
    )
  }
}
