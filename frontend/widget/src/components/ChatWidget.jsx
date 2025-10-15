import { useState, useEffect, useRef } from 'react';
import { sendMessage, captureLead } from '../services/api';

export default function ChatWidget({ apiKey, theme = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  const primaryColor = theme.primaryColor || '#667eea';
  const position = theme.position || 'bottom-right';
  const welcomeMessage = theme.welcomeMessage || "Hello! How can I help you today?";

  // Add welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show lead form after 3 user messages
  useEffect(() => {
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length >= 3 && !showLeadForm) {
      const hasLead = localStorage.getItem(`lead_${apiKey}`);
      if (!hasLead) {
        setTimeout(() => setShowLeadForm(true), 1000);
      }
    }
  }, [messages, apiKey]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(apiKey, input, sessionId);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend is running on http://localhost:8000',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSubmit = async (leadData) => {
    try {
      await captureLead(apiKey, sessionId, leadData);
      localStorage.setItem(`lead_${apiKey}`, 'true');
      setShowLeadForm(false);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Thank you! I\'ve saved your information. How else can I help you?',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Lead capture error:', error);
      alert('Failed to save your information. Please try again.');
    }
  };

  const positionClasses = {
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
  };

  return (
    <div 
      id="prodesk-chatbot-root"
      style={{
        position: 'fixed',
        ...positionClasses[position],
        zIndex: 999999,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => {
            console.log('🔵 Button clicked! Opening chat...');
            setIsOpen(true);
          }}
          style={{
            backgroundColor: primaryColor,
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
          aria-label="Open chat"
        >
          {/* Chat Icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          style={{
            width: '380px',
            height: '600px',
            maxHeight: '90vh',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 5px 40px rgba(0, 0, 0, 0.16)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
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
              onClick={() => {
                console.log('❌ Closing chat...');
                setIsOpen(false);
              }}
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
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: '#f8f9fa',
          }}>
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} primaryColor={primaryColor} />
            ))}

            {isLoading && <TypingIndicator />}
            {showLeadForm && <LeadForm onSubmit={handleLeadSubmit} onClose={() => setShowLeadForm(false)} />}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white',
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  outline: 'none',
                }}
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
                  opacity: isLoading || !input.trim() ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function MessageBubble({ message, primaryColor }) {
  const isUser = message.role === 'user';
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
    }}>
      <div style={{
        maxWidth: '75%',
        backgroundColor: isUser ? primaryColor : 'white',
        color: isUser ? 'white' : '#1f2937',
        padding: '10px 14px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      }}>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
          {message.content}
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: '10px', opacity: 0.7, textAlign: 'right' }}>
          {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '18px',
        padding: '12px 16px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#6b7280',
                animation: `typing 1.4s infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
          30% { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function LeadForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name required';
    if (!formData.email.trim()) newErrors.email = 'Email required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div style={{
      marginTop: '16px',
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '12px',
      padding: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1e40af' }}>
          📧 Let's stay in touch!
        </h4>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Your name *"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }}
          required
        />
        <input
          type="email"
          placeholder="Email *"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }}
          required
        />
        <input
          type="tel"
          placeholder="Phone (optional)"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

function adjustColor(color, amount) {
  const clamp = (num) => Math.min(Math.max(num, 0), 255);
  const num = parseInt(color.replace('#', ''), 16);
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0x00ff) + amount);
  const b = clamp((num & 0x0000ff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
