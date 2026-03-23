import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClinicTimings = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [sessionTimes, setSessionTimes] = useState([
    { start: '09:00', end: '10:00' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const toggleDay = (index) => {
    const newSelectedDays = [...selectedDays];
    if (newSelectedDays.includes(index)) {
      const idx = newSelectedDays.indexOf(index);
      newSelectedDays.splice(idx, 1);
    } else {
      newSelectedDays.push(index);
    }
    newSelectedDays.sort();
    setSelectedDays(newSelectedDays);
  };

  const addSession = () => {
    setSessionTimes([...sessionTimes, { start: '', end: '' }]);
  };

  const updateSession = (index, field, value) => {
    const newSessions = [...sessionTimes];
    newSessions[index][field] = value;
    setSessionTimes(newSessions);
  };

  const removeSession = (index) => {
    if (sessionTimes.length > 1) {
      const newSessions = sessionTimes.filter((_, i) => i !== index);
      setSessionTimes(newSessions);
    }
  };

  const handleNext = async () => {
    if (selectedDays.length === 0) {
      alert('Please select at least one working day');
      return;
    }
    
    const validSessions = sessionTimes.filter(session => session.start && session.end);
    if (validSessions.length === 0) {
      alert('Please add at least one session time');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/consultation-fees');
    }, 1000);
  };

  const isButtonDisabled = selectedDays.length === 0 || isLoading;

  return (
    <div className="auth-split-bg">
      {/* Background patterns */}
      <div className="auth-pattern-dots"></div>
      <div className="auth-pattern-lines"></div>

      {/* Main clinic timings card */}
      <div className="auth-card">
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '0.5rem', 
          textAlign: 'center',
          color: '#1e293b'
        }}>
          Clinic Timings
        </h1>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#64748b', 
          marginBottom: '2rem', 
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          Enter your clinic timings which will be used for appointments.
        </p>

        {/* Choose Days Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: '600', 
            marginBottom: '1rem', 
            color: '#1e293b' 
          }}>
            Choose Days
          </h3>
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => toggleDay(index)}
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  border: `2px solid ${selectedDays.includes(index) ? '#0ea5e9' : '#e2e8f0'}`,
                  background: selectedDays.includes(index) ? '#0ea5e9' : 'white',
                  color: selectedDays.includes(index) ? 'white' : '#64748b',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={dayNames[index]}
              >
                {day}
              </button>
            ))}
          </div>
          {selectedDays.length > 0 && (
            <p style={{ 
              fontSize: '0.85rem', 
              color: '#64748b', 
              marginTop: '0.5rem', 
              textAlign: 'center' 
            }}>
              Selected: {selectedDays.map(i => dayNames[i]).join(', ')}
            </p>
          )}
        </div>

        {/* Session Time Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: '600', 
            marginBottom: '1rem', 
            color: '#1e293b' 
          }}>
            Session Time
          </h3>
          
          {sessionTimes.map((session, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              marginBottom: '1rem',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0'
            }}>
              <div className="input-with-icon" style={{ flex: 1, margin: 0 }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  🕐
                </span>
                <input
                  type="time"
                  value={session.start}
                  onChange={(e) => updateSession(index, 'start', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 3rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    background: 'white'
                  }}
                />
              </div>
              
              <span style={{ color: '#64748b', fontWeight: '500' }}>to</span>
              
              <div className="input-with-icon" style={{ flex: 1, margin: 0 }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  🕐
                </span>
                <input
                  type="time"
                  value={session.end}
                  onChange={(e) => updateSession(index, 'end', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 3rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    background: 'white'
                  }}
                />
              </div>
              
              {sessionTimes.length > 1 && (
                <button
                  onClick={() => removeSession(index)}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#f43f5e',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          <button
            onClick={addSession}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              background: 'white',
              color: '#0ea5e9',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '1.2rem', color: '#f43f5e' }}>+</span> Add Session
          </button>
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

export default ClinicTimings;
