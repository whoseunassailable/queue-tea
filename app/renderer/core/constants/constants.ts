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

// The files a git hold lists before +N more.
export const HOLD_FILES_SHOWN = 7

// Where the task log goes unless someone says otherwise.
export const DEFAULT_LOG_PATH = 'docs/task_log.md'

// What each difficulty is worth, for the Finish sheet to offer. Main works out
// what was really earned.
export const XP_BY_DIFFICULTY = { light: 10, medium: 25, hard: 50 } as const

// The widths the window changes shape at (section 3 of the design).
export const DETAIL_FLOATS_BELOW = 1_180
export const DETAIL_IS_PAGE_BELOW = 900

// How often the active quest's pane measures its lines again.
export const LINES_REFRESH_MS = 30_000

// Codex appends session events independently of Queue-tea record changes.
export const ACTIVITY_REFRESH_MS = 1_000

// The Designs editor: how long after the last change it saves, how far zoom
// goes, the drag that counts as a move, and how far arrows nudge.
export const AUTOSAVE_MS = 600
export const ZOOM_RANGE = { low: 0.1, high: 8 } as const
export const DRAG_SLOP_PX = 3
export const NUDGE_PX = { small: 1, big: 10 } as const
// The width a card's thumbnail fits into.
export const THUMB_BOX = { width: 220, height: 300 } as const

// How often the update button asks whether a new version is ready.
export const UPDATE_POLL_MS = 2_000

// How long a note waits after typing stops before it saves itself.
export const NOTE_AUTOSAVE_MS = 800
// How many notes the [[ link picker offers at once.
export const NOTE_PICKER_ROWS = 8
// How many notes the ⌘K palette lists, and how long a matching line it shows.
export const PALETTE_NOTE_ROWS = 5
export const PALETTE_SNIPPET = 60
