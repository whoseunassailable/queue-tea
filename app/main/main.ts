import { randomBytes } from 'node:crypto'
import { appendFileSync } from 'node:fs'
import { join } from 'node:path'

import { app, BrowserWindow, ipcMain, shell } from 'electron'

import { CHANNELS } from '../shared/engine_api'
import { LOG_FILE, projectsFolder, SETTINGS_FILE, WATCH_SETTLE_MS, WINDOW } from './core/constants'
import { appIdOf, flavorOf } from './core/flavor'
import { createLogger, fileSink } from './core/logger'
import { nodeHost } from './core/node_host'
import { windowChrome } from './core/platform/mac'
import { watchFolders } from './core/watcher'
import { readGame } from './features/game/api/game_api'
import { listProjects, readProject } from './features/projects/api/projects_api'
import { readSettings, saveSettings } from './features/settings/api/settings_api'
import * as tasks from './features/tasks/api/tasks_api'
import { sessionsFolder } from '../../hooks/shared/sessions/domain/services/session_rules'

// How often the window hears from main with no file event, so a session that
// stopped sending heartbeats goes stale on screen.
const SWEEP_MS = 5_000
const STALE_CHECK_MS = 30_000

const flavor = flavorOf(process.env.QUEUE_TEA_FLAVOR, app.isPackaged)
app.setAppUserModelId(appIdOf(flavor))
app.setName(flavor === 'prod' ? 'Queue-tea' : `Queue-tea ${flavor}`)
const userData = process.env.QUEUE_TEA_USER_DATA ?? join(app.getPath('appData'), app.getName())
app.setPath('userData', userData)

const logFile = join(app.getPath('logs'), LOG_FILE)
const log = createLogger(flavor, fileSink(logFile, flavor))

// Whatever slips through is logged, so nothing fails silently.
process.on('uncaughtException', err => log.error('uncaught exception in main', err))
process.on('unhandledRejection', err => log.error('unhandled rejection in main', err))

const home = (process.env.HOME ?? app.getPath('home')).replace(/\/+$/, '')
const host = nodeHost(log, async url => {
  try {
    await shell.openExternal(url)

    return { exitCode: 0, stdout: '', stderr: '' }
  } catch (err) {
    return { exitCode: 1, stdout: '', stderr: err instanceof Error ? err.message : String(err) }
  }
})
const projects = { host, home, now: () => Date.now(), log }
const game = { ...projects, offsetMinutes: () => -new Date().getTimezoneOffset() }
const settings = { host, file: join(app.getPath('userData'), SETTINGS_FILE), log }
const quests = { ...game, newId: () => `t-${randomBytes(4).toString('hex')}` }

const serveEngine = () => {
  ipcMain.handle(CHANNELS.listProjects, () => listProjects(projects))
  ipcMain.handle(CHANNELS.readProject, (_, key: unknown) => readProject(projects, key))
  ipcMain.handle(CHANNELS.readGame, () => readGame(game))
  ipcMain.handle(CHANNELS.readSettings, () => readSettings(settings))
  ipcMain.handle(CHANNELS.saveSettings, (_, patch: unknown) => saveSettings(settings, patch))
  ipcMain.handle(CHANNELS.readChoices, (_, key: unknown, taskId: unknown) => tasks.readChoices(quests, key, taskId))
  ipcMain.handle(CHANNELS.setPriority, (_, key: unknown, taskId: unknown, priority: unknown) => tasks.setPriority(quests, key, taskId, priority))
  ipcMain.handle(CHANNELS.togglePlayNext, (_, key: unknown, taskId: unknown) => tasks.togglePlayNext(quests, key, taskId))
  ipcMain.handle(CHANNELS.fileQuest, (_, key: unknown, quest: unknown) => tasks.fileQuest(quests, key, quest))
  ipcMain.handle(CHANNELS.moveQuest, (_, key: unknown, taskId: unknown, parentId: unknown) => tasks.moveQuest(quests, key, taskId, parentId))
  ipcMain.handle(CHANNELS.sealQuest, (_, key: unknown, taskId: unknown, seal: unknown) => tasks.sealQuest(quests, key, taskId, seal))
  ipcMain.handle(CHANNELS.unsealQuest, (_, key: unknown, taskId: unknown) => tasks.unsealQuest(quests, key, taskId))
  ipcMain.handle(CHANNELS.removeQuest, (_, key: unknown, taskId: unknown) => tasks.removeQuest(quests, key, taskId))
  ipcMain.handle(CHANNELS.restoreQuest, (_, key: unknown, taskId: unknown) => tasks.restoreQuest(quests, key, taskId))
  ipcMain.handle(CHANNELS.editQuest, (_, key: unknown, taskId: unknown, edit: unknown) => tasks.editQuest(quests, key, taskId, edit))
  ipcMain.handle(CHANNELS.setActiveSaga, (_, key: unknown, taskId: unknown) => tasks.setActiveSaga(quests, key, taskId))
  ipcMain.on(CHANNELS.log, (_, level: unknown, text: unknown) => {
    const line = `window: ${String(text)}`
    if (level === 'warn') log.warn(line)
    else log.error(line)
  })
}

const openWindow = async (): Promise<BrowserWindow> => {
  const window = new BrowserWindow({
    ...WINDOW,
    ...windowChrome,
    show: false,
    title: 'Queue-tea',
    webPreferences: { preload: join(__dirname, '../preload/preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false },
  })
  window.once('ready-to-show', () => window.show())
  // Nothing inside the app navigates away from it.
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  window.webContents.on('render-process-gone', (_, details) => log.error(`the window's process ended: ${details.reason}`))

  const devServer = process.env.ELECTRON_RENDERER_URL
  if (devServer !== undefined) await window.loadURL(devServer)
  else await window.loadFile(join(__dirname, '../renderer/index.html'))

  return window
}

const tellWindows = () => {
  for (const window of BrowserWindow.getAllWindows()) window.webContents.send(CHANNELS.changed)
}

const start = async () => {
  serveEngine()
  await openWindow()
  try {
    await watchFolders([projectsFolder(home), sessionsFolder(home)], tellWindows, { settleMs: WATCH_SETTLE_MS, sweepMs: SWEEP_MS, log })
  } catch (err) {
    log.error("watching ~/.queue-tea failed, so changes show when the app is reopened", err)
  }
  setInterval(tellWindows, STALE_CHECK_MS)
}

app
  .whenReady()
  .then(start)
  .catch(err => {
    // The logger may be the thing that failed, so this one goes straight down.
    appendFileSync(logFile, `${String(err)}\n`)
    app.quit()
  })

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) openWindow().catch(err => log.error('opening a window failed', err))
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
