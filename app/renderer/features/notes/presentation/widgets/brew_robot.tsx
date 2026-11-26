import type { BrewMood } from '../../domain/notes_view'

// One pixel run, in the robot's 12 × 12 grid: x, y, width, height.
type Px = readonly [x: number, y: number, width: number, height: number]
type Paint = { fill: string; px: readonly Px[] }
// What changes from mood to mood. The head, body and feet stay put.
type Pose = { eyes: Paint; mouth: Paint; chest: string; arms: { left: Px; right: Px }; mark: Paint | null }

const INK = '#2A3550'
const SKY = '#3BA6D6'
const FACE = '#EEF3F8'
const BODY = '#DDE6EF'
const ARM = '#B8C6D4'
const BROWN = '#54473A'
const GOLD = '#E8B04B'
const JADE = '#2E9C7E'
const MINT = '#5FD3A7'
const RED = '#C8443A'

const EYES: readonly Px[] = [[3.5, 3.5, 1.5, 1.5], [7, 3.5, 1.5, 1.5]]
const ARMS_DOWN = { left: [1.4, 7.8, 1.2, 2], right: [9.4, 7.8, 1.2, 2] } as const
const ARM_UP = { left: [0.6, 5.6, 1.2, 2], right: [10.2, 5.6, 1.2, 2] } as const
// A cross of pixels, three wide, for each eye.
const crossAt = (x: number, y: number): Px[] => [[x, y, 0.5, 0.5], [x + 1, y, 0.5, 0.5], [x + 0.5, y + 0.5, 0.5, 0.5], [x, y + 1, 0.5, 0.5], [x + 1, y + 1, 0.5, 0.5]]
const archAt = (x: number, y: number): Px[] => [[x, y + 0.5, 0.5, 0.5], [x + 0.5, y, 0.5, 0.5], [x + 1, y + 0.5, 0.5, 0.5]]

// Each mood reads without any motion: the eyes, mouth, arms, chest light and
// a mark in a free corner say it still, so Reduce Motion loses nothing.
// Marks sit right of the head or in the top corners, inside the grid.
export const ROBOT_POSES: Readonly<Record<BrewMood, Pose>> = {
  idle: { eyes: { fill: SKY, px: EYES }, mouth: { fill: INK, px: [[5, 5.6, 2, 0.6]] }, chest: JADE, arms: ARMS_DOWN, mark: null },
  hover: {
    eyes: { fill: SKY, px: [[3.5, 3.1, 1.5, 1.5], [7, 3.1, 1.5, 1.5]] },
    mouth: { fill: INK, px: [[4.5, 5.3, 0.5, 0.5], [5, 5.7, 2, 0.5], [7, 5.3, 0.5, 0.5]] },
    chest: JADE,
    arms: { left: ARMS_DOWN.left, right: ARM_UP.right },
    mark: null,
  },
  thinking: {
    eyes: { fill: SKY, px: [[4, 3.1, 1.5, 1.5], [7.5, 3.1, 1.5, 1.5]] },
    mouth: { fill: INK, px: [[5.6, 5.6, 1, 0.6]] },
    chest: JADE,
    arms: ARMS_DOWN,
    mark: { fill: SKY, px: [[10.4, 2.4, 0.6, 0.6], [10.9, 1.4, 0.6, 0.6], [11.3, 0.4, 0.6, 0.6]] },
  },
  working: {
    eyes: { fill: SKY, px: [[3.5, 3.9, 1.5, 0.7], [7, 3.9, 1.5, 0.7]] },
    mouth: { fill: INK, px: [[5.2, 5.6, 1.6, 0.6]] },
    chest: GOLD,
    arms: { left: [1.4, 7.2, 1.2, 2], right: ARMS_DOWN.right },
    mark: null,
  },
  success: {
    eyes: { fill: SKY, px: [...archAt(3.5, 3.5), ...archAt(7, 3.5)] },
    mouth: { fill: INK, px: [[4.5, 5.2, 0.5, 0.5], [5, 5.6, 2, 0.6], [7, 5.2, 0.5, 0.5]] },
    chest: MINT,
    arms: ARM_UP,
    mark: { fill: GOLD, px: [[0.8, 0.3, 0.4, 1.4], [0.3, 0.8, 1.4, 0.4], [10.8, 0.7, 0.4, 1.4], [10.3, 1.2, 1.4, 0.4], [0.9, 3.4, 0.5, 0.5]] },
  },
  confused: {
    eyes: { fill: SKY, px: [[3.5, 3.5, 1.5, 1.5], [7.2, 3.2, 1, 1]] },
    mouth: { fill: INK, px: [[4.6, 5.8, 0.6, 0.5], [5.2, 5.5, 0.6, 0.5], [5.8, 5.8, 0.6, 0.5], [6.4, 5.5, 0.6, 0.5]] },
    chest: JADE,
    arms: ARMS_DOWN,
    mark: { fill: GOLD, px: [[10.4, 0.3, 1.5, 0.5], [10.4, 0.8, 0.5, 0.5], [11.4, 0.8, 0.5, 0.5], [11.4, 1.3, 0.5, 0.5], [10.9, 1.8, 0.5, 0.5], [10.9, 2.8, 0.5, 0.5]] },
  },
  error: {
    eyes: { fill: RED, px: [...crossAt(3.5, 3.5), ...crossAt(7, 3.5)] },
    mouth: { fill: INK, px: [[4.5, 6, 0.5, 0.5], [5, 5.6, 2, 0.5], [7, 6, 0.5, 0.5]] },
    chest: RED,
    arms: ARMS_DOWN,
    mark: { fill: RED, px: [[11, 0.3, 0.6, 1.6], [11, 2.3, 0.6, 0.6]] },
  },
}

const pixels = ({ fill, px }: Paint) => px.map(([x, y, width, height], i) => <rect key={i} x={x} y={y} width={width} height={height} fill={fill} />)

// BrewQuest, drawn in pixels: a small robot with a tea-cup antenna. It moves
// only inside its own box, which clips, so no mood reaches the text beside it.
export const Robot = ({ size = 44, mood = 'idle' }: { size?: number; mood?: BrewMood }) => {
  const pose = ROBOT_POSES[mood]
  const [lx, ly, lw, lh] = pose.arms.left
  const [rx, ry, rw, rh] = pose.arms.right

  return (
    <svg class="nt-robot" data-mood={mood} viewBox="0 0 12 12" width={size} height={size} role="presentation" aria-hidden="true" shape-rendering="crispEdges">
      <g class="nt-robot-cup">
        <rect x="5" y="0" width="2" height="1" fill={GOLD} />
        <rect x="5.5" y="1" width="1" height="1" fill={BROWN} />
      </g>
      <g class="nt-robot-head">
        <rect x="2" y="2" width="8" height="5" fill={FACE} stroke={INK} stroke-width="0.4" />
        <g class="nt-robot-eyes">{pixels(pose.eyes)}</g>
        <g class="nt-robot-mouth">{pixels(pose.mouth)}</g>
      </g>
      <rect x="3" y="7.5" width="6" height="3" fill={BODY} stroke={INK} stroke-width="0.4" />
      <rect class="nt-robot-chest" x="5" y="8.3" width="2" height="1.4" fill={pose.chest} />
      <rect class="nt-robot-arm left" x={lx} y={ly} width={lw} height={lh} fill={ARM} />
      <rect class="nt-robot-arm right" x={rx} y={ry} width={rw} height={rh} fill={ARM} />
      <rect x="3.6" y="10.6" width="1.6" height="1.2" fill={BROWN} />
      <rect x="6.8" y="10.6" width="1.6" height="1.2" fill={BROWN} />
      {pose.mark !== null && <g class="nt-robot-mark">{pixels(pose.mark)}</g>}
    </svg>
  )
}
