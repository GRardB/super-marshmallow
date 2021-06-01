export enum AtlasFrames {
  MISSILE = 'missile.png',
  CACTUS_TOP = 'cactus-top.png',

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
}

export const mapObjectTypeToFrame = (type: string) => {
  switch (type) {
    case 'KEY_SHIFT':
      return AtlasFrames.KEYS_SHIFT
    case 'KEY_SPACE':
      return AtlasFrames.KEYS_SPACE
    case 'KEY_A':
      return AtlasFrames.KEYS_A
    case 'KEY_D':
      return AtlasFrames.KEYS_D
    case 'KEY_W':
      return AtlasFrames.KEYS_W
    case 'KEY_LEFT':
      return AtlasFrames.KEYS_LEFT
    case 'KEY_UP':
      return AtlasFrames.KEYS_UP
    case 'KEY_RIGHT':
      return AtlasFrames.KEYS_RIGHT
    case 'MOVEABLE_DIAMOND_BLUE':
      return AtlasFrames.MOVEABLE_DIAMOND_BLUE
    case 'MOVEABLE_DIAMOND_GREEN':
      return AtlasFrames.MOVEABLE_DIAMOND_GREEN
    case 'MOVEABLE_DIAMOND_ORANGE':
      return AtlasFrames.MOVEABLE_DIAMOND_ORANGE
    case 'MOVEABLE_DIAMOND_RED':
      return AtlasFrames.MOVEABLE_DIAMOND_RED
  }

  return ''
}
