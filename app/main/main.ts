import { randomBytes } from 'node:crypto'
import { appendFileSync } from 'node:fs'
import { join } from 'node:path'

import { app, BrowserWindow, clipboard, dialog, ipcMain, Menu, Notification, shell } from 'electron'

import { CHANNELS } from '../shared/engine_api'
import type { MenuItem, Opened } from '../shared/engine_api'
import { appMenu } from './core/app_menu'
import { GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, projectsFolder, SETTINGS_FILE, WATCH_SETTLE_MS, WINDOW } from './core/constants'
import { appIdOf, flavorOf } from './core/flavor'
import { createLogger, fileSink } from './core/logger'
import { MESSAGES } from './core/messages'
import { nodeHost } from './core/node_host'
import { windowChrome } from './core/platform/mac'
import { reply } from './core/reply'
import { watchFolders } from './core/watcher'
import { readChronicle } from './features/chronicle/api/chronicle_api'
import { readGame, readHoard } from './features/game/api/game_api'
import { readMana } from './features/mana/api/mana_api'
import { githubApi } from './features/github/api/github_api'
import { libraryApi } from './features/library/api/library_api'
import { judgementWatch } from './features/notify/domain/judgements'
import type { Asked } from './features/notify/domain/judgements'
import { installCommand, openedFromUrl } from './features/opening/api/opening_api'
import { scanRecords } from './features/projects/data/projects_source'
import { listProjects, readProject } from './features/projects/api/projects_api'
import * as realms from './features/realms/api/realms_api'
import { DEFAULT_SETTINGS, readSettings, saveSettings } from './features/settings/api/settings_api'
import * as back from './features/tasks/api/back_api'
import { readQuestFacts } from './features/tasks/api/detail_api'
import * as finish from './features/tasks/api/finish_api'
import * as live from './features/tasks/api/live_api'
import * as setOut from './features/tasks/api/start_api'
import * as tasks from './features/tasks/api/tasks_api'
import { sessionsFolder } from '../../hooks/shared/sessions/domain/services/session_rules'

// How often the window hears from main with no file event, so a session that
// stopped sending heartbeats goes stale on screen.
const SWEEP_MS = 5_000
const STALE_CHECK_MS = 30_000

// Set by the build: empty for prod and for development.
declare const QUEUE_TEA_BUILT_FLAVOR: string

const flavor = flavorOf(process.env.QUEUE_TEA_FLAVOR ?? (QUEUE_TEA_BUILT_FLAVOR || undefined), app.isPackaged)
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
const quests = {
  ...game,
  newId: () => `t-${randomBytes(4).toString('hex')}`,
  terminal: async () => {
    const chosen = await readSettings(settings)

    return chosen.ok ? chosen.data.terminal : DEFAULT_SETTINGS.terminal
  },
  copy: (text: string) => clipboard.writeText(text),
}

const places = {
  ...game,
  commandDirs: ['/usr/local/bin', '/opt/homebrew/bin', `${home}/.local/bin`],
  reveal: (path: string) => shell.showItemInFolder(path),
  pickFolder: async () => {
    const window = BrowserWindow.getFocusedWindow()
    const options = { properties: ['openDirectory' as const, 'createDirectory' as const] }
    const picked = window === null ? await dialog.showOpenDialog(options) : await dialog.showOpenDialog(window, options)

    return picked.canceled ? null : (picked.filePaths[0] ?? null)
  },
}

const github = githubApi({ host, home, log, ghPaths: [`${home}/.local/bin/gh`, ...GH_PATHS], codeWaitMs: GH_CODE_WAIT_MS, loginWaitMs: GH_LOGIN_WAIT_MS })
const library = libraryApi({ ...game, newId: () => `b-${randomBytes(4).toString('hex')}` })

const serveEngine = () => {
  ipcMain.handle(CHANNELS.listProjects, () => listProjects(projects))
  ipcMain.handle(CHANNELS.readProject, (_, key: unknown) => readProject(projects, key))
  ipcMain.handle(CHANNELS.readGame, () => readGame(game))
  ipcMain.handle(CHANNELS.readHoard, () => readHoard(game))
  ipcMain.handle(CHANNELS.readChronicle, (_, scope: unknown, day: unknown) => readChronicle(game, scope, day))
  ipcMain.handle(CHANNELS.readMana, (_, key: unknown) => readMana(quests, key))
  ipcMain.handle(CHANNELS.readSettings, () => readSettings(settings))
  ipcMain.handle(CHANNELS.saveSettings, (_, patch: unknown) => saveSettings(settings, patch))
  ipcMain.handle(CHANNELS.readSettingsPage, (_, key: unknown) => realms.readSettingsPage(places, key))
  ipcMain.handle(CHANNELS.setTaskLog, (_, key: unknown, path: unknown) => realms.setTaskLog(places, key, path))
  ipcMain.handle(CHANNELS.showRecord, (_, key: unknown) => realms.showRecord(places, key))
  ipcMain.handle(CHANNELS.openFolder, () => realms.openFolder(places))
  ipcMain.handle(CHANNELS.addProject, (_, path: unknown) => realms.addProject(places, path))
  ipcMain.handle(CHANNELS.restoreRealm, (_, key: unknown) => realms.restoreRealm(places, key))
  ipcMain.handle(CHANNELS.installCommand, () => installCommand(places))
  ipcMain.handle(CHANNELS.readGithub, () => github.readGithub())
  ipcMain.handle(CHANNELS.startGithubLogin, () => github.startGithubLogin())
  ipcMain.handle(CHANNELS.openGithubLogin, () => github.openGithubLogin())
  ipcMain.handle(CHANNELS.awaitGithubLogin, () => github.awaitGithubLogin())
  ipcMain.handle(CHANNELS.cancelGithubLogin, () => github.cancelGithubLogin())
  ipcMain.handle(CHANNELS.readLibrary, () => library.readLibrary())
  ipcMain.handle(CHANNELS.addBook, (_, book: unknown) => library.addBook(book))
  ipcMain.handle(CHANNELS.setBookPage, (_, id: unknown, page: unknown) => library.setBookPage(id, page))
  ipcMain.handle(CHANNELS.finishBook, (_, id: unknown) => library.finishBook(id))
  ipcMain.handle(CHANNELS.removeBook, (_, id: unknown) => library.removeBook(id))
  ipcMain.handle(CHANNELS.takeOpened, () => reply(log, MESSAGES.openFolder, async () => takeOpened()))
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
  ipcMain.handle(CHANNELS.setTimeBudget, (_, key: unknown, budget: unknown) => live.setTimeBudget(quests, key, budget))
  ipcMain.handle(CHANNELS.readLive, (_, key: unknown) => live.readLive(quests, key))
  ipcMain.handle(CHANNELS.readQuestFacts, (_, key: unknown, taskId: unknown) => readQuestFacts(quests, key, taskId))
  ipcMain.handle(CHANNELS.switchBranch, (_, key: unknown) => live.switchBranch(quests, key))
  ipcMain.handle(CHANNELS.checkStart, (_, key: unknown, taskId: unknown) => setOut.checkStart(quests, key, taskId))
  ipcMain.handle(CHANNELS.startQuest, (_, key: unknown, taskId: unknown) => setOut.startQuest(quests, key, taskId))
  ipcMain.handle(CHANNELS.openClaude, (_, key: unknown) => setOut.openClaude(quests, key))
  ipcMain.handle(CHANNELS.notYet, (_, key: unknown, taskId: unknown) => finish.notYet(quests, key, taskId))
  ipcMain.handle(CHANNELS.finishQuest, (_, key: unknown, taskId: unknown, actual: unknown, logPath: unknown) => finish.finishQuest(quests, key, taskId, actual, logPath))
  ipcMain.handle(CHANNELS.retryTaskLog, (_, key: unknown, taskId: unknown, path: unknown) => finish.retryTaskLog(quests, key, taskId, path))
  ipcMain.handle(CHANNELS.putBackQuest, (_, key: unknown, taskId: unknown, seal: unknown) => back.putBackQuest(quests, key, taskId, seal))
  ipcMain.handle(CHANNELS.putBackNow, (_, key: unknown, taskId: unknown) => back.putBackNow(quests, key, taskId))
  ipcMain.handle(CHANNELS.copyText, (_, text: unknown) => setOut.copyText(quests, text))
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
  window.once('closed', () => {
    isWindowListening = false
  })
  // Nothing inside the app navigates away from it.
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  window.webContents.on('render-process-gone', (_, details) => log.error(`the window's process ended: ${details.reason}`))

  const devServer = process.env.ELECTRON_RENDERER_URL
  if (devServer !== undefined) await window.loadURL(devServer)
  else await window.loadFile(join(__dirname, '../renderer/index.html'))

  return window
}

// What a link or a notification brought, until the window is there to hear it.
// A link that launches the app arrives before there is a window at all.
let inbox: Opened[] = []
let isWindowListening = false

const takeOpened = (): Opened[] => {
  isWindowListening = true
  const taken = inbox
  inbox = []

  return taken
}

const bringForward = async (): Promise<void> => {
  if (!app.isReady()) return
  const [window] = BrowserWindow.getAllWindows()
  if (window === undefined) await openWindow()
  else window.show()
  app.focus({ steal: true })
}

const deliver = (opened: Opened) => {
  const [window] = BrowserWindow.getAllWindows()
  if (isWindowListening && window !== undefined) window.webContents.send(CHANNELS.opened, opened)
  else inbox.push(opened)
  bringForward().catch(err => log.error('bringing the window forward failed', err))
}

// Before it's ready, so a link that launches the app isn't lost.
app.on('open-url', (event, url) => {
  event.preventDefault()
  openedFromUrl(places, url)
    .then(deliver)
    .catch(err => log.error('opening a link failed', err))
})

// Held on to, or the click never comes back.
const shown = new Set<Notification>()

const notifyJudgement = (asked: Asked) => {
  if (!Notification.isSupported()) return
  const notification = new Notification({ title: app.getName(), body: MESSAGES.judgement(asked.title) })
  shown.add(notification)
  notification.on('click', () => {
    shown.delete(notification)
    deliver({ kind: 'judgement', key: asked.key })
  })
  notification.on('close', () => shown.delete(notification))
  notification.show()
}

const checkJudgements = judgementWatch({ scan: () => scanRecords(host, home, log), isAway: () => BrowserWindow.getFocusedWindow() === null, notify: notifyJudgement, log })

const tellWindows = () => {
  for (const window of BrowserWindow.getAllWindows()) window.webContents.send(CHANNELS.changed)
  void checkJudgements()
}

const sendMenu = (item: MenuItem) => (BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0])?.webContents.send(CHANNELS.menu, item)

const start = async () => {
  serveEngine()
  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu(app.getName(), flavor === 'dev', sendMenu)))
  await openWindow()
  await checkJudgements()
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

// A sign-in doesn't outlive the app.
app.on('before-quit', () => github.stopGithubLogin())

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) openWindow().catch(err => log.error('opening a window failed', err))
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
