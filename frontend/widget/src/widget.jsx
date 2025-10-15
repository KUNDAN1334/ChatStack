import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatWidget from './components/ChatWidget';
import './styles.css';

class ProdeskChatbotWidget {
  constructor() {
    this.root = null;
    this.container = null;
    this.config = null;
  }

  init(config) {
    // Validate config
    if (!config || !config.apiKey) {
      console.error('❌ Prodesk Chatbot: API key is required');
      console.log('Usage: ProdeskChatbot.init({ apiKey: "your-key" })');
      return;
    }

    // Save config
    this.config = config;

    // Check if already initialized
    if (this.container) {
      console.warn('⚠️ Prodesk Chatbot: Already initialized');
      return;
    }

    // Create container
    this.container = document.createElement('div');
    this.container.id = 'prodesk-chatbot-container';
    document.body.appendChild(this.container);

    // Set API URL from window or default
    window.PRODESK_API_URL = window.PRODESK_API_URL || 'http://localhost:8000';

    // Render widget
    this.root = ReactDOM.createRoot(this.container);
    this.root.render(
      <React.StrictMode>
        <ChatWidget
          apiKey={config.apiKey}
          theme={config.theme || {}}
        />
      </React.StrictMode>
    );

    console.log('✅ Prodesk Chatbot initialized successfully');
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
    console.log('🗑️ Prodesk Chatbot destroyed');
  }

  updateConfig(newConfig) {
    if (!this.root) {
      console.error('❌ Prodesk Chatbot: Not initialized yet');
      return;
    }
    
    this.config = { ...this.config, ...newConfig };
    
    // Re-render with new config
    this.root.render(
      <React.StrictMode>
        <ChatWidget
          apiKey={this.config.apiKey}
          theme={this.config.theme || {}}
        />
      </React.StrictMode>
    );
    
    console.log('✅ Prodesk Chatbot config updated');
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  window.ProdeskChatbot = new ProdeskChatbotWidget();
  
  // Auto-init if config is already provided
  if (window.PRODESK_CHATBOT_CONFIG) {
    window.ProdeskChatbot.init(window.PRODESK_CHATBOT_CONFIG);
  }
}

export default window.ProdeskChatbot;
