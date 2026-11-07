import { randomBytes } from 'node:crypto'
import { appendFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { app, BrowserWindow, clipboard, dialog, ipcMain, Menu, Notification, shell } from 'electron'
import type { IpcMainInvokeEvent } from 'electron'

import { CHANNELS } from '../shared/engine_api'
import type { MenuItem, Opened } from '../shared/engine_api'
import { appMenu } from './core/app_menu'
import { BUSY_PROBE, GH_CODE_WAIT_MS, GH_LOGIN_WAIT_MS, GH_PATHS, LOG_FILE, projectsFolder, RESTART_FILE, SETTINGS_FILE, UPDATE_CHECK_MS, WATCH_SETTLE_MS, WINDOW } from './core/constants'
import { appIdOf, flavorOf } from './core/flavor'
import { createLogger, fileSink } from './core/logger'
import { MESSAGES, UPDATE_TEXT } from './core/messages'
import { nodeHost } from './core/node_host'
import { codexConfigArgs, installCodexSkills, linkCompanionSkills } from './features/codex/data/setup'
import { stopProcesses, streamProcess } from './core/stream_process'
import { windowChrome } from './core/platform/mac'
import { reply } from './core/reply'
import { watchFolders } from './core/watcher'
import { readChronicle } from './features/chronicle/api/chronicle_api'
import { readGame, readHoard } from './features/game/api/game_api'
import { readMana } from './features/mana/api/mana_api'
import { githubApi } from './features/github/api/github_api'
import { libraryApi } from './features/library/api/library_api'
import { notesApi } from './features/notes/api/notes_api'
import { designsApi } from './features/designs/api/designs_api'
import { helpersApi } from './features/helpers/api/helpers_api'
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
import * as branches from './features/branches/api/branch_api'
import { runMergeChecks, cancelMergeChecks } from './features/branches/api/checks_api'
import { commitBranchFiles } from './features/branches/api/commit_api'
import { readPush, pushMerge } from './features/branches/api/push_api'
import { nodeUserGit } from './features/branches/data/user_git'
import * as setOut from './features/tasks/api/start_api'
import * as tasks from './features/tasks/api/tasks_api'
import { commitOfProvenance, relaunchArgv, restoredOf, versionOfPlist } from './features/update/data/bundle'
import type { Restored } from './features/update/data/bundle'
import { updateWatch } from './features/update/domain/update_watch'
import { updateService } from './features/update/data/update_service'
import type { Provenance } from '../tools/release_guard.mjs'
import { sessionsFolder } from '../../hooks/shared/sessions/domain/services/session_rules'

// How often the window hears from main with no file event, so a session that
// stopped sending heartbeats goes stale on screen.
const SWEEP_MS = 5_000
const STALE_CHECK_MS = 30_000

// Set by the build: empty for prod and for development.
declare const QUEUE_TEA_BUILT_FLAVOR: string
declare const QUEUE_TEA_SOURCE: Provenance

const flavor = flavorOf(process.env.QUEUE_TEA_FLAVOR ?? (QUEUE_TEA_BUILT_FLAVOR || undefined), app.isPackaged)
app.on('before-quit', stopProcesses)
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
  prepareCodex: async (path: string) => {
    try {
      const server = app.isPackaged ? join(process.resourcesPath, 'codex/server.cjs') : join(__dirname, '../codex/server.cjs')
      if (!(await host.exists(server))) throw new Error('Build the Queue-tea Codex server before opening a session.')
      await installCodexSkills(join(home, '.agents/skills'))
      const companions = await linkCompanionSkills(join(home, '.agents/skills'), home)
      if (companions.missing.length > 0) log.warn(`Codex companion skills unavailable: ${companions.missing.join(', ')}`)

      return codexConfigArgs({ command: process.execPath, server, electron: true }, path)
    } catch (err) {
      log.error('preparing Queue-tea for Codex failed', err)
      throw err
    }
  },
}

const branchActions = { ...quests, userGit: nodeUserGit(log), reveal: (path: string) => shell.showItemInFolder(path), published: (repo: string, remote: string, branch: string, commit: string) => updates.published(repo, remote, branch, commit) }

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
const notes = notesApi({ ...quests, newNoteId: () => `n-${randomBytes(4).toString('hex')}`, reveal: (path: string) => shell.showItemInFolder(path) })
// Each change to a helper's work goes to every window as it happens.
const helpers = helpersApi({
  ...quests,
  stream: streamProcess,
  tell: jobs => {
    for (const window of BrowserWindow.getAllWindows()) window.webContents.send(CHANNELS.helpers, jobs)
  },
})
const designs = designsApi({
  ...quests,
  reveal: (path: string) => shell.showItemInFolder(path),
  listFolders: async (dir: string) => {
    try {
      return (await readdir(dir, { withFileTypes: true })).filter(e => e.isDirectory()).map(e => e.name)
    } catch (err) {
      // A realm with no docs/designs yet has no designs; anything else is a fault.
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
      throw err
    }
  },
})

// Engine calls still changing something. A restart in the middle of one could
// lose a save; one that only reads is read again by the new copy, and the
// window reads every 30 s, so counting reads would hold an update off for good.
let callsRunning = 0
const READS = /^engine:(list|read|check)-/

const handle = (channel: string, work: (event: IpcMainInvokeEvent, ...args: unknown[]) => unknown) =>
  ipcMain.handle(channel, async (event, ...args) => {
    const allowed = process.env.ELECTRON_RENDERER_URL ?? pathToFileURL(join(__dirname, '../renderer/index.html')).href
    if (event.senderFrame !== event.sender.mainFrame || event.senderFrame?.url.split('#')[0] !== new URL(allowed).href.split('#')[0]) {
      log.warn(`Refused engine request from an unexpected frame: ${channel}`)
      return { ok: false, error: { message: MESSAGES.badValue } }
    }
    if (READS.test(channel) || channel === CHANNELS.applyAppUpdate) return work(event, ...args)
    callsRunning += 1
    try {
      return await work(event, ...args)
    } finally {
      callsRunning -= 1
    }
  })

const serveEngine = () => {
  handle(CHANNELS.readAppUpdate, () => reply(log, UPDATE_TEXT.failed, updates.read))
  handle(CHANNELS.applyAppUpdate, () => reply(log, UPDATE_TEXT.failed, updates.apply))
  handle(CHANNELS.listProjects, () => listProjects(projects))
  handle(CHANNELS.readProject, (_, key: unknown) => readProject(projects, key))
  handle(CHANNELS.readGame, () => readGame(game))
  handle(CHANNELS.readHoard, () => readHoard(game))
  handle(CHANNELS.readChronicle, (_, scope: unknown, day: unknown) => readChronicle(game, scope, day))
  handle(CHANNELS.readMana, (_, key: unknown) => readMana(quests, key))
  handle(CHANNELS.readDesigns, (_, key: unknown) => designs.readDesigns(key))
  handle(CHANNELS.readDesignVersion, (_, key: unknown, folder: unknown) => designs.readDesignVersion(key, folder))
  handle(CHANNELS.readDesign, (_, key: unknown, folder: unknown, id: unknown) => designs.readDesign(key, folder, id))
  handle(CHANNELS.saveDesign, (_, key: unknown, folder: unknown, id: unknown, scene: unknown, stamp: unknown) => designs.saveDesign(key, folder, id, scene, stamp))
  handle(CHANNELS.saveDesignCopy, (_, key: unknown, folder: unknown, id: unknown, scene: unknown) => designs.saveDesignCopy(key, folder, id, scene))
  handle(CHANNELS.restoreDesignFile, (_, key: unknown, folder: unknown, file: unknown) => designs.restoreDesignFile(key, folder, file))
  handle(CHANNELS.addDesignComment, (_, key: unknown, folder: unknown, comment: unknown) => designs.addDesignComment(key, folder, comment))
  handle(CHANNELS.setDesignComment, (_, key: unknown, folder: unknown, id: unknown, isResolved: unknown) => designs.setDesignComment(key, folder, id, isResolved))
  handle(CHANNELS.sendDesignComments, (_, key: unknown, folder: unknown, next: unknown) => designs.sendDesignComments(key, folder, next))
  handle(CHANNELS.showDesigns, (_, key: unknown) => designs.showDesigns(key))
  handle(CHANNELS.readSettings, () => readSettings(settings))
  handle(CHANNELS.saveSettings, (_, patch: unknown) => saveSettings(settings, patch))
  handle(CHANNELS.readSettingsPage, (_, key: unknown) => realms.readSettingsPage(places, key))
  handle(CHANNELS.setTaskLog, (_, key: unknown, path: unknown) => realms.setTaskLog(places, key, path))
  handle(CHANNELS.showRecord, (_, key: unknown) => realms.showRecord(places, key))
  handle(CHANNELS.openFolder, () => realms.openFolder(places))
  handle(CHANNELS.addProject, (_, path: unknown) => realms.addProject(places, path))
  handle(CHANNELS.restoreRealm, (_, key: unknown) => realms.restoreRealm(places, key))
  handle(CHANNELS.installCommand, () => installCommand(places))
  handle(CHANNELS.readGithub, () => github.readGithub())
  handle(CHANNELS.startGithubLogin, () => github.startGithubLogin())
  handle(CHANNELS.openGithubLogin, () => github.openGithubLogin())
  handle(CHANNELS.awaitGithubLogin, () => github.awaitGithubLogin())
  handle(CHANNELS.cancelGithubLogin, () => github.cancelGithubLogin())
  handle(CHANNELS.readLibrary, () => library.readLibrary())
  handle(CHANNELS.addBook, (_, book: unknown) => library.addBook(book))
  handle(CHANNELS.setBookPage, (_, id: unknown, page: unknown) => library.setBookPage(id, page))
  handle(CHANNELS.finishBook, (_, id: unknown) => library.finishBook(id))
  handle(CHANNELS.removeBook, (_, id: unknown) => library.removeBook(id))
  handle(CHANNELS.readNotes, (_, key: unknown) => notes.readNotes(key))
  handle(CHANNELS.showNotes, (_, key: unknown) => notes.showNotes(key))
  handle(CHANNELS.openLink, (_, url: unknown) => notes.openLink(url))
  handle(CHANNELS.createNote, (_, key: unknown, note: unknown) => notes.createNote(key, note))
  handle(CHANNELS.saveNote, (_, key: unknown, id: unknown, change: unknown, stamp: unknown) => notes.saveNote(key, id, change, stamp))
  handle(CHANNELS.archiveNote, (_, key: unknown, id: unknown, isArchived: unknown) => notes.archiveNote(key, id, isArchived))
  handle(CHANNELS.deleteNote, (_, key: unknown, id: unknown) => notes.deleteNote(key, id))
  handle(CHANNELS.fileNoteQuests, (_, key: unknown, id: unknown, proposal: unknown) => notes.fileNoteQuests(key, id, proposal))
  handle(CHANNELS.takeOpened, () => reply(log, MESSAGES.openFolder, async () => takeOpened()))
  handle(CHANNELS.readChoices, (_, key: unknown, taskId: unknown) => tasks.readChoices(quests, key, taskId))
  handle(CHANNELS.setPriority, (_, key: unknown, taskId: unknown, priority: unknown) => tasks.setPriority(quests, key, taskId, priority))
  handle(CHANNELS.togglePlayNext, (_, key: unknown, taskId: unknown) => tasks.togglePlayNext(quests, key, taskId))
  handle(CHANNELS.fileQuest, (_, key: unknown, quest: unknown) => tasks.fileQuest(quests, key, quest))
  handle(CHANNELS.moveQuest, (_, key: unknown, taskId: unknown, parentId: unknown) => tasks.moveQuest(quests, key, taskId, parentId))
  handle(CHANNELS.sealQuest, (_, key: unknown, taskId: unknown, seal: unknown) => tasks.sealQuest(quests, key, taskId, seal))
  handle(CHANNELS.unsealQuest, (_, key: unknown, taskId: unknown) => tasks.unsealQuest(quests, key, taskId))
  handle(CHANNELS.removeQuest, (_, key: unknown, taskId: unknown) => tasks.removeQuest(quests, key, taskId))
  handle(CHANNELS.restoreQuest, (_, key: unknown, taskId: unknown) => tasks.restoreQuest(quests, key, taskId))
  handle(CHANNELS.editQuest, (_, key: unknown, taskId: unknown, edit: unknown) => tasks.editQuest(quests, key, taskId, edit))
  handle(CHANNELS.setActiveSaga, (_, key: unknown, taskId: unknown) => tasks.setActiveSaga(quests, key, taskId))
  handle(CHANNELS.setTimeBudget, (_, key: unknown, budget: unknown) => live.setTimeBudget(quests, key, budget))
  handle(CHANNELS.readLive, (_, key: unknown) => live.readLive(quests, key))
  handle(CHANNELS.readQuestFacts, (_, key: unknown, taskId: unknown) => readQuestFacts(quests, key, taskId))
  handle(CHANNELS.switchBranch, (_, key: unknown) => live.switchBranch(quests, key))
  handle(CHANNELS.readBranches, (_, key) => branches.readBranches(quests, key))
  handle(CHANNELS.readBranch, (_, key, id, target) => branches.readBranch(quests, key, id, target))
  handle(CHANNELS.readMergeWorkspace, (_, key, id) => branches.readMergeWorkspace(quests, key, id))
  handle(CHANNELS.prepareMerge, (_, key, request) => branches.prepareMerge(branchActions, key, request))
  handle(CHANNELS.resolveMergeFile, (_, key, request) => branches.resolveMergeFile(branchActions, key, request))
  handle(CHANNELS.completeMerge, (_, key, request) => branches.completeMerge(branchActions, key, request))
  handle(CHANNELS.abandonMerge, (_, key, id) => branches.abandonMerge(branchActions, key, id))
  handle(CHANNELS.runMergeChecks, (_, key, request) => runMergeChecks(branchActions, key, request))
  handle(CHANNELS.cancelMergeChecks, (_, key, id) => cancelMergeChecks(branchActions, key, id))
  handle(CHANNELS.openMergeFolder, (_, key, id) => branches.openMergeFolder(branchActions, key, id))
  handle(CHANNELS.commitBranchFiles, (_, key, request) => commitBranchFiles(branchActions, key, request))
  handle(CHANNELS.readPush, (_, key, id, remote) => readPush(quests, key, id, remote))
  handle(CHANNELS.pushMerge, (_, key, request) => pushMerge(branchActions, key, request))
  handle(CHANNELS.checkStart, (_, key: unknown, taskId: unknown) => setOut.checkStart(quests, key, taskId))
  handle(CHANNELS.startQuest, (_, key: unknown, taskId: unknown, platform: unknown) => setOut.startQuest(quests, key, taskId, platform))
  handle(CHANNELS.openClaude, (_, key: unknown, taskId?: unknown) => setOut.openClaude(quests, key, taskId))
  handle(CHANNELS.continueIn, (_, key: unknown, taskId: unknown, platform: unknown) => setOut.continueIn(quests, key, taskId, platform))
  handle(CHANNELS.notYet, (_, key: unknown, taskId: unknown) => finish.notYet(quests, key, taskId))
  handle(CHANNELS.finishQuest, (_, key: unknown, taskId: unknown, actual: unknown, logPath: unknown) => finish.finishQuest(quests, key, taskId, actual, logPath))
  handle(CHANNELS.retryTaskLog, (_, key: unknown, taskId: unknown, path: unknown) => finish.retryTaskLog(quests, key, taskId, path))
  handle(CHANNELS.putBackQuest, (_, key: unknown, taskId: unknown, seal: unknown) => back.putBackQuest(quests, key, taskId, seal))
  handle(CHANNELS.putBackNow, (_, key: unknown, taskId: unknown) => back.putBackNow(quests, key, taskId))
  handle(CHANNELS.copyText, (_, text: unknown) => setOut.copyText(quests, text))
  handle(CHANNELS.readHelpers, () => helpers.readHelpers())
  handle(CHANNELS.sendHelper, (_, key: unknown, helper: unknown, order: unknown) => helpers.sendHelper(key, helper, order))
  handle(CHANNELS.concileMerge, (_, key: unknown, helper: unknown, operationId: unknown) => helpers.concileMerge(key, helper, operationId))
  handle(CHANNELS.stopHelper, (_, helper: unknown) => helpers.stopHelper(helper))
  ipcMain.on(CHANNELS.log, (_, level: unknown, text: unknown) => {
    const line = `window: ${String(text)}`
    if (level === 'warn') log.warn(line)
    else log.error(line)
  })
}

// Given after an update restart, so the window comes back where it was, and
// stays behind what you're using when you weren't using it.
const openWindow = async (restored?: Restored): Promise<BrowserWindow> => {
  const window = new BrowserWindow({
    ...WINDOW,
    ...restored?.bounds,
    ...windowChrome,
    show: false,
    title: 'Queue-tea',
    webPreferences: { preload: join(__dirname, '../preload/preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false },
  })
  window.once('ready-to-show', () => (restored?.isInFront === false ? window.showInactive() : window.show()))
  window.once('closed', () => {
    isWindowListening = false
  })
  // Nothing inside the app navigates away from it.
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  window.webContents.on('will-navigate', event => event.preventDefault())
  window.webContents.on('render-process-gone', (_, details) => log.error(`the window's process ended: ${details.reason}`))

  const devServer = process.env.ELECTRON_RENDERER_URL
  if (devServer !== undefined) await window.loadURL(devServer)
  else await window.loadFile(join(__dirname, '../renderer/index.html'), { hash: restored?.hash })

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

// The bundle this app runs from: an install swaps a new one in under it.
const bundle = resolve(app.getPath('exe'), '../../..')
const restartFile = join(app.getPath('userData'), RESTART_FILE)

const restart = async (isInFront: boolean) => {
  const [window] = BrowserWindow.getAllWindows()
  const restored: Restored = window === undefined ? null : { hash: new URL(window.webContents.getURL()).hash, bounds: window.getBounds(), isInFront }
  await host.write(restartFile, JSON.stringify(restored))
  const relaunched = await host.run(relaunchArgv(process.pid, bundle, isInFront))
  if (relaunched.exitCode !== 0) throw new Error(relaunched.stderr)
  app.exit(0)
}

const askRestart = async (version: string): Promise<boolean> => {
  const options = { type: 'info' as const, message: UPDATE_TEXT.ready(version), detail: UPDATE_TEXT.detail, buttons: [UPDATE_TEXT.restartNow, UPDATE_TEXT.later], defaultId: 0, cancelId: 1 }
  const [window] = BrowserWindow.getAllWindows()
  const { response } = window === undefined ? await dialog.showMessageBox(options) : await dialog.showMessageBox(window, options)

  return response === 0
}

const isUpdateBusy = async () => {
  // A restart would end a helper's order half done.
  if (callsRunning > 0 || helpers.isBusy()) return true
  const [window] = BrowserWindow.getAllWindows()

  return window !== undefined && (await window.webContents.executeJavaScript(BUSY_PROBE)) === true
}
const runningBuild = { version: app.getVersion(), commit: QUEUE_TEA_SOURCE.commit }
const installedBuild = async () => {
  const version = versionOfPlist(await host.read(join(bundle, 'Contents/Info.plist')))
  if (version === null) return null
  const file = join(bundle, 'Contents/Resources/provenance.json')
  const commit = await host.exists(file) ? commitOfProvenance(await host.read(file)) : null
  return { version, commit }
}
const updates = updateService({ running: runningBuild, repository: QUEUE_TEA_SOURCE.repository, enabled: app.isPackaged && flavor === 'prod',
  tools: app.isPackaged ? join(process.resourcesPath, 'update-tools') : resolve(__dirname, '../../tools'),
  isBusy: isUpdateBusy, installed: installedBuild, restart: () => restart(true), log })
const checkUpdate = updateWatch({
  running: runningBuild,
  installed: async () => { const state = await updates.read(); return state.canRestart ? state.installed : null },
  isAway: () => BrowserWindow.getFocusedWindow() === null,
  isBusy: isUpdateBusy,
  ask: askRestart,
  restart,
  log,
})

// Read once, after an update restart; any other launch has no file.
const takeRestored = async (): Promise<Restored | undefined> => {
  if (!(await host.exists(restartFile))) return undefined
  try {
    return restoredOf(await host.read(restartFile))
  } catch (err) {
    log.error('reading where the window was before the update failed', err)

    return undefined
  } finally {
    await host.remove(restartFile)
  }
}

const start = async () => {
  serveEngine()
  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu(app.getName(), flavor === 'dev', sendMenu)))
  const restored = await takeRestored()
  // Closed before the restart: it stays closed until the Dock icon opens it.
  if (restored !== null) await openWindow(restored)
  await checkJudgements()
  try {
    await watchFolders([projectsFolder(home), sessionsFolder(home)], tellWindows, { settleMs: WATCH_SETTLE_MS, sweepMs: SWEEP_MS, log })
  } catch (err) {
    log.error("watching ~/.queue-tea failed, so changes show when the app is reopened", err)
  }
  setInterval(tellWindows, STALE_CHECK_MS)
  // Only a packaged app has a bundle that an install replaces.
  if (app.isPackaged && flavor === 'prod') setInterval(() => void checkUpdate(), UPDATE_CHECK_MS)
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
