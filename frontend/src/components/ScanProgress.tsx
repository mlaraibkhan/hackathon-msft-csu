import React, { useEffect, useState } from 'react';
import './ScanProgress.css';

interface ScanProgressProps {
  scanId: number;
  onComplete: (results: any) => void;
}

function ScanProgress({ scanId, onComplete }: ScanProgressProps) {
  const [status, setStatus] = useState('pending');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const result = await window.api.getScanProgress(scanId);
        
        setStatus(result.status);
        setProgress(result.progress || 0);

        if (result.status === 'completed') {
          clearInterval(pollInterval);
          // Fetch full results
          const fullResults = await window.api.getScan(scanId);
          onComplete(fullResults);
        } else if (result.status === 'failed') {
          clearInterval(pollInterval);
          setError(result.error_message || 'Scan failed');
        }
      } catch (err: any) {
        console.error('Failed to poll scan progress:', err);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [scanId, onComplete]);

  return (
    <div className="scan-progress">
      <div className="progress-info">
        <span className="status">Status: <strong>{status}</strong></span>
        <span className="percentage">{Math.round(progress)}%</span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>Scan Failed:</strong>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
}

export default ScanProgress;
