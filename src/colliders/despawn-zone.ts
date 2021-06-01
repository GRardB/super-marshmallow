import Phaser from 'phaser'

export const handleDespawnZoneCollisionDestruction = (
  _,
  gameObject: Phaser.GameObjects.GameObject,
) => {
  gameObject.destroy()
}

export const handleDespawnZoneCollisionDeactivation = <
  T extends Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody &
    Phaser.GameObjects.Components.Visible,
>(
  _,
  gameObject: T,
) => {
  gameObject.setVisible(false).setActive(false)
  gameObject.body.setEnable(false)
}
