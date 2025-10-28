import React from 'react';
import './FindingRow.css';

interface FindingRowProps {
  finding: any;
}

function FindingRow({ finding }: FindingRowProps) {
  const getSeverityClass = (severity: string) => {
    return `severity-${severity}`;
  };

  return (
    <tr className="finding-row">
      <td>{finding.port}</td>
      <td>{finding.protocol}</td>
      <td>
        <span className={`state-badge state-${finding.state}`}>
          {finding.state}
        </span>
      </td>
      <td>{finding.service || 'unknown'}</td>
      <td>{finding.version || '-'}</td>
      <td>
        <span className={`severity-badge ${getSeverityClass(finding.severity)}`}>
          {finding.severity}
        </span>
      </td>
    </tr>
  );
}

export default FindingRow;
