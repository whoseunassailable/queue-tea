import { describe, expect, it, vi } from 'vitest'

import { updateWatch } from './update_watch'

const setup = ({ installed = '1.5.0' as string | null, isAway = true, isBusy = false, says = false } = {}) => {
  const restart = vi.fn(async () => {})
  const ask = vi.fn(async () => says)
  const log = { error: vi.fn() }
  const check = updateWatch({ running: { version: '1.4.0', commit: 'a'.repeat(40) }, installed: async () => installed === null ? null : { version: installed, commit: 'a'.repeat(40) }, isAway: () => isAway, isBusy: async () => isBusy, ask, restart, log })

  return { check, restart, ask, log }
}

describe('moving to the installed version', () => {
  it('restarts for a changed source commit at the same displayed version, after work is safe', async () => {
    let busy = true
    const restart = vi.fn(async () => {})
    const check = updateWatch({ running: { version: '1.5.2', commit: 'a'.repeat(40) }, installed: async () => ({ version: '1.5.2', commit: 'b'.repeat(40) }), isAway: () => true, isBusy: async () => busy, ask: vi.fn(), restart, log: { error: vi.fn() } })
    await check(); expect(restart).not.toHaveBeenCalled()
    busy = false; await check(); expect(restart).toHaveBeenCalledWith(false)
  })

  it('never restarts a busy app for a major update even after an earlier confirmation', async () => {
    const { check, restart, ask } = setup({ installed: '2.0.0', isAway: false, isBusy: true, says: true })
    await check(); expect(ask).not.toHaveBeenCalled(); expect(restart).not.toHaveBeenCalled()
  })
  it('does nothing while the installed copy is the one running', async () => {
    const { check, restart, ask, log } = setup({ installed: '1.4.0' })

    await check()

    expect(restart).not.toHaveBeenCalled()
    expect(ask).not.toHaveBeenCalled()
    expect(log.error).not.toHaveBeenCalled()
  })

  it('restarts quietly, behind what you are using, once you step away', async () => {
    const { check, restart, ask } = setup()

    await check()

    expect(restart).toHaveBeenCalledWith(false)
    expect(ask).not.toHaveBeenCalled()
  })

  it('waits while you are using the window, without asking about a small update', async () => {
    const { check, restart, ask } = setup({ isAway: false })

    await check()

    expect(restart).not.toHaveBeenCalled()
    expect(ask).not.toHaveBeenCalled()
  })

  it('waits while something is half done, even when you are away', async () => {
    const { check, restart } = setup({ isBusy: true })

    await check()

    expect(restart).not.toHaveBeenCalled()
  })

  it('asks once about a new major version while you use the window, and restarts in front on yes', async () => {
    const { check, restart, ask } = setup({ installed: '2.0.0', isAway: false, says: true })

    await check()

    expect(ask).toHaveBeenCalledWith('2.0.0')
    expect(restart).toHaveBeenCalledWith(true)
  })

  it('takes Later as an answer and never asks again', async () => {
    const { check, restart, ask } = setup({ installed: '2.0.0', isAway: false, says: false })

    await check()
    await check()

    expect(ask).toHaveBeenCalledOnce()
    expect(restart).not.toHaveBeenCalled()
  })

  it('moves to a major version without asking when you are away', async () => {
    const { check, restart, ask } = setup({ installed: '2.0.0' })

    await check()

    expect(ask).not.toHaveBeenCalled()
    expect(restart).toHaveBeenCalledWith(false)
  })

  it('logs a failed restart and tries again on the next check', async () => {
    const { check, restart, log } = setup()
    restart.mockRejectedValueOnce(new Error('no shell'))

    await check()
    await check()

    expect(log.error).toHaveBeenCalledOnce()
    expect(restart).toHaveBeenCalledTimes(2)
  })

  it('does nothing when the installed copy says no version', async () => {
    const { check, restart } = setup({ installed: null })

    await check()

    expect(restart).not.toHaveBeenCalled()
  })
})
