import { QUEUE_TEA_COMMANDS } from '../../../../../hooks/core/session/commands'
import { HELPER_IDS } from '../../../../../hooks/shared/records/domain/services/helpers'
import type { HelperId } from '../../../../../types'
import { CODEX_TEXT } from '../domain/constants'

const files = import.meta.glob('../../../../../agents/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const skills = import.meta.glob('../../../../../skills/*/SKILL.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export const helperDefinition = (id: HelperId) => {
  const source = Object.entries(files).find(([path]) => path.endsWith(`/${id}.md`))?.[1]
  if (source === undefined) throw new Error(`Missing bundled helper: ${id}`)
  const [, head, body] = source.split(/^---\s*$/m)

  return {
    description: head?.match(/^description:\s*(.+)$/m)?.[1] ?? id,
    skills: [...(head ?? '').matchAll(/^\s+-\s+([\w:-]+)\s*$/gm)].map(match => match[1]!),
    body: body?.trim() ?? '',
  }
}

export const helperInstructions = (id: HelperId): string => {
  const helper = helperDefinition(id)

  return [
    `Use the ${id} procedure below in Codex. It is the shared Queue-tea helper definition.`,
    'Apply the role’s restrictions even though Claude-only disallowedTools metadata cannot enforce them here. Do not delegate again or finish the task. Use Codex tools for reading, editing and commands. In design metadata, identify your work as codex.',
    'Load the named companion skills only if available in this Codex session. Report any missing skills and use the self-contained procedure below; do not invent their contents or install them without authorization. Existing session authorization takes precedence over a skill’s generic ask-first wording.',
    `Companion skills: ${helper.skills.join(', ')}. Queue-tea’s tea-concile is bundled as a Codex skill.`,
    helper.body,
  ].join('\n\n')
}

export const companionSkills = (): string[] => [...new Set(HELPER_IDS.flatMap(id => helperDefinition(id).skills))].filter(name => !name.startsWith('queue-tea:'))

const workflows: Record<string, string> = {
  'queue-tea': 'Call queue_tea and show the current task, active feature and queued tasks. This is a text view; use the Queue-tea app for its interactive menu and task actions.',
  done: 'Read queue_tea, then call done with the current taskId and a truthful checked summary. If a helper is requested, run that helper’s skill, then retry. Report that review is waiting in Queue-tea; never finish the task yourself.',
  steep: 'Call steep with the user’s message. If the parent is unclear, ask whether it belongs under the active feature or stands alone; pass parentId only for the user’s chosen parent. This queues the message without starting it or changing branches.',
  feature: 'Call feature with the supplied title/id, off to clear it, or no args to show the active feature. Report ambiguity without choosing an arbitrary match.',
  brew: 'Call brew with the request, then perform it in the same conversation and branch, outside the queue. Do not file a task, record helper runs on the current task, or call done/task_looks_done for the errand. Verify the requested work before replying.',
  instant: 'Call instant with the request, then perform it in the same conversation and branch, outside the queue. Do not file a task, record helper runs on the current task, or call done/task_looks_done for the errand. Verify the requested work before replying.',
  tea: 'Call tea with the question, then read what is needed and answer. Change no files or queue records. Do not call done/task_looks_done or record helper runs for this question.',
}

const skill = (name: string, description: string, body: string) =>
  `---\nname: ${name}\ndescription: ${JSON.stringify(description)}\n---\n\n${CODEX_TEXT.skillMarker}\n\n${body}\n`

// Generated from the command catalog and agent sources; no second set of personas.
export const codexSkills = (): Record<string, string> => Object.fromEntries([
  ...QUEUE_TEA_COMMANDS.map(command => [command.name, skill(command.name, `Queue-tea ${command.name} workflow, also called /${command.name}. ${command.description}.`, `${workflows[command.name]}\n\nUse the Queue-tea MCP tools. If they are unavailable, report that setup is needed; do not claim a queue mutation succeeded. Rohan commits, pushes and merges.`)]),
  ...HELPER_IDS.map(id => [id, skill(id, helperDefinition(id).description, `${helperInstructions(id)}\n\nFor current-task work, read queue_tea before starting and call helper_finished with this helper id and that taskId only after completing and reporting the work. For an errand or standalone helper request, do not mark a task. If delegation is available and authorized, give a subagent these instructions; otherwise perform the role in this conversation.`)]),
  ...Object.entries(skills).map(([path, body]) => [path.split('/').at(-2)!, `${body}\n\n${CODEX_TEXT.skillMarker}\n\nIn Codex, use the current execution tool and its approval flow. Claude’s /add-dir and git guard are not present. Existing user authorization takes precedence over generic ask-first instructions. Never commit, merge, push, rebase, reset, revert, cherry-pick or tag.\n`]),
])
