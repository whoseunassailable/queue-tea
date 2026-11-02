import type { Color, EngineInterface, RenderElement, RenderInput } from 'claude-code'

import type { Allowance, OtherProject, Priority, ProjectRecord, Task } from '../../../types'
import type { Ports, View } from '../ports/ports'

export function resolvePane($: EngineInterface, e: RenderInput<'Pane'>) {
  return $.ui.resolve(e)
}
type Els = ReturnType<typeof resolvePane>

// What every view of the menu draws from.
export type MenuContext = {
  e: RenderInput<'Pane'>
  p: Ports
  Box: Els['Box']
  Text: Els['Text']
  Button: Els['Button']
  view: View['menuView']
  cols: number
  now: number
  today: string
  offset: number
  record: ProjectRecord | null
  tasks: Task[]
  current: Task | null
  budget: View['budget']
  queue: Task[]
  blocked: Task[]
  waiting: number
  feature: Task | null
  others: OtherProject[]
  allowance: Allowance | null
  hold: View['hold']
  isAskingDone: boolean
  isChoosingNext: boolean
  canContinue: boolean
  openRow: string | null
  checked: string | null
  busy: string | null
  drift: string[]
  mismatch: string | null
  openParents: string[]
  done: Task[]
  minutes: number[]
  header: RenderElement
  lines: RenderElement
  hints: RenderElement
  top: RenderElement
  bar: (color: Color, text: string) => RenderElement
  tag: (p: Priority) => RenderElement
}
