import type { Reply } from '../entities/reply'

// Claude Code as a helper: a reply over the conversation, a clear, a message.
export type AssistantRepository = {
  fork: (prompt: string) => Promise<Reply>
  clear: () => Promise<void>
  submit: (text: string, asUser?: boolean) => Promise<void>
}
