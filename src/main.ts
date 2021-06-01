import Phaser from 'phaser'
import { Game } from './scenes/Game'
import { Preloader } from './scenes/Preloader'

export default new Phaser.Game({
  parent: 'game',
  type: Phaser.AUTO,
  antialiasGL: false,
  pixelArt: true,
  scene: [Preloader, Game],
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
})
