import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleChange = (e) => {
    setError(''); // Clear error on input change
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear error on new submit
    setIsLoading(true);
    
    try {
      // Call AuthContext login with real API call
      await login(formData.email, formData.password);
      
      setIsLoading(false);
      
      // Navigate to intended route or fallback to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      setIsLoading(false);
      // Set error message from backend if available, otherwise use generic message
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  const isButtonDisabled = !formData.email || !formData.password || isLoading;

  return (
    <div className="auth-split-bg">
      {/* Background patterns */}
      <div className="auth-pattern-dots"></div>
      <div className="auth-pattern-lines"></div>

      {/* Main login card */}
      <div className="auth-card">
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '1rem', 
          textAlign: 'center',
          color: '#1e293b'
        }}>
          Welcome Back
        </h1>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#64748b', 
          marginBottom: '2rem', 
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          Sign in to access your KIVI Health account
        </p>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginBottom: '1.5rem',
            color: '#dc2626',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          <div className="input-with-icon" style={{ marginBottom: '1.5rem' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              🔒
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
              <input type="checkbox" style={{ width: '1rem', height: '1rem' }} />
              Remember me
            </label>
            <button 
              type="button"
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#0ea5e9', 
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem'
              }}
            >
              Forgot Password?
            </button>
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
              <span>SIGNING IN...</span>
            ) : (
              <>
                <span>SIGN IN</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Don't have an account? 
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
              Sign Up
            </button>
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>Or continue with</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              <span>🔵</span> Google
            </button>
            <button
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              <span>📘</span> Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
