import { contextBridge, ipcRenderer } from 'electron'

import { CHANNELS } from '../shared/engine_api'
import type { EngineApi } from '../shared/engine_api'

// The window reaches main through this one object and nothing else.
const engine: EngineApi = {
  listProjects: () => ipcRenderer.invoke(CHANNELS.listProjects),
  readProject: key => ipcRenderer.invoke(CHANNELS.readProject, key),
  readGame: () => ipcRenderer.invoke(CHANNELS.readGame),
  readSettings: () => ipcRenderer.invoke(CHANNELS.readSettings),
  saveSettings: patch => ipcRenderer.invoke(CHANNELS.saveSettings, patch),
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
  checkStart: (key, taskId) => ipcRenderer.invoke(CHANNELS.checkStart, key, taskId),
  startQuest: (key, taskId) => ipcRenderer.invoke(CHANNELS.startQuest, key, taskId),
  openClaude: key => ipcRenderer.invoke(CHANNELS.openClaude, key),
  notYet: (key, taskId) => ipcRenderer.invoke(CHANNELS.notYet, key, taskId),
  finishQuest: (key, taskId, actual, logPath) => ipcRenderer.invoke(CHANNELS.finishQuest, key, taskId, actual, logPath),
  retryTaskLog: (key, taskId, path) => ipcRenderer.invoke(CHANNELS.retryTaskLog, key, taskId, path),
  putBackQuest: (key, taskId, seal) => ipcRenderer.invoke(CHANNELS.putBackQuest, key, taskId, seal),
  putBackNow: (key, taskId) => ipcRenderer.invoke(CHANNELS.putBackNow, key, taskId),
  copyText: text => ipcRenderer.invoke(CHANNELS.copyText, text),
  onChange: listener => {
    const heard = () => listener()
    ipcRenderer.on(CHANNELS.changed, heard)

    return () => ipcRenderer.off(CHANNELS.changed, heard)
  },
  log: (level, text) => ipcRenderer.send(CHANNELS.log, level, text),
}

contextBridge.exposeInMainWorld('engine', engine)
