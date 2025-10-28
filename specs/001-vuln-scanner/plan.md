# Implementation Plan: Educational Vulnerability Scanner

**Branch**: `001-vuln-scanner` | **Date**: October 28, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-vuln-scanner/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a desktop-based educational vulnerability scanner that performs network port scanning, identifies services, and provides AI-powered analysis and learning resources for security beginners. The system must execute port scans, display results in an intuitive dashboard with severity indicators, generate plain-language explanations of findings, suggest remediation steps, and link to educational resources while maintaining strong ethical guidelines for authorized use only.

## Technical Context

**Language/Version**: 
- Backend: Python 3.11+ (minimum 3.11.0 for modern async and performance features)
- Frontend: TypeScript 5.0+ with Node.js 18 LTS

**Primary Dependencies**: 
- **Core Backend**: 
  - python-nmap 0.7.1+ (Nmap Python wrapper)
  - nmap 7.92+ (system package - required installation)
  - Flask 3.0+ (lightweight web framework)
  - SQLAlchemy 2.0+ (ORM for database)
  - openai 1.0+ (OpenAI Python SDK for GPT-4 integration)
- **Frontend Desktop**: 
  - Electron 27.0+ (desktop application framework)
  - React 18.2+ (UI framework)
  - TypeScript 5.0+ (type safety)
  - electron-builder 24.0+ (packaging and distribution)

**Storage**: SQLite 3.35+ (local file-based database for simplicity and portability)

**Testing**: 
- Backend: pytest 7.4+, pytest-flask 1.3+, pytest-cov 4.1+ for coverage
- Frontend: Jest 29+, React Testing Library 14+, Playwright 1.40+ for E2E
- Integration: Postman/Newman for API contract testing

**Target Platform**: Desktop application (cross-platform: Linux, Windows, macOS via Electron)

**Project Type**: Desktop application (Electron frontend + Python Flask backend with IPC bridge)

**Performance Goals**: 
  - Application launch: <5 seconds on systems meeting minimum requirements
  - Scan completion: <2 minutes for common 100 ports
  - AI analysis generation: <10 seconds per finding
  - Dashboard load: <1 second initial render
  - UI responsiveness: <100ms for user interactions
  - Memory usage: <500MB during typical operation (1-3 concurrent scans)
  - Support 10 concurrent scans without degradation

**Constraints**:

- Desktop application requiring local installation and Electron runtime
- Graceful degradation when AI unavailable
- Real-time scan progress updates via IPC
- Network scanning requires elevated privileges (sudo/admin/setcap)
- Must prevent unauthorized/external target scanning
- Cross-platform compatibility (Linux, Windows, macOS)
- Python runtime must be bundled with Electron application
- Installer size target: <150MB for easy distribution

**Scale/Scope**:

- Single-user educational tool (can support 10 concurrent scans)
- Store last 50 scans per user
- Support scanning up to 1000 ports per scan
- Handle up to 100 findings per scan with AI analysis

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ✅ PASS - Constitution file is template-only, no specific gates defined

The constitution.md file contains only template placeholders without specific principles or gates defined for this project. Therefore, no architectural constraints or governance rules are enforced at this time.

**Post-Design Re-check**: Will re-evaluate after Phase 1 completes to ensure design aligns with any principles documented during development.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/           # Data models (ScanSession, Finding, Target, etc.)
│   ├── services/         # Business logic (scanner, AI analyzer, severity classifier)
│   ├── api/              # Flask REST endpoints for IPC
│   ├── utils/            # Helpers (validators, formatters, nmap parser)
│   ├── main.py           # Flask application entry point
│   └── privilege_helper.py # Elevated privilege management for nmap
├── tests/
│   ├── unit/             # Unit tests for services and models
│   ├── integration/      # API integration tests
│   └── contract/         # Contract tests for external dependencies
└── requirements.txt      # Python dependencies

frontend/
├── electron/
│   ├── main.ts           # Electron main process (window management, IPC)
│   ├── preload.ts        # Preload script for secure context bridge
│   └── ipc.ts            # IPC handlers for backend communication
├── src/
│   ├── components/       # Reusable React UI components (FindingCard, SeverityBadge, etc.)
│   ├── pages/            # Route pages (Dashboard, ScanResults, History)
│   ├── services/         # IPC client, data fetching, API abstraction
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Frontend utilities
│   ├── App.tsx           # Main React application component
│   └── index.tsx         # React entry point
├── tests/
│   ├── unit/             # React component unit tests
│   └── e2e/              # Playwright E2E tests
├── package.json          # Node.js dependencies
└── electron-builder.yml  # Electron packaging configuration

scripts/
├── build.sh              # Build script for all platforms
├── package-linux.sh      # Linux-specific packaging
├── package-windows.sh    # Windows-specific packaging
└── package-macos.sh      # macOS-specific packaging

docs/
├── api/                  # Backend API documentation
├── deployment/           # Deployment and installation guides
└── privilege-setup.md    # Guide for nmap privilege configuration

dist/                     # Built application packages (gitignored)
```

**Structure Decision**: Desktop application architecture using Electron for cross-platform GUI with embedded Python Flask backend. Electron main process manages application lifecycle and windows, while renderer process runs React UI. IPC bridge enables communication between React frontend and Python backend for scan operations. Backend runs as local server (127.0.0.1) accessible only to Electron process. This architecture allows Python to handle privileged network operations (nmap) while Electron provides native desktop experience across platforms. Python runtime is bundled with Electron for portability.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - No constitution violations detected. Constitution file contains only templates without specific principles or constraints to violate.
