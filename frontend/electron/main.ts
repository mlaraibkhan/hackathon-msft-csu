import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import axios from 'axios';

let mainWindow: BrowserWindow | null = null;
let pythonProcess: ChildProcess | null = null;

const PYTHON_BACKEND_PORT = 5000;
const API_BASE_URL = `http://127.0.0.1:${PYTHON_BACKEND_PORT}`;
const isDev = process.env.NODE_ENV === 'development';

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'Educational Vulnerability Scanner',
    show: false,
  });

  // Security: Disable navigation to external URLs
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      `file://${path.join(__dirname, '../build/index.html')}`,
    ];
    
    if (!allowedOrigins.some(origin => url.startsWith(origin))) {
      event.preventDefault();
    }
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startPythonBackend(): void {
  if (pythonProcess) {
    console.log('Python backend already running');
    return;
  }

  const pythonScript = path.join(__dirname, '../../backend/src/main.py');
  
  // In production, use bundled Python runtime
  const pythonCommand = isDev ? 'python3' : path.join(process.resourcesPath, 'python', 'bin', 'python3');

  pythonProcess = spawn(pythonCommand, [pythonScript], {
    env: {
      ...process.env,
      FLASK_ENV: isDev ? 'development' : 'production',
      FLASK_HOST: '127.0.0.1',
      FLASK_PORT: String(PYTHON_BACKEND_PORT),
    },
  });

  pythonProcess.stdout?.on('data', (data) => {
    console.log(`[Python Backend]: ${data}`);
  });

  pythonProcess.stderr?.on('data', (data) => {
    console.error(`[Python Backend Error]: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python backend exited with code ${code}`);
    pythonProcess = null;
  });
}

function stopPythonBackend(): void {
  if (pythonProcess) {
    pythonProcess.kill();
    pythonProcess = null;
  }
}

// App lifecycle
app.whenReady().then(() => {
  startPythonBackend();
  
  // Wait a bit for backend to start
  setTimeout(() => {
    createWindow();
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  stopPythonBackend();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopPythonBackend();
});

// Security: Content Security Policy
app.on('web-contents-created', (event, contents) => {
  contents.on('will-attach-webview', (event, webPreferences) => {
    // Disable webview - security risk
    event.preventDefault();
  });

  contents.setWindowOpenHandler(() => {
    // Deny all window.open() calls
    return { action: 'deny' };
  });
});

// IPC Handlers
ipcMain.handle('start-scan', async (event, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/scans`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message);
  }
});

ipcMain.handle('get-scan', async (event, scanId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/scans/${scanId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message);
  }
});

ipcMain.handle('get-scan-progress', async (event, scanId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/scans/${scanId}/progress`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message);
  }
});

ipcMain.handle('list-scans', async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/scans`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message);
  }
});

ipcMain.handle('get-finding', async (event, findingId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/findings/${findingId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message);
  }
});

ipcMain.handle('analyze-finding', async (event, findingId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/findings/${findingId}/analyze`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message);
  }
});

ipcMain.handle('check-privileges', async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/privileges/check`);
    return response.data;
  } catch (error: any) {
    return { has_privileges: false, message: 'Backend not available' };
  }
});

ipcMain.handle('open-external', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to open URL: ${error.message}`);
  }
});

export { mainWindow };
