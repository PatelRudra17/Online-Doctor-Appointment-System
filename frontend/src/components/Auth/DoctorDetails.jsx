import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { specialties } from '../../data/mockData';

const DoctorDetails = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    specialty: ''
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
    if (!formData.fullName || !formData.specialty) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/create-account');
    }, 1000);
  };

  const isButtonDisabled = !formData.fullName || !formData.specialty || isLoading;

  return (
    <div className="auth-split-bg">
      {/* Background patterns */}
      <div className="auth-pattern-dots"></div>
      <div className="auth-pattern-lines"></div>

      {/* Main doctor details card */}
      <div className="auth-card">
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '0.5rem', 
          textAlign: 'center',
          color: '#1e293b'
        }}>
          Hello, Doctor!
        </h1>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#64748b', 
          marginBottom: '2rem', 
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          You're one step closer towards making your practice better.
        </p>

        <div className="input-with-icon" style={{ marginBottom: '1.5rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            👤
          </span>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your name"
            value={formData.fullName}
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
            🩺
          </span>
          <select
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              outline: 'none',
              background: 'white',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
              color: formData.specialty ? '#1e293b' : '#94a3b8'
            }}
            onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          >
            <option value="" disabled hidden>Your speciality</option>
            {specialties.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
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

export default DoctorDetails;
