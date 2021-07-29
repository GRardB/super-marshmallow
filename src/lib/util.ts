import Phaser from 'phaser'

export const isOffScreen = (container: Phaser.GameObjects.Container) => {
  return container.y > container.scene.scale.height + container.height
}

export const getBodyBounds = (body: Phaser.Physics.Arcade.Body) => {
  let bounds = new Phaser.Geom.Rectangle()

  body.getBounds(bounds)

  return bounds
}

export const groupBy = <T>(xs: T[], key: string) => {
  return xs.reduce((rv, x) => {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

interface TiledProperty {
  name: string
  value: any
}
export type TiledProperties = TiledProperty[]

export const getTiledProperty = (properties: TiledProperty[], name: string) => {
  return properties.find((tiledProperty) => tiledProperty.name === name)?.value
}
