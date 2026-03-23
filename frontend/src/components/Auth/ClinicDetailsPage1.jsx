import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClinicDetailsPage1 = () => {
  const [formData, setFormData] = useState({
    clinicName: '',
    clinicNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = async () => {
    if (!formData.clinicName || !formData.clinicNumber) return;
    
    setIsLoading(true);
    // Save to localStorage for persistence across pages
    localStorage.setItem('clinicDetails', JSON.stringify(formData));
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/clinic-location-1');
    }, 1000);
  };

  const isButtonDisabled = !formData.clinicName || !formData.clinicNumber || isLoading;

  return (
    <div className="auth-split-bg">
      {/* Background patterns */}
      <div className="auth-pattern-dots"></div>
      <div className="auth-pattern-lines"></div>

      {/* Main clinic details card */}
      <div className="auth-card">
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '0.5rem', 
          textAlign: 'center',
          color: '#1e293b'
        }}>
          Clinic Details
        </h1>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#64748b', 
          marginBottom: '2rem', 
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          Please provide your clinic information
        </p>

        <div className="input-with-icon" style={{ marginBottom: '1.5rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            🏥
          </span>
          <input
            type="text"
            name="clinicName"
            placeholder="Clinic Name"
            value={formData.clinicName}
            onChange={handleChange}
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

        <div className="input-with-icon" style={{ marginBottom: '2rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            📞
          </span>
          <input
            type="tel"
            name="clinicNumber"
            placeholder="Clinic Number"
            value={formData.clinicNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 10) {
                handleChange({ target: { name: 'clinicNumber', value } });
              }
            }}
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
            <span>PROCESSING...</span>
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

export default ClinicDetailsPage1;
