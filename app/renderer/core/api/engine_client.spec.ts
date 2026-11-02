import { describe, expect, it, vi } from 'vitest'

import { ask } from './engine_client'

const engine = () => ({ log: vi.fn() })

describe('the one reply file', () => {
  it('hands back the data', async () => {
    expect(await ask(engine(), async () => ({ ok: true, data: 1 }))).toEqual({ ok: true, data: 1 })
  })

  it("hands back the engine's plain message", async () => {
    expect(await ask(engine(), async () => ({ ok: false, error: { message: 'plain' } }))).toEqual({ ok: false, message: 'plain' })
  })

  it('logs an exception and never shows its text', async () => {
    const e = engine()

    const answer = await ask(e, async () => {
      throw new Error('ipc blew up at 0x1f')
    })

    expect(answer).toMatchObject({ ok: false })
    expect(JSON.stringify(answer)).not.toContain('0x1f')
    expect(e.log.mock.calls[0]?.[1]).toContain('0x1f')
  })
})
