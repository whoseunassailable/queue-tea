import { chmod, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const line = (event: object) => `${JSON.stringify(event)}\n`

// A stand-in for claude, put first on the app's PATH, so no Notes test spends
// tokens or depends on Claude Code being installed. It notes how it was run and
// prints what the test last said it should: BrewQuest reading, then answering,
// or Claude Code without BrewQuest, which the app turns into the checklist.
export const plantBrewQuest = async (home: string) => {
  const bin = join(home, 'brew-bin')
  await mkdir(bin, { recursive: true })
  await writeFile(
    join(bin, 'claude'),
    `#!/bin/sh
for arg in "$@"; do printf '%s\\n' "$arg"; done | head -c 400 >> '${home}/claude-calls'
printf '\\n---\\n' >> '${home}/claude-calls'
cat '${home}/claude-says'
`,
  )
  await chmod(join(bin, 'claude'), 0o755)
  await brewQuestIsMissing(home)

  return bin
}

// Claude Code that hasn't got the BrewQuest helper yet.
export const brewQuestIsMissing = (home: string) => writeFile(join(home, 'claude-says'), line({ type: 'system', subtype: 'init', agents: ['claude'] }))

// BrewQuest that reads a file, then answers with this draft.
export const brewQuestDrafts = (home: string, draft: object) =>
  writeFile(
    join(home, 'claude-says'),
    line({ type: 'system', subtype: 'init', agents: ['claude', 'queue-tea:brewquest'] }) +
      line({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Read', input: { file_path: 'CLAUDE.md' } }] } }) +
      line({ type: 'result', subtype: 'success', is_error: false, result: `Here is the draft.\n\n\`\`\`brewquest-draft\n${JSON.stringify(draft)}\n\`\`\`` }),
  )
