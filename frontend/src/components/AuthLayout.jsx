import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div className="auth-split-bg">
            <div className="auth-pattern-dots"></div>
            <div className="auth-pattern-lines"></div>
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                <div className="auth-card animate-fade-in">
                    {children}
                </div>
            </div>
            <div style={{ flex: 1 }}></div> {/* The blue half */}
        </div>
    );
};

export default AuthLayout;
