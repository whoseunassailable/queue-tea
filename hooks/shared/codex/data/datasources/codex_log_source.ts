import type { Host } from '../../../../core/host/host'

const DAY = 86_400_000
const STAMP = /^\{"timestamp":"([^"]+)"/

// The folder a session ran in, from its first line, Codex's session_meta.
const folderOf = (firstLine: string): string | null => {
  try {
    const cwd = (JSON.parse(firstLine) as { payload?: { cwd?: unknown } } | null)?.payload?.cwd

    return typeof cwd === 'string' ? cwd : null
  } catch {
    // A first line Codex hasn't finished writing is no session to count yet.
    return null
  }
}

// ~/.codex/sessions/<yyyy>/<mm>/<dd>/rollout-*.jsonl, one folder per day a
// session started, one line per event, each starting with its timestamp. The
// folders are named by local date, so a day either side is read as well.
// shortcut: a session started over a day before `sinceMs` and resumed since is
// missed; read every day folder if Codex time comes up short.
export const readCodexActivity = async (host: Host, home: string, folder: string, sinceMs: number, nowMs: number): Promise<number[]> => {
  const stamps: number[] = []
  // From midnight, so the last step reaches the day after now's whatever the time of day.
  for (let day = Math.floor((sinceMs - DAY) / DAY) * DAY; day <= nowMs + DAY; day += DAY) {
    const dir = `${home}/.codex/sessions/${new Date(day).toISOString().slice(0, 10).replace(/-/g, '/')}`
    if (!(await host.exists(dir))) continue
    for (const name of await host.list(dir)) {
      const file = `${dir}/${name}`
      if (!name.endsWith('.jsonl') || ((await host.modifiedAt(file)) ?? 0) < sinceMs) continue
      const lines = (await host.read(file)).split('\n')
      if (folderOf(lines[0] ?? '') !== folder) continue
      for (const line of lines) {
        const ms = Date.parse(STAMP.exec(line)?.[1] ?? '')
        if (ms >= sinceMs) stamps.push(ms)
      }
    }
  }

  return stamps
}
