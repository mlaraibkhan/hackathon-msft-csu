# Research & Technology Decisions: Educational Vulnerability Scanner

**Date**: October 28, 2025  
**Purpose**: Resolve technical uncertainties and document technology choices for implementation

## Technology Stack Decisions

### Backend Language & Framework

**Decision**: Python 3.11+ with Flask

**Rationale**:
- **Python**: Industry standard for security tools, excellent library ecosystem for network operations
- **Version 3.11+**: Modern async support, improved performance, active security updates
- **Flask**: Lightweight, easy to learn for educational projects, minimal boilerplate, extensive documentation
- Flask provides just enough structure without imposing heavy patterns on beginners

**Alternatives Considered**:
- **FastAPI**: More modern with auto-docs, but adds complexity with Pydantic models and async-first approach
- **Django**: Too heavy for this scope, brings unnecessary ORM and admin features
- **Node.js/Express**: Viable but Python better aligns with security tool ecosystem and Nmap integration

**Best Practices**:
- Use Flask Blueprints to organize API routes by domain (scans, history, analysis)
- Implement proper error handling with Flask error handlers
- Use Flask-CORS for cross-origin requests from frontend
- Implement request validation using Flask-Inputs or similar
- Use environment variables for configuration (API keys, scan settings)

---

### Network Scanning Approach

**Decision**: python-nmap library wrapper around Nmap utility

**Rationale**:
- **Nmap**: Industry-standard, mature, reliable port scanner with extensive service detection
- **python-nmap**: Provides Pythonic interface to Nmap while maintaining full feature access
- Nmap must be installed as system dependency (documented in setup)
- Allows parsing of Nmap XML output for structured data access
- Security beginners benefit from learning industry-standard tool

**Alternatives Considered**:
- **Pure Python scanners (scapy, socket)**: More control but unreliable, less feature-complete, harder to maintain
- **Masscan**: Faster but less service detection, overkill for educational use
- **Zmap**: Research-focused, not suitable for learning/small-scale scans

**Best Practices**:
- Run Nmap with explicit safe flags: `-sV` (version detection), `-sT` (TCP connect - less intrusive)
- Default to scanning top 100 ports for speed, allow custom port ranges
- Implement timeout handling (default 120 seconds)
- Parse Nmap XML output for reliable structured data
- Run scans in background thread/process to avoid blocking API
- Validate target IP against RFC1918 private ranges to warn about external IPs

---

### Frontend Framework

**Decision**: Electron with React.js 18+ and TypeScript

**Rationale**:
- **Electron**: Industry standard for desktop apps, cross-platform support, native integration capabilities
- **React**: Popular, extensive learning resources, component reusability fits feature modularity
- **TypeScript**: Type safety reduces bugs, improves maintainability, better IDE support
- Direct integration with system APIs through Electron's IPC
- Native access to filesystem and system resources
- Ability to bundle Python runtime with the application

**Alternatives Considered**:
- **Qt/PyQt**: Python native but steeper learning curve, complex setup
- **Tkinter**: Too basic for modern UI requirements
- **wxPython**: Good but less modern development experience
- **Native GUI frameworks**: Platform-specific, requires multiple implementations

**Best Practices**:
- Use Electron IPC for communication between UI and Python backend
- Implement proper process separation (main and renderer)
- Use functional React components with hooks
- Implement proper security practices for Electron (contextIsolation, sandbox)
- Handle native system dialogs and notifications through Electron API
- Structure by feature with clear separation of Electron and React code

---

### AI Integration

**Decision**: OpenAI GPT-4 API (gpt-4-turbo or gpt-4o)

**Rationale**:
- **GPT-4**: Superior reasoning for security analysis, better at technical explanations in simple terms
- **Turbo/4o variants**: Balance cost and quality, fast response times (<10s target)
- Well-documented API with Python SDK (openai library)
- Built-in content moderation aligns with ethical disclaimer requirements
- JSON mode available for structured output (severity, remediation steps)

**Alternatives Considered**:
- **GPT-3.5**: Cheaper but less accurate for technical security analysis
- **Claude (Anthropic)**: Comparable quality but less familiar to developers
- **Open-source models (Llama, Mistral)**: Require hosting infrastructure, less reliable

**Best Practices**:
- Use system prompts to enforce beginner-friendly tone and ethical guidelines
- Implement caching for common service explanations to reduce API costs
- Use JSON mode for structured responses (explanation, severity, remediation, resources)
- Set max_tokens limits (500-800 per explanation) to control costs
- Implement retry logic with exponential backoff for API failures
- Cache responses locally to allow graceful degradation when API unavailable
- Sanitize and validate AI outputs before displaying to users

**Prompt Engineering Strategy**:
```
System: You are a security education assistant. Explain findings in simple terms 
for beginners. Include: 1) What the service does, 2) Security implications, 
3) Remediation steps, 4) Learning resources. Always emphasize authorized testing only.

User: Port 22 open, SSH version 7.4, on target 192.168.1.100
```

---

### Data Storage

**Decision**: SQLite for development/single-user, PostgreSQL for production scaling

**Rationale**:
- **SQLite**: Zero-config, file-based, perfect for educational single-user deployment
- **PostgreSQL**: Production-ready, supports concurrent access if scaling to multi-user
- Start with SQLite, abstract database layer for easy migration
- Both supported by SQLAlchemy ORM in Python

**Alternatives Considered**:
- **JSON files**: Too simple, no query capabilities, race conditions
- **MongoDB**: Overkill for structured scan data, adds complexity
- **In-memory only**: Loses scan history on restart

**Best Practices**:
- Use SQLAlchemy ORM for database abstraction
- Define models matching Key Entities from spec (ScanSession, Finding, Target, AIAnalysis)
- Implement migration system (Alembic) from day one
- Index on target, timestamp, severity for query performance
- Implement automatic cleanup (delete scans older than 50 scans or 30 days)
- Store AI responses in database to support offline access

**Schema Design**:
- `scan_sessions`: id, target, timestamp, status, parameters, created_at
- `findings`: id, scan_id (FK), port, protocol, service, version, state, severity, created_at
- `ai_analyses`: id, finding_id (FK), explanation, remediation, resources, exploit_info, created_at
- `targets`: id, identifier (IP/hostname), label, first_seen, last_scanned

---

### Testing Frameworks

**Decision**: 
- **Backend**: pytest with pytest-flask, pytest-cov for coverage
- **Frontend**: Jest + React Testing Library for unit, Playwright for E2E
- **API Contract**: Postman collections or OpenAPI validation

**Rationale**:
- **pytest**: Python standard, excellent fixture system, extensive plugin ecosystem
- **Jest**: React ecosystem standard, fast, built-in coverage, mocking
- **React Testing Library**: User-centric testing, avoids implementation details
- **Playwright**: Modern E2E, better reliability than Selenium, cross-browser

**Alternatives Considered**:
- **unittest**: Built-in but less ergonomic than pytest
- **Cypress**: Popular but Playwright has better developer experience
- **Enzyme**: Older React testing library, less maintained

**Best Practices**:
- Achieve >80% code coverage on backend services
- Mock external dependencies (Nmap, OpenAI API) in unit tests
- Use fixtures for common test data (sample scan results, findings)
- Test error conditions (timeouts, invalid inputs, API failures)
- E2E tests cover critical paths: scan → results → AI explanation → history
- Contract tests verify API matches OpenAPI specification
- Performance tests validate scan completion time (<2 min for 100 ports)

---

### Real-Time Communication

**Decision**: Server-Sent Events (SSE) for scan progress updates

**Rationale**:
- **SSE**: Simple, unidirectional (server→client), built into browsers, works over HTTP
- Perfect for progress updates (percentage, current port, found services)
- No WebSocket complexity (bidirectional not needed)
- Easier to implement in Flask compared to WebSockets
- Falls back gracefully to polling if SSE unavailable

**Alternatives Considered**:
- **WebSockets**: Bidirectional overkill, more complex server setup
- **Polling**: Simple but inefficient, higher latency
- **Long polling**: Complex state management

**Best Practices**:
- Implement SSE endpoint `/scans/{scan_id}/progress`
- Send events: `progress`, `finding`, `complete`, `error`
- Include retry logic and automatic reconnection in frontend
- Set reasonable timeout (5 minutes for scan completion)
- Close SSE connection when scan completes or errors

---

## Security Considerations

### Target Validation

**Approach**: Multi-layer validation to prevent unauthorized scanning

**Implementation**:
1. **Frontend**: Validate IP/hostname format, warn on public IPs
2. **Backend**: 
   - Validate against RFC1918 private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
   - Reject loopback except 127.0.0.1
   - Reject broadcast addresses
   - DNS validation for hostnames
3. **User Confirmation**: Require acknowledgment for non-private IPs

**Best Practices**:
- Implement rate limiting (max 5 scans per hour per user)
- Log all scan attempts with timestamps
- Display ethical disclaimer on first use (store acceptance in localStorage)
- Include "Authorized Use Only" banner on scan initiation

---

### API Security

**Approach**: Basic authentication + API key for AI service

**Implementation**:
- Use environment variables for OpenAI API key (never in code)
- Implement CORS whitelist for frontend origin
- Rate limiting on API endpoints (flask-limiter)
- Input validation on all endpoints
- HTTPS required in production

**Best Practices**:
- Sanitize all user inputs (target IPs, port ranges)
- Validate scan parameters (port ranges 1-65535)
- Implement request size limits
- Log security-relevant events (failed validations, scan attempts)

---

## Deployment Considerations

### Development Environment

**Setup**:
- Backend: Python virtual environment (venv), pip for dependencies
- Frontend: Node.js 18+, npm/yarn for package management
- Nmap: System package (apt, brew, yum)
- Database: SQLite file in data/ directory

**Scripts**:
- `backend/run.sh`: Start Flask development server
- `frontend/npm run dev`: Start frontend dev server (Vite or Create React App)
- `setup.sh`: Install all dependencies (Python, Node, Nmap)

---

### Production Deployment

**Recommended Stack**:
- **Backend**: Gunicorn WSGI server with multiple workers
- **Frontend**: Static build served by Nginx or Caddy
- **Database**: PostgreSQL for multi-user support
- **Reverse Proxy**: Nginx for HTTPS termination and routing
- **Container**: Docker Compose for easy deployment

**Best Practices**:
- Use environment variables for all configuration
- Implement health check endpoints
- Set up structured logging (JSON format)
- Use systemd for service management
- Implement database backups for scan history

---

## Development Workflow

### Phase 1 Priorities

1. **Backend MVP**: 
   - Flask app setup with basic API structure
   - Nmap integration for port scanning
   - SQLAlchemy models for data storage
   - Scan execution endpoint with progress tracking

2. **Frontend MVP**:
   - React app scaffold with routing
   - Scan input form with validation
   - Results display with basic table
   - SSE integration for live progress

3. **AI Integration**:
   - OpenAI API integration
   - Prompt engineering for explanations
   - Caching layer for common services
   - Error handling and fallbacks

4. **Testing Foundation**:
   - Unit tests for scan parsing
   - API endpoint tests
   - Frontend component tests
   - E2E test for complete flow

---

## Open Questions Resolved

### Q: Should we support IPv6?
**A**: No, start with IPv4 only (simpler, more common in lab environments). Add IPv6 in future iteration if needed.

### Q: How to handle Nmap requiring root/sudo?
**A**: Document two approaches:
1. **Development**: Run Flask with sudo (acceptable for local lab)
2. **Production**: Set capabilities on Nmap binary: `setcap cap_net_raw,cap_net_admin=eip /usr/bin/nmap`

### Q: Should we implement user authentication?
**A**: No for MVP (single-user educational tool). Scan history uses browser localStorage for simplicity. Add auth if scaling to multi-user.

### Q: What about CVE database integration?
**A**: Link to external resources (NVD, CVE.org, ExploitDB) rather than hosting database. AI can suggest CVE numbers when applicable, links open in new tabs.

### Q: How detailed should exploit information be?
**A**: Educational overview only - what the vulnerability is, why it's risky, general exploitation concept. NO step-by-step exploitation guides. Always emphasize authorized testing and link to responsible disclosure practices.

---

## Summary

**Resolved Technology Stack**:
- **Backend**: Python 3.11+ + Flask + python-nmap + SQLAlchemy + SQLite/PostgreSQL
- **Frontend**: React 18+ + TypeScript + Material-UI/Chakra UI + React Query
- **AI**: OpenAI GPT-4 (turbo/4o) with caching
- **Real-time**: Server-Sent Events (SSE)
- **Testing**: pytest + Jest + Playwright

**Key Architectural Decisions**:
- Web application architecture (frontend + backend separation)
- Nmap as scanning engine (industry standard)
- SQLite for simplicity, PostgreSQL path for scaling
- AI caching for cost optimization and offline support
- Multi-layer target validation for ethical compliance
- SSE for real-time progress (simpler than WebSockets)

**Next Steps**: Proceed to Phase 1 (data-model.md, contracts/, quickstart.md)
