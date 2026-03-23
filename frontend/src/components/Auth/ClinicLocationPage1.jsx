import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCityFromPincode } from '../../data/locationData';

const ClinicLocationPage1 = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('clinicDetails');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return {
          pincode: parsed.pincode || '',
          clinicCity: parsed.clinicCity || ''
        };
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
    return {
      pincode: '',
      clinicCity: ''
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'pincode') {
      // Auto-detect city when pincode is entered
      const city = getCityFromPincode(value);
      setFormData({
        pincode: value,
        clinicCity: city || ''
      });
      
      // If city is found and pincode is complete (6 digits), navigate to next page
      if (value.length === 6 && city) {
        setIsLoading(true);
        setTimeout(() => {
          localStorage.setItem('clinicDetails', JSON.stringify({
            ...formData,
            pincode: value,
            clinicCity: city
          }));
          setIsLoading(false);
          navigate('/auth/clinic-location-2');
        }, 1000);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleNext = async () => {
    if (!formData.pincode || !formData.clinicCity) return;
    
    setIsLoading(true);
    // Save to localStorage
    localStorage.setItem('clinicDetails', JSON.stringify(formData));
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/clinic-location-2');
    }, 1000);
  };

  const handleBack = () => {
    // Save current data before going back
    localStorage.setItem('clinicDetails', JSON.stringify(formData));
    navigate('/auth/clinic-details-1');
  };

  const isButtonDisabled = !formData.pincode || !formData.clinicCity || isLoading;

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
          Enter your clinic pincode to auto-detect city
        </p>

        <div className="input-with-icon" style={{ marginBottom: '1.5rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            📮
          </span>
          <input
            type="text"
            name="pincode"
            placeholder="Enter 6-digit pincode"
            value={formData.pincode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 6) {
                handleChange({ target: { name: 'pincode', value } });
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

        {formData.clinicCity && (
          <div style={{ 
            background: '#f0f9ff', 
            padding: '1rem', 
            borderRadius: '0.75rem', 
            marginBottom: '2rem',
            border: '1px solid #0ea5e9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🏙️</span>
              <div>
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: '#0284c7', 
                  margin: '0 0 0.25rem 0',
                  fontWeight: '600'
                }}>
                  City Detected
                </p>
                <p style={{ 
                  fontSize: '1.1rem', 
                  color: '#1e293b', 
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {formData.clinicCity}
                </p>
              </div>
            </div>
          </div>
        )}

        {formData.pincode.length === 6 && !formData.clinicCity && (
          <div style={{ 
            background: '#fef2f2', 
            padding: '1rem', 
            borderRadius: '0.75rem', 
            marginBottom: '2rem',
            border: '1px solid #f87171'
          }}>
            <p style={{ 
              fontSize: '0.85rem', 
              color: '#dc2626', 
              margin: 0,
              textAlign: 'center'
            }}>
              ⚠️ City not found for this pincode. Please check and try again.
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
              <span>DETECTING...</span>
            ) : (
              <>
                <span>NEXT</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicLocationPage1;
