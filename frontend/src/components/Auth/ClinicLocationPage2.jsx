import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAddressesByCityAndPincode } from '../../data/locationData';

const ClinicLocationPage2 = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('clinicDetails');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return {
          clinicArea: parsed.clinicArea || '',
          fullAddress: parsed.fullAddress || '',
          pincode: parsed.pincode || '',
          clinicCity: parsed.clinicCity || ''
        };
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
    return {
      clinicArea: '',
      fullAddress: '',
      pincode: '',
      clinicCity: ''
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Get dynamic locations based on city and pincode
  const locations = getAddressesByCityAndPincode(formData.clinicCity, formData.pincode);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = async () => {
    if (!formData.clinicArea || !formData.fullAddress) return;
    
    setIsLoading(true);
    // Save all clinic data to localStorage
    localStorage.setItem('clinicDetails', JSON.stringify(formData));
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/clinic-timings');
    }, 1000);
  };

  const handleBack = () => {
    // Save current data before going back
    localStorage.setItem('clinicDetails', JSON.stringify(formData));
    navigate('/auth/clinic-location-1');
  };

  const isButtonDisabled = !formData.clinicArea || !formData.fullAddress || isLoading;

  return (
    <div className="auth-split-bg">
      {/* Background patterns */}
      <div className="auth-pattern-dots"></div>
      <div className="auth-pattern-lines"></div>

      {/* Main clinic location card */}
      <div className="auth-card">
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '0.5rem', 
          textAlign: 'center',
          color: '#1e293b'
        }}>
          Clinic Location
        </h1>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#64748b', 
          marginBottom: '2rem', 
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          Enter your clinic location which will be used for patients.
        </p>

        {/* Show city and pincode info */}
        {(formData.clinicCity || formData.pincode) && (
          <div style={{ 
            background: '#f8fafc', 
            padding: '1rem', 
            borderRadius: '0.75rem', 
            marginBottom: '2rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📍</span>
                <div>
                  <p style={{ 
                    fontSize: '0.85rem', 
                    color: '#64748b', 
                    margin: '0 0 0.25rem 0'
                  }}>
                    Selected Location
                  </p>
                  <p style={{ 
                    fontSize: '1rem', 
                    color: '#1e293b', 
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {formData.clinicCity} - {formData.pincode}
                  </p>
                </div>
              </div>
              <button
                onClick={handleBack}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#e2e8f0';
                  e.target.style.color = '#475569';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#f1f5f9';
                  e.target.style.color = '#64748b';
                }}
              >
                Change
              </button>
            </div>
          </div>
        )}

        {locations.length > 0 ? (
          <>
            <div className="input-with-icon" style={{ marginBottom: '1.5rem' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                📍
              </span>
              <select
                name="clinicArea"
                value={formData.clinicArea}
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
                  color: formData.clinicArea ? '#1e293b' : '#94a3b8'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              >
                <option value="" disabled hidden>Select Area</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className="input-with-icon" style={{ marginBottom: '2rem' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                📝
              </span>
              <textarea
                name="fullAddress"
                placeholder="Full address"
                value={formData.fullAddress}
                onChange={handleChange}
                rows={3}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </>
        ) : (
          <div style={{ 
            background: '#fef2f2', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            marginBottom: '2rem',
            border: '1px solid #f87171',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🏢</span>
            <p style={{ 
              fontSize: '1rem', 
              color: '#dc2626', 
              margin: '0 0 0.5rem 0',
              fontWeight: '600'
            }}>
              No Areas Found
            </p>
            <p style={{ 
              fontSize: '0.85rem', 
              color: '#7f1d1d', 
              margin: 0
            }}>
              No clinic areas available for {formData.clinicCity} - {formData.pincode}. 
              Please go back and select a different pincode.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleBack}
            style={{
              flex: 1,
              padding: '1rem',
              background: '#f8fafc',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <span>←</span>
            <span>BACK</span>
          </button>

          {locations.length > 0 && (
            <button
              onClick={handleNext}
              disabled={isButtonDisabled}
              style={{
                flex: 2,
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicLocationPage2;
