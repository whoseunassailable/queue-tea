import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

import { QUEUE_TEA_COMMANDS } from '../../../../../hooks/core/session/commands'
import { HELPER_IDS } from '../../../../../hooks/shared/records/domain/services/helpers'
import type { Logger } from '../../../core/logger'
import { CODEX_LIMITS, CODEX_TEXT } from '../domain/constants'
import { CodexRefusal, codexOperations } from '../domain/operations'
import type { CodexContext } from '../domain/operations'
import { helperInstructions } from './definitions'

export const createCodexServer = (context: CodexContext, log: Logger) => {
  const server = new McpServer({ name: 'queue-tea', version: '1.0.0' }, { instructions: CODEX_TEXT.instructions })
  const ops = codexOperations(context)
  const run = async (work: () => Promise<unknown> | unknown): Promise<CallToolResult> => {
    try {
      return { content: [{ type: 'text', text: JSON.stringify(await work()) }] }
    } catch (err) {
      log.error('Queue-tea Codex tool failed', err)

      return { isError: true, content: [{ type: 'text', text: err instanceof CodexRefusal ? err.message : CODEX_TEXT.failure }] }
    }
  }
  const description = (name: string) => QUEUE_TEA_COMMANDS.find(c => c.name === name)!.description
  const annotations = (readOnlyHint: boolean) => ({ readOnlyHint, destructiveHint: false, openWorldHint: false })
  const message = z.string().trim().min(1).max(CODEX_LIMITS.message)
  const taskId = z.string().trim().min(1).max(200)
  const helper = z.enum(HELPER_IDS as ['commit-chai-n', 'mocha-mockup', 'chai-pter', 'tea-dd'])
  const reviewInput = z.object({ taskId, checked: z.string().trim().max(CODEX_LIMITS.checked).default('') }).strict()

  server.registerTool('queue_tea', { description: 'Read Queue-tea’s current task, feature and priority queue in this folder. Use the desktop app for the interactive menu.', inputSchema: z.object({}).strict(), annotations: annotations(true) }, () => run(ops.queue))
  for (const name of ['brew', 'instant', 'tea'] as const) {
    server.registerTool(name, { description: description(name), inputSchema: z.object({ request: message }).strict(), annotations: annotations(true) }, ({ request }) => run(() => ops.errand(name === 'tea' ? 'tea' : 'brew', request)))
  }
  server.registerTool('steep', { description: description('steep'), inputSchema: z.object({ message, title: z.string().trim().min(1).max(CODEX_LIMITS.title).optional(), parentId: taskId.optional() }).strict(), annotations: annotations(false) }, input => run(() => ops.steep(input.message, input.title, input.parentId)))
  server.registerTool('feature', { description: description('feature'), inputSchema: z.object({ args: z.string().trim().max(CODEX_LIMITS.title).default('') }).strict(), annotations: annotations(false) }, ({ args }) => run(() => ops.feature(args)))
  for (const name of ['done', 'task_looks_done']) {
    server.registerTool(name, { description: `${description('done')}. Supply the taskId from queue_tea. Does not finish it.`, inputSchema: reviewInput, annotations: annotations(false) }, ({ taskId, checked }) => run(() => ops.review(taskId, checked)))
  }
  server.registerTool('helper_instructions', { description: 'Read the shared instructions and companion skill names for a Queue-tea helper. Does not launch a model or mark the helper as run.', inputSchema: z.object({ helper }).strict(), annotations: annotations(true) }, ({ helper }) => run(() => ({ instructions: helperInstructions(helper) })))
  server.registerTool('helper_finished', { description: 'Record a helper after its work has actually completed on the supplied current task. Never call for brew/instant/tea errands.', inputSchema: z.object({ taskId, helper }).strict(), annotations: annotations(false) }, ({ taskId, helper }) => run(() => ops.helperFinished(taskId, helper)))

  return server
}
