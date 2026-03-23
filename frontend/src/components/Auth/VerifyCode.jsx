import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!code || code.length < 6) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // After successful verification, navigate to login
      // In real implementation, this would call a proper verification API
      console.log('Verification successful, redirecting to login');
      navigate('/auth/login');
    }, 1500);
  };

  const isButtonDisabled = !code || code.length < 6 || isLoading;

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
          Enter Verification Code
        </h1>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#64748b', 
          marginBottom: '2rem', 
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          We've sent a 6-digit verification code to your registered contact number.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={code[index] || ''}
              onChange={(e) => {
                const newCode = code.split('');
                newCode[index] = e.target.value;
                setCode(newCode.join(''));
                if (e.target.value && index < 5) {
                  const nextInput = e.target.parentElement.children[index + 1];
                  if (nextInput) nextInput.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !code[index] && index > 0) {
                  const prevInput = e.target.parentElement.children[index - 1];
                  if (prevInput) prevInput.focus();
                }
              }}
              style={{
                width: '3rem',
                height: '3rem',
                textAlign: 'center',
                fontSize: '1.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '0.5rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
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
              <span>VERIFY CODE</span>
              <span>→</span>
            </>
          )}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Didn't receive the code? 
            <button 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#0ea5e9', 
                cursor: 'pointer',
                fontWeight: '600',
                marginLeft: '0.5rem'
              }}
              onClick={() => navigate('/auth/verification')}
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
