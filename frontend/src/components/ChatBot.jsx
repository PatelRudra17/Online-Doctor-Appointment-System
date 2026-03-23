import React, { useState } from 'react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm KIVI Bot. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { text: input, isBot: false }]);
        setInput('');

        // Mock bot response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                text: "I can help you book appointments or find doctors. Would you like to see available slots?",
                isBot: true
            }]);
        }, 1000);
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
            {isOpen ? (
                <div className="card" style={{ width: '350px', height: '450px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600' }}>KIVI Bot</span>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', color: 'white', fontSize: '1.2rem' }}>×</button>
                    </div>
                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.isBot ? 'flex-start' : 'flex-end',
                                background: m.isBot ? '#f1f5f9' : 'var(--primary)',
                                color: m.isBot ? 'var(--foreground)' : 'white',
                                padding: '0.75rem',
                                borderRadius: '1rem',
                                maxWidth: '80%',
                                fontSize: '0.9rem'
                            }}>
                                {m.text}
                            </div>
                        ))}
                    </div>
                    <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                        />
                        <button onClick={handleSend} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Send</button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        color: 'white',
                        fontSize: '1.5rem',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    💬
                </button>
            )}
        </div>
    );
};

export default ChatBot;
