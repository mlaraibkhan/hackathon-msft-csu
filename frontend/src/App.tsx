import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🔒 Educational Vulnerability Scanner</h1>
        <p className="warning-banner">⚠️ For Educational Use Only</p>
      </header>
      
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
