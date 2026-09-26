// @vexoulz/ui: Deep Field components for the *.vexoulz.net sites.
// Styles are extracted to dist/style.css (the JS doesn't load them). In the site's entry:
//   import '@vexoulz/ui/fonts.css'
//   import '@vexoulz/ui/style.css'
import './styles/index.css'

// Chrome
export { default as VxSiteShell } from './components/chrome/VxSiteShell.vue'
export { default as VxSiteHeader } from './components/chrome/VxSiteHeader.vue'
export { default as VxSiteFooter } from './components/chrome/VxSiteFooter.vue'
export { default as VxSiteSwitcher } from './components/chrome/VxSiteSwitcher.vue'
export { default as VxLockup } from './components/chrome/VxLockup.vue'
export { default as VxAccountMenu } from './components/chrome/VxAccountMenu.vue'
export { default as VxLink } from './components/chrome/VxLink.vue'

// Controls
export { default as VxButton } from './components/controls/VxButton.vue'
export { default as VxInput } from './components/controls/VxInput.vue'
export { default as VxField } from './components/controls/VxField.vue'
export { default as VxSelect } from './components/controls/VxSelect.vue'
export { default as VxStepper } from './components/controls/VxStepper.vue'
export { default as VxSwitch } from './components/controls/VxSwitch.vue'
export { default as VxCheckbox } from './components/controls/VxCheckbox.vue'
export { default as VxRadioGroup } from './components/controls/VxRadioGroup.vue'
export { default as VxSlider } from './components/controls/VxSlider.vue'
export { default as VxDateRange } from './components/controls/VxDateRange.vue'
export { default as VxTabs } from './components/controls/VxTabs.vue'
export { default as VxSegmented } from './components/controls/VxSegmented.vue'
export { default as VxPagination } from './components/controls/VxPagination.vue'

// Overlays
export { default as VxPopover } from './components/overlays/VxPopover.vue'
export { default as VxMenuItem } from './components/overlays/VxMenuItem.vue'
export { default as VxMenuLabel } from './components/overlays/VxMenuLabel.vue'
export { default as VxMenuSeparator } from './components/overlays/VxMenuSeparator.vue'
export { default as VxDialog } from './components/overlays/VxDialog.vue'
export { default as VxToastHost } from './components/overlays/VxToastHost.vue'
export { default as VxTooltip } from './components/overlays/VxTooltip.vue'

// Feedback
export { default as VxCallout } from './components/feedback/VxCallout.vue'
export { default as VxProgress } from './components/feedback/VxProgress.vue'
export { default as VxSpinner } from './components/feedback/VxSpinner.vue'
export { default as VxSkeleton } from './components/feedback/VxSkeleton.vue'
export { default as VxEmptyState } from './components/feedback/VxEmptyState.vue'

// Data
export { default as VxTable } from './components/data/VxTable.vue'
export { default as VxChip } from './components/data/VxChip.vue'
export { default as VxStatusDot } from './components/data/VxStatusDot.vue'
export { default as VxAvatar } from './components/data/VxAvatar.vue'
export { default as VxKbd } from './components/data/VxKbd.vue'

// Media
export { default as VxPlaceholder } from './components/media/VxPlaceholder.vue'
export { default as VxStarfield } from './components/media/VxStarfield.vue'
export { default as VxPosters } from './components/media/VxPosters.vue'
export { default as VxChapterBar } from './components/media/VxChapterBar.vue'

// Composables
export { useToast, type Toast, type ToastKind } from './composables/useToast'
export { useSite, provideSite, SITE_KEY } from './composables/useSite'
export { useBuild, VxBuild, BUILD_KEY, type BuildInfo } from './composables/useBuild'
export { useDismiss } from './composables/useClickOutside'

// Utils
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
export { clamp, decimalsOf, stepValue, type StepOptions } from './utils/number'
export { pageRange, type PageItem } from './utils/pagination'
export { clampX, place, type PlaceInput, type Placement, type Rect } from './utils/place'
export { mulberry32, hashString } from './utils/random'
export { createNoise, type Noise2 } from './utils/perlin'
export { generateStars, STARFIELD_DEFAULTS, SPECTRA, METEOR_GAPS, type StarfieldOptions, type Star, type Spectrum, type MeteorRate } from './utils/starfield'
export { formatDuration } from './utils/time'

// Types
export * from './types'
