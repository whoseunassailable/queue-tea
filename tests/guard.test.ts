import { expect, test } from 'claude-code/testing'

import { isCommitOrPush } from '../hooks/guard'

const TEXT = 'Queue-tea: commits and pushes are yours to make.'

const refused = [
  'git commit -m "x"',
  'git commit --amend',
  'git push',
  'git push --force',
  'git push --tags',
  'git merge main',
  'git rebase main',
  'git cherry-pick abc',
  'git revert abc',
  'git pull',
  'git am x.patch',
  'cd x && git commit -m y',
  'git -C /tmp/r commit -m y',
  'git -c user.name=a commit',
  'GIT_AUTHOR_NAME=a git commit',
  'bash -c "git push"',
  "sh -c 'git commit -m x'",
  'echo $(git commit -m x)',
  'echo "$(git push)"',
  'echo `git push`',
  'gh repo create a/b --push --source .',
  'gh pr merge 12',
  'git status; git push origin main',
  'git add . && git commit -m wip | cat',
  '/usr/bin/git push',
  'sudo git push',
  'eval "git push"',
]

const allowed = [
  'git status',
  'git log --oneline',
  'git diff',
  'git branch',
  'git switch -c task/x',
  'grep -r "git push" docs/',
  'echo "git commit"',
  "echo 'git push && git commit'",
  'gh pr view 12',
  'gh repo create a/b',
  'ls -la',
  'git -C /r status --porcelain=v2 --branch',
]

test('refuses every commit and push', () => {
  for (const command of refused) {
    expect([command, isCommitOrPush(command)]).toEqual([command, true])
  }
})

test('allows the rest', () => {
  for (const command of allowed) {
    expect([command, isCommitOrPush(command)]).toEqual([command, false])
  }
})

test('the hook denies with the spec text', async ($, on) => {
  let ran = false
  on('tool.call', () => {
    ran = true

    return { result: {} }
  })

  const answer = await $.tool.call({ tool: 'Bash', command: 'git push' })

  expect(JSON.stringify(answer)).toContain(TEXT)
  expect(ran).toBe(false)
})

test('a helper’s commits and pushes are refused too, its reads let through', async ($, on) => {
  const ran: string[] = []
  on('tool.call', ($, e) => {
    ran.push(`${e.agentId ?? 'main'}: ${e.tool === 'Bash' ? e.command : e.tool}`)

    return { result: {} }
  })
  // A call from a subagent's loop, as when Commit Chai-n runs a command.
  const inHelper = { agentId: 'commit-chai-n-1' }

  const push = await $.tool.call({ tool: 'Bash', command: 'git push -u origin task/x', ...inHelper })
  const merge = await $.tool.call({ tool: 'Bash', command: 'gh pr merge 12 --squash', ...inHelper })
  await $.tool.call({ tool: 'Bash', command: 'git status', ...inHelper })

  expect(JSON.stringify(push)).toContain(TEXT)
  expect(JSON.stringify(merge)).toContain(TEXT)
  expect(ran).toEqual(['commit-chai-n-1: git status'])
})

test('the hook passes git status through', async ($, on) => {
  let ran = false
  on('tool.call', () => {
    ran = true

    return { result: {} }
  })

  await $.tool.call({ tool: 'Bash', command: 'git status' })

  expect(ran).toBe(true)
})

const refusedShell = [
  'if true; then git push; fi',
  'for f in a; do git commit -m x; done',
  'if x; then echo; else git commit -m y; fi',
  'while true; do git push; done',
  'true || { git commit -m x; }',
  '! git push',
  'timeout 30 git push',
  'sudo -u bob git push',
  'env -u X git push',
  'nice -n 5 git push',
  'xargs git commit -m x',
  'find . -name x -exec git commit -m y \;',
  'bash -c -- "git push"',
  'dash -c "git push"',
  'ksh -c "git commit -m x"',
]
const allowedShell = [
  'timeout 30 git status',
  'xargs grep x',
  'find . -name "*.ts" -exec ls {} \;',
  'if [ -f x ]; then echo yes; fi',
  'sudo -u bob ls',
]

test('refuses commits and pushes inside shell grammar and wrappers', () => {
  for (const command of refusedShell) {
    expect([command, isCommitOrPush(command)]).toEqual([command, true])
  }
})

test('allows harmless commands inside shell grammar and wrappers', () => {
  for (const command of allowedShell) {
    expect([command, isCommitOrPush(command)]).toEqual([command, false])
  }
})

test('the Monitor tool is guarded too', async ($, on) => {
  let ran = false
  on('tool.call', () => {
    ran = true

    return { result: {} }
  })

  const answer = await $.tool.call({ tool: 'Monitor', description: 'x', timeout_ms: 1000, command: 'git push' })

  expect(JSON.stringify(answer)).toContain(TEXT)
  expect(ran).toBe(false)
})

test('wrapper options are read per wrapper', () => {
  for (const command of ['env -i git push', 'sudo -E git push', 'xargs -0 git commit -m x', 'stdbuf -o L git push', 'xargs -I {} git commit -m {}']) {
    expect([command, isCommitOrPush(command)]).toEqual([command, true])
  }
})
