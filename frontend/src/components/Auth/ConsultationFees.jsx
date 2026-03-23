import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConsultationFees = () => {
  const [formData, setFormData] = useState({
    consultationCharges: '',
    followUpCharges: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async () => {
    if (!formData.consultationCharges || !formData.followUpCharges) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Store user data in localStorage for dashboard to use
      const userData = {
        name: 'Dr. John Smith',
        specialty: 'Cardiologist',
        email: 'dr.johnsmith@kivihealth.com',
        clinicName: 'Heart Care Clinic',
        clinicCity: 'Mumbai',
        consultationCharges: `₹${formData.consultationCharges}`,
        followUpCharges: `₹${formData.followUpCharges}`,
        registrationComplete: true
      };
      
      localStorage.setItem('kiviUser', JSON.stringify(userData));
      navigate('/dashboard');
    }, 1500);
  };

  const isButtonDisabled = !formData.consultationCharges || !formData.followUpCharges || isLoading;

  return (
    <div className="auth-split-bg">
      {/* Background patterns */}
      <div className="auth-pattern-dots"></div>
      <div className="auth-pattern-lines"></div>

      {/* Main consultation fees card */}
      <div className="auth-card">
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '0.5rem', 
          textAlign: 'center',
          color: '#1e293b'
        }}>
          Consultation Fees
        </h1>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#64748b', 
          marginBottom: '2rem', 
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          Set your consultation charges for patients
        </p>

        <div className="input-with-icon" style={{ marginBottom: '1.5rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            💰
          </span>
          <input
            type="text"
            name="consultationCharges"
            placeholder="Consultation Charges"
            value={formData.consultationCharges}
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
            🔄
          </span>
          <input
            type="text"
            name="followUpCharges"
            placeholder="Follow-Up Charges"
            value={formData.followUpCharges}
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

        <div style={{ 
          background: '#f0f9ff', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '2rem',
          border: '1px solid #0ea5e9'
        }}>
          <p style={{ 
            fontSize: '0.85rem', 
            color: '#0ea5e9', 
            margin: 0,
            textAlign: 'center',
            fontWeight: '500'
          }}>
            💡 Tip: Set competitive prices to attract more patients
          </p>
        </div>

        <button
          onClick={handleSubmit}
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
            <span>SETTING UP...</span>
          ) : (
            <>
              <span>TAKE ME TO PRACTICE</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConsultationFees;
