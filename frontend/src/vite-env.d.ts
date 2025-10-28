/// <reference types="vite/client" />

interface Window {
  api: {
    startScan: (target: string, scanType: string) => Promise<any>;
    getScan: (scanId: number) => Promise<any>;
    getScanProgress: (scanId: number) => Promise<any>;
    listScans: () => Promise<any[]>;
    getFinding: (findingId: number) => Promise<any>;
    analyzeFinding: (findingId: number) => Promise<any>;
    checkPrivileges: () => Promise<any>;
    openExternal: (url: string) => Promise<any>;
  };
}
