import { beforeEach, expect, it, vi } from 'vitest'
import { updateService } from './update_service'
import { readUpdate, queuePublished } from '../../../../tools/update_runner.mjs'
import { createLogger } from '../../../core/logger'

vi.mock('../../../../tools/update_runner.mjs', () => ({ readUpdate: vi.fn(async () => null), queuePublished: vi.fn(async () => true), updateFolder: () => '/unused' }))
beforeEach(() => vi.mocked(readUpdate).mockReset().mockResolvedValue(null))
const setup = (busy = false, enabled = true) => {
  const restart = vi.fn(async () => {})
  const service = updateService({ running: { version: '1.5.2', commit: 'a'.repeat(40) }, repository: '/repo/.git', enabled, tools: '/trusted/tools', isBusy: async () => busy,
    installed: async () => ({ version: '1.5.2', commit: 'b'.repeat(40) }), restart, log: createLogger('dev', () => {}) })
  return { service, restart }
}
it('detects a changed source at the same version and restarts only when safe', async () => {
  const safe = setup(); expect((await safe.service.read()).canRestart).toBe(true)
  await safe.service.apply(); expect(safe.restart).toHaveBeenCalledOnce()
  const busy = setup(true); expect((await busy.service.read()).canRestart).toBe(false)
  await busy.service.apply(); expect(busy.restart).not.toHaveBeenCalled()
})
it('blocks restart during installation and offers retry after failure, beside the installed build', async () => {
  vi.mocked(readUpdate).mockResolvedValue({ repository: '/repo/.git', phase: 'installing', commit: 'b'.repeat(40), detail: null })
  const { service } = setup(); expect(await service.read()).toMatchObject({ canRestart: false, canRetry: false })
  vi.mocked(readUpdate).mockResolvedValue({ repository: '/repo/.git', phase: 'failed', commit: 'b'.repeat(40), detail: 'Retry' })
  expect(await service.read()).toMatchObject({ canRestart: true, canRetry: true })
})
it('a later push queued, building or failed does not block restarting into the build an earlier push installed', async () => {
  for (const phase of ['queued', 'checking', 'building', 'verifying', 'failed'] as const) {
    vi.mocked(readUpdate).mockResolvedValue({ repository: '/repo/.git', phase, commit: 'c'.repeat(40), detail: null })
    expect((await setup().service.read()).canRestart, phase).toBe(true)
  }
})
it('never offers a restart while the next build is being swapped into the Applications folder', async () => {
  vi.mocked(readUpdate).mockResolvedValue({ repository: '/repo/.git', phase: 'installing', commit: 'c'.repeat(40), detail: null })
  expect((await setup().service.read()).canRestart).toBe(false)
})
it('shows and retries a launch failure even when its state could not be saved', async () => {
  vi.mocked(queuePublished).mockRejectedValueOnce(new Error('State directory unavailable'))
  const { service, restart } = setup()
  await service.published('/repo', 'origin', 'main', 'c'.repeat(40))
  expect(await service.read()).toMatchObject({ state: { phase: 'failed', detail: expect.stringContaining('push succeeded') }, canRetry: true, canRestart: true })
  await service.apply()
  expect(restart).not.toHaveBeenCalled()
  expect(queuePublished).toHaveBeenLastCalledWith({ repo: '/repo', remote: 'origin', branch: 'main', commit: 'c'.repeat(40) }, { repository: '/repo/.git', tools: '/trusted/tools', retry: true })
})
it('keeps stage/development and unrelated repository state away from production updates', async () => {
  const disabled = setup(false, false); expect(await disabled.service.read()).toMatchObject({ canRestart: false, canRetry: false })
  vi.mocked(queuePublished).mockClear()
  await disabled.service.published('/repo', 'origin', 'main', 'c'.repeat(40)); expect(queuePublished).not.toHaveBeenCalled()
  vi.mocked(readUpdate).mockResolvedValue({ repository: '/other/.git', phase: 'failed', commit: 'b'.repeat(40), detail: null })
  expect((await setup().service.read()).state.phase).toBe('idle')
})
