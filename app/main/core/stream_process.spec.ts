import { expect, it } from 'vitest'
import { createLogger } from './logger'
import { streamProcess } from './stream_process'
const log = createLogger('dev', () => {})
it('delivers stdout before exit and returns the real exit code', async () => {
  let arrived!: () => void
  const first = new Promise<void>(resolve => { arrived = resolve })
  let finished = false; let output = ''
  const result = streamProcess(log, { argv: [process.execPath, '-e', "process.stdout.write('started\\n'); setTimeout(()=>{process.stderr.write('finished\\n');process.exit(3)},600)"], cwd: process.cwd() }, chunk => { output += chunk; arrived() }).then(r => { finished = true; return r })
  await first
  expect(output).toContain('started'); expect(finished).toBe(false)
  expect((await result).exitCode).toBe(3); expect(output).toContain('finished')
})
it('cancels a running process group and reports cancellation', async () => {
  const controller = new AbortController()
  const result = streamProcess(log, { argv: [process.execPath, '-e', "console.log('ready');setInterval(()=>{},1000)"], cwd: process.cwd(), signal: controller.signal }, () => controller.abort())
  expect((await result).exitCode).toBe(130)
})
it('bounds output and reports startup errors without hanging', async () => {
  const big = await streamProcess(log, { argv: [process.execPath, '-e', "process.stdout.write('a'.repeat(100000))"], cwd: process.cwd() })
  expect(big.stdout.length).toBeLessThanOrEqual(64000)
  expect((await streamProcess(log, { argv: ['/missing-queue-tea-test-command'], cwd: process.cwd() })).exitCode).toBe(1)
})
