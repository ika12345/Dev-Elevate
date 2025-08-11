import React from 'react';
import ReactDOM from 'react-dom/client';
import ATSScanner from './components/ResumeBuilder/ATSScannerNew';
import './index.css';
import { GlobalProvider } from './contexts/GlobalContext';

// Create a simple test page that only shows the ATS Scanner
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalProvider>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">ATS Scanner Test Page</h1>
        <ATSScanner />
      </div>
    </GlobalProvider>
  </React.StrictMode>,
);
