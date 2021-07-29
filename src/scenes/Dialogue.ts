import Phaser from 'phaser'
import { AtlasFrames } from '../globals/AtlasFrames'
import { ResourceKey } from '../globals/ResourceKeys'
import { SceneKey } from '../globals/SceneKeys'

const TYPING_INTERVAL = 30 // ms

interface DialogueConfig {
  message: string
  onComplete(dialogueScene: Phaser.Scene): void
}

export class Dialogue extends Phaser.Scene {
  private message: string
  private onComplete: (dialogueScene: Phaser.Scene) => void

  constructor() {
    super(SceneKey.DIALOGUE)
  }

  init({ message, onComplete }: DialogueConfig) {
    this.message = message
    this.onComplete = onComplete
  }

  create() {
    const x = this.scale.width * 0.5
    const y = this.scale.height * 0.9

    const messageEl = this.add
      .dom(x, y, 'div')
      .setClassName('dialogue')
      .setOrigin(0.5, 1)

    this.typeMessage(messageEl)
    this.displayContinueButton()
  }

  private typeMessage = (messageEl: Phaser.GameObjects.DOMElement) => {
    for (let i = 0; i < this.message.length; i++) {
      this.time.addEvent({
        callback: () => {
          messageEl.setText(this.message.substr(0, i + 1))
        },
        delay: i * TYPING_INTERVAL,
      })
    }
  }

  private displayContinueButton = () => {
    this.time.delayedCall(this.message.length * TYPING_INTERVAL, () => {
      this.add
        .sprite(
          this.scale.width * 0.5,
          this.scale.height * 0.95,
          ResourceKey.ENTITIES,
          AtlasFrames.KEYS_SPACE,
        )
        .setOrigin(0.5, 0.5)

      this.input.keyboard.on('keydown-SPACE', this.onComplete.bind(null, this))
    })
  }
}
