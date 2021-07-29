export enum AtlasFrames {
  MISSILE = 'missile.png',
  CACTUS_TOP = 'cactus-top.png',
  SIGN = 'sign.png',
  MARSHMALLOW = 'marshmallow-walk-1.png',
  COIN = 'coin-1.png',

  KEYS_SHIFT = 'keys-10.png',
  KEYS_SPACE = 'keys-16.png',
  KEYS_A = 'keys-42.png',
  KEYS_D = 'keys-45.png',
  KEYS_W = 'keys-64.png',
  KEYS_LEFT = 'keys-21.png',
  KEYS_UP = 'keys-22.png',
  KEYS_RIGHT = 'keys-23.png',

  MOVEABLE_DIAMOND_BLUE = 'diamond-blue-small.png',
  MOVEABLE_DIAMOND_GREEN = 'diamond-green-small.png',
  MOVEABLE_DIAMOND_ORANGE = 'diamond-orange-small.png',
  MOVEABLE_DIAMOND_RED = 'diamond-red-small.png',

  BLOCK_CONCRETE = 'block-concrete-1.png',
  CRATE_RED = 'crate-red.png',
  COIN_CHEST = 'crate-purple.png',
}

const mappings = [
  ['COIN_CHEST', AtlasFrames.COIN_CHEST],
  ['CRUMBLING_CONCRETE', AtlasFrames.BLOCK_CONCRETE],
  ['KEY_A', AtlasFrames.KEYS_A],
  ['KEY_D', AtlasFrames.KEYS_D],
  ['KEY_LEFT', AtlasFrames.KEYS_LEFT],
  ['KEY_RIGHT', AtlasFrames.KEYS_RIGHT],
  ['KEY_SHIFT', AtlasFrames.KEYS_SHIFT],
  ['KEY_SPACE', AtlasFrames.KEYS_SPACE],
  ['KEY_UP', AtlasFrames.KEYS_UP],
  ['KEY_W', AtlasFrames.KEYS_W],
  ['MARSHMALLOW', AtlasFrames.MARSHMALLOW],
  ['MOVEABLE_DIAMOND_BLUE', AtlasFrames.MOVEABLE_DIAMOND_BLUE],
  ['MOVEABLE_DIAMOND_GREEN', AtlasFrames.MOVEABLE_DIAMOND_GREEN],
  ['MOVEABLE_DIAMOND_ORANGE', AtlasFrames.MOVEABLE_DIAMOND_ORANGE],
  ['MOVEABLE_DIAMOND_RED', AtlasFrames.MOVEABLE_DIAMOND_RED],
  ['MOVING_PLATFORM_RED', AtlasFrames.CRATE_RED],
  ['SIGN', AtlasFrames.SIGN],
]

export const mapObjectTypeToFrame = (type: string) => {
  return mappings.find(([t]) => t === type)[1]
}
