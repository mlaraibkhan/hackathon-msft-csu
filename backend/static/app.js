// CyberScope - Application Logic
const API_BASE = window.location.origin;
let currentScanId = null;
let pollInterval = null;

// Page Navigation
function goToPage(pageName) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`page-${pageName}`).classList.add('active');
    
    // Update title
    const titles = {
        'dashboard': 'Dashboard',
        'new-scan': 'Create New Scan',
        'scans': 'Scan History',
        'reports': 'Reports'
    };
    document.getElementById('pageTitle').textContent = titles[pageName];
    
    // Load data for page
    if (pageName === 'dashboard') loadDashboard();
    if (pageName === 'scans') loadScans();
}

// Add click handlers to nav items
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        goToPage(item.dataset.page);
    });
});

// Dashboard
async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE}/api/scans`);
        const scans = await response.json();
        
        // Update stats
        document.getElementById('stat-total').textContent = scans.length;
        
        const running = scans.filter(s => s.status === 'running').length;
        document.getElementById('stat-running').textContent = running;
        
        let totalPorts = 0;
        scans.forEach(scan => {
            if (scan.findings) totalPorts += scan.findings.length;
        });
        document.getElementById('stat-ports').textContent = totalPorts;
        
        // Recent scans
        const recentScans = scans.slice(0, 5);
        const recentHtml = recentScans.length ? recentScans.map(scan => `
            <div class="scan-item" style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600;">Scan #${scan.id}</div>
                        <div style="font-size: 0.875rem; color: var(--gray);">Target: ${scan.target || 'N/A'}</div>
                    </div>
                    <div style="text-align: right;">
                        <span class="badge ${scan.status === 'completed' ? 'success' : scan.status === 'running' ? 'info' : 'danger'}">
                            ${scan.status}
                        </span>
                        <div style="font-size: 0.875rem; color: var(--gray); margin-top: 0.25rem;">
                            ${new Date(scan.started_at).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        `).join('') : '<div class="empty-state"><div class="empty-icon">📋</div><p>No scans yet</p><button class="btn-primary" onclick="goToPage(\'new-scan\')">Create Scan</button></div>';
        
        document.getElementById('recent-scans').innerHTML = recentHtml;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Scan Form
document.getElementById('scanForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await startScan();
});

async function startScan() {
    const target = document.getElementById('target').value.trim();
    const portRange = document.getElementById('portRange').value;
    
    if (!target) {
        showAlert('Please enter a target IP', 'error');
        return;
    }
    
    // Map port range to scan type
    let scanType = 'basic';
    if (portRange === 'all') scanType = 'full';
    
    try {
        const response = await fetch(`${API_BASE}/api/scans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target, scan_type: scanType })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Scan failed');
        }
        
        currentScanId = data.scan_id;
        showAlert('✅ Scan started successfully!', 'success');
        
        // Show modal
        openScanModal(target);
        pollScanProgress();
        
    } catch (error) {
        showAlert(`❌ Error: ${error.message}`, 'error');
    }
}

// Scan Progress Modal
function openScanModal(target) {
    const modal = document.getElementById('scanModal');
    modal.classList.add('active');
    document.getElementById('modal-target').textContent = target;
    document.getElementById('modal-status').textContent = 'Initializing...';
    document.getElementById('modal-progress-fill').style.width = '0%';
    document.getElementById('modal-progress-text').textContent = '0%';
    
    // Add initial log
    const logs = document.getElementById('scan-logs');
    logs.innerHTML = '<div class="log-entry">🚀 Starting scan...</div>';
}

function closeModal() {
    document.getElementById('scanModal').classList.remove('active');
    if (pollInterval) {
        clearInterval(pollInterval);
    }
}

async function pollScanProgress() {
    let attempts = 0;
    const maxAttempts = 150;
    
    pollInterval = setInterval(async () => {
        attempts++;
        
        if (attempts > maxAttempts) {
            clearInterval(pollInterval);
            addLog('⏱️ Scan taking longer than expected', 'warning');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/api/scans/${currentScanId}/progress`);
            const data = await response.json();
            
            // Update progress
            document.getElementById('modal-status').textContent = data.status.toUpperCase();
            document.getElementById('modal-progress-fill').style.width = data.progress + '%';
            document.getElementById('modal-progress-text').textContent = Math.round(data.progress) + '%';
            
            // Add log entry
            if (data.progress === 10) addLog('🔍 Scanning ports...', 'info');
            if (data.progress === 50) addLog('📡 Detecting services...', 'info');
            if (data.progress === 90) addLog('📊 Analyzing results...', 'info');
            
            if (data.status === 'completed') {
                clearInterval(pollInterval);
                addLog('✅ Scan completed successfully!', 'success');
                setTimeout(() => {
                    closeModal();
                    showResults(currentScanId);
                }, 1000);
            } else if (data.status === 'failed') {
                clearInterval(pollInterval);
                addLog('❌ Scan failed: ' + (data.error_message || 'Unknown error'), 'error');
            }
        } catch (error) {
            console.error('Error polling:', error);
        }
    }, 2000);
}

function addLog(message, type = 'info') {
    const logs = document.getElementById('scan-logs');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logs.appendChild(entry);
    logs.scrollTop = logs.scrollHeight;
}

// Results Modal
async function showResults(scanId) {
    try {
        const response = await fetch(`${API_BASE}/api/scans/${scanId}`);
        const data = await response.json();
        
        const modal = document.getElementById('resultsModal');
        modal.classList.add('active');
        
        // Summary
        const duration = Math.round((new Date(data.completed_at) - new Date(data.started_at)) / 1000);
        const summaryHtml = `
            <div class="alert success">
                <h4>🎉 Scan Completed</h4>
                <div style="margin-top: 0.5rem;">
                    <div>Findings: <strong>${data.findings?.length || 0}</strong> open ports</div>
                    <div>Duration: <strong>${duration}s</strong></div>
                    <div>Started: ${new Date(data.started_at).toLocaleString()}</div>
                </div>
            </div>
        `;
        document.getElementById('results-summary').innerHTML = summaryHtml;
        
        // Findings table
        const findings = data.findings || [];
        const tableHtml = findings.length ? `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Port</th>
                        <th>Protocol</th>
                        <th>State</th>
                        <th>Service</th>
                        <th>Version</th>
                        <th>Severity</th>
                    </tr>
                </thead>
                <tbody>
                    ${findings.map(f => `
                        <tr>
                            <td><strong>${f.port}</strong></td>
                            <td>${f.protocol.toUpperCase()}</td>
                            <td><span class="badge success">${f.state}</span></td>
                            <td>${f.service || 'unknown'}</td>
                            <td>${f.version || '-'}</td>
                            <td><span class="badge info">${f.severity}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : '<div class="empty-state"><p>No open ports found</p></div>';
        
        document.getElementById('results-table').innerHTML = tableHtml;
        
        // Refresh dashboard
        loadDashboard();
        
    } catch (error) {
        console.error('Error loading results:', error);
    }
}

function closeResultsModal() {
    document.getElementById('resultsModal').classList.remove('active');
}

// Load Scans History
async function loadScans() {
    try {
        const response = await fetch(`${API_BASE}/api/scans`);
        const scans = await response.json();
        
        const tbody = document.getElementById('scans-table-body');
        
        if (scans.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><div class="empty-icon">🔍</div><p>No scans found</p></td></tr>';
            return;
        }
        
        tbody.innerHTML = scans.map(scan => {
            const duration = scan.completed_at ? 
                Math.round((new Date(scan.completed_at) - new Date(scan.started_at)) / 1000) + 's' : 
                '-';
            
            return `
                <tr>
                    <td><strong>#${scan.id}</strong></td>
                    <td>${scan.target_id || '-'}</td>
                    <td><span class="badge ${scan.status === 'completed' ? 'success' : scan.status === 'running' ? 'info' : 'danger'}">${scan.status}</span></td>
                    <td>${scan.findings?.length || 0}</td>
                    <td>${new Date(scan.started_at).toLocaleString()}</td>
                    <td>
                        <button class="link-btn" onclick="showResults(${scan.id})">View Results →</button>
                    </td>
                </tr>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading scans:', error);
    }
}

// Alerts
function showAlert(message, type) {
    const container = document.getElementById('alerts');
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    container.innerHTML = '';
    container.appendChild(alert);
    
    setTimeout(() => alert.remove(), 5000);
}

// Download Report
async function downloadReport() {
    if (!currentScanId) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/scans/${currentScanId}`);
        const data = await response.json();
        
        const report = JSON.stringify(data, null, 2);
        const blob = new Blob([report], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `scan-${currentScanId}-report.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading report:', error);
    }
}

// Initialize
window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_BASE}/health`);
        if (response.ok) {
            console.log('✅ Backend connected');
            loadDashboard();
        }
    } catch (error) {
        showAlert('❌ Cannot connect to backend', 'error');
    }
});
