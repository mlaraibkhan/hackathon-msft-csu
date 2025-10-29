# Tasks: Educational Vulnerability Scanner

**Input**: Design documents from `/specs/001-vuln-scanner/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:
- Backend: `backend/src/`, `backend/tests/`
- Frontend: `frontend/src/`, `frontend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project directory structure (backend/, frontend/, docs/, scripts/)
- [X] T002 Initialize Python backend with Flask in backend/requirements.txt
- [X] T003 [P] Initialize Electron + React + TypeScript frontend in frontend/package.json
- [X] T004 [P] Configure Python linting (flake8, black) in backend/.flake8
- [X] T005 [P] Configure TypeScript + ESLint in frontend/.eslintrc.json
- [X] T006 [P] Create environment configuration template in backend/.env.example
- [X] T007 [P] Setup Electron main process entry point in frontend/electron/main.ts
- [X] T008 [P] Setup Electron preload script with secure context bridge (contextIsolation) in frontend/electron/preload.ts
- [X] T009 [P] Configure electron-builder for cross-platform packaging in frontend/electron-builder.yml
- [ ] T010 [P] Create privilege setup documentation in docs/privilege-setup.md
- [ ] T011 [P] Create README.md with setup instructions and privilege requirements

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T012 Setup SQLite database with SQLAlchemy in backend/src/database.py
- [ ] T013 Create Alembic migrations framework in backend/alembic/
- [ ] T014 [P] Create Target model per data-model.md in backend/src/models/target.py
- [ ] T015 [P] Create ScanSession model per data-model.md in backend/src/models/scan_session.py
- [ ] T016 [P] Create Finding model per data-model.md in backend/src/models/finding.py
- [ ] T017 [P] Create AIAnalysis model per data-model.md in backend/src/models/ai_analysis.py
- [ ] T018 Run initial database migration to create tables
- [ ] T019 [P] Setup Flask app factory with blueprints in backend/src/app.py
- [ ] T020 [P] Configure local-only access (127.0.0.1) for Flask in backend/src/app.py
- [ ] T021 [P] Implement input validation utilities in backend/src/utils/validators.py
- [ ] T022 [P] Create error handling middleware in backend/src/middleware/error_handler.py
- [ ] T023 [P] Setup structured logging in backend/src/utils/logger.py
- [ ] T024 [P] Create privilege helper module for nmap in backend/src/privilege_helper.py
- [ ] T025 [P] Implement privilege detection (check if running with sudo/admin) in backend/src/privilege_helper.py
- [ ] T026 [P] Create platform-specific privilege elevation helpers (Linux setcap, Windows admin, macOS) in backend/src/privilege_helper.py
- [ ] T027 [P] Create Electron IPC bridge module for Flask backend communication in frontend/electron/ipc.ts
- [ ] T028 [P] Setup React Router in frontend/src/App.tsx
- [ ] T029 [P] Create base IPC client wrapper in frontend/src/services/ipc.ts
- [ ] T030 [P] Implement Electron security best practices (contextIsolation, sandbox) in frontend/electron/main.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Network Scan (Priority: P1) 🎯 MVP

**Goal**: Users can enter a target IP, run a port scan, and see results with port numbers, states, and service names

**Independent Test**: Enter valid target IP → click "Scan" → view results showing open ports with service names

### Implementation for User Story 1

- [ ] T031 [P] [US1] Install and configure python-nmap wrapper in backend/requirements.txt
- [ ] T032 [P] [US1] Create ScanService with Nmap integration in backend/src/services/scan_service.py
- [ ] T033 [P] [US1] Create TargetService for target management in backend/src/services/target_service.py
- [ ] T034 [US1] Implement target validation (IPv4, hostname, RFC1918 check) in backend/src/services/target_service.py
- [ ] T035 [US1] Implement privilege check before scan execution in backend/src/services/scan_service.py
- [ ] T036 [US1] Add privilege elevation guidance in scan error messages
- [ ] T037 [US1] Implement Nmap XML parsing logic in backend/src/utils/nmap_parser.py
- [ ] T038 [US1] Create POST /api/scans endpoint in backend/src/api/scans.py
- [ ] T039 [US1] Create GET /api/scans/{scan_id} endpoint in backend/src/api/scans.py
- [ ] T040 [US1] Implement scan execution with background threading in backend/src/services/scan_service.py
- [ ] T041 [US1] Store scan results in database (ScanSession, Finding entities)
- [ ] T042 [P] [US1] Create ScanForm component with IP input validation in frontend/src/components/ScanForm.tsx
- [ ] T043 [P] [US1] Create ScanProgress component with progress bar in frontend/src/components/ScanProgress.tsx
- [ ] T044 [P] [US1] Create ScanResults component displaying findings table in frontend/src/components/ScanResults.tsx
- [ ] T045 [P] [US1] Create FindingRow component showing port, state, service in frontend/src/components/FindingRow.tsx
- [ ] T046 [US1] Create Dashboard page integrating ScanForm and ScanResults in frontend/src/pages/Dashboard.tsx
- [ ] T047 [US1] Implement scan initiation with IPC call in frontend/src/services/scanService.ts
- [ ] T048 [US1] Implement poll-based progress tracking via IPC in frontend/src/services/scanService.ts
- [ ] T049 [US1] Add privilege warning dialog when nmap lacks permissions
- [ ] T050 [US1] Add error handling for invalid targets and scan failures
- [ ] T051 [US1] Display user-friendly error messages in UI

**Checkpoint**: User Story 1 complete - users can scan targets and view basic results

---

## Phase 4: User Story 2 - AI-Powered Explanation of Findings (Priority: P2)

**Goal**: Users can click any finding to see plain-language explanation of the service, security implications, and risks

**Independent Test**: Click any finding in results → see AI-generated explanation popup/panel

### Implementation for User Story 2

- [ ] T042-US2 [P] [US2] Install OpenAI Python SDK in backend/requirements.txt
- [ ] T043-US2 [P] [US2] Create AIService with GPT-4 integration in backend/src/services/ai_service.py
- [ ] T044-US2 [US2] Implement prompt engineering for service explanations in backend/src/services/ai_service.py
- [ ] T045-US2 [US2] Create caching layer for common service explanations in backend/src/services/ai_service.py
- [ ] T046-US2 [US2] Create POST /api/findings/{finding_id}/analyze endpoint in backend/src/api/findings.py
- [ ] T047-US2 [US2] Implement AI analysis generation and storage (AIAnalysis entity)
- [ ] T048-US2 [US2] Add fallback handling when AI API unavailable
- [ ] T049-US2 [P] [US2] Create FindingDetail modal/panel component in frontend/src/components/FindingDetail.tsx
- [ ] T050-US2 [P] [US2] Create AIExplanation component displaying analysis in frontend/src/components/AIExplanation.tsx
- [ ] T051-US2 [US2] Implement click handler on FindingRow to open detail view
- [ ] T052-US2 [US2] Fetch and display AI analysis on finding selection
- [ ] T053-US2 [US2] Add loading spinner while AI generates analysis
- [ ] T054-US2 [US2] Display simplified technical terms with tooltips/glossary

**Checkpoint**: User Story 2 complete - users get educational explanations for findings

---

## Phase 5: User Story 3 - Severity Assessment and Prioritization (Priority: P2)

**Goal**: Each finding shows clear severity level (Critical/High/Medium/Low/Info) with visual indicators, filterable and sortable

**Independent Test**: View scan results → see color-coded severity badges → filter by severity level

### Implementation for User Story 3

- [ ] T055-US3 [P] [US3] Create SeverityClassifier utility in backend/src/utils/severity_classifier.py
- [ ] T056-US3 [US3] Implement severity logic based on service type and version
- [ ] T057-US3 [US3] Assign severity to findings during scan processing in backend/src/services/scan_service.py
- [ ] T058-US3 [US3] Add GET /api/scans/{scan_id}/findings?severity={level} filtering endpoint
- [ ] T059-US3 [P] [US3] Create SeverityBadge component with color styling in frontend/src/components/SeverityBadge.tsx
- [ ] T060-US3 [P] [US3] Create SeverityFilter component with checkboxes in frontend/src/components/SeverityFilter.tsx
- [ ] T061-US3 [P] [US3] Create DashboardSummary component showing severity breakdown in frontend/src/components/DashboardSummary.tsx
- [ ] T062-US3 [US3] Integrate SeverityBadge into FindingRow component
- [ ] T063-US3 [US3] Implement client-side filtering by severity level
- [ ] T064-US3 [US3] Implement sorting by severity (Critical → Info)
- [ ] T065-US3 [US3] Display dashboard statistics (total ports, open ports, severity counts)
- [ ] T066-US3 [US3] Add severity explanation in FindingDetail (why this severity assigned)

**Checkpoint**: User Story 3 complete - users can prioritize findings by severity

---

## Phase 6: User Story 4 - Remediation Guidance (Priority: P3)

**Goal**: Each finding with security implications provides step-by-step remediation instructions in beginner-friendly language

**Independent Test**: View finding detail with vulnerability → see numbered remediation steps → see verification instructions

### Implementation for User Story 4

- [ ] T067-US4 [US4] Enhance AI prompt to generate remediation steps in backend/src/services/ai_service.py
- [ ] T068-US4 [US4] Add remediation_steps field to AIAnalysis generation
- [ ] T069-US4 [US4] Implement remediation step numbering and formatting
- [ ] T070-US4 [P] [US4] Create RemediationSteps component in frontend/src/components/RemediationSteps.tsx
- [ ] T071-US4 [US4] Display remediation steps in FindingDetail panel
- [ ] T072-US4 [US4] Add "How to verify fix" section in remediation display
- [ ] T073-US4 [US4] Style remediation steps as numbered list with clear formatting

**Checkpoint**: User Story 4 complete - users know how to fix vulnerabilities

---

## Phase 7: User Story 5 - Learning Resources and References (Priority: P3)

**Goal**: Each finding links to curated external educational resources (OWASP, CVE, vendor docs)

**Independent Test**: View finding detail → see linked resources → click link → opens external resource

### Implementation for User Story 5

- [ ] T074-US5 [US5] Enhance AI prompt to suggest learning resources in backend/src/services/ai_service.py
- [ ] T075-US5 [US5] Add learning_resources JSON field to AIAnalysis generation
- [ ] T076-US5 [US5] Implement CVE reference lookup when applicable
- [ ] T077-US5 [P] [US5] Create LearningResources component in frontend/src/components/LearningResources.tsx
- [ ] T078-US5 [P] [US5] Create ResourceLink component with icons by type in frontend/src/components/ResourceLink.tsx
- [ ] T079-US5 [US5] Display learning resources in FindingDetail panel
- [ ] T080-US5 [US5] Open external links in new window/tab via Electron shell
- [ ] T081-US5 [US5] Group resources by type (guides, CVE, documentation, tools)

**Checkpoint**: User Story 5 complete - users can explore curated learning materials

---

## Phase 8: User Story 6 - Exploit Information for Lab Testing (Priority: P4)

**Goal**: Advanced findings show educational exploit information with strong ethical disclaimers

**Independent Test**: View critical/high severity finding → see ethical disclaimer → acknowledge → see exploit concept explanation

### Implementation for User Story 6

- [ ] T082-US6 [US6] Enhance AI prompt to generate exploit education in backend/src/services/ai_service.py
- [ ] T083-US6 [US6] Add exploit_information field to AIAnalysis for critical/high severity only
- [ ] T084-US6 [US6] Implement ethical disclaimer requirement flag
- [ ] T085-US6 [P] [US6] Create EthicalDisclaimer modal component in frontend/src/components/EthicalDisclaimer.tsx
- [ ] T086-US6 [P] [US6] Create ExploitInfo component in frontend/src/components/ExploitInfo.tsx
- [ ] T087-US6 [US6] Display disclaimer before showing exploit information
- [ ] T088-US6 [US6] Require user acknowledgment to view exploit details
- [ ] T089-US6 [US6] Store disclaimer acceptance in localStorage
- [ ] T090-US6 [US6] Emphasize "authorized testing only" and responsible disclosure

**Checkpoint**: User Story 6 complete - advanced users get exploit education safely

---

## Phase 9: User Story 7 - Scan History and Progress Tracking (Priority: P4)

**Goal**: Users can view historical scans, compare results over time, track remediation progress

**Independent Test**: Run multiple scans → access history page → view previous scan → compare two scans

### Implementation for User Story 7

- [ ] T091-US7 [US7] Create GET /api/scans endpoint listing scan history in backend/src/api/scans.py
- [ ] T092-US7 [US7] Create GET /api/scans/{scan_id}/compare/{other_scan_id} endpoint in backend/src/api/scans.py
- [ ] T093-US7 [US7] Implement scan comparison logic (new/closed/changed findings)
- [ ] T094-US7 [US7] Implement DELETE /api/scans/{scan_id} endpoint for history cleanup
- [ ] T095-US7 [US7] Implement automatic FIFO cleanup (keep last 50 scans, delete oldest when limit exceeded) in backend/src/services/scan_service.py
- [ ] T096-US7 [P] [US7] Create History page component in frontend/src/pages/History.tsx
- [ ] T097-US7 [P] [US7] Create ScanHistoryList component in frontend/src/components/ScanHistoryList.tsx
- [ ] T098-US7 [P] [US7] Create ScanHistoryItem component showing date, target, summary in frontend/src/components/ScanHistoryItem.tsx
- [ ] T099-US7 [P] [US7] Create ComparisonView component in frontend/src/components/ComparisonView.tsx
- [ ] T100-US7 [US7] Implement history list with sorting (newest first)
- [ ] T101-US7 [US7] Implement scan selection for comparison
- [ ] T102-US7 [US7] Display comparison highlighting changes (new ports, closed ports, version changes)
- [ ] T103-US7 [US7] Add delete functionality for individual scans
- [ ] T104-US7 [US7] Add navigation from history to scan detail view

**Checkpoint**: User Story 7 complete - users can track progress over time

---

## Phase 10: Real-Time Progress Updates (Enhancement)

**Goal**: Implement Server-Sent Events for live scan progress instead of polling

**Note**: This enhances User Story 1 but is separate to avoid blocking MVP

- [ ] T105 [P] Implement SSE endpoint GET /api/scans/{scan_id}/progress in backend/src/api/scans.py
- [ ] T106 [P] Create SSE event emitter in ScanService in backend/src/services/scan_service.py
- [ ] T107 Emit progress events (percentage, current port, findings count)
- [ ] T108 [P] Create useSSE hook in frontend/src/hooks/useSSE.ts
- [ ] T109 Replace polling with SSE connection in ScanProgress component
- [ ] T110 Implement automatic reconnection on connection loss
- [ ] T111 Close SSE connection when scan completes or component unmounts

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T112 [P] Add first-use legal/ethical disclaimer modal in frontend/src/components/LegalDisclaimer.tsx
- [ ] T113 [P] Implement warning for external/public IP scans in frontend/src/components/ScanForm.tsx
- [ ] T114 [P] Add "For Educational Use Only" banner in frontend/src/components/Header.tsx
- [ ] T115 [P] Create comprehensive error messages mapping in backend/src/utils/error_messages.py
- [ ] T116 [P] Implement graceful degradation when AI unavailable in frontend/src/services/aiService.ts
- [ ] T117 [P] Add loading states for all async operations
- [ ] T118 [P] Implement responsive design for laptop/desktop screens (minimum 1024x768)
- [ ] T119 [P] Add keyboard shortcuts (Escape to close modals, Enter to submit)
- [ ] T120 [P] Implement native desktop notifications for scan completion in frontend/electron/main.ts
- [ ] T121 [P] Create API documentation in docs/api/
- [ ] T122 [P] Create deployment guide in docs/deployment/SETUP.md
- [ ] T123 [P] Create privilege setup guide for all platforms in docs/privilege-setup.md
- [ ] T124 [P] Setup pytest test configuration with pytest-flask and pytest-cov in backend/pytest.ini
- [ ] T125 [P] Setup Jest configuration in frontend/jest.config.js
- [ ] T126 [P] Add unit tests for severity classifier in backend/tests/unit/test_severity_classifier.py
- [ ] T127 [P] Add unit tests for Nmap parser in backend/tests/unit/test_nmap_parser.py
- [ ] T128 [P] Add unit tests for privilege helper in backend/tests/unit/test_privilege_helper.py
- [ ] T129 [P] Add integration test for complete scan flow in backend/tests/integration/test_scan_flow.py
- [ ] T130 [P] Add E2E test with Playwright for Linux in frontend/tests/e2e/scan-linux.spec.ts
- [ ] T131 [P] Add E2E test with Playwright for Windows in frontend/tests/e2e/scan-windows.spec.ts
- [ ] T132 [P] Add E2E test with Playwright for macOS in frontend/tests/e2e/scan-macos.spec.ts
- [ ] T133 [P] Test Electron packaging for Linux (.deb, .rpm, .AppImage)
- [ ] T134 [P] Test Electron packaging for Windows (.exe installer)
- [ ] T135 [P] Test Electron packaging for macOS (.dmg)
- [ ] T136 [P] Verify installer size <150MB for all platforms
- [ ] T137 [P] Test privilege elevation on Linux (sudo, setcap)
- [ ] T138 [P] Test privilege elevation on Windows (Run as Administrator)
- [ ] T139 [P] Test privilege elevation on macOS (sudo)
- [ ] T140 Code cleanup and refactoring across all modules
- [ ] T141 Performance optimization (AI caching, database queries, memory usage)
- [ ] T142 Security audit (input validation, SQL injection prevention, IPC security)
- [ ] T143 [P] Implement Electron security hardening (contextIsolation, sandbox, CSP)
- [ ] T144 [P] Create build scripts for all platforms in scripts/
- [ ] T145 [P] Create automated CI/CD pipeline configuration for cross-platform builds
- [ ] T146 Verify application launch time <5 seconds on minimum hardware
- [ ] T147 Verify UI responsiveness <100ms for all interactions
- [ ] T148 Verify memory usage <500MB during typical operation
- [ ] T149 [P] Verify scan results display renders within 1 second of completion (SC-015)
- [ ] T150 [P] Verify AI analysis generation for 90% of findings within 10 seconds (SC-002)
- [ ] T151 [P] Verify concurrent scan handling without degradation for 10 simultaneous scans (SC-008)
- [ ] T152 [P] Verify privilege guidance displays within 2 seconds when privileges missing (SC-019)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-9)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P2 → P3 → P3 → P4 → P4)
- **Real-Time Progress (Phase 10)**: Enhancement to US1, can be done anytime after US1
- **Polish (Phase 11)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories ✅ **MVP STARTS HERE**
- **User Story 2 (P2)**: Can start after Foundational - Extends US1 findings with AI analysis
- **User Story 3 (P2)**: Can start after Foundational - Extends US1 findings with severity
- **User Story 4 (P3)**: Depends on US2 (uses AI analysis) - Adds remediation to explanations
- **User Story 5 (P3)**: Depends on US2 (uses AI analysis) - Adds resources to explanations
- **User Story 6 (P4)**: Depends on US2 and US3 (uses AI + severity) - Advanced educational content
- **User Story 7 (P4)**: Can start after Foundational - Independent history feature

### Within Each User Story

- Backend models/services before API endpoints
- API endpoints before frontend components
- Frontend components before page integration
- Core implementation before enhancements
- Story complete and tested before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: T002-T008 can all run in parallel (8 tasks)

**Phase 2 (Foundational)**: 
- T011-T014 (models) in parallel (4 tasks)
- T016-T023 (infrastructure) in parallel (8 tasks)

**Phase 3 (User Story 1)**:

- T031-T033 (backend setup) in parallel (3 tasks)
- T042-T045 (frontend components) in parallel (4 tasks)

**Phase 4 (User Story 2)**:
- T042-T043 (AI setup) in parallel (2 tasks)
- T049-T050 (frontend components) in parallel (2 tasks)

**Phase 5 (User Story 3)**:
- T055, T059-T061 (utilities and components) in parallel (4 tasks)

**All Phases**: Tasks marked [P] within each story can be parallelized

**Cross-Story Parallelization**: Once Foundational completes, multiple developers can work on different user stories simultaneously:
- Developer A: User Story 1 (MVP)
- Developer B: User Story 2 (AI explanations)
- Developer C: User Story 3 (Severity)

---

## Parallel Example: User Story 1

```bash
# After Foundational phase completes, launch US1 tasks in parallel:

# Backend tasks (parallel):
Task T031: "Install python-nmap in backend/requirements.txt"
Task T032: "Create ScanService in backend/src/services/scan_service.py"
Task T033: "Create TargetService in backend/src/services/target_service.py"

# Frontend tasks (parallel):
Task T042: "Create ScanForm component in frontend/src/components/ScanForm.tsx"
Task T043: "Create ScanProgress component in frontend/src/components/ScanProgress.tsx"
Task T044: "Create ScanResults component in frontend/src/components/ScanResults.tsx"
Task T045: "Create FindingRow component in frontend/src/components/FindingRow.tsx"

# Then sequential integration tasks (depend on above):
Task T034: "Implement target validation" (needs T033)
Task T038-T041: "API endpoints and scan execution" (needs T032)
Task T046-T051: "Page integration and error handling" (needs T042-T045)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup → ~8 tasks
2. Complete Phase 2: Foundational (CRITICAL) → ~15 tasks  
3. Complete Phase 3: User Story 1 → ~18 tasks
4. **Total MVP: ~41 tasks**
5. **STOP and VALIDATE**: Test User Story 1 independently
6. Deploy/demo basic scanning capability

### Incremental Delivery

1. **Foundation** (Phases 1-2): Setup + Models + Infrastructure → ~23 tasks
2. **MVP Release** (Phase 3): Add User Story 1 → Test independently → Deploy/Demo
3. **AI Education Release** (Phases 4-5): Add User Stories 2-3 → ~24 tasks → Deploy/Demo
4. **Advanced Features** (Phases 6-8): Add User Stories 4-6 → ~33 tasks → Deploy/Demo
5. **Complete Product** (Phase 9): Add User Story 7 → ~14 tasks → Deploy/Demo
6. **Production Ready** (Phases 10-11): Real-time + Polish → ~28 tasks → Final release

Each release adds educational value without breaking previous functionality.

### Parallel Team Strategy

With 3 developers after Foundational phase:

**Week 1-2**: All hands on Foundational (Phase 2)

**Week 3**:

- Dev A: User Story 1 (MVP) - T031-T051
- Dev B: User Story 2 (AI) - T042-US2 to T054-US2
- Dev C: User Story 3 (Severity) - T055-US3 to T066-US3

**Week 4**:

- Dev A: User Story 4 (Remediation) - T067-US4 to T073-US4
- Dev B: User Story 5 (Resources) - T074-US5 to T081-US5
- Dev C: User Story 6 (Exploits) - T082-US6 to T090-US6

**Week 5**:

- Dev A: User Story 7 (History) - T091-US7 to T104-US7
- Dev B: Real-time Progress - T105-T111
- Dev C: Polish & Testing - T112-T152

---

## Task Summary

**Total Tasks**: 152

**By Phase**:

- Phase 1 (Setup): 11 tasks
- Phase 2 (Foundational): 22 tasks ⚠️ BLOCKING
- Phase 3 (US1 - MVP): 21 tasks 🎯
- Phase 4 (US2): 13 tasks
- Phase 5 (US3): 12 tasks
- Phase 6 (US4): 7 tasks
- Phase 7 (US5): 8 tasks
- Phase 8 (US6): 9 tasks
- Phase 9 (US7): 14 tasks
- Phase 10 (Real-time): 7 tasks
- Phase 11 (Polish): 41 tasks

**Parallel Opportunities**: 85+ tasks marked [P] can run in parallel with others in their phase

**MVP Scope** (Phase 1-3): 54 tasks to deliver basic scanning functionality with privilege handling

**Suggested First Milestone**: Complete through Phase 5 (User Stories 1-3) = 79 tasks for core educational scanner

**Cross-Platform Testing**: 15 tasks dedicated to ensuring compatibility across Linux, Windows, and macOS

**Performance Validation**: 5 tasks (T149-T152, plus T146-T148) dedicated to verifying success criteria SC-002, SC-008, SC-013-SC-019

**Security & Privileges**: 8 tasks specifically for handling elevated privileges required by nmap

---

## Notes

- Each task includes exact file path for implementation
- [P] marker indicates parallelization opportunity (different files, no dependencies)
- [Story] label (US1-US7) maps tasks to user stories from spec.md
- Each user story delivers independently testable functionality
- Tests are NOT included (not requested in specification)
- Stop at any checkpoint to validate story independently
- Foundational phase MUST complete before any user story work begins
- Commit after each task or logical group for easy rollback
- **CRITICAL**: Desktop application architecture using Electron + Python backend with IPC communication
- **CRITICAL**: Network scanning requires elevated privileges - handled by privilege helper module
- Cross-platform compatibility validated through platform-specific E2E tests and packaging verification
