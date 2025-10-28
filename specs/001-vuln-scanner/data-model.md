# Data Model: Educational Vulnerability Scanner

**Date**: October 28, 2025  
**Purpose**: Define data structures and relationships for scan operations, findings, and AI analysis

## Entity Relationship Overview

```
Target 1──────* ScanSession 1──────* Finding 1──────1 AIAnalysis
  │
  └── label, identifier
```

**Relationships**:
- A Target can have multiple ScanSessions (historical scans)
- A ScanSession contains multiple Findings (one per discovered port/service)
- Each Finding has one AIAnalysis (explanation, remediation, resources)

---

## Core Entities

### Target

Represents a system that can be scanned (identified by IP or hostname).

**Attributes**:
- `id`: Unique identifier (UUID or auto-increment integer)
- `identifier`: IP address (IPv4 string) or hostname (string) [UNIQUE, REQUIRED]
- `label`: User-provided friendly name (string, optional, max 100 chars)
- `first_seen`: Timestamp when first added (datetime, auto-set)
- `last_scanned`: Timestamp of most recent scan (datetime, nullable)
- `total_scans`: Count of scans performed (integer, default 0)

**Validation Rules**:
- `identifier` must be valid IPv4 address or resolvable hostname
- `identifier` must be unique across all targets
- `label` if provided, must be 1-100 characters
- `first_seen` is immutable after creation
- `last_scanned` updated automatically when scan completes

**State Transitions**:
- Created → (first scan) → Active
- Active → (scan completes) → last_scanned updated

**Indexes**:
- Primary key on `id`
- Unique index on `identifier`
- Index on `last_scanned` for recent target queries

---

### ScanSession

Represents a single scan operation with its parameters and status.

**Attributes**:
- `id`: Unique identifier (UUID or auto-increment integer)
- `target_id`: Foreign key to Target (integer, REQUIRED)
- `status`: Current state (enum: 'pending', 'running', 'completed', 'failed', 'cancelled')
- `port_range`: Ports scanned (string, e.g., "1-1000" or "22,80,443", max 255 chars)
- `scan_type`: Nmap scan type (string, e.g., "-sT", default "-sT -sV", max 50 chars)
- `started_at`: When scan started (datetime, auto-set when status→running)
- `completed_at`: When scan finished (datetime, nullable, set on completion)
- `duration_seconds`: Total scan time (integer, calculated)
- `total_ports_scanned`: Number of ports checked (integer, default 0)
- `open_ports_found`: Number of open ports (integer, default 0)
- `error_message`: Error details if failed (text, nullable)
- `raw_output`: Raw Nmap XML output (text, nullable, for debugging)
- `created_at`: Record creation timestamp (datetime, auto-set)

**Validation Rules**:
- `status` must be one of: pending, running, completed, failed, cancelled
- `port_range` must be valid Nmap format (1-65535, comma or hyphen separated)
- `started_at` required when status is 'running', 'completed', or 'failed'
- `completed_at` required when status is 'completed', 'failed', or 'cancelled'
- `duration_seconds` = completed_at - started_at (auto-calculated)
- `error_message` required when status is 'failed'

**State Transitions**:
```
pending → running → completed
         ↓        ↘
      cancelled    failed
```

**Lifecycle**:
1. Created with status='pending'
2. Scan starts → status='running', started_at=now
3. Scan completes → status='completed', completed_at=now, findings created
4. User cancels → status='cancelled', completed_at=now
5. Scan errors → status='failed', completed_at=now, error_message set

**Indexes**:
- Primary key on `id`
- Foreign key on `target_id` referencing Target(id)
- Index on `status` for filtering active scans
- Composite index on (`target_id`, `created_at`) for target history
- Index on `created_at` for recent scans

---

### Finding

Represents a single discovered port/service from a scan.

**Attributes**:
- `id`: Unique identifier (UUID or auto-increment integer)
- `scan_session_id`: Foreign key to ScanSession (integer, REQUIRED)
- `port`: Port number (integer 1-65535, REQUIRED)
- `protocol`: Network protocol (enum: 'tcp', 'udp', default 'tcp')
- `state`: Port state (enum: 'open', 'closed', 'filtered', REQUIRED)
- `service_name`: Service identifier (string, e.g., "ssh", "http", nullable, max 100 chars)
- `service_version`: Detected version (string, nullable, max 255 chars)
- `service_product`: Product name (string, e.g., "OpenSSH", nullable, max 255 chars)
- `severity`: Risk level (enum: 'critical', 'high', 'medium', 'low', 'info', REQUIRED)
- `severity_reason`: Why this severity assigned (text, nullable)
- `cve_references`: Comma-separated CVE IDs (string, nullable, max 500 chars)
- `created_at`: Record creation timestamp (datetime, auto-set)

**Validation Rules**:
- `port` must be 1-65535
- `protocol` must be 'tcp' or 'udp'
- `state` must be 'open', 'closed', or 'filtered'
- `severity` must be one of: critical, high, medium, low, info
- `severity` determined by service type, version, known vulnerabilities
- Only 'open' ports have AIAnalysis generated

**Severity Assignment Logic** (from requirements):
- **Critical**: Known exploits + outdated version
- **High**: Known vulnerabilities in current version
- **Medium**: Service with security implications (SSH, RDP, databases)
- **Low**: Common services without known issues (HTTP, HTTPS)
- **Info**: Standard services, informational only

**Indexes**:
- Primary key on `id`
- Foreign key on `scan_session_id` referencing ScanSession(id)
- Composite index on (`scan_session_id`, `port`) for unique finding lookup
- Index on `severity` for filtering by risk level
- Index on `state` for filtering open/closed ports

---

### AIAnalysis

Represents AI-generated educational content for a finding.

**Attributes**:
- `id`: Unique identifier (UUID or auto-increment integer)
- `finding_id`: Foreign key to Finding (integer, UNIQUE, REQUIRED)
- `explanation`: Plain-language description (text, REQUIRED, max 2000 chars)
- `security_implications`: Why this matters for security (text, nullable, max 1000 chars)
- `remediation_steps`: How to fix/secure (text, nullable, max 2000 chars)
- `learning_resources`: JSON array of resource objects (JSON, nullable)
- `exploit_information`: Educational exploit overview (text, nullable, max 1500 chars)
- `ethical_disclaimer_shown`: Whether disclaimer displayed (boolean, default true)
- `ai_model_used`: Which model generated this (string, e.g., "gpt-4-turbo", max 50 chars)
- `generation_timestamp`: When analysis generated (datetime, auto-set)
- `cached`: Whether from cache vs fresh generation (boolean, default false)

**Validation Rules**:
- `finding_id` must be unique (1:1 relationship with Finding)
- `explanation` required, 100-2000 characters
- `learning_resources` must be valid JSON array of format:
  ```json
  [
    {"title": "OWASP Guide", "url": "https://...", "type": "guide"},
    {"title": "CVE-2023-1234", "url": "https://...", "type": "cve"}
  ]
  ```
- `exploit_information` only populated when severity is 'critical' or 'high'
- `ethical_disclaimer_shown` must be true if `exploit_information` present

**Learning Resource Types**:
- `guide`: Tutorial or how-to guide
- `cve`: CVE database entry
- `documentation`: Official docs
- `tool`: Security tool reference
- `article`: Blog post or article

**Indexes**:
- Primary key on `id`
- Unique foreign key on `finding_id` referencing Finding(id)
- Index on `cached` for cache hit rate monitoring
- Index on `generation_timestamp` for recent analysis queries

---

## Derived/Computed Data

### Dashboard Statistics (not stored, computed on-demand)

**Per Scan Session**:
- Total ports scanned (from ScanSession.total_ports_scanned)
- Open ports count (from ScanSession.open_ports_found)
- Findings by severity (COUNT grouped by Finding.severity)
- Scan duration (ScanSession.duration_seconds)
- Services discovered (DISTINCT Finding.service_name)

**Per Target**:
- Total scans performed (COUNT ScanSessions)
- Last scan date (MAX ScanSession.completed_at)
- Historical severity trend (severity counts over time)

**Comparison Between Scans**:
- New findings (ports open now but not before)
- Resolved findings (ports closed now but were open)
- Changed services (version/product differences)

---

## Data Retention & Cleanup

**Retention Policy** (from FR-032):
- Keep last 50 scans per target OR scans from last 30 days, whichever is more
- Delete oldest scans when limit exceeded

**Cascade Deletion**:
```
Delete ScanSession 
  → CASCADE delete all Findings
    → CASCADE delete all AIAnalysis
```

**Orphan Cleanup**:
- Delete Targets with zero ScanSessions and last_scanned > 90 days

---

## Database Schema (SQL)

```sql
CREATE TABLE targets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    identifier VARCHAR(255) UNIQUE NOT NULL,
    label VARCHAR(100),
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_scanned TIMESTAMP,
    total_scans INTEGER DEFAULT 0
);

CREATE TABLE scan_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    port_range VARCHAR(255) NOT NULL DEFAULT '1-1000',
    scan_type VARCHAR(50) NOT NULL DEFAULT '-sT -sV',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,
    total_ports_scanned INTEGER DEFAULT 0,
    open_ports_found INTEGER DEFAULT 0,
    error_message TEXT,
    raw_output TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (target_id) REFERENCES targets(id) ON DELETE CASCADE,
    CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled'))
);

CREATE TABLE findings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scan_session_id INTEGER NOT NULL,
    port INTEGER NOT NULL CHECK (port >= 1 AND port <= 65535),
    protocol VARCHAR(10) NOT NULL DEFAULT 'tcp',
    state VARCHAR(20) NOT NULL,
    service_name VARCHAR(100),
    service_version VARCHAR(255),
    service_product VARCHAR(255),
    severity VARCHAR(20) NOT NULL,
    severity_reason TEXT,
    cve_references VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scan_session_id) REFERENCES scan_sessions(id) ON DELETE CASCADE,
    CHECK (protocol IN ('tcp', 'udp')),
    CHECK (state IN ('open', 'closed', 'filtered')),
    CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
    UNIQUE(scan_session_id, port)
);

CREATE TABLE ai_analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    finding_id INTEGER UNIQUE NOT NULL,
    explanation TEXT NOT NULL,
    security_implications TEXT,
    remediation_steps TEXT,
    learning_resources TEXT, -- JSON
    exploit_information TEXT,
    ethical_disclaimer_shown BOOLEAN DEFAULT 1,
    ai_model_used VARCHAR(50),
    generation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cached BOOLEAN DEFAULT 0,
    FOREIGN KEY (finding_id) REFERENCES findings(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_targets_last_scanned ON targets(last_scanned);
CREATE INDEX idx_scans_target ON scan_sessions(target_id, created_at);
CREATE INDEX idx_scans_status ON scan_sessions(status);
CREATE INDEX idx_scans_created ON scan_sessions(created_at);
CREATE INDEX idx_findings_scan ON findings(scan_session_id);
CREATE INDEX idx_findings_severity ON findings(severity);
CREATE INDEX idx_findings_state ON findings(state);
CREATE INDEX idx_ai_cached ON ai_analyses(cached);
CREATE INDEX idx_ai_timestamp ON ai_analyses(generation_timestamp);
```

---

## API Data Transfer Objects (DTOs)

### ScanRequest (POST /api/scans)
```json
{
  "target": "192.168.1.100",
  "port_range": "1-1000",
  "scan_type": "-sT"
}
```

### ScanResponse
```json
{
  "scan_id": "uuid",
  "target": "192.168.1.100",
  "status": "running",
  "started_at": "2025-10-28T12:00:00Z"
}
```

### FindingDetail
```json
{
  "id": "uuid",
  "port": 22,
  "protocol": "tcp",
  "state": "open",
  "service": {
    "name": "ssh",
    "version": "OpenSSH 7.4",
    "product": "OpenSSH"
  },
  "severity": "medium",
  "severity_reason": "SSH service with outdated version",
  "cve_references": ["CVE-2023-1234"],
  "ai_analysis": {
    "explanation": "SSH is a protocol for secure remote login...",
    "security_implications": "Outdated version may have known vulnerabilities...",
    "remediation_steps": "1. Update SSH to latest version...",
    "learning_resources": [
      {
        "title": "OWASP SSH Security",
        "url": "https://owasp.org/ssh",
        "type": "guide"
      }
    ],
    "exploit_information": null
  }
}
```

### ProgressEvent (SSE)
```json
{
  "event": "progress",
  "data": {
    "scan_id": "uuid",
    "percentage": 45,
    "current_port": 450,
    "ports_scanned": 450,
    "open_ports_found": 3,
    "message": "Scanning port 450..."
  }
}
```

---

## Migration Strategy

**Initial Schema**: SQLite with schema version 1
**Future Migrations**:
- v1→v2: Add user authentication tables
- v2→v3: Add scan templates/presets
- v3→v4: Add collaborative features (shared scans)

**Tooling**: Alembic for schema migrations (Python)

**Backward Compatibility**: 
- Always add columns as nullable or with defaults
- Never remove columns in minor versions
- Deprecate before removing in major versions
