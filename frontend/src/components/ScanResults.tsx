import React from 'react';
import FindingRow from './FindingRow';
import './ScanResults.css';

interface ScanResultsProps {
  results: any;
}

function ScanResults({ results }: ScanResultsProps) {
  const findings = results.findings || [];

  return (
    <div className="scan-results">
      <div className="results-summary">
        <h3>Summary</h3>
        <p>Total Findings: <strong>{findings.length}</strong></p>
        <p>Status: <strong>{results.status}</strong></p>
        <p>Started: {new Date(results.started_at).toLocaleString()}</p>
        {results.completed_at && (
          <p>Completed: {new Date(results.completed_at).toLocaleString()}</p>
        )}
      </div>

      {findings.length === 0 ? (
        <div className="no-findings">
          <p>No open ports found.</p>
        </div>
      ) : (
        <div className="findings-table">
          <table>
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
              {findings.map((finding: any) => (
                <FindingRow key={finding.id} finding={finding} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ScanResults;
