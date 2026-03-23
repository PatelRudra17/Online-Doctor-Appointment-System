import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/clinic-details-1');
    }, 1500);
  };

  const isButtonDisabled = !formData.firstName || !formData.lastName || !formData.email || 
                          !formData.password || formData.password.length < 8 || 
                          formData.password !== formData.confirmPassword || isLoading;

  return (
    <div className="auth-split-bg">
      {/* Background patterns */}
      <div className="auth-pattern-dots"></div>
      <div className="auth-pattern-lines"></div>

      {/* Main create account card */}
      <div className="auth-card">
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '1rem', 
          textAlign: 'center',
          color: '#1e293b'
        }}>
          Create Account
        </h1>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#64748b', 
          marginBottom: '2rem', 
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          Join KIVI Health to manage your healthcare journey
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              style={{
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              style={{
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div className="input-with-icon" style={{ marginBottom: '1rem' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              📧
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 3rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div className="input-with-icon" style={{ marginBottom: '1rem' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              🔒
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password (min 8 characters)"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 3rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div className="input-with-icon" style={{ marginBottom: '1.5rem' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              🔒
            </span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 3rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <button
            type="submit"
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
              <span>CREATING ACCOUNT...</span>
            ) : (
              <>
                <span>CREATE ACCOUNT</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Already have an account? 
            <button 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#0ea5e9', 
                cursor: 'pointer',
                fontWeight: '600',
                marginLeft: '0.5rem'
              }}
              onClick={() => navigate('/auth/login')}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
