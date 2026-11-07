import { contextBridge, ipcRenderer } from 'electron'

import { CHANNELS } from '../shared/engine_api'
import type { EngineApi } from '../shared/engine_api'

// The window reaches main through this one object and nothing else.
const engine: EngineApi = {
  readAppUpdate: () => ipcRenderer.invoke(CHANNELS.readAppUpdate),
  applyAppUpdate: () => ipcRenderer.invoke(CHANNELS.applyAppUpdate),
  listProjects: () => ipcRenderer.invoke(CHANNELS.listProjects),
  readProject: key => ipcRenderer.invoke(CHANNELS.readProject, key),
  readGame: () => ipcRenderer.invoke(CHANNELS.readGame),
  readHoard: () => ipcRenderer.invoke(CHANNELS.readHoard),
  readChronicle: (scope, day) => ipcRenderer.invoke(CHANNELS.readChronicle, scope, day),
  readMana: key => ipcRenderer.invoke(CHANNELS.readMana, key),
  readDesigns: key => ipcRenderer.invoke(CHANNELS.readDesigns, key),
  readDesignVersion: (key, folder) => ipcRenderer.invoke(CHANNELS.readDesignVersion, key, folder),
  readDesign: (key, folder, id) => ipcRenderer.invoke(CHANNELS.readDesign, key, folder, id),
  saveDesign: (key, folder, id, scene, stamp) => ipcRenderer.invoke(CHANNELS.saveDesign, key, folder, id, scene, stamp),
  saveDesignCopy: (key, folder, id, scene) => ipcRenderer.invoke(CHANNELS.saveDesignCopy, key, folder, id, scene),
  restoreDesignFile: (key, folder, file) => ipcRenderer.invoke(CHANNELS.restoreDesignFile, key, folder, file),
  addDesignComment: (key, folder, comment) => ipcRenderer.invoke(CHANNELS.addDesignComment, key, folder, comment),
  setDesignComment: (key, folder, id, isResolved) => ipcRenderer.invoke(CHANNELS.setDesignComment, key, folder, id, isResolved),
  sendDesignComments: (key, folder, next) => ipcRenderer.invoke(CHANNELS.sendDesignComments, key, folder, next),
  showDesigns: key => ipcRenderer.invoke(CHANNELS.showDesigns, key),
  readSettings: () => ipcRenderer.invoke(CHANNELS.readSettings),
  saveSettings: patch => ipcRenderer.invoke(CHANNELS.saveSettings, patch),
  readSettingsPage: key => ipcRenderer.invoke(CHANNELS.readSettingsPage, key),
  setTaskLog: (key, path) => ipcRenderer.invoke(CHANNELS.setTaskLog, key, path),
  showRecord: key => ipcRenderer.invoke(CHANNELS.showRecord, key),
  openFolder: () => ipcRenderer.invoke(CHANNELS.openFolder),
  addProject: path => ipcRenderer.invoke(CHANNELS.addProject, path),
  restoreRealm: key => ipcRenderer.invoke(CHANNELS.restoreRealm, key),
  installCommand: () => ipcRenderer.invoke(CHANNELS.installCommand),
  readGithub: () => ipcRenderer.invoke(CHANNELS.readGithub),
  startGithubLogin: () => ipcRenderer.invoke(CHANNELS.startGithubLogin),
  openGithubLogin: () => ipcRenderer.invoke(CHANNELS.openGithubLogin),
  awaitGithubLogin: () => ipcRenderer.invoke(CHANNELS.awaitGithubLogin),
  cancelGithubLogin: () => ipcRenderer.invoke(CHANNELS.cancelGithubLogin),
  readLibrary: () => ipcRenderer.invoke(CHANNELS.readLibrary),
  addBook: book => ipcRenderer.invoke(CHANNELS.addBook, book),
  setBookPage: (id, page) => ipcRenderer.invoke(CHANNELS.setBookPage, id, page),
  finishBook: id => ipcRenderer.invoke(CHANNELS.finishBook, id),
  removeBook: id => ipcRenderer.invoke(CHANNELS.removeBook, id),
  readNotes: key => ipcRenderer.invoke(CHANNELS.readNotes, key),
  attachNoteFile: (key, id, file) => ipcRenderer.invoke(CHANNELS.attachNoteFile, key, id, file),
  readNoteFile: (key, path) => ipcRenderer.invoke(CHANNELS.readNoteFile, key, path),
  downloadNoteFile: (key, path) => ipcRenderer.invoke(CHANNELS.downloadNoteFile, key, path),
  showNotes: key => ipcRenderer.invoke(CHANNELS.showNotes, key),
  openLink: url => ipcRenderer.invoke(CHANNELS.openLink, url),
  createNote: (key, note) => ipcRenderer.invoke(CHANNELS.createNote, key, note),
  saveNote: (key, id, change, stamp) => ipcRenderer.invoke(CHANNELS.saveNote, key, id, change, stamp),
  archiveNote: (key, id, isArchived) => ipcRenderer.invoke(CHANNELS.archiveNote, key, id, isArchived),
  deleteNote: (key, id) => ipcRenderer.invoke(CHANNELS.deleteNote, key, id),
  fileNoteQuests: (key, id, proposal) => ipcRenderer.invoke(CHANNELS.fileNoteQuests, key, id, proposal),
  takeOpened: () => ipcRenderer.invoke(CHANNELS.takeOpened),
  readChoices: (key, taskId) => ipcRenderer.invoke(CHANNELS.readChoices, key, taskId),
  setPriority: (key, taskId, priority) => ipcRenderer.invoke(CHANNELS.setPriority, key, taskId, priority),
  togglePlayNext: (key, taskId) => ipcRenderer.invoke(CHANNELS.togglePlayNext, key, taskId),
  fileQuest: (key, quest) => ipcRenderer.invoke(CHANNELS.fileQuest, key, quest),
  moveQuest: (key, taskId, parentId) => ipcRenderer.invoke(CHANNELS.moveQuest, key, taskId, parentId),
  sealQuest: (key, taskId, seal) => ipcRenderer.invoke(CHANNELS.sealQuest, key, taskId, seal),
  unsealQuest: (key, taskId) => ipcRenderer.invoke(CHANNELS.unsealQuest, key, taskId),
  removeQuest: (key, taskId) => ipcRenderer.invoke(CHANNELS.removeQuest, key, taskId),
  restoreQuest: (key, taskId) => ipcRenderer.invoke(CHANNELS.restoreQuest, key, taskId),
  editQuest: (key, taskId, edit) => ipcRenderer.invoke(CHANNELS.editQuest, key, taskId, edit),
  setActiveSaga: (key, taskId) => ipcRenderer.invoke(CHANNELS.setActiveSaga, key, taskId),
  setTimeBudget: (key, budget) => ipcRenderer.invoke(CHANNELS.setTimeBudget, key, budget),
  readLive: key => ipcRenderer.invoke(CHANNELS.readLive, key),
  readQuestFacts: (key, taskId) => ipcRenderer.invoke(CHANNELS.readQuestFacts, key, taskId),
  switchBranch: key => ipcRenderer.invoke(CHANNELS.switchBranch, key),
  readBranches: (key) => ipcRenderer.invoke(CHANNELS.readBranches, key),
  readBranch: (key, taskId, target) => ipcRenderer.invoke(CHANNELS.readBranch, key, taskId, target),
  readMergeWorkspace: (key, operationId) => ipcRenderer.invoke(CHANNELS.readMergeWorkspace, key, operationId),
  prepareMerge: (key, request) => ipcRenderer.invoke(CHANNELS.prepareMerge, key, request),
  resolveMergeFile: (key, request) => ipcRenderer.invoke(CHANNELS.resolveMergeFile, key, request),
  completeMerge: (key, request) => ipcRenderer.invoke(CHANNELS.completeMerge, key, request),
  abandonMerge: (key, operationId) => ipcRenderer.invoke(CHANNELS.abandonMerge, key, operationId),
  runMergeChecks: (key, request) => ipcRenderer.invoke(CHANNELS.runMergeChecks, key, request),
  cancelMergeChecks: (key, operationId) => ipcRenderer.invoke(CHANNELS.cancelMergeChecks, key, operationId),
  openMergeFolder: (key, operationId) => ipcRenderer.invoke(CHANNELS.openMergeFolder, key, operationId),
  commitBranchFiles: (key, request) => ipcRenderer.invoke(CHANNELS.commitBranchFiles, key, request),
  readPush: (key, operationId, remote) => ipcRenderer.invoke(CHANNELS.readPush, key, operationId, remote),
  pushMerge: (key, preview) => ipcRenderer.invoke(CHANNELS.pushMerge, key, preview),
  checkStart: (key, taskId) => ipcRenderer.invoke(CHANNELS.checkStart, key, taskId),
  startQuest: (key, taskId, platform) => ipcRenderer.invoke(CHANNELS.startQuest, key, taskId, platform),
  openClaude: (key, taskId) => ipcRenderer.invoke(CHANNELS.openClaude, key, taskId),
  continueIn: (key, taskId, platform) => ipcRenderer.invoke(CHANNELS.continueIn, key, taskId, platform),
  notYet: (key, taskId) => ipcRenderer.invoke(CHANNELS.notYet, key, taskId),
  finishQuest: (key, taskId, actual, logPath) => ipcRenderer.invoke(CHANNELS.finishQuest, key, taskId, actual, logPath),
  retryTaskLog: (key, taskId, path) => ipcRenderer.invoke(CHANNELS.retryTaskLog, key, taskId, path),
  putBackQuest: (key, taskId, seal) => ipcRenderer.invoke(CHANNELS.putBackQuest, key, taskId, seal),
  putBackNow: (key, taskId) => ipcRenderer.invoke(CHANNELS.putBackNow, key, taskId),
  copyText: text => ipcRenderer.invoke(CHANNELS.copyText, text),
  readHelpers: () => ipcRenderer.invoke(CHANNELS.readHelpers),
  sendHelper: (key, helper, order) => ipcRenderer.invoke(CHANNELS.sendHelper, key, helper, order),
  concileMerge: (key, helper, operationId) => ipcRenderer.invoke(CHANNELS.concileMerge, key, helper, operationId),
  stopHelper: helper => ipcRenderer.invoke(CHANNELS.stopHelper, helper),
  onHelpers: listener => {
    const heard = (_: unknown, jobs: Parameters<typeof listener>[0]) => listener(jobs)
    ipcRenderer.on(CHANNELS.helpers, heard)

    return () => ipcRenderer.off(CHANNELS.helpers, heard)
  },
  onChange: listener => {
    const heard = () => listener()
    ipcRenderer.on(CHANNELS.changed, heard)

    return () => ipcRenderer.off(CHANNELS.changed, heard)
  },
  onMenu: listener => {
    const heard = (_: unknown, item: Parameters<typeof listener>[0]) => listener(item)
    ipcRenderer.on(CHANNELS.menu, heard)

    return () => ipcRenderer.off(CHANNELS.menu, heard)
  },
  onOpened: listener => {
    const heard = (_: unknown, opened: Parameters<typeof listener>[0]) => listener(opened)
    ipcRenderer.on(CHANNELS.opened, heard)

    return () => ipcRenderer.off(CHANNELS.opened, heard)
  },
  log: (level, text) => ipcRenderer.send(CHANNELS.log, level, text),
}

contextBridge.exposeInMainWorld('engine', engine)
