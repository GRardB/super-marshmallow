import Phaser from 'phaser'
import { ResourceKey } from '../globals/ResourceKeys'
import { SceneKey } from '../globals/SceneKeys'
import { createAnimations } from '../animations'

export class Preloader extends Phaser.Scene {
  preload() {
    // MAP
    this.load.image(ResourceKey.BACKGROUND_SPRING, '/img/bg-spring.png')
    this.load.image(ResourceKey.BACKGROUND_SUMMER, '/img/bg-summer.png')
    this.load.image(ResourceKey.BACKGROUND_WINTER, '/img/bg-winter.png')
    this.load.image(ResourceKey.BACKGROUND_CITY, '/img/bg-city.png')
    this.load.atlas(
      ResourceKey.MAP_TILES,
      '/img/spritesheets/tiles.png',
      '/img/spritesheets/tiles.json',
    )

    this.load.tilemapTiledJSON(ResourceKey.LEVEL_1, '/maps/level-1.json')

    this.load.atlas(
      ResourceKey.ENTITIES,
      '/img/spritesheets/entities.png',
      '/img/spritesheets/entities.json',
    )

    this.load.atlas(
      ResourceKey.KEYS,
      '/img/spritesheets/keys.png',
      '/img/spritesheets/keys.json',
    )
  }

  create() {
    createAnimations(this)
    this.scene.start(SceneKey.MENU)
  }
}
