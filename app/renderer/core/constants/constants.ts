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
// Bound the list's rendered rows, including when every folder is folded.
export const NOTE_LIST_PAGE_SIZE = 100
export const NOTE_BREW_DRAG_TYPE = 'application/x-queue-tea-brewquest'
// How many notes the [[ link picker offers at once.
export const NOTE_PICKER_ROWS = 8
// How many notes the ⌘K palette lists, and how long a matching line it shows.
export const PALETTE_NOTE_ROWS = 5
export const PALETTE_SNIPPET = 60
// Rows of the 8 kept for quests, when that many match.
export const NOTE_PICKER_QUEST_ROWS = 3
// The note graph's layout: how far apart linked notes sit, how hard notes push
// apart and how gently all of them are drawn to the middle. A layout that has
// most of its points kept starts warm, so it settles quickly and doesn't jump.
// 150 steps and a looser Barnes-Hut (theta 1.2) lay out 5,000 notes in about
// 1.4 s cold and 1 s warm; d3's own 300 steps and 0.9 took 4.7 s.
export const GRAPH_LINK_DISTANCE = 60
export const GRAPH_CHARGE = -120
export const GRAPH_GRAVITY = 0.04
export const GRAPH_TICKS = 150
export const GRAPH_THETA = 1.2
export const GRAPH_WARM_ALPHA = 0.1
// How many layout steps pass between two progress reports.
export const GRAPH_PROGRESS_TICKS = 20
// The note graph on screen: the wait before its spinner shows, the zoom at
// which every title shows on the whole realm, how near a click must land on a
// node, how long a title may be, the zoom range, and how far the mouse moves
// before a press is a pan and not a click.
export const GRAPH_SPINNER_MS = 150
export const GRAPH_LABEL_ZOOM = 1.5
export const GRAPH_HIT_PX = 10
export const GRAPH_LABEL_CHARS = 40
export const GRAPH_ZOOM_MIN = 0.05
export const GRAPH_ZOOM_MAX = 4
export const GRAPH_DRAG_PX = 3
// The room Fit leaves around the graph, in pixels.
export const GRAPH_FIT_PX = 40

// The canvas: the zoom range, how far a press moves before it drags, how far
// an arrow key moves or resizes a card (Shift: four times that), the smallest
// card, the room Fit leaves, how far a new card steps aside from one already
// there, how far a line bows out of a card's side at most, how much of a
// note's text its card shows, and each new card's size.
export const CANVAS_ZOOM_MIN = 0.1
export const CANVAS_ZOOM_MAX = 2
export const CANVAS_DRAG_PX = 3
export const CANVAS_STEP_PX = 20
export const CANVAS_MIN_SIZE = { width: 120, height: 60 } as const
export const CANVAS_FIT_PX = 40
export const CANVAS_CASCADE_PX = 30
export const CANVAS_CURVE_PX = 120
export const CANVAS_EXCERPT = 240
export const CANVAS_CARD_SIZE = { note: { width: 280, height: 160 }, quest: { width: 280, height: 100 }, link: { width: 300, height: 140 }, file: { width: 300, height: 240 } } as const

// The calendar: how tall an hour is in the week grid, the hour it opens
// scrolled to, how many items a month's day shows before "+N more", and how
// often the now line and today move.
export const CALENDAR_HOUR_PX = 44
export const CALENDAR_OPEN_HOUR = 8
export const CALENDAR_MONTH_ITEMS = 3
export const CALENDAR_CLOCK_MS = 60_000
