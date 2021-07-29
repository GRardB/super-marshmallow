import Phaser from 'phaser'
import { ResourceKey } from '../globals/ResourceKeys'
import { getTiledProperty, groupBy } from '../lib/util'
import { Coin } from '../entities/Coin'
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
import { mapObjectTypeToFrame } from '../globals/AtlasFrames'
import { Player } from '../entities/Player'
import { ExtendedCursorKeys } from './input'
import { MAP_TILE_SIZE } from '../globals/Map'
import { createInteractivePlatform } from '../entities/platforms'
import { createTrigger } from '../entities/triggers'

const HUD_HEIGHT = MAP_TILE_SIZE
const CAMERA_X_OFFSET_PERCENT = 0.1
const CAMERA_DEADZONE_PERCENT = 0.05

enum MapKeys {
  TILESET_NAME = 'tiles',

  // LAYERS
  BACKGROUND = 'BACKGROUND',
  GROUND = 'GROUND',
  BACKGROUND_PLATFORMS = 'BACKGROUND_PLATFORMS',
  WATER = 'WATER',
  DECORATIONS_BACKGROUND_1 = 'DECORATIONS_BACKGROUND_1',
  DECORATIONS_BACKGROUND_2 = 'DECORATIONS_BACKGROUND_2',
  DECORATIONS_FOREGROUND = 'DECORATIONS_FOREGROUND',
  SPAWN_POINTS = 'SPAWN_POINTS',
  MISC = 'MISC',
  TRIGGERS = 'TRIGGERS',

  // ENTITY OBJECT TYPES
  COINS = 'COINS',

  PLAYER_SPAWN = 'PLAYER_SPAWN',
  DAIKON_SPAWN = 'DAIKON_SPAWN',
  SQUASH_SPAWN = 'SQUASH_SPAWN',
  JELLY_SPAWN = 'JELLY_SPAWN',
  SOLDIER_SPAWN = 'SOLDIER_SPAWN',
  CACTUS_SPAWN = 'CACTUS_SPAWN',
  TANK_SPAWN = 'TANK_SPAWN',
  EYE_SPAWN = 'EYE_SPAWN',
  RADISH_SPAWN = 'RADISH_SPAWN',
  FLYING_RADISH_SPAWN = 'FLYING_RADISH_SPAWN',

  // COLLISIONS
  COLLISION_PROPERTY = 'collides',
  ENEMY_LEDGE_COLLIDERS = 'ENEMY_LEDGE_COLLIDERS',
  BACKGROUND_PLATFORM_COLLIDERS = 'BACKGROUND_PLATFORM_COLLIDERS',
  INTERACTIVE_PLATFORMS = 'INTERACTIVE_PLATFORMS',
}

export const setUpLevel = (
  scene: Phaser.Scene,
  cursorKeys: ExtendedCursorKeys,
  mapKey: ResourceKey,
) => {
  const { map, ground } = createMap(scene, mapKey)

  setBackground(scene, map.widthInPixels)
  scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

  const player = createPlayer(scene, map, cursorKeys)

  const cactusTops = scene.physics.add.group()
  const backgroundPlatforms = createBackgroundPlatforms(scene, map)
  const enemyLedgeColliders = createEnemyLedgeColliders(scene, map)
  const interactivePlatforms = createInteractivePlatforms(scene, map)
  const missiles = scene.physics.add.group()
  const cannonBalls = scene.physics.add.group()
  const enemies = createEnemies(scene, map, {
    cannonBalls,
    cactusTops,
    missiles,
    player,
  })
  const coins = createCoins(scene, map)
  setUpCamera(scene, map, player)
  createMiscObjects(scene, map)
  const triggers = createTriggers(scene, map)

  return {
    backgroundPlatforms,
    cactusTops,
    cannonBalls,
    coins,
    enemies,
    enemyLedgeColliders,
    ground,
    map,
    missiles,
    interactivePlatforms,
    player,
    triggers,
  }
}

const createMap = (scene: Phaser.Scene, mapKey: ResourceKey) => {
  const map = scene.make.tilemap({
    key: mapKey,
  })

  const tileset = map.addTilesetImage(
    MapKeys.TILESET_NAME,
    ResourceKey.MAP_TILES,
  )

  map.createLayer(MapKeys.WATER, tileset).setDepth(LayerOrder.MAP_TILES)
  map
    .createLayer(MapKeys.BACKGROUND_PLATFORMS, tileset)
    .setDepth(LayerOrder.MAP_TILES)

  const ground = map
    .createLayer(MapKeys.GROUND, tileset)
    .setDepth(LayerOrder.MAP_TILES)
    .setCollisionByProperty({ collides: true })

  map
    .createLayer(MapKeys.DECORATIONS_BACKGROUND_1, tileset)
    .setDepth(LayerOrder.MAP_DECORATIONS_BACKGROUND)

  map
    .createLayer(MapKeys.DECORATIONS_BACKGROUND_2, tileset)
    .setDepth(LayerOrder.MAP_DECORATIONS_BACKGROUND)

  map
    .createLayer(MapKeys.DECORATIONS_FOREGROUND, tileset)
    .setDepth(LayerOrder.MAP_DECORATIONS_FOREGROUND)

  return { map, ground }
}

const createBackgroundPlatforms = (
  scene: Phaser.Scene,
  map: Phaser.Tilemaps.Tilemap,
) => {
  const platforms = scene.physics.add.staticGroup(
    map
      .getObjectLayer(MapKeys.BACKGROUND_PLATFORM_COLLIDERS)
      .objects.map(({ x, y, width, height }) => {
        return scene.add.rectangle(x, y, width, height, 0, 0).setOrigin(0, 0)
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

const createEnemyLedgeColliders = (
  scene: Phaser.Scene,
  map: Phaser.Tilemaps.Tilemap,
) => {
  const enemyLedgeColliders = scene.physics.add.staticGroup(
    map
      .getObjectLayer(MapKeys.ENEMY_LEDGE_COLLIDERS)
      .objects.map(({ x, y, width, height }) => {
        return scene.add.rectangle(x, y, width, height, 0, 0).setOrigin(0, 0)
      }),
  )

  return enemyLedgeColliders
}

const createInteractivePlatforms = (
  scene: Phaser.Scene,
  map: Phaser.Tilemaps.Tilemap,
) => {
  const interactivePlatforms = scene.physics.add
    .staticGroup(
      map
        .getObjectLayer(MapKeys.INTERACTIVE_PLATFORMS)
        .objects.filter(
          ({ properties }) => !getTiledProperty(properties, 'isNoOp'),
        )
        .map(({ x, y, type, properties }) => {
          return scene.add.existing(
            createInteractivePlatform(scene, x, y, type, properties),
          )
        }),
    )
    .setDepth(LayerOrder.INTERACTIVE_PLATFORMS)

  return interactivePlatforms
}

const setBackground = (scene: Phaser.Scene, width: number) => {
  scene.add
    .tileSprite(
      0,
      HUD_HEIGHT,
      width,
      scene.scale.height - HUD_HEIGHT,
      ResourceKey.BACKGROUND_SPRING,
    )
    .setOrigin(0, 0)
    .setDepth(LayerOrder.BACKGROUND)
    .setScrollFactor(0.5)
}

const createPlayer = (
  scene: Phaser.Scene,
  map: Phaser.Tilemaps.Tilemap,
  cursorKeys: ExtendedCursorKeys,
) => {
  const { x, y } = map
    .getObjectLayer(MapKeys.SPAWN_POINTS)
    .objects.find((object) => object.type === MapKeys.PLAYER_SPAWN)

  const player = new Player(scene, x, y, cursorKeys)

  scene.add.existing(player).setDepth(LayerOrder.CHARACTERS)

  return player
}

const createEnemies = (
  scene: Phaser.Scene,
  map: Phaser.Tilemaps.Tilemap,
  {
    cactusTops,
    missiles,
    cannonBalls,
    player,
  }: {
    cactusTops: Phaser.Physics.Arcade.Group
    missiles: Phaser.Physics.Arcade.Group
    cannonBalls: Phaser.Physics.Arcade.Group
    player: Player
  },
) => {
  const spawnPoints = groupBy(
    map.getObjectLayer(MapKeys.SPAWN_POINTS).objects,
    'type',
  )

  return scene.add
    .group()
    .addMultiple(
      (spawnPoints[MapKeys.TANK_SPAWN] || []).map(({ x, y }) => {
        const tank = new Tank(scene, x, y, missiles)
        tank.follow(player)

        return scene.add.existing(tank)
      }),
    )
    .addMultiple(
      (spawnPoints[MapKeys.DAIKON_SPAWN] || []).map(({ x, y }) =>
        scene.add.existing(new Daikon(scene, x, y)),
      ),
    )
    .addMultiple(
      (spawnPoints[MapKeys.SQUASH_SPAWN] || []).map(({ x, y }) =>
        scene.add.existing(new Squash(scene, x, y)),
      ),
    )
    .addMultiple(
      (spawnPoints[MapKeys.JELLY_SPAWN] || []).map(({ x, y }) =>
        scene.add.existing(new Jelly(scene, x, y)),
      ),
    )
    .addMultiple(
      (spawnPoints[MapKeys.SOLDIER_SPAWN] || []).map(({ x, y }) =>
        scene.add.existing(new Soldier(scene, x, y)),
      ),
    )
    .addMultiple(
      (spawnPoints[MapKeys.RADISH_SPAWN] || []).map(({ x, y }) =>
        scene.add.existing(new Radish(scene, x, y)),
      ),
    )
    .addMultiple(
      (spawnPoints[MapKeys.FLYING_RADISH_SPAWN] || []).map(
        ({ x, y, properties }) =>
          scene.add.existing(new FlyingRadish(scene, x, y, properties)),
      ),
    )
    .addMultiple(
      (spawnPoints[MapKeys.CACTUS_SPAWN] || []).map(({ x, y }) =>
        scene.add.existing(new Cactus(scene, x, y, cactusTops)),
      ),
    )
    .addMultiple(
      (spawnPoints[MapKeys.EYE_SPAWN] || []).map(({ x, y }) => {
        const eye = new Eye(scene, x, y, cannonBalls)
        eye.setTarget(player)

        return scene.add.existing(eye)
      }),
    )
    .setDepth(LayerOrder.CHARACTERS)
}

const createCoins = (scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) => {
  return scene.physics.add
    .staticGroup(
      map
        .getObjectLayer(MapKeys.COINS)
        .objects.map(({ x, y }) => scene.add.existing(new Coin(scene, x, y))),
    )
    .setDepth(LayerOrder.COINS)
}

const createMiscObjects = (
  scene: Phaser.Scene,
  map: Phaser.Tilemaps.Tilemap,
) => {
  map.getObjectLayer(MapKeys.MISC).objects.forEach(({ x, y, type }) => {
    scene.add
      .image(x, y, ResourceKey.ENTITIES, mapObjectTypeToFrame(type))
      .setDepth(LayerOrder.MISC)
  })
}

const createTriggers = (scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) => {
  return scene.physics.add.staticGroup(
    map
      .getObjectLayer(MapKeys.TRIGGERS)
      .objects.map(({ x, y, type, flippedHorizontal, properties }) => {
        const trigger = scene.add.existing(
          createTrigger(scene, x, y, type, properties),
        )
        trigger
          .setFlipX(flippedHorizontal)
          .setDepth(LayerOrder.MAP_DECORATIONS_BACKGROUND)

        return trigger
      }),
  )
}

const setUpCamera = (
  scene: Phaser.Scene,
  map: Phaser.Tilemaps.Tilemap,
  player: Player,
) => {
  scene.cameras.main.startFollow(
    player,
    false,
    1,
    1,
    -CAMERA_X_OFFSET_PERCENT * scene.scale.width,
  )
  scene.cameras.main.setDeadzone(CAMERA_DEADZONE_PERCENT * scene.scale.width)
  scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
}
