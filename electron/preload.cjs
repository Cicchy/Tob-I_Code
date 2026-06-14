const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  saveFile: (options) => ipcRenderer.invoke('dialog:saveFile', options),
  saveFileAs: (options) => ipcRenderer.invoke('dialog:saveFileAs', options),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
})
