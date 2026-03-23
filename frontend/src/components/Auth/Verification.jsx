import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Verification = () => {
  const [contactNumber, setContactNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!contactNumber || contactNumber.length < 10) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/verify-code');
    }, 1500);
  };

  const isButtonDisabled = !contactNumber || contactNumber.length < 10 || isLoading;

  return (
    <div className="auth-split-bg">
      {/* Background patterns */}
      <div className="auth-pattern-dots"></div>
      <div className="auth-pattern-lines"></div>

      {/* Main verification card */}
      <div className="auth-card">
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '1rem', 
          textAlign: 'center',
          color: '#1e293b'
        }}>
          Verification
        </h1>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#64748b', 
          marginBottom: '2rem', 
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          We need your contact details to authenticate your login.
        </p>

        <div className="input-with-icon">
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            📱
          </span>
          <input
            type="tel"
            placeholder="Enter your Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ''))}
            maxLength={10}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <button
          onClick={handleSendCode}
          disabled={isButtonDisabled}
          style={{
            width: '100%',
            padding: '1rem',
            background: isButtonDisabled ? '#e2e8f0' : '#0ea5e9',
            color: isButtonDisabled ? '#94a3b8' : 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
            marginTop: '1rem'
          }}
        >
          {isLoading ? (
            <span>SENDING...</span>
          ) : (
            <>
              <span>SEND VERIFICATION CODE</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Verification;
