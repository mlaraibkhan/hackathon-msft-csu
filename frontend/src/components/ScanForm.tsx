import React, { useState } from 'react';
import './ScanForm.css';

interface ScanFormProps {
  onScanStarted: (scanData: any) => void;
}

declare global {
  interface Window {
    api: any;
  }
}

function ScanForm({ onScanStarted }: ScanFormProps) {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setWarning('');
    setLoading(true);

    try {
      const result = await window.api.startScan(target, scanType);
      
      if (result.warning) {
        setWarning(result.warning);
      }
      
      onScanStarted(result);
    } catch (err: any) {
      setError(err.message || 'Failed to start scan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scan-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="target">Target IP or Hostname:</label>
          <input
            type="text"
            id="target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="e.g., 192.168.1.1 or localhost"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="scanType">Scan Type:</label>
          <select
            id="scanType"
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
            disabled={loading}
          >
            <option value="basic">Basic (Top 1000 ports)</option>
            <option value="full">Full (All ports)</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Starting...' : 'Start Scan'}
        </button>
      </form>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> <pre>{error}</pre>
        </div>
      )}

      {warning && (
        <div className="alert alert-warning">
          <strong>⚠️ Warning:</strong> {warning}
        </div>
      )}
    </div>
  );
}

export default ScanForm;
