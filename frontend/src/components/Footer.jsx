import React from 'react';
import { cities, specialties, healthProblems } from '../data/mockData';

const Footer = () => {
    return (
        <footer style={{ background: '#1e293b', color: 'white', padding: '5rem 0 2rem' }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '3rem',
                    marginBottom: '4rem'
                }}>
                    <div>
                        <h3 style={{ color: '#cbd5e1', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Cities</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                            {cities.slice(0, 10).map(c => (
                                <a key={c} href="#" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{c}</a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 style={{ color: '#cbd5e1', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Specialties</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {specialties.slice(0, 8).map(s => (
                                <li key={s.id} style={{ marginBottom: '0.5rem' }}>
                                    <a href="#" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{s.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 style={{ color: '#cbd5e1', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Health Problems</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {healthProblems.map(p => (
                                <li key={p} style={{ marginBottom: '0.5rem' }}>
                                    <a href="#" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{p}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 style={{ color: '#cbd5e1', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Contact Us</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>info@kivihealth.com</p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map(social => (
                                <div key={social} style={{ width: '32px', height: '32px', background: '#334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <span style={{ fontSize: '0.8rem' }}>{social[0]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <hr style={{ borderColor: '#334155', marginBottom: '2rem' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.8rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <p>© 2026 KIVI Health. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href="#">Terms & Conditions</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">About Us</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
