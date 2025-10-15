import React, { useState } from 'react';

export default function LeadForm({ onSubmit, onClose, primaryColor = '#0066cc' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div
      style={{
        marginTop: '16px',
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        padding: '16px',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1e40af' }}>
          📧 Let's stay in touch!
        </h4>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            fontSize: '18px',
            lineHeight: 1,
          }}
          aria-label="Close lead form"
        >
          ✕
        </button>
      </div>

      <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#4b5563' }}>
        Share your details and we'll get back to you shortly.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name *"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: errors.name ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => !errors.name && (e.currentTarget.style.borderColor = primaryColor)}
            onBlur={(e) => !errors.name && (e.currentTarget.style.borderColor = '#d1d5db')}
          />
          {errors.name && (
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#ef4444' }}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address *"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => !errors.email && (e.currentTarget.style.borderColor = primaryColor)}
            onBlur={(e) => !errors.email && (e.currentTarget.style.borderColor = '#d1d5db')}
          />
          {errors.email && (
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#ef4444' }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div style={{ marginBottom: '10px' }}>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number (optional)"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = primaryColor}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Message Field */}
        <div style={{ marginBottom: '12px' }}>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Any specific requirements? (optional)"
            rows={2}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = primaryColor}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: primaryColor,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Submit
        </button>
      </form>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
