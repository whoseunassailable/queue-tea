import type { Band, MenuView, ProjectRecord, Task } from '../../types'
import { currentTask, orderQueue } from '../queue'
import { formatMinutes } from '../time'

export type Mood = 'idle' | 'working' | 'attention' | 'done'

// One run of one row of the cup: its text and colours.
export type Seg = { text: string; color?: string; backgroundColor?: string; bold?: boolean }

// The cup's rows, top to bottom.
export type Frame = Seg[][]

// What the cup's surface module plays: the frames in turn, `ms` apart, and
// the one it shows while the pointer is on it.
export type CupArt = { frames: Frame[]; wink: Frame; ms: number }

// What the cup is drawn from: the view's values, whether a turn runs, and now.
export type CupFacts = {
  load: 'loading' | 'ready' | 'failed'
  record: ProjectRecord | null
  band: Band
  isAskingDone: boolean
  hold: { text: string } | null
  mismatch: string | null
  canContinue: boolean
  warning: string | null
  isChecking: boolean
  busy: string | null
  isTurnRunning: boolean
  now: number
}

// The cup's mood, a line saying why, and the menu view that answers it.
export type Cup = { mood: Mood; line: string; view: MenuView }

// How long a finished task keeps the cup pleased.
export const DONE_FOR_MS = 15 * 60_000

export const CUP_COLUMNS = 11
export const CUP_ROWS = 3

const minutesOf = (task: Task) => Object.values(task.minutesByDay).reduce((a, b) => a + b, 0)

const lastFinished = (tasks: Task[]): Task | null =>
  tasks
    .filter(t => t.state === 'done' && t.finished !== null)
    .reduce<Task | null>((last, t) => (last === null || Date.parse(t.finished!) > Date.parse(last.finished!) ? t : last), null)

// Something waiting on Rohan first, then work going on, then a task just
// finished; idle otherwise.
export const cupOf = (f: CupFacts): Cup => {
  const tasks = f.record?.tasks ?? []
  const current = currentTask(tasks)

  if (f.load === 'failed') return { mood: 'attention', line: "Couldn't read your task record", view: 'menu' }
  if (f.band.kind !== 'none') return { mood: 'attention', line: 'Waiting for your answer', view: 'menu' }
  if (f.isAskingDone && current !== null) {
    return { mood: 'attention', line: `Is this done for now? ${current.title}`, view: 'current' }
  }
  if (f.hold !== null) return { mood: 'attention', line: f.hold.text, view: 'current' }
  if (f.mismatch !== null) return { mood: 'attention', line: f.mismatch, view: 'current' }
  if (f.warning !== null) return { mood: 'attention', line: f.warning, view: 'current' }
  if (f.canContinue && current !== null) {
    return { mood: 'attention', line: `Ready to continue: ${current.title}`, view: 'current' }
  }

  if (f.isChecking) return { mood: 'working', line: 'Checking your message…', view: 'menu' }
  if (f.busy !== null) return { mood: 'working', line: f.busy, view: 'current' }
  if (f.load === 'loading') return { mood: 'working', line: 'Reading your queue…', view: 'menu' }
  if (current !== null) {
    return { mood: 'working', line: `${current.title} · ${formatMinutes(minutesOf(current))}`, view: 'current' }
  }
  if (f.isTurnRunning) return { mood: 'working', line: 'Brewing outside the queue', view: 'menu' }

  const last = lastFinished(tasks)
  if (last !== null && f.now - Date.parse(last.finished!) < DONE_FOR_MS) {
    return { mood: 'done', line: `Finished: ${last.title}`, view: 'history' }
  }
  const queue = orderQueue(tasks)

  return queue.length === 0
    ? { mood: 'idle', line: 'Nothing queued', view: 'menu' }
    : { mood: 'idle', line: `${queue.length} waiting · ★ ${queue[0]!.title}`, view: 'backlog' }
}

// The cup in the reference picture: cream, amber tea, a sage tea-bag tag, a
// face with pink cheeks. Every glyph is one column wide, so any terminal
// lays it out the same.
const CREAM = '#F1DCB2'
const CLAY = '#CFAE7B'
const TEA = '#C8782F'
const INK = '#3A2A20'
const PINK = '#EE9A9A'
const SAGE = '#8DB596'
const STEAM = '#B9A88C'
const ALERT = '#E8A13A'
const STAR = '#E9C46A'

const FACE: Record<Mood, string> = { idle: '-ω-', working: '•ω•', attention: '•o•', done: '^ω^' }
const BLINK = '-ω-'
const WINK = '•ω-'

// The rim: tea in a cream cup, its corners rounded by half blocks.
const RIM: Seg[] = [
  { text: ' ' },
  { text: '▄', color: CREAM },
  { text: '▀'.repeat(7), color: TEA, backgroundColor: CREAM },
  { text: '▄', color: CREAM },
  { text: ' ' },
]

// The body: the tag on the left, the face between pink cheeks, its bottom
// corners rounded by half blocks, and the handle in a deeper tone, so it
// shows on a light terminal too.
const body = (face: string): Seg[] => [
  { text: '▐', color: SAGE },
  { text: '▀', color: CREAM },
  { text: ' ', backgroundColor: CREAM },
  { text: '▄', color: PINK, backgroundColor: CREAM },
  { text: face, color: INK, backgroundColor: CREAM, bold: true },
  { text: '▄', color: PINK, backgroundColor: CREAM },
  { text: ' ', backgroundColor: CREAM },
  { text: '▀', color: CREAM },
  { text: ')', color: CLAY, bold: true },
]

// What rises from the cup: steam while it brews, z's while it waits, a
// blinking ! when it needs Rohan, twinkles when a task is done.
const AIR: Record<Mood, { rows: string[]; color: string; bold?: boolean; ms: number }> = {
  working: { rows: ['   ) ( )   ', '   ( ) (   ', '   ) ) (   ', '   ( ( )   '], color: STEAM, ms: 500 },
  idle: { rows: ['      z    ', '       z   ', '        Z  ', '           '], color: STEAM, ms: 1000 },
  attention: { rows: ['     !     ', '           '], color: ALERT, bold: true, ms: 500 },
  done: { rows: ['  ✧   ·    ', '  ·   ✧    ', '      ·  ✧ ', '  ✧      · '], color: STAR, ms: 750 },
}

const frame = (mood: Mood, air: string, face: string): Frame => {
  const { color, bold } = AIR[mood]

  return [[bold === true ? { text: air, color, bold } : { text: air, color }], RIM, body(face)]
}

export const cupArt = (mood: Mood): CupArt => {
  const { rows, ms } = AIR[mood]
  const frames = rows.map(air => frame(mood, air, FACE[mood]))
  // While it brews, a blink every second round of the steam.
  const blinks = mood === 'working' ? rows.map((air, i) => frame(mood, air, i === 2 ? BLINK : FACE[mood])) : []

  return { frames: [...frames, ...blinks], wink: frame(mood, rows[0]!, WINK), ms }
}

// The text a frame shows, row by row, for a still cup and for tests.
export const frameText = (f: Frame): string[] => f.map(row => row.map(seg => seg.text).join(''))
