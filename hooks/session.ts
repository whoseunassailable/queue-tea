import type { EngineInterface } from 'claude-code'

import type { Ctx, Options } from './core/env/env'
import { hostOf } from './core/host/claude_host'
import { carryOverRecords, projectKey, recordPath } from './shared/records/data/datasources/record_source'
import { parseOffset } from './shared/time/domain/services/time'

// Where this session works: the repository's top folder (or the working
// directory outside one), its record file, and the local time offset.
export async function loadContext($: EngineInterface, options: Options): Promise<Ctx> {
  const host = hostOf($)
  const cwd = await $.session.cwd()
  const top = await host.run(['git', 'rev-parse', '--show-toplevel'], cwd)
  const projectPath = top.exitCode === 0 && top.stdout.trim() !== '' ? top.stdout.trim() : cwd
  const home = (await $.env.get('HOME')) ?? ''
  try {
    await carryOverRecords(host, home)
  } catch (err) {
    $.ui.log(`carrying over the Queue-tie records failed: ${err instanceof Error ? err.message : String(err)}`, { to: 'debug' })
  }
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
