import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// IPC without exposing the entire ipcRenderer
contextBridge.exposeInMainWorld('electron', {
  // Scan operations
  startScan: (target: string, portRange: string) =>
    ipcRenderer.invoke('scan:start', { target, portRange }),
  
  getScanStatus: (scanId: string) =>
    ipcRenderer.invoke('scan:status', scanId),
  
  cancelScan: (scanId: string) =>
    ipcRenderer.invoke('scan:cancel', scanId),
  
  getScanHistory: () =>
    ipcRenderer.invoke('scan:history'),
  
  getScanResults: (scanId: string) =>
    ipcRenderer.invoke('scan:results', scanId),
  
  deleteScan: (scanId: string) =>
    ipcRenderer.invoke('scan:delete', scanId),
  
  compareScan: (scanId1: string, scanId2: string) =>
    ipcRenderer.invoke('scan:compare', { scanId1, scanId2 }),
  
  // AI Analysis operations
  getAnalysis: (findingId: string) =>
    ipcRenderer.invoke('analysis:get', findingId),
  
  // System operations
  checkPrivileges: () =>
    ipcRenderer.invoke('system:checkPrivileges'),
  
  openExternal: (url: string) =>
    ipcRenderer.invoke('system:openExternal', url),
  
  // Event listeners
  onScanProgress: (callback: (data: any) => void) => {
    const subscription = (_event: any, data: any) => callback(data);
    ipcRenderer.on('scan:progress', subscription);
    
    // Return cleanup function
    return () => {
      ipcRenderer.removeListener('scan:progress', subscription);
    };
  },
  
  onScanComplete: (callback: (data: any) => void) => {
    const subscription = (_event: any, data: any) => callback(data);
    ipcRenderer.on('scan:complete', subscription);
    
    return () => {
      ipcRenderer.removeListener('scan:complete', subscription);
    };
  },
  
  onScanError: (callback: (data: any) => void) => {
    const subscription = (_event: any, data: any) => callback(data);
    ipcRenderer.on('scan:error', subscription);
    
    return () => {
      ipcRenderer.removeListener('scan:error', subscription);
    };
  },
});

// Type definitions for TypeScript
export interface ElectronAPI {
  startScan: (target: string, portRange: string) => Promise<any>;
  getScanStatus: (scanId: string) => Promise<any>;
  cancelScan: (scanId: string) => Promise<any>;
  getScanHistory: () => Promise<any>;
  getScanResults: (scanId: string) => Promise<any>;
  deleteScan: (scanId: string) => Promise<any>;
  compareScan: (scanId1: string, scanId2: string) => Promise<any>;
  getAnalysis: (findingId: string) => Promise<any>;
  checkPrivileges: () => Promise<any>;
  openExternal: (url: string) => Promise<void>;
  onScanProgress: (callback: (data: any) => void) => () => void;
  onScanComplete: (callback: (data: any) => void) => () => void;
  onScanError: (callback: (data: any) => void) => () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
