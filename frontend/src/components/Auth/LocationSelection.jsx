import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LocationSelection = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const locations = [
    "Dabholi",
    "Gotalawadi", 
    "Katargam GIDC",
    "Katargam",
    "Motived",
    "Singanpore",
    "Vasta Devdi Road",
    "singanpore"
  ];

  const handleNext = async () => {
    if (!selectedLocation) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/clinic-timings');
    }, 1000);
  };

  const isButtonDisabled = !selectedLocation || isLoading;

  return (
    <div className="auth-split-bg">
      {/* Background patterns */}
      <div className="auth-pattern-dots"></div>
      <div className="auth-pattern-lines"></div>

      {/* Main location selection card */}
      <div className="auth-card">
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '0.5rem', 
          textAlign: 'center',
          color: '#1e293b'
        }}>
          Select Your Location
        </h1>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#64748b', 
          marginBottom: '2rem', 
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          Choose your clinic location from the available areas
        </p>

        <div className="input-with-icon" style={{ marginBottom: '2rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            📍
          </span>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
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
              color: selectedLocation ? '#1e293b' : '#94a3b8'
            }}
            onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          >
            <option value="" disabled hidden>Select your location</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Alternative: Location grid view */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '0.75rem', 
          marginBottom: '2rem',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {locations.map((location, index) => (
            <div
              key={index}
              onClick={() => setSelectedLocation(location)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${selectedLocation === location ? '#0ea5e9' : '#e2e8f0'}`,
                borderRadius: '0.5rem',
                cursor: 'pointer',
                textAlign: 'center',
                background: selectedLocation === location ? '#f0f9ff' : 'white',
                color: selectedLocation === location ? '#0ea5e9' : '#1e293b',
                fontWeight: selectedLocation === location ? '600' : '500',
                transition: 'all 0.2s',
                fontSize: '0.9rem'
              }}
            >
              {location}
            </div>
          ))}
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

export default LocationSelection;
