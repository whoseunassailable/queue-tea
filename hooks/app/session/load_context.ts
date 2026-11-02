import type { EngineInterface } from 'claude-code'

import type { Ctx, Options } from '../../core/env/env'
import { portsOf } from '../../core/ports/claude_ports'
import { projectRepositoryOf } from '../../shared/records/records_providers'

// Where this session works, as every later step needs it.
export async function loadContext($: EngineInterface, options: Options): Promise<Ctx> {
  const cwd = await $.session.cwd()
  const home = (await $.env.get('HOME')) ?? ''
  const { projectPath, file, offsetMinutes } = await projectRepositoryOf(portsOf($)).locate(cwd, home)

  return {
    cwd,
    projectPath,
    projectName: projectPath.split('/').pop() || projectPath,
    file,
    offsetMinutes,
    options,
  }
}
