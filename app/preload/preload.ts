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
  onChange: listener => {
    const heard = () => listener()
    ipcRenderer.on(CHANNELS.changed, heard)

    return () => ipcRenderer.off(CHANNELS.changed, heard)
  },
  log: (level, text) => ipcRenderer.send(CHANNELS.log, level, text),
}

contextBridge.exposeInMainWorld('engine', engine)
