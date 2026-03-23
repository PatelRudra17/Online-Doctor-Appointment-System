import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="glass sticky-top" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>K</div>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>KIVI Health</span>
                </div>

                <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <a href="#" style={{ fontWeight: '500' }}>For Doctors</a>
                    <a href="#" style={{ fontWeight: '500' }}>For Patients</a>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                            style={{ background: 'transparent', color: 'var(--primary)', fontWeight: '600', padding: '0.5rem 1rem' }}
                            onClick={() => navigate('/auth/login')}
                        >
                            Login
                        </button>
                        <button 
                            className="btn-primary"
                            onClick={() => navigate('/auth/doctor-details')}
                        >
                            Sign Up
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
