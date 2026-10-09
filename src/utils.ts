// `@vexoulz/ui/utils`: the logic behind the components, with no component or style attached, for sites that
// keep their own look (keeki-vods) but share how games are coloured, popovers placed, toasts queued and data polled.
// The components import these same modules, so both entries share one implementation (and one toast store).
//
//   import { gameColor, place, useToast } from '@vexoulz/ui/utils'
export { clamp, decimalsOf, stepValue, type StepOptions } from './utils/number'
export { clampX, place, type PlaceInput, type Placement, type Rect } from './utils/place'
export {
  dominantHue,
  gameColor,
  gameHue,
  gamePalette,
  hasGameHue,
  initials,
  setGameHue,
  twitchColor,
  readableOnBlack,
  contrastOnBlack,
  TWITCH_DEFAULT_COLORS,
} from './utils/color'
export { learnGameColors, sampleHue } from './utils/artColor'
export { useDismiss } from './composables/useClickOutside'
export { useToast, type Toast, type ToastKind } from './composables/useToast'
export { useResource, type Resource, type ResourceOptions } from './composables/useResource'
export { usePoll } from './composables/usePoll'
export { useNow } from './composables/useNow'
