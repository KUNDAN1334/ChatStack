import React from 'react';

export default function Message({ message, primaryColor = '#0066cc' }) {
  const isUser = message.role === 'user';
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '12px',
        animation: 'fadeIn 0.3s ease-in',
      }}
    >
      <div
        style={{
          maxWidth: '75%',
          backgroundColor: isUser ? primaryColor : 'white',
          color: isUser ? 'white' : '#1f2937',
          padding: '10px 14px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          wordWrap: 'break-word',
        }}
      >
        <p style={{ 
          margin: 0, 
          fontSize: '14px', 
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
        }}>
          {message.content}
        </p>
        
        <p style={{
          margin: '4px 0 0 0',
          fontSize: '10px',
          opacity: 0.7,
          textAlign: 'right',
        }}>
          {formatTime(message.timestamp)}
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
