import React, { useState } from 'react';
import ScanForm from '../components/ScanForm';
import ScanProgress from '../components/ScanProgress';
import ScanResults from '../components/ScanResults';
import './Dashboard.css';

interface ScanData {
  scan_id: number;
  status: string;
  target: any;
  warning?: string;
}

function Dashboard() {
  const [currentScan, setCurrentScan] = useState<ScanData | null>(null);
  const [scanResults, setScanResults] = useState<any>(null);

  const handleScanStarted = (scanData: ScanData) => {
    setCurrentScan(scanData);
    setScanResults(null);
  };

  const handleScanComplete = (results: any) => {
    setScanResults(results);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <section className="scan-section">
          <h2>Start New Scan</h2>
          <ScanForm onScanStarted={handleScanStarted} />
        </section>

        {currentScan && (
          <section className="progress-section">
            <h2>Scan Progress</h2>
            <ScanProgress 
              scanId={currentScan.scan_id} 
              onComplete={handleScanComplete}
            />
          </section>
        )}

        {scanResults && (
          <section className="results-section">
            <h2>Scan Results</h2>
            <ScanResults results={scanResults} />
          </section>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
