// Reads a shell command the way a shell splits it, closely enough to find
// every git or gh call that commits or pushes. Quoted text is one word, so
// `grep "git push"` is a grep; command substitutions and `sh -c` scripts are
// read as commands of their own.

const REFUSED_GIT = new Set(['commit', 'push', 'merge', 'rebase', 'cherry-pick', 'revert', 'pull', 'am'])
const WRAPPERS = new Set(['sudo', 'env', 'command', 'exec', 'time', 'nohup', 'nice', 'timeout', 'ionice', 'stdbuf', 'xargs'])
// Each wrapper's options that take the next word as their value.
const WRAPPER_VALUES: Record<string, readonly string[]> = {
  sudo: ['-u', '-g', '-C', '-h', '-p', '-r', '-t', '-U', '--user', '--group'],
  env: ['-u', '-C', '-S', '--unset', '--chdir'],
  nice: ['-n', '--adjustment'],
  timeout: ['-s', '-k', '--signal', '--kill-after'],
  ionice: ['-c', '-n', '-p'],
  stdbuf: ['-i', '-o', '-e'],
  xargs: ['-I', '-L', '-n', '-P', '-d', '-s', '-a', '-E'],
  exec: ['-a'],
}
// Shell words that come before a command without being one.
const RESERVED = new Set(['if', 'then', 'else', 'elif', 'do', 'while', 'until', '!', '{', '}', 'fi', 'done'])
const SHELLS = new Set(['bash', 'sh', 'zsh', 'dash', 'ksh'])
const GIT_OPTIONS_WITH_VALUE = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace'])

type Lexed = { commands: string[][]; subs: string[] }

// Reads `$(...)` from s[at] (just past the `$(`), nesting included; returns
// the inside and the index after the closing parenthesis.
const readParens = (s: string, at: number): [string, number] => {
  let depth = 1
  let i = at
  while (i < s.length && depth > 0) {
    if (s[i] === '(') depth += 1
    if (s[i] === ')') depth -= 1
    i += 1
  }

  return [s.slice(at, depth === 0 ? i - 1 : i), i]
}

const lex = (s: string): Lexed => {
  const commands: string[][] = [[]]
  const subs: string[] = []
  let word: string | null = null
  const add = (text: string) => {
    word = (word ?? '') + text
  }
  const end = () => {
    if (word !== null) commands[commands.length - 1]!.push(word)
    word = null
  }
  const split = () => {
    end()
    if (commands[commands.length - 1]!.length > 0) commands.push([])
  }

  let i = 0
  while (i < s.length) {
    const c = s[i]!
    const two = s.slice(i, i + 2)

    if (c === '\\') {
      add(s[i + 1] ?? '')
      i += 2
    } else if (c === "'") {
      const close = s.indexOf("'", i + 1)
      const stop = close < 0 ? s.length : close
      add(s.slice(i + 1, stop))
      i = stop + 1
    } else if (c === '"') {
      i += 1
      add('')
      while (i < s.length && s[i] !== '"') {
        if (s[i] === '\\') {
          add(s[i + 1] ?? '')
          i += 2
        } else if (s.slice(i, i + 2) === '$(') {
          const [inside, after] = readParens(s, i + 2)
          subs.push(inside)
          i = after
        } else if (s[i] === '`') {
          const close = s.indexOf('`', i + 1)
          const stop = close < 0 ? s.length : close
          subs.push(s.slice(i + 1, stop))
          i = stop + 1
        } else {
          add(s[i]!)
          i += 1
        }
      }
      i += 1
    } else if (two === '$(') {
      const [inside, after] = readParens(s, i + 2)
      subs.push(inside)
      add('$()')
      i = after
    } else if (c === '`') {
      const close = s.indexOf('`', i + 1)
      const stop = close < 0 ? s.length : close
      subs.push(s.slice(i + 1, stop))
      add('``')
      i = stop + 1
    } else if (two === '&&' || two === '||') {
      split()
      i += 2
    } else if (c === ';' || c === '|' || c === '&' || c === '\n' || c === '(' || c === ')') {
      split()
      i += 1
    } else if (c === ' ' || c === '\t') {
      end()
      i += 1
    } else {
      add(c)
      i += 1
    }
  }
  end()

  return { commands: commands.filter(words => words.length > 0), subs }
}

const isRefused = (words: string[]): boolean => {
  let i = 0
  let wrapper: string | null = null
  while (i < words.length) {
    const w = words[i]!
    if (RESERVED.has(w) || /^[A-Za-z_][A-Za-z0-9_]*=/.test(w)) {
      i += 1
    } else if (WRAPPERS.has(w)) {
      wrapper = w
      i += 1
    } else if (wrapper !== null && w.startsWith('-')) {
      i += (WRAPPER_VALUES[wrapper] ?? []).includes(w) ? 2 : 1
    } else if (wrapper === 'timeout' && /^\d/.test(w)) {
      i += 1
      wrapper = null
    } else {
      break
    }
  }
  const name = (words[i] ?? '').split('/').pop() ?? ''
  const rest = words.slice(i + 1)

  if (SHELLS.has(name)) {
    const flag = rest.findIndex(w => /^-[a-z]*c[a-z]*$/.test(w))
    const after = flag < 0 ? [] : rest.slice(flag + 1)
    const script = after[0] === '--' ? after[1] : after[0]

    return script !== undefined && isCommitOrPush(script)
  }
  if (name === 'find') {
    const exec = rest.findIndex(w => w === '-exec' || w === '-execdir' || w === '-ok')
    if (exec >= 0) {
      const end = rest.findIndex((w, j) => j > exec && (w === ';' || w === '+'))
      if (isRefused(rest.slice(exec + 1, end < 0 ? undefined : end))) return true
    }

    return false
  }
  if (name === 'eval') return isCommitOrPush(rest.join(' '))
  if (name === 'git') {
    let j = 0
    while (j < rest.length && rest[j]!.startsWith('-')) {
      j += GIT_OPTIONS_WITH_VALUE.has(rest[j]!) ? 2 : 1
    }

    return REFUSED_GIT.has(rest[j] ?? '')
  }
  if (name === 'gh') {
    const isRepoCreatePush = rest[0] === 'repo' && rest[1] === 'create' && rest.includes('--push')
    const isPrMerge = rest[0] === 'pr' && rest[1] === 'merge'

    return isRepoCreatePush || isPrMerge
  }

  return false
}

export const isCommitOrPush = (command: string): boolean => {
  const { commands, subs } = lex(command)

  return commands.some(isRefused) || subs.some(isCommitOrPush)
}
