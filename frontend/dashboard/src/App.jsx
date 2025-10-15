import { useState } from 'react';
import ClientManager from './components/ClientManager';
import Analytics from './components/Analytics';
import './App.css';
import logo from './assets/logo.png';

function App() {
  const [activeTab, setActiveTab] = useState('clients');
  const [selectedApiKey, setSelectedApiKey] = useState('');

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Prodesk Logo" className="logo" />
          <h2 className="logo-text">PRODESK</h2>
          <p className="logo-subtitle">IT & ENGINEERING SERVICES</p>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            Clients
          </button>
          <button
            className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <h1>Welcome to Prodesk Chatbot Platform</h1>
          <p>Empowering Innovation, Transforming Businesses</p>
        </header>

        <div className="content-box">
          {activeTab === 'clients' && <ClientManager />}
          {activeTab === 'analytics' && (
            <div>
              <div className="api-input-box">
                <label>Enter API Key to view analytics:</label>
                <input
                  type="text"
                  value={selectedApiKey}
                  onChange={(e) => setSelectedApiKey(e.target.value)}
                  placeholder="pk_..."
                />
              </div>
              {selectedApiKey && <Analytics apiKey={selectedApiKey} />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
