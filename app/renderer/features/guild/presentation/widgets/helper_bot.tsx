import type { JSX } from 'preact'

import type { HelperId } from '../../../../../../types'

// What each helper holds, after its pun: Commit Chai-n swings a chain of
// commits, Mocha Mockup holds up a mockup, Chai-pter reads a chapter, Tea-DD
// shakes a test flask, and Tea-Concile holds up two branches joined into one,
// drawn in pixels. The hand that holds it is drawn over it.
// Tea-Concile's prop, cell by cell on a 4px grid: [part, column, row].
const PIXELS: readonly (readonly ['a' | 'b' | 'j', number, number])[] = [
  ['a', 0, 0], ['a', 0, 1], ['a', 1, 2], ['a', 2, 3],
  ['b', 6, 0], ['b', 6, 1], ['b', 5, 2], ['b', 4, 3],
  ['j', 3, 4], ['j', 3, 5], ['j', 3, 6], ['j', 3, 7],
]

const PROPS: Record<HelperId, JSX.Element> = {
  'commit-chai-n': (
    <g class="prop">
      <ellipse cx="97" cy="101" rx="4" ry="6" />
      <ellipse cx="97" cy="111" rx="1.6" ry="6" />
      <ellipse cx="97" cy="121" rx="4" ry="6" />
    </g>
  ),
  'mocha-mockup': (
    <g class="prop">
      <rect class="paper" x="91" y="58" width="25" height="33" rx="3" />
      <rect class="tint" x="94.5" y="62" width="18" height="6" rx="1.5" />
      <path d="M95 74h17M95 79h17M95 84h10" />
    </g>
  ),
  'chai-pter': (
    <g class="prop">
      <path class="paper" d="M87 84q7.5-4 15 0v16q-7.5-4-15 0zM102 84q7.5-4 15 0v16q-7.5-4-15 0z" />
      <path d="M90 89q4.5-2 9 0M90 94q4.5-2 9 0M105 89q4.5-2 9 0M105 94q4.5-2 9 0" />
    </g>
  ),
  'tea-dd': (
    <g class="prop">
      <path class="paper" d="M99 72v12l-8 16q-2 5 3 5h18q5 0 3-5l-8-16V72z" />
      <path class="tint" d="M93.5 96h19l2 4q2 5-3 5H94q-5 0-3-5z" />
      <circle class="tint" cx="101" cy="90" r="1.6" />
      <circle class="tint" cx="105" cy="85" r="1.2" />
    </g>
  ),
  // The target's strand (a), the task's strand (b) and what they become (j).
  // At work the two strands blink in turn; while a choice waits for Rohan the
  // joined stem stays dim.
  'tea-concile': (
    <g class="prop pixels" shape-rendering="crispEdges">
      {PIXELS.map(([part, col, row]) => (
        <rect key={`${col}-${row}`} class={`px ${part}`} x={90 + col * 4} y={56 + row * 4} width="4" height="4" />
      ))}
    </g>
  ),
}

// One helper as a little bot with arms, legs and its prop. Its mood (idle, at
// work, done, stuck, stopped) only sets a class: the theme moves it, and Calm
// mode or reduced motion keeps it still.
export const HelperBot = ({ id, mood, size = 120 }: { id: HelperId; mood: string; size?: number }) => (
  <svg class={`bot ${mood}`} viewBox="0 0 120 132" width={size} height={(size * 132) / 120} aria-hidden="true">
    <ellipse class="floor" cx="56" cy="125" rx="30" ry="4" />
    <g class="whole">
      <path class="limb" d="M46 100v14M66 100v14" />
      <ellipse class="foot" cx="45" cy="118" rx="8" ry="4.5" />
      <ellipse class="foot" cx="67" cy="118" rx="8" ry="4.5" />
      <g class="antenna">
        <path class="limb thin" d="M56 27q-2-9 2-17" />
        <circle class="tip" cx="58" cy="8" r="5" />
      </g>
      <path class="shell" d="M56 26c22 0 32 24 32 46 0 20-14 32-32 32S24 92 24 72c0-22 10-46 32-46z" />
      <ellipse class="shine" cx="42" cy="44" rx="7" ry="11" transform="rotate(25 42 44)" />
      <ellipse class="eye" cx="45" cy="60" rx="4.5" ry="7" />
      <ellipse class="eye" cx="67" cy="60" rx="4.5" ry="7" />
      <circle class="glint" cx="46.6" cy="56.6" r="1.6" />
      <circle class="glint" cx="68.6" cy="56.6" r="1.6" />
      <ellipse class="cheek" cx="37" cy="73" rx="5" ry="3" />
      <ellipse class="cheek" cx="75" cy="73" rx="5" ry="3" />
      <path class="smile" d="M51 72q5 4 10 0" />
      <g class="wave">
        <path class="limb" d="M27 75q-10 6-12 17" />
        <circle class="hand" cx="15" cy="93" r="5" />
      </g>
      <g class="hold">
        {PROPS[id]}
        <path class="limb" d="M85 75q9 7 11 16" />
        <circle class="hand" cx="96" cy="92" r="5" />
      </g>
    </g>
  </svg>
)
