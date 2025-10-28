# 🔒 Educational Vulnerability Scanner

> **⚠️ FOR EDUCATIONAL USE ONLY** - This application is designed for learning about network security in authorized environments only.

A desktop application that helps students and security enthusiasts learn about network vulnerabilities through hands-on scanning and analysis.

![Status](https://img.shields.io/badge/Status-MVP%20Complete-success)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)
![Python](https://img.shields.io/badge/Python-3.11%2B-blue)
![Node](https://img.shields.io/badge/Node-18%2B-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation on Windows 11](#-installation-on-windows-11)
- [Running the Application](#-running-the-application)
- [How to Use](#-how-to-use)
- [Troubleshooting](#-troubleshooting)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## ✨ Features

### Current Features (MVP)
- ✅ **Network Port Scanning** - Scan targets to discover open ports and services
- ✅ **Service Detection** - Identify running services and their versions
- ✅ **Real-Time Progress** - Watch scan progress with live updates
- ✅ **Target Validation** - Automatic validation of IP addresses and hostnames
- ✅ **RFC1918 Detection** - Identifies private vs public IP addresses
- ✅ **Security Warnings** - Alerts when scanning external/public IPs
- ✅ **Privilege Management** - Checks and guides for required administrator rights
- ✅ **Results Display** - Clean, organized table of scan findings
- ✅ **Educational Branding** - Clear disclaimers about authorized use only

### Coming Soon
- 🔄 **AI-Powered Explanations** - Learn what each finding means in plain language
- 🔄 **Severity Assessment** - Automatic risk classification (Critical/High/Medium/Low)
- 🔄 **Remediation Guidance** - Step-by-step instructions to fix vulnerabilities
- 🔄 **Scan History** - View and compare past scans
- 🔄 **Export Reports** - Save results to PDF or JSON

---

## 📦 Prerequisites

Before installing the application, ensure you have:

### Required Software

1. **Python 3.11 or higher**
   - Download from: https://www.python.org/downloads/
   - ⚠️ During installation, check "Add Python to PATH"

2. **Node.js 18 or higher**
   - Download from: https://nodejs.org/
   - LTS version recommended

3. **Nmap Network Scanner**
   - Download from: https://nmap.org/download.html
   - ⚠️ **IMPORTANT:** Download the Windows installer (not Zenmap GUI)
   - Install to default location: `C:\Program Files (x86)\Nmap`

4. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/download/win

### System Requirements
- **OS:** Windows 11 (Windows 10 also supported)
- **RAM:** 4GB minimum, 8GB recommended
- **Disk Space:** 500MB for application + dependencies
- **Administrator Access:** Required for network scanning

---

## 🚀 Installation on Windows 11

### Step 1: Download the Project

**Option A: Using Git**
```powershell
git clone https://github.com/your-repo/hackathon-msft-csu.git
cd hackathon-msft-csu
```

**Option B: Download ZIP**
1. Download the project ZIP file
2. Extract to a folder (e.g., `C:\Projects\hackathon-msft-csu`)
3. Open PowerShell or Command Prompt in that folder

### Step 2: Install Python Dependencies

```powershell
# Navigate to backend directory
cd backend

# Install Python packages
pip install -r requirements.txt

# Verify installation
python --version
```

Expected output: `Python 3.11.x` or higher

### Step 3: Install Node.js Dependencies

```powershell
# Navigate to frontend directory
cd ..\frontend

# Install Node packages (this may take 2-3 minutes)
npm install

# Verify installation
node --version
npm --version
```

### Step 4: Verify Nmap Installation

```powershell
# Check if nmap is accessible
nmap --version
```

If this fails, add Nmap to your PATH:
1. Open System Properties → Environment Variables
2. Edit "Path" in System Variables
3. Add: `C:\Program Files (x86)\Nmap`
4. Restart PowerShell

---

## 🎮 Running the Application

### Method 1: Automatic Startup (Recommended for Windows)

1. **Open PowerShell as Administrator** (Right-click PowerShell → Run as Administrator)

2. **Navigate to project directory:**
   ```powershell
   cd C:\path\to\hackathon-msft-csu
   ```

3. **Start both backend and frontend:**
   ```powershell
   # Start backend in background
   Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python src/main.py"
   
   # Wait 3 seconds for backend to start
   Start-Sleep -Seconds 3
   
   # Start frontend
   cd frontend
   npm run dev
   ```

### Method 2: Manual Startup (Two Terminals)

**Terminal 1 - Backend:**
```powershell
# Open PowerShell as Administrator
cd C:\path\to\hackathon-msft-csu\backend
python src/main.py
```

You should see:
```
2025-10-28 14:43:56 - vuln_scanner - INFO - Database initialized
2025-10-28 14:43:56 - vuln_scanner - INFO - Application created successfully
2025-10-28 14:43:56 - vuln_scanner - INFO - Starting server on 127.0.0.1:5000
 * Running on http://127.0.0.1:5000
```

**Terminal 2 - Frontend:**
```powershell
# Open new PowerShell (normal user is fine)
cd C:\path\to\hackathon-msft-csu\frontend
npm run dev
```

The Electron app should launch automatically.

### Method 3: Using Batch Script (Easiest)

Create a file named `start.bat` in the project root:

```batch
@echo off
echo Starting Educational Vulnerability Scanner...
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Please run this script as Administrator
    echo Right-click start.bat and select "Run as Administrator"
    pause
    exit /b 1
)

echo Starting backend...
start /B powershell -Command "cd backend; python src/main.py"

echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

echo Starting frontend...
cd frontend
npm run dev

pause
```

Then:
1. Right-click `start.bat`
2. Select "Run as Administrator"

---

## 📖 How to Use

### 1. Launch the Application
- The Electron window will open automatically
- You'll see the main dashboard with a scan form

### 2. Enter a Target
**For Testing (Safe Options):**
- `127.0.0.1` - Your local machine
- `localhost` - Same as above
- `192.168.1.1` - Your router (if on home network)
- `192.168.1.0/24` - Scan your local network

**⚠️ WARNING:** Only scan systems you own or have explicit permission to test!

### 3. Select Scan Type
- **Basic (Top 1000 ports)** - Fast, scans most common ports (~30 seconds)
- **Full (All ports)** - Comprehensive, scans all 65535 ports (~10 minutes)

### 4. Start the Scan
1. Click **"Start Scan"** button
2. Watch the progress bar update in real-time
3. Results appear automatically when complete

### 5. View Results
The results table shows:
- **Port:** Port number (e.g., 80, 443, 22)
- **Protocol:** Usually TCP or UDP
- **State:** Open, Closed, or Filtered
- **Service:** Service name (e.g., http, ssh, mysql)
- **Version:** Software version if detected
- **Severity:** Risk level (currently all marked "info")

### 6. Understanding the Results

**Example Result:**
```
Port: 80    Protocol: tcp    State: open    Service: http    Version: Apache 2.4.52
```

This means:
- A web server (HTTP) is running on port 80
- It's using Apache version 2.4.52
- The port is accessible from the network

---

## 🔧 Troubleshooting

### Problem: "nmap is not installed or not in PATH"

**Solution:**
1. Reinstall Nmap from https://nmap.org/download.html
2. Add to PATH manually:
   - Open System Properties
   - Environment Variables
   - Edit "Path"
   - Add: `C:\Program Files (x86)\Nmap`
3. Restart PowerShell

### Problem: "Backend not available" or Connection Refused

**Solution:**
1. Check if backend is running (Terminal 1 should show Flask logs)
2. Make sure you're using `127.0.0.1:5000` (not another IP)
3. Check if port 5000 is already in use:
   ```powershell
   netstat -ano | findstr :5000
   ```
4. If in use, kill the process or change port in `backend/src/app.py`

### Problem: "Insufficient privileges" error when scanning

**Solution:**
- **Windows:** You MUST run PowerShell as Administrator
  - Right-click PowerShell → "Run as Administrator"
- This is required for network scanning operations

### Problem: npm install fails

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
Remove-Item -Recurse -Force node_modules
npm install
```

### Problem: Python packages fail to install

**Solution:**
```powershell
# Upgrade pip first
python -m pip install --upgrade pip

# Try installing again
pip install -r requirements.txt

# If specific package fails, try installing individually
pip install flask flask-cors sqlalchemy python-nmap
```

### Problem: Electron window doesn't open

**Solution:**
1. Check if Vite dev server is running (should show `http://localhost:5173`)
2. Check browser console for errors (press F12 in Electron)
3. Try clearing Electron cache:
   ```powershell
   Remove-Item -Recurse -Force "$env:APPDATA\vuln-scanner-frontend"
   ```

### Problem: Scans are very slow

**Causes & Solutions:**
- **Large network range:** Use `/24` or smaller (e.g., `192.168.1.0/24`)
- **Full port scan:** Use "Basic" scan type for faster results
- **Firewall blocking:** Some firewalls slow down or block scans
- **Windows Defender:** May scan nmap.exe, add exception:
  - Windows Security → Virus & threat protection
  - Manage settings → Add exclusion
  - Add: `C:\Program Files (x86)\Nmap\nmap.exe`

---

## 📂 Project Structure

```
hackathon-msft-csu/
├── backend/                    # Python Flask backend
│   ├── src/
│   │   ├── api/               # REST API endpoints
│   │   │   ├── scans.py       # Scan operations
│   │   │   └── findings.py    # Finding operations
│   │   ├── models/            # Database models
│   │   │   ├── target.py      # Scan targets
│   │   │   ├── scan_session.py # Scan sessions
│   │   │   ├── finding.py     # Port/service findings
│   │   │   └── ai_analysis.py # AI analysis data
│   │   ├── services/          # Business logic
│   │   │   ├── scan_service.py    # Scan execution
│   │   │   └── target_service.py  # Target validation
│   │   ├── utils/             # Utilities
│   │   │   ├── validators.py  # Input validation
│   │   │   ├── logger.py      # Logging
│   │   │   └── nmap_parser.py # Nmap output parser
│   │   ├── middleware/        # Flask middleware
│   │   ├── database.py        # Database setup
│   │   ├── privilege_helper.py # Privilege checking
│   │   ├── app.py            # Flask app factory
│   │   └── main.py           # Entry point
│   ├── requirements.txt       # Python dependencies
│   └── .env.example          # Environment config
│
├── frontend/                  # Electron + React frontend
│   ├── electron/
│   │   ├── main.ts           # Electron main process
│   │   ├── preload.ts        # Preload script
│   │   └── ipc.ts            # IPC definitions
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ScanForm.tsx      # Scan input form
│   │   │   ├── ScanProgress.tsx  # Progress display
│   │   │   ├── ScanResults.tsx   # Results table
│   │   │   └── FindingRow.tsx    # Result row
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.tsx     # Main page
│   │   │   └── History.tsx       # History (future)
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # React entry
│   ├── package.json          # Node dependencies
│   ├── index.html           # HTML template
│   └── vite.config.ts       # Vite config
│
├── docs/                     # Documentation
│   ├── MVP_COMPLETE.md      # Implementation summary
│   └── IMPLEMENTATION_STATUS.md # Task checklist
│
├── scripts/                  # Utility scripts
│   └── dev.sh               # Linux/Mac startup
│
└── README.md                # This file
```

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- **Framework:** Flask 3.0 (Python web framework)
- **Database:** SQLite with SQLAlchemy ORM
- **Scanner:** python-nmap (wrapper for Nmap)
- **Security:** Localhost-only binding, input validation

**Frontend:**
- **Desktop Framework:** Electron 27
- **UI Library:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Styling:** Vanilla CSS with modern design

**Communication:**
- **IPC:** Electron IPC for frontend ↔ backend
- **API:** REST endpoints (JSON)
- **Updates:** HTTP polling (2-second interval)

### Security Features
- ✅ Backend bound to `127.0.0.1` only (no external access)
- ✅ Context isolation in Electron renderer
- ✅ Sandboxed renderer process
- ✅ Input validation on all user inputs
- ✅ No external network requests from frontend
- ✅ Educational disclaimers throughout

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│  Electron Desktop App (Frontend)                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  React UI Components                             │   │
│  │  - ScanForm: User input                         │   │
│  │  - ScanProgress: Real-time updates              │   │
│  │  - ScanResults: Display findings                │   │
│  └─────────────────────────────────────────────────┘   │
│                       ↕ IPC                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Electron Main Process                           │   │
│  │  - Manages window                                │   │
│  │  - Forwards requests to Flask                    │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (localhost:5000)
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Flask Backend (Python)                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  REST API                                        │   │
│  │  - POST /api/scans      Start scan              │   │
│  │  - GET  /api/scans/:id  Get results             │   │
│  └─────────────────────────────────────────────────┘   │
│                       ↓                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Scan Service                                    │   │
│  │  - Validate target                               │   │
│  │  - Check privileges                              │   │
│  │  - Execute nmap (background thread)             │   │
│  │  - Parse results                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                       ↓                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  SQLite Database                                 │   │
│  │  - Store targets, scans, findings                │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↓
                   ┌──────────┐
                   │   Nmap   │
                   │  Scanner │
                   └──────────┘
                         ↓
                   Target Network
```

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Complete)
- [x] Basic port scanning
- [x] Service detection
- [x] Results display
- [x] Target validation
- [x] Privilege handling

### 🔄 Phase 2: AI Integration (In Progress)
- [ ] OpenAI GPT-4 integration
- [ ] Plain-language explanations
- [ ] Security implications
- [ ] Click-to-learn interface

### 🔄 Phase 3: Enhanced Analysis
- [ ] Automatic severity classification
- [ ] CVE vulnerability matching
- [ ] Risk scoring
- [ ] Dashboard statistics

### 🔄 Phase 4: Learning Features
- [ ] Step-by-step remediation guides
- [ ] Curated learning resources
- [ ] Interactive tutorials
- [ ] Glossary of terms

### 🔄 Phase 5: History & Reporting
- [ ] Scan history viewer
- [ ] Comparison between scans
- [ ] Export to PDF/JSON
- [ ] Progress tracking

### 🔄 Phase 6: Polish
- [ ] Cross-platform installers
- [ ] Unit & E2E tests
- [ ] Performance optimization
- [ ] Offline documentation

---

## 🤝 Contributing

This is an educational project. Contributions are welcome!

**To contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Areas needing help:**
- AI explanation prompts
- Severity classification logic
- UI/UX improvements
- Documentation
- Testing

---

## ⚖️ Legal & Ethics

### Important Disclaimers

**🚨 AUTHORIZED USE ONLY**
- Only scan systems you own or have explicit written permission to test
- Unauthorized port scanning may be illegal in your jurisdiction
- This tool is for educational purposes ONLY

**What is legal:**
- ✅ Scanning your own computer (`127.0.0.1`)
- ✅ Scanning your home network devices
- ✅ Scanning systems with written authorization
- ✅ Using in controlled lab environments

**What is NOT legal:**
- ❌ Scanning your employer's network without permission
- ❌ Scanning any public IP addresses without authorization
- ❌ Scanning your ISP's infrastructure
- ❌ Using this for malicious purposes

**Your Responsibility:**
You are solely responsible for how you use this tool. The developers assume no liability for misuse.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Support

**Having issues?**
1. Check [Troubleshooting](#-troubleshooting) section
2. Review [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md)
3. Open an issue on GitHub
4. Contact the development team

**Quick Links:**
- 📖 [Full Implementation Status](docs/MVP_COMPLETE.md)
- 🐛 [Known Issues](docs/IMPLEMENTATION_STATUS.md#known-issues)
- 🗺️ [Roadmap](#-roadmap)

---

## 🌟 Acknowledgments

- **Nmap:** Network scanning engine by Gordon Lyon
- **Flask:** Python web framework
- **Electron:** Desktop app framework
- **React:** UI library by Meta

---

<div align="center">

**Built with ❤️ for educational purposes**

⚠️ **Remember: Always get permission before scanning!** ⚠️

[Report Bug](https://github.com/your-repo/issues) · [Request Feature](https://github.com/your-repo/issues) · [Documentation](docs/)

</div>
