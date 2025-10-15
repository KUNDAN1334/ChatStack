import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

// This is just for dev mode preview
// The actual widget is loaded via widget.jsx

const DevModeMessage = () => (
  <div style={{
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'white',
    padding: '15px 30px',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    zIndex: 999998,
    fontFamily: 'Arial, sans-serif'
  }}>
    <strong>🔧 Dev Mode:</strong> Widget should appear in bottom-right corner
  </div>
);

// Only render in dev mode if widget didn't load
if (import.meta.env.DEV && !window.ProdeskChatbot) {
  const devRoot = document.createElement('div');
  document.body.appendChild(devRoot);
  ReactDOM.createRoot(devRoot).render(<DevModeMessage />);
}
