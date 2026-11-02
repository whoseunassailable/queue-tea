// How many quests Home shows before the link to the board.
export const HOME_BOARD_ROWS = 3
export const HOME_BADGES = 4

// How often the sky looks at the clock. Hours are all it needs.
export const SKY_CHECK_MS = 60_000

// The ✓ on a saved chip, and how long a toast stays with and without an action.
export const SAVED_MS = 1_200
export const TOAST_MS = 4_000
export const TOAST_ACTION_MS = 6_000
export const TOASTS_SHOWN = 3
export const UNDO_DEPTH = 20

// How long the dragon enjoys a pat.
export const PET_MS = 1_400

// Mana bar width and the dragon's size at each stage, against the hatchling.
export const STAGE_SCALE = { egg: 0.6, hatchling: 1, young: 1.08, adult: 1.16, elder: 1.24 } as const

// The level each stage grows out of.
export const GROWS_AT = { egg: 2, hatchling: 5, young: 10, adult: 20, elder: null } as const
