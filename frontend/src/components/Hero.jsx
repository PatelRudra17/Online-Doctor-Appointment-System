import React, { useState } from 'react';
import { cities, specialties } from '../data/mockData';

const Hero = () => {
    const [city, setCity] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [name, setName] = useState('');

    return (
        <section style={{
            padding: '6rem 0',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative background elements */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', bottom: '-15%', left: '5%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>

            <div className="container animate-fade-in">
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'white' }}>Search Your Doctor here</h1>
                <p style={{ fontSize: '1.25rem', marginBottom: '3rem', opacity: 0.9 }}>Book appointments with the best doctors in your city</p>

                <div className="card" style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1.5fr auto',
                    gap: '1rem',
                    padding: '1.5rem',
                    alignItems: 'center',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                }}>
                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: 'white' }}
                    >
                        <option value="">Select City</option>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: 'white' }}
                    >
                        <option value="">Select Specialty</option>
                        {specialties.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>

                    <input
                        type="text"
                        placeholder="Search by Name/Hospital"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                    />

                    <button className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>🔍</span>
                    </button>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    {['Medical Videos', 'Conferences', 'Health Camps', 'Disease'].map(item => (
                        <div key={item} style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem 2rem', borderRadius: '2rem', backdropFilter: 'blur(4px)', cursor: 'pointer', transition: 'background 0.3s' }}>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
