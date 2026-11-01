import type { Ask, Ports } from '../../../../core/ports/ports'
import type { CheckAnswer } from '../../../../shared/assistant/domain/entities/check_answer'
import type { CheckRepository } from '../../domain/repositories/check_repository'
import { parseCheckAnswer } from '../../domain/services/check_prompt'

const replyOf = async (ask: Ask, prompt: string): Promise<string | null> => {
  try {
    const forked = await ask.fork(prompt)
    const result = !forked.isAnswered && forked.reason === 'nothing-to-fork' ? await ask.complete(prompt) : forked
    if (result.isAnswered) return result.text
    ask.log(`message check not answered: ${result.reason}`)
  } catch (err) {
    ask.log(`message check failed: ${err instanceof Error ? err.message : String(err)}`)
  }

  return null
}

// The check's answer, or null when it timed out, wasn't answered or didn't
// parse; never a guess.
export const checkMessage = async (ask: Ask, prompt: string, timeoutMs: number): Promise<CheckAnswer | null> => {
  const reply = await Promise.race([
    replyOf(ask, prompt),
    ask.sleep(timeoutMs).then(() => 'timeout' as const),
  ])
  if (reply === 'timeout') {
    ask.log(`message check timed out after ${timeoutMs} ms`)

    return null
  }
  if (reply === null) return null

  const answer = parseCheckAnswer(reply)
  if (answer === null) ask.log(`message check reply did not parse (${reply.length} characters)`)

  return answer
}

export const checkRepositoryImpl = (p: Ports): CheckRepository => ({
  check: (prompt, timeoutMs) => checkMessage(p.ask, prompt, timeoutMs),
})
