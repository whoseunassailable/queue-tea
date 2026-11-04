import type { Host } from '../../../../core/host/host'
import { parseOffset } from '../../../time/domain/services/time'
import type { ProjectPlace } from '../../domain/repositories/project_repository'
import { carryOverRecords, projectKey, recordPath } from './record_source'

// The repository's top folder (or the working directory outside one), its
// record file, and the local time offset.
export const readProjectPlace = async (host: Host, cwd: string, home: string, log: (text: string) => void): Promise<ProjectPlace> => {
  const top = await host.run(['git', 'rev-parse', '--show-toplevel'], cwd)
  const workingPath = top.exitCode === 0 && top.stdout.trim() !== '' ? top.stdout.trim() : cwd
  let projectPath = workingPath
  if (top.exitCode === 0) {
    const common = await host.run(['git', 'rev-parse', '--path-format=absolute', '--git-common-dir'], cwd)
    const dir = common.stdout.trim()
    if (common.exitCode === 0 && dir.endsWith('/.git')) projectPath = dir.slice(0, -5)
  }
  try {
    await carryOverRecords(host, home)
  } catch (err) {
    // The old folder is left as it was, so the session goes on without them.
    log(`carrying over the Queue-tie records failed: ${err instanceof Error ? err.message : String(err)}`)
  }
  const offsetMinutes = parseOffset((await host.run(['date', '+%z'], cwd)).stdout)

  return { projectPath, workingPath, file: recordPath(home, projectKey(projectPath)), offsetMinutes }
}
