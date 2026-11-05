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
export const codexLine = (path: string, briefFile: string): string => `cd ${shellQuote(path)} && codex ${CODEX_GUARD} "$(cat ${shellQuote(briefFile)})"`

// For copying when the brief file couldn't be written: pasted, it needs no file.
export const codexPasteLine = (path: string, brief: string): string => `cd ${shellQuote(path)} && codex ${CODEX_GUARD} ${shellQuote(brief)}`

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

// A session is open already, so its terminal only comes forward.
export const bringForwardArgv = (terminal: TerminalChoice, path: string): string[] => {
  if (terminal === 'terminal') return script('tell application "Terminal"', 'activate', 'repeat with queueTeaWindow in windows', 'repeat with queueTeaTab in tabs of queueTeaWindow', `if custom title of queueTeaTab is ${appleScriptText(path)} then`, 'set selected of queueTeaTab to true', 'set frontmost of queueTeaWindow to true', 'return', 'end if', 'end repeat', 'end repeat', 'end tell')
  if (terminal === 'iterm') return script('tell application "iTerm"', 'activate', 'repeat with queueTeaWindow in windows', 'repeat with queueTeaTab in tabs of queueTeaWindow', 'repeat with queueTeaSession in sessions of queueTeaTab', `if name of queueTeaSession is ${appleScriptText(path)} then`, 'select queueTeaSession', 'select queueTeaTab', 'select queueTeaWindow', 'return', 'end if', 'end repeat', 'end repeat', 'end repeat', 'end tell')

  return openVsCode(path)
}
