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

const script = (...lines: string[]): string[] => ['osascript', ...lines.flatMap(line => ['-e', line])]

// VS Code by name and not with `code`: an app opened from the Finder doesn't
// get the shell's PATH.
const openVsCode = (path: string): string[] => ['open', '-a', 'Visual Studio Code', path]

// A new window running claude in the project.
export const openClaudeArgv = (terminal: TerminalChoice, path: string): string[] => {
  const line = appleScriptText(claudeLine(path))
  if (terminal === 'terminal') return script(`tell application "Terminal" to do script ${line}`, 'tell application "Terminal" to activate')
  if (terminal === 'iterm') {
    return script('tell application "iTerm"', 'activate', 'set queueTeaWindow to (create window with default profile)', `tell current session of queueTeaWindow to write text ${line}`, 'end tell')
  }

  return openVsCode(path)
}

// A session is open already, so its terminal only comes forward.
export const bringForwardArgv = (terminal: TerminalChoice, path: string): string[] => {
  if (terminal === 'terminal') return script('tell application "Terminal" to activate')
  if (terminal === 'iterm') return script('tell application "iTerm" to activate')

  return openVsCode(path)
}
