const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),

  // File system
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  openDirectory: (path) => ipcRenderer.invoke('open-directory', path),
  getDefaultPath: () => ipcRenderer.invoke('get-default-path'),

  // Video operations
  getVideoInfo: (url) => ipcRenderer.invoke('get-video-info', url),
  startDownload: (options) => ipcRenderer.invoke('start-download', options),
  stopDownload: () => ipcRenderer.invoke('stop-download'),
  checkYtdlp: () => ipcRenderer.invoke('check-ytdlp'),
  updateYtdlp: () => ipcRenderer.invoke('update-ytdlp'),

  // Settings
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

  // History
  getHistory: () => ipcRenderer.invoke('get-history'),
  clearHistory: () => ipcRenderer.invoke('clear-history'),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),

  // Event listeners
  onDownloadProgress: (callback) => {
    ipcRenderer.on('download-progress', (event, data) => callback(data));
  },
  onDownloadOutput: (callback) => {
    ipcRenderer.on('download-output', (event, data) => callback(data));
  },
  onDownloadComplete: (callback) => {
    ipcRenderer.on('download-complete', (event, data) => callback(data));
  },
  onDownloadError: (callback) => {
    ipcRenderer.on('download-error', (event, data) => callback(data));
  },
  onYtdlpUpdateOutput: (callback) => {
    ipcRenderer.on('ytdlp-update-output', (event, data) => callback(data));
  },

  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});