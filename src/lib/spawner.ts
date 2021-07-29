import Phaser from 'phaser'
import { EventNames } from '../globals/EventNames'

const SPAWN_AREA_PADDING = 20

export const createSpawner = (
  scene: Phaser.Scene,
  gameObjects: Phaser.GameObjects.Group,
) => {
  const unspawnedObjects = new Set<Phaser.GameObjects.GameObject>(
    gameObjects.children.entries,
  )

  unspawnedObjects.forEach(disableGameObject)

  return () => {
    const x = scene.cameras.main.worldView.right + SPAWN_AREA_PADDING

    unspawnedObjects.forEach((gameObject) => {
      if (gameObject.body.position.x <= x) {
        unspawnedObjects.delete(gameObject)
        enableGameObject(gameObject)
        gameObject.emit(EventNames.SPAWN)
      }
    })
  }
}

const disableGameObject = (gameObject: Phaser.GameObjects.GameObject) => {
  gameObject.setActive(false)
  if (gameObject.body instanceof Phaser.Physics.Arcade.Body) {
    gameObject.body.setEnable(false)
  }
}

const enableGameObject = (gameObject: Phaser.GameObjects.GameObject) => {
  gameObject.setActive(true)
  if (gameObject.body instanceof Phaser.Physics.Arcade.Body) {
    gameObject.body.setEnable(true)
  }
}
