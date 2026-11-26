import type { BrowserWindowConstructorOptions } from 'electron'

import type { TerminalChoice } from '../../../shared/engine_api'

// Everything that differs between the Mac and Windows lives under platform/.
// Windows gets a file beside this one, with the same exports.
export const windowChrome: BrowserWindowConstructorOptions = {
  titleBarStyle: 'hiddenInset',
  trafficLightPosition: { x: 20, y: 18 },
}

// One word to the shell, whatever the folder is called.
export const shellQuote = (text: string): string => `'${text.replace(/'/g, `'\\''`)}'`

export const appleScriptText = (text: string): string => `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`

export const claudeLine = (path: string): string => `cd ${shellQuote(path)} && claude`

// Codex's own sandbox keeps .git read-only, and on-request makes it ask Rohan
// before anything runs outside it: the guard Codex has in place of the mod's.
const CODEX_GUARD = '--sandbox workspace-write --ask-for-approval on-request'

// The brief comes from a file: typed through AppleScript its quotes and lines would break.
const codexOptions = (args: string[]) => args.length === 0 ? '' : `${args.map(shellQuote).join(' ')} `

export const codexLine = (path: string, briefFile: string, args: string[] = []): string => `cd ${shellQuote(path)} && codex ${CODEX_GUARD} ${codexOptions(args)}"$(cat ${shellQuote(briefFile)})"`

// For copying when the brief file couldn't be written: pasted, it needs no file.
export const codexPasteLine = (path: string, brief: string, args: string[] = []): string => `cd ${shellQuote(path)} && codex ${CODEX_GUARD} ${codexOptions(args)}${shellQuote(brief)}`

const script = (...lines: string[]): string[] => ['osascript', ...lines.flatMap(line => ['-e', line])]

// VS Code by name and not with `code`: an app opened from the Finder doesn't
// get the shell's PATH.
const openVsCode = (path: string): string[] => ['open', '-a', 'Visual Studio Code', path]

// A new window running the line in the project.
export const openLineArgv = (terminal: TerminalChoice, path: string, shellLine: string): string[] => {
  const line = appleScriptText(shellLine)
  if (terminal === 'terminal') return script('tell application "Terminal"', `set queueTeaTab to do script ${line}`, `set custom title of queueTeaTab to ${appleScriptText(path)}`, 'activate', 'end tell')
  if (terminal === 'iterm') {
    return script('tell application "iTerm"', 'activate', 'set queueTeaWindow to (create window with default profile)', `set name of current session of queueTeaWindow to ${appleScriptText(path)}`, `tell current session of queueTeaWindow to write text ${line}`, 'end tell')
  }

  return openVsCode(path)
}

// What the bring-forward script prints, so a tab it didn't find isn't taken
// for one it brought forward.
export const FORWARD_FOUND = 'found'
export const FORWARD_MISSING = 'missing'

// The terminal a session's TERM_PROGRAM names, or null for one Queue-tea can't
// bring forward, where the chosen terminal is tried.
export const terminalOfProgram = (program: string | null): TerminalChoice | null =>
  program === 'Apple_Terminal' ? 'terminal' : program === 'iTerm.app' ? 'iterm' : program === 'vscode' ? 'vscode' : null

const found = `return "${FORWARD_FOUND}"`
const missing = `return "${FORWARD_MISSING}"`
// A terminal that isn't running holds no session, so it isn't started for one.
const unlessRunning = (app: string) => `if application "${app}" is not running then ${missing}`

// Each Terminal tab once, bringing forward the first that passes the test.
const terminalPass = (test: string): string[] => [
  'repeat with queueTeaWindow in windows',
  'repeat with queueTeaTab in tabs of queueTeaWindow',
  `if ${test} then`,
  'set selected of queueTeaTab to true',
  'set frontmost of queueTeaWindow to true',
  'activate',
  found,
  'end if',
  'end repeat',
  'end repeat',
]

// Each iTerm2 session once, bringing forward the first that passes the test.
const itermPass = (test: string): string[] => [
  'repeat with queueTeaWindow in windows',
  'repeat with queueTeaTab in tabs of queueTeaWindow',
  'repeat with queueTeaSession in sessions of queueTeaTab',
  `if ${test} then`,
  'select queueTeaSession',
  'select queueTeaTab',
  'select queueTeaWindow',
  'activate',
  found,
  'end if',
  'end repeat',
  'end repeat',
  'end repeat',
]

// A session is open already, so only its own tab comes forward: first the one
// on its tty, which no title the session sets can hide, then the one named
// after its folder, as the app names the tabs it opens. When neither is there
// the script prints missing and brings nothing forward.
export const bringForwardArgv = (terminal: TerminalChoice, path: string, tty: string | null = null): string[] => {
  const title = appleScriptText(path)
  if (terminal === 'terminal') {
    const byTty = tty === null ? [] : terminalPass(`tty of queueTeaTab is ${appleScriptText(tty)}`)

    return script(unlessRunning('Terminal'), 'tell application "Terminal"', ...byTty, ...terminalPass(`custom title of queueTeaTab is ${title}`), 'end tell', missing)
  }
  if (terminal === 'iterm') {
    const byTty = tty === null ? [] : itermPass(`tty of queueTeaSession is ${appleScriptText(tty)}`)

    return script(unlessRunning('iTerm'), 'tell application "iTerm"', ...byTty, ...itermPass(`name of queueTeaSession is ${title}`), 'end tell', missing)
  }

  return openVsCode(path)
}
