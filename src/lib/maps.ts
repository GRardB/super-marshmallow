import { ResourceKey } from '../globals/ResourceKeys'

const MAP_ORDER = [ResourceKey.LEVEL_1, ResourceKey.LEVEL_2]

export const getNextMap = (mapKey: ResourceKey) => {
  const index = MAP_ORDER.findIndex((mk) => mk === mapKey)
  return MAP_ORDER[index + 1]
}
