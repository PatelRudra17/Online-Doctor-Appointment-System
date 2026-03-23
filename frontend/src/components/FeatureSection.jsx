import React from 'react';
import patientImg from '../assets/patient_care.png';
import botImg from '../assets/chatbot.png';
import growthImg from '../assets/growth_charts.png';

const FeatureBlock = ({ title, description, items, image, reverse }) => (
    <div style={{
        display: 'flex',
        flexDirection: reverse ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: '4rem',
        padding: '6rem 0',
        flexWrap: 'wrap'
    }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--foreground)' }}>{title}</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--muted)', marginBottom: '2rem' }}>{description}</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {items.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: '500' }}>
                        <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>✓</span> {item}
                    </li>
                ))}
            </ul>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Get Started</button>
        </div>
        <div style={{ flex: 1.2, minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
            <img src={image} alt={title} style={{ width: '100%', maxWidth: '600px', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }} />
        </div>
    </div>
);

const FeatureSection = () => {
    return (
        <section style={{ background: '#f8fafc' }}>
            <div className="container">
                <FeatureBlock
                    title="KIVIHEALTH FOR PATIENTS"
                    description="Manage your health with ease and find the best doctors around you."
                    items={["Find the best doctors around you", "Manage your medical records", "Book Appointment with doctors"]}
                    image={patientImg}
                />
                <FeatureBlock
                    title="KIVI BOT"
                    description="Your digital assistant for all your healthcare needs. Personalized health monitoring at your fingertips."
                    items={["Check your full medical history", "Book appointments in seconds", "Talk to him in your own language"]}
                    image={botImg}
                    reverse
                />
                <FeatureBlock
                    title="GROWTH CHARTS"
                    description="Keep track of your growth and health metrics over time with intuitive and professional visualizations."
                    items={["Track weight, height, and BMI", "Intuitive graphs and charts", "Share records with your doctor"]}
                    image={growthImg}
                />
            </div>
        </section>
    );
};

export default FeatureSection;
