import Phaser from 'phaser'
import { Dialogue } from './scenes/Dialogue'
import { GameOver } from './scenes/GameOver'
import { Level } from './scenes/Level'
import { Menu } from './scenes/Menu'
import { Preloader } from './scenes/Preloader'
import { GrayScalePipeline } from './pipelines/GrayScale'
import { ResourceKey } from './globals/ResourceKeys'

export default new Phaser.Game({
  parent: 'game',
  type: Phaser.AUTO,
  backgroundColor: 0x141414,
  antialiasGL: false,
  pixelArt: true,
  scene: [Preloader, Menu, Level, Dialogue, GameOver],
  banner: {
    hidePhaser: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 256,
    height: 144,
  },
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 500,
      },
      // debug: true,
    },
  },
  pipeline: {
    // @ts-ignore
    [ResourceKey.PIPELINE_GRAYSCALE]: GrayScalePipeline,
  },
})
