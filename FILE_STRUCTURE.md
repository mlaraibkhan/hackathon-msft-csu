# 📁 Project File Structure

Complete overview of all files in the Educational Vulnerability Scanner project.

## 🌳 Directory Tree

```
hackathon-msft-csu/
│
├── 📄 README.md                          # Main project overview (start here!)
├── 📄 PROJECT_README.md                  # Complete documentation & guide
├── 📄 WINDOWS_QUICKSTART.md             # Windows 11 quick start guide
├── 📄 FILE_STRUCTURE.md                 # This file - project structure
│
├── 🪟 start-backend-windows.bat         # Windows: Start backend
├── 🪟 start-frontend-windows.bat        # Windows: Start frontend
│
├── 📂 backend/                          # Python Flask Backend
│   ├── 📄 requirements.txt              # Python dependencies
│   ├── 📄 .env.example                  # Environment config template
│   ├── 📄 .flake8                       # Python linting config
│   ├── 📄 pyproject.toml                # Python project config
│   │
│   └── 📂 src/                          # Backend source code
│       ├── 📄 __init__.py               # Package initializer
│       ├── 📄 main.py                   # 🚀 Application entry point
│       ├── 📄 app.py                    # Flask app factory
│       ├── 📄 database.py               # Database configuration
│       ├── 📄 privilege_helper.py       # Nmap privilege checking
│       │
│       ├── 📂 api/                      # REST API Endpoints
│       │   ├── 📄 __init__.py
│       │   ├── 📄 scans.py              # POST/GET /api/scans
│       │   └── 📄 findings.py           # GET /api/findings/:id
│       │
│       ├── 📂 models/                   # Database Models
│       │   ├── 📄 __init__.py
│       │   ├── 📄 target.py             # Target model (IP/hostname)
│       │   ├── 📄 scan_session.py       # ScanSession model
│       │   ├── 📄 finding.py            # Finding model (ports)
│       │   └── 📄 ai_analysis.py        # AIAnalysis model
│       │
│       ├── 📂 services/                 # Business Logic
│       │   ├── 📄 __init__.py
│       │   ├── 📄 scan_service.py       # ⭐ Core scanning logic
│       │   └── 📄 target_service.py     # Target validation
│       │
│       ├── 📂 utils/                    # Utilities
│       │   ├── 📄 __init__.py
│       │   ├── 📄 validators.py         # Input validation
│       │   ├── 📄 logger.py             # Logging setup
│       │   └── 📄 nmap_parser.py        # Parse nmap XML output
│       │
│       └── 📂 middleware/               # Flask Middleware
│           ├── 📄 __init__.py
│           └── 📄 error_handler.py      # Error handling
│
├── 📂 frontend/                         # Electron + React Frontend
│   ├── 📄 package.json                  # Node dependencies & scripts
│   ├── 📄 package-lock.json             # Locked dependency versions
│   ├── 📄 index.html                    # HTML template
│   ├── 📄 vite.config.ts                # Vite build configuration
│   ├── 📄 tsconfig.json                 # TypeScript configuration
│   ├── 📄 tsconfig.node.json            # TS config for Node
│   ├── 📄 .eslintrc.json                # ESLint configuration
│   ├── 📄 electron-builder.yml          # Electron packaging config
│   │
│   ├── 📂 electron/                     # Electron Main Process
│   │   ├── 📄 main.ts                   # 🚀 Electron entry point
│   │   ├── 📄 preload.ts                # Preload script (security)
│   │   └── 📄 ipc.ts                    # IPC definitions
│   │
│   └── 📂 src/                          # React Application
│       ├── 📄 main.tsx                  # React entry point
│       ├── 📄 App.tsx                   # Root component
│       ├── 📄 App.css                   # Global styles
│       ├── 📄 index.css                 # Base styles
│       ├── 📄 vite-env.d.ts             # TypeScript definitions
│       │
│       ├── 📂 pages/                    # Page Components
│       │   ├── 📄 Dashboard.tsx         # ⭐ Main page
│       │   ├── �� Dashboard.css
│       │   ├── 📄 History.tsx           # History page (stub)
│       │   └── 📄 History.css
│       │
│       └── 📂 components/               # Reusable Components
│           ├── 📄 ScanForm.tsx          # Target input form
│           ├── 📄 ScanForm.css
│           ├── 📄 ScanProgress.tsx      # Progress bar
│           ├── 📄 ScanProgress.css
│           ├── 📄 ScanResults.tsx       # Results table
│           ├── 📄 ScanResults.css
│           ├── 📄 FindingRow.tsx        # Table row component
│           └── 📄 FindingRow.css
│
├── 📂 docs/                             # Documentation
│   ├── 📄 MVP_COMPLETE.md               # Implementation summary
│   └── 📄 IMPLEMENTATION_STATUS.md      # Detailed task checklist
│
├── 📂 scripts/                          # Utility Scripts
│   └── 📄 dev.sh                        # Linux/macOS startup script
│
└── 📂 specs/                            # Project Specifications
    └── 📂 001-vuln-scanner/
        ├── 📄 tasks.md                  # Task breakdown
        ├── 📄 plan.md                   # Implementation plan
        ├── 📄 research.md               # Research notes
        └── 📄 data-model.md             # Database design

```

## 📊 File Statistics

- **Total Files:** 60+
- **Python Files:** 18
- **TypeScript/React Files:** 18
- **CSS Files:** 7
- **Config Files:** 10
- **Documentation:** 7

## 🔑 Key Files to Understand

### Backend (Python)

| File | Purpose | Key Functions |
|------|---------|---------------|
| `backend/src/main.py` | Entry point | Starts Flask server |
| `backend/src/app.py` | Flask setup | Creates app, registers routes |
| `backend/src/services/scan_service.py` | **Core logic** | Executes scans, manages threads |
| `backend/src/utils/validators.py` | Input validation | IPv4, hostname, RFC1918 checks |
| `backend/src/privilege_helper.py` | Privilege checking | Detects admin/sudo status |
| `backend/src/api/scans.py` | REST API | POST/GET scan endpoints |

### Frontend (TypeScript/React)

| File | Purpose | Key Components |
|------|---------|----------------|
| `frontend/electron/main.ts` | Electron main | Window management, IPC handlers |
| `frontend/src/main.tsx` | React entry | Renders App component |
| `frontend/src/App.tsx` | Root component | Routing, main layout |
| `frontend/src/pages/Dashboard.tsx` | **Main page** | Scan form, progress, results |
| `frontend/src/components/ScanForm.tsx` | User input | Target entry, validation |
| `frontend/src/components/ScanProgress.tsx` | Progress display | Polls backend, shows progress |
| `frontend/src/components/ScanResults.tsx` | Results table | Displays findings |

## 🗺️ Request Flow

```
User enters IP in ScanForm.tsx
    ↓
ScanForm calls window.api.startScan()
    ↓
Electron main.ts forwards to Flask backend
    ↓
Flask api/scans.py receives POST request
    ↓
Creates Target via target_service.py
    ↓
Creates ScanSession via scan_service.py
    ↓
scan_service.py starts background thread
    ↓
Background thread executes nmap
    ↓
Results parsed and stored in SQLite
    ↓
ScanProgress.tsx polls for updates
    ↓
When complete, ScanResults.tsx displays findings
```

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `backend/requirements.txt` | Python packages (Flask, SQLAlchemy, nmap) |
| `backend/.flake8` | Python linting rules |
| `frontend/package.json` | Node packages, npm scripts |
| `frontend/tsconfig.json` | TypeScript compiler options |
| `frontend/vite.config.ts` | Vite build settings |
| `frontend/electron-builder.yml` | Electron packaging config |

## 🗄️ Database Files

When you run the app, these files are created automatically:

```
backend/
└── vuln_scanner.db          # SQLite database (auto-created)
```

Tables created:
- `targets` - Scan targets (IPs/hostnames)
- `scan_sessions` - Individual scans
- `findings` - Discovered ports/services
- `ai_analyses` - AI explanations (future)

## 🚀 Startup Scripts

### Windows
- `start-backend-windows.bat` - Starts Flask with admin check
- `start-frontend-windows.bat` - Starts Electron/Vite

### Linux/macOS
- `scripts/dev.sh` - Starts both backend and frontend

## 📝 Documentation Files

| File | Content |
|------|---------|
| `README.md` | Quick overview, links to guides |
| `PROJECT_README.md` | **Complete guide** - features, setup, architecture |
| `WINDOWS_QUICKSTART.md` | Fast Windows 11 setup guide |
| `FILE_STRUCTURE.md` | This file - project structure |
| `docs/MVP_COMPLETE.md` | What's implemented, statistics |
| `docs/IMPLEMENTATION_STATUS.md` | Detailed task checklist |

## 🎨 Asset Files

Currently, the project uses:
- Text-based UI (no images)
- CSS for styling
- Emoji icons in UI (🔒, ⚠️, etc.)

Future additions might include:
- Logo/icon files
- Screenshot images
- Tutorial videos

## 🧪 Test Files

Test structure (not yet implemented):
```
backend/tests/
├── unit/
│   ├── test_validators.py
│   ├── test_scan_service.py
│   └── test_nmap_parser.py
└── integration/
    └── test_scan_flow.py

frontend/tests/
├── e2e/
│   ├── scan-windows.spec.ts
│   ├── scan-linux.spec.ts
│   └── scan-macos.spec.ts
└── unit/
    └── components/
```

## 🔍 Finding Specific Features

**Want to modify scan logic?**
→ `backend/src/services/scan_service.py`

**Want to change the UI?**
→ `frontend/src/components/` or `frontend/src/pages/`

**Want to add API endpoints?**
→ `backend/src/api/`

**Want to change database schema?**
→ `backend/src/models/`

**Want to modify privilege checking?**
→ `backend/src/privilege_helper.py`

**Want to change validation rules?**
→ `backend/src/utils/validators.py`

## 💡 Tips

1. **Start here:** Read `PROJECT_README.md` first
2. **Quick test:** Run with `127.0.0.1` to scan yourself
3. **Debugging backend:** Check logs in terminal where you ran `main.py`
4. **Debugging frontend:** Press F12 in Electron window for DevTools
5. **Database:** Use DB Browser for SQLite to view `vuln_scanner.db`

---

**Questions?** Check [PROJECT_README.md](PROJECT_README.md) or [docs/](docs/)
