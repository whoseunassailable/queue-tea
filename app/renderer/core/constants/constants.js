"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CANVAS_STEP_PX = exports.CANVAS_DRAG_PX = exports.CANVAS_ZOOM_MAX = exports.CANVAS_ZOOM_MIN = exports.GRAPH_FIT_PX = exports.GRAPH_DRAG_PX = exports.GRAPH_ZOOM_MAX = exports.GRAPH_ZOOM_MIN = exports.GRAPH_LABEL_CHARS = exports.GRAPH_HIT_PX = exports.GRAPH_LABEL_ZOOM = exports.GRAPH_SPINNER_MS = exports.GRAPH_PROGRESS_TICKS = exports.GRAPH_WARM_ALPHA = exports.GRAPH_THETA = exports.GRAPH_TICKS = exports.GRAPH_GRAVITY = exports.GRAPH_CHARGE = exports.GRAPH_LINK_DISTANCE = exports.NOTE_PICKER_QUEST_ROWS = exports.PALETTE_SNIPPET = exports.PALETTE_NOTE_ROWS = exports.NOTE_PICKER_ROWS = exports.NOTE_BREW_DRAG_TYPE = exports.NOTE_LIST_PAGE_SIZE = exports.NOTE_AUTOSAVE_MS = exports.UPDATE_POLL_MS = exports.THUMB_BOX = exports.NUDGE_PX = exports.DRAG_SLOP_PX = exports.ZOOM_RANGE = exports.AUTOSAVE_MS = exports.ACTIVITY_REFRESH_MS = exports.LINES_REFRESH_MS = exports.DETAIL_IS_PAGE_BELOW = exports.DETAIL_FLOATS_BELOW = exports.XP_BY_DIFFICULTY = exports.DEFAULT_LOG_PATH = exports.HOLD_FILES_SHOWN = exports.GROWS_AT = exports.STAGE_SCALE = exports.PET_MS = exports.UNDO_DEPTH = exports.TOASTS_SHOWN = exports.TOAST_ACTION_MS = exports.TOAST_MS = exports.SAVED_MS = exports.SKY_CHECK_MS = exports.HOME_BADGES = exports.HOME_BOARD_ROWS = void 0;
exports.CALENDAR_CLOCK_MS = exports.CALENDAR_MONTH_ITEMS = exports.CALENDAR_OPEN_HOUR = exports.CALENDAR_HOUR_PX = exports.CANVAS_CARD_SIZE = exports.CANVAS_EXCERPT = exports.CANVAS_CURVE_PX = exports.CANVAS_CASCADE_PX = exports.CANVAS_FIT_PX = exports.CANVAS_MIN_SIZE = void 0;
// How many quests Home shows before the link to the board.
exports.HOME_BOARD_ROWS = 3;
exports.HOME_BADGES = 4;
// How often the sky looks at the clock. Hours are all it needs.
exports.SKY_CHECK_MS = 60000;
// The ✓ on a saved chip, and how long a toast stays with and without an action.
exports.SAVED_MS = 1200;
exports.TOAST_MS = 4000;
exports.TOAST_ACTION_MS = 6000;
exports.TOASTS_SHOWN = 3;
exports.UNDO_DEPTH = 20;
// How long the dragon enjoys a pat.
exports.PET_MS = 1400;
// Mana bar width and the dragon's size at each stage, against the hatchling.
exports.STAGE_SCALE = { egg: 0.6, hatchling: 1, young: 1.08, adult: 1.16, elder: 1.24 };
// The level each stage grows out of.
exports.GROWS_AT = { egg: 2, hatchling: 5, young: 10, adult: 20, elder: null };
// The files a git hold lists before +N more.
exports.HOLD_FILES_SHOWN = 7;
// Where the task log goes unless someone says otherwise.
exports.DEFAULT_LOG_PATH = 'docs/task_log.md';
// What each difficulty is worth, for the Finish sheet to offer. Main works out
// what was really earned.
exports.XP_BY_DIFFICULTY = { light: 10, medium: 25, hard: 50 };
// The widths the window changes shape at (section 3 of the design).
exports.DETAIL_FLOATS_BELOW = 1180;
exports.DETAIL_IS_PAGE_BELOW = 900;
// How often the active quest's pane measures its lines again.
exports.LINES_REFRESH_MS = 30000;
// Codex appends session events independently of Queue-tea record changes.
exports.ACTIVITY_REFRESH_MS = 1000;
// The Designs editor: how long after the last change it saves, how far zoom
// goes, the drag that counts as a move, and how far arrows nudge.
exports.AUTOSAVE_MS = 600;
exports.ZOOM_RANGE = { low: 0.1, high: 8 };
exports.DRAG_SLOP_PX = 3;
exports.NUDGE_PX = { small: 1, big: 10 };
// The width a card's thumbnail fits into.
exports.THUMB_BOX = { width: 220, height: 300 };
// How often the update button asks whether a new version is ready.
exports.UPDATE_POLL_MS = 2000;
// How long a note waits after typing stops before it saves itself.
exports.NOTE_AUTOSAVE_MS = 800;
// Bound the list's rendered rows, including when every folder is folded.
exports.NOTE_LIST_PAGE_SIZE = 100;
exports.NOTE_BREW_DRAG_TYPE = 'application/x-queue-tea-brewquest';
// How many notes the [[ link picker offers at once.
exports.NOTE_PICKER_ROWS = 8;
// How many notes the ⌘K palette lists, and how long a matching line it shows.
exports.PALETTE_NOTE_ROWS = 5;
exports.PALETTE_SNIPPET = 60;
// Rows of the 8 kept for quests, when that many match.
exports.NOTE_PICKER_QUEST_ROWS = 3;
// The note graph's layout: how far apart linked notes sit, how hard notes push
// apart and how gently all of them are drawn to the middle. A layout that has
// most of its points kept starts warm, so it settles quickly and doesn't jump.
// 150 steps and a looser Barnes-Hut (theta 1.2) lay out 5,000 notes in about
// 1.4 s cold and 1 s warm; d3's own 300 steps and 0.9 took 4.7 s.
exports.GRAPH_LINK_DISTANCE = 60;
exports.GRAPH_CHARGE = -120;
exports.GRAPH_GRAVITY = 0.04;
exports.GRAPH_TICKS = 150;
exports.GRAPH_THETA = 1.2;
exports.GRAPH_WARM_ALPHA = 0.1;
// How many layout steps pass between two progress reports.
exports.GRAPH_PROGRESS_TICKS = 20;
// The note graph on screen: the wait before its spinner shows, the zoom at
// which every title shows on the whole realm, how near a click must land on a
// node, how long a title may be, the zoom range, and how far the mouse moves
// before a press is a pan and not a click.
exports.GRAPH_SPINNER_MS = 150;
exports.GRAPH_LABEL_ZOOM = 1.5;
exports.GRAPH_HIT_PX = 10;
exports.GRAPH_LABEL_CHARS = 40;
exports.GRAPH_ZOOM_MIN = 0.05;
exports.GRAPH_ZOOM_MAX = 4;
exports.GRAPH_DRAG_PX = 3;
// The room Fit leaves around the graph, in pixels.
exports.GRAPH_FIT_PX = 40;
// The canvas: the zoom range, how far a press moves before it drags, how far
// an arrow key moves or resizes a card (Shift: four times that), the smallest
// card, the room Fit leaves, how far a new card steps aside from one already
// there, how far a line bows out of a card's side at most, how much of a
// note's text its card shows, and each new card's size.
exports.CANVAS_ZOOM_MIN = 0.1;
exports.CANVAS_ZOOM_MAX = 2;
exports.CANVAS_DRAG_PX = 3;
exports.CANVAS_STEP_PX = 20;
exports.CANVAS_MIN_SIZE = { width: 120, height: 60 };
exports.CANVAS_FIT_PX = 40;
exports.CANVAS_CASCADE_PX = 30;
exports.CANVAS_CURVE_PX = 120;
exports.CANVAS_EXCERPT = 240;
exports.CANVAS_CARD_SIZE = { note: { width: 280, height: 160 }, quest: { width: 280, height: 100 }, link: { width: 300, height: 140 }, file: { width: 300, height: 240 } };
// The calendar: how tall an hour is in the week grid, the hour it opens
// scrolled to, how many items a month's day shows before "+N more", and how
// often the now line and today move.
exports.CALENDAR_HOUR_PX = 44;
exports.CALENDAR_OPEN_HOUR = 8;
exports.CALENDAR_MONTH_ITEMS = 3;
exports.CALENDAR_CLOCK_MS = 60000;
