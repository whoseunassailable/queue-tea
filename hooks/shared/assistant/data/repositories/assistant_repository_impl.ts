import type { Ports } from '../../../../core/ports/ports'
import type { AssistantRepository } from '../../domain/repositories/assistant_repository'

export const assistantRepositoryImpl = (p: Ports): AssistantRepository => ({
  fork: prompt => p.ask.fork(prompt),
  clear: () => p.clear(),
  submit: (text, asUser) => p.submit(text, asUser),
})
