import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PincodePage = () => {
  const [pincode, setPincode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = async () => {
    if (!pincode || pincode.length < 6) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/location-selection');
    }, 1000);
  };

  const isButtonDisabled = !pincode || pincode.length < 6 || isLoading;

  return (
    <div className="auth-split-bg">
      {/* Background patterns */}
      <div className="auth-pattern-dots"></div>
      <div className="auth-pattern-lines"></div>

      {/* Main pincode card */}
      <div className="auth-card">
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '0.5rem', 
          textAlign: 'center',
          color: '#1e293b'
        }}>
          Enter Pincode
        </h1>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#64748b', 
          marginBottom: '2rem', 
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          Please enter your clinic area pincode
        </p>

        <div className="input-with-icon" style={{ marginBottom: '2rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            📮
          </span>
          <input
            type="text"
            placeholder="Enter 6-digit pincode"
            value={pincode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 6) {
                setPincode(value);
              }
            }}
            maxLength={6}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
              letterSpacing: '0.1em'
            }}
            onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <div style={{ 
          background: '#f8fafc', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '2rem',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{ 
            fontSize: '0.85rem', 
            color: '#64748b', 
            margin: 0,
            textAlign: 'center'
          }}>
            💡 Enter the 6-digit pincode of your clinic location to help us find nearby services
          </p>
        </div>

        <button
          onClick={handleNext}
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
            transition: 'all 0.2s'
          }}
        >
          {isLoading ? (
            <span>VERIFYING...</span>
          ) : (
            <>
              <span>NEXT</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PincodePage;
