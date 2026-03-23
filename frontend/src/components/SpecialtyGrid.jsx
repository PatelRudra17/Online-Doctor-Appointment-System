import React from 'react';
import { specialties } from '../data/mockData';

const SpecialtyGrid = () => {
    return (
        <section style={{ padding: '4rem 0', background: 'white' }}>
            <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>Browse by Specialties</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '1.5rem',
                    textAlign: 'center'
                }}>
                    {specialties.map(s => (
                        <div key={s.id} className="card" style={{
                            padding: '1.5rem 1rem',
                            cursor: 'pointer',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            border: '1px solid #f1f5f9'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                            <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{s.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SpecialtyGrid;
