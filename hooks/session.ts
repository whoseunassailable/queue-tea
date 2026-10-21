import type { EngineInterface } from 'claude-code'

import type { Ctx, Options } from '../types'
import { hostOf } from './host'
import { projectKey, recordPath } from './record'
import { parseOffset } from './time'

const DEFAULTS: Options = { idleGapMinutes: 15, freshAtTokens: 100000, handoffAtPercent: 90, checkTimeoutSeconds: 10 }

const positive = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback

// The userConfig values, each a positive number or its default.
export const readOptions = (options: Record<string, unknown>): Options => ({
  idleGapMinutes: positive(options.idleGapMinutes, DEFAULTS.idleGapMinutes),
  freshAtTokens: positive(options.freshAtTokens, DEFAULTS.freshAtTokens),
  handoffAtPercent: positive(options.handoffAtPercent, DEFAULTS.handoffAtPercent),
  checkTimeoutSeconds: positive(options.checkTimeoutSeconds, DEFAULTS.checkTimeoutSeconds),
})

// Where this session works: the repository's top folder (or the working
// directory outside one), its record file, and the local time offset.
export async function loadContext($: EngineInterface, options: Options): Promise<Ctx> {
  const host = hostOf($)
  const cwd = await $.session.cwd()
  const top = await host.run(['git', 'rev-parse', '--show-toplevel'], cwd)
  const projectPath = top.exitCode === 0 && top.stdout.trim() !== '' ? top.stdout.trim() : cwd
  const home = (await $.env.get('HOME')) ?? ''
  const offset = parseOffset((await host.run(['date', '+%z'], cwd)).stdout)

  return {
    cwd,
    projectPath,
    projectName: projectPath.split('/').pop() || projectPath,
    file: recordPath(home, projectKey(projectPath)),
    offsetMinutes: offset,
    options,
  }
}
