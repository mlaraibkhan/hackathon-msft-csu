"""IPC communication module for Electron <-> Flask."""
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // Scan operations
  startScan: (target: string, scanType: string) =>
    ipcRenderer.invoke('start-scan', { target, scanType }),
  
  getScan: (scanId: number) =>
    ipcRenderer.invoke('get-scan', scanId),
  
  getScanProgress: (scanId: number) =>
    ipcRenderer.invoke('get-scan-progress', scanId),
  
  listScans: () =>
    ipcRenderer.invoke('list-scans'),
  
  // Finding operations
  getFinding: (findingId: number) =>
    ipcRenderer.invoke('get-finding', findingId),
  
  analyzeFinding: (findingId: number) =>
    ipcRenderer.invoke('analyze-finding', findingId),
  
  // Privilege operations
  checkPrivileges: () =>
    ipcRenderer.invoke('check-privileges'),
  
  // System operations
  openExternal: (url: string) =>
    ipcRenderer.invoke('open-external', url),
});

export {};
