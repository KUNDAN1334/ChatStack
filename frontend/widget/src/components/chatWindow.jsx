import React, { useRef, useEffect } from 'react';
import Message from './Message';
import LeadForm from './LeadForm';

export default function ChatWindow({
  messages,
  isLoading,
  showLeadForm,
  onSendMessage,
  onCloseLeadForm,
  onSubmitLead,
  onClose,
  primaryColor = '#0066cc',
  welcomeMessage = 'Hello! How can I help you today?',
}) {
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="chat-window"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '380px',
        height: '600px',
        maxHeight: '90vh',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 5px 40px rgba(0, 0, 0, 0.16)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, -20)} 100%)`,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '12px 12px 0 0',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            Prodesk Assistant
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
            Powered by AI • Online
          </p>
        </div>
        
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          aria-label="Close chat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          backgroundColor: '#f8f9fa',
        }}
      >
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            primaryColor={primaryColor}
          />
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '18px',
                padding: '12px 16px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                <div className="typing-dot" style={dotStyle}></div>
                <div className="typing-dot" style={{ ...dotStyle, animationDelay: '0.2s' }}></div>
                <div className="typing-dot" style={{ ...dotStyle, animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Lead Form */}
        {showLeadForm && (
          <LeadForm
            onSubmit={onSubmitLead}
            onClose={onCloseLeadForm}
            primaryColor={primaryColor}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: 'white',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            style={{
              flex: 1,
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              padding: '10px 16px',
              fontSize: '14px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              minHeight: '40px',
              maxHeight: '120px',
              transition: 'border-color 0.2s',
            }}
            rows={1}
            onFocus={(e) => e.currentTarget.style.borderColor = primaryColor}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
          />
          
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{
              backgroundColor: primaryColor,
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isLoading || !input.trim() ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        
        <p style={{
          margin: '8px 0 0 0',
          fontSize: '11px',
          color: '#9ca3af',
          textAlign: 'center',
        }}>
          Press Enter to send
        </p>
      </div>

      {/* CSS Animation for typing dots */}
      <style>{`
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
          30% { transform: translateY(-10px); opacity: 1; }
        }
        .typing-dot {
          animation: typing-dot 1.4s infinite;
        }
      `}</style>
    </div>
  );
}

// Helper function to darken/lighten color
function adjustColor(color, amount) {
  const clamp = (num) => Math.min(Math.max(num, 0), 255);
  const num = parseInt(color.replace('#', ''), 16);
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0x00ff) + amount);
  const b = clamp((num & 0x0000ff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const dotStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#6b7280',
};
