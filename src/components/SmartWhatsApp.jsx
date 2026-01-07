import React, { useState, useEffect, useRef } from 'react';
import './SmartWhatsApp.css';

// Agent Configuration
const agentsConfig = {
    sales: {
        id: 'sales',
        name: 'Ventas Corporativas',
        role: 'Ejecutivo Comercial',
        avatar: '👨‍💼',
        phone: '56990728582',
        message: 'Hola, estoy interesado en cotizar un servicio de limpieza para mi empresa.',
        paths: ['/servicios', '/servicios/limpieza-empresas', '/servicios/limpieza-edificios']
    },
    ethics: {
        id: 'ethics',
        name: 'Canal Ético',
        role: 'Denuncias Confidenciales',
        avatar: '⚖️',
        phone: '56990728582', // Update if there is a specific number for ethics
        message: 'Hola, deseo realizar una consulta o denuncia confidencial a través del Canal Ético.',
        paths: ['/denuncias']
    },
    support: {
        id: 'support',
        name: 'Atención al Cliente',
        role: 'Soporte General',
        avatar: '🎧',
        phone: '56990728582',
        message: 'Hola, tengo una consulta general sobre Limpik.',
        paths: ['/contacto', '/nosotros']
    },
    general: {
        id: 'general',
        name: 'Equipo Limpik',
        role: 'Asesor en Línea',
        avatar: '👋',
        phone: '56990728582',
        message: 'Hola, bienvenidos a Limpik. ¿En qué podemos ayudarle?',
        paths: ['/']
    }
};

const SmartWhatsApp = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [primaryAgent, setPrimaryAgent] = useState(agentsConfig.general);
    const [hasUnread, setHasUnread] = useState(true);
    const [userMessage, setUserMessage] = useState('');
    const textareaRef = useRef(null);

    // Context Awareness Logic
    useEffect(() => {
        const path = window.location.pathname;

        let match = agentsConfig.general;
        if (path.includes('denuncias')) {
            match = agentsConfig.ethics;
        } else if (path.includes('servicios')) {
            match = agentsConfig.sales;
        } else if (path.includes('contacto') || path.includes('nosotros')) {
            match = agentsConfig.support;
        }

        setPrimaryAgent(match);
    }, []);

    const toggleWidget = () => {
        setIsOpen(!isOpen);
        if (hasUnread) setHasUnread(false);
        // Focus textarea on open
        if (!isOpen) {
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    };

    const handleSend = () => {
        const messageToSend = userMessage.trim() || primaryAgent.message;
        const url = `https://wa.me/${primaryAgent.phone}?text=${encodeURIComponent(messageToSend)}`;
        window.open(url, '_blank');
        // Optional: Close on send or keep open
        // setIsOpen(false); 
        setUserMessage('');
    };

    return (
        <div className="smart-whatsapp-container">
            {/* Widget Card */}
            {isOpen && (
                <div className="whatsapp-widget-card">
                    {/* Header */}
                    <div className="widget-header">
                        <div className="header-agent-info">
                            <div className="header-avatar">{primaryAgent.avatar}</div>
                            <div className="header-text">
                                <h3 className="widget-title">{primaryAgent.name}</h3>
                                <p className="widget-subtitle">{primaryAgent.role}</p>
                            </div>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
                    </div>

                    {/* Chat Body */}
                    <div className="widget-body chat-mode">
                        <div className="chat-bubble agent">
                            {primaryAgent.message}
                            <span className="chat-time">Justo ahora</span>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="widget-footer">
                        <textarea
                            ref={textareaRef}
                            placeholder="Escribe tu consulta aquí..."
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        ></textarea>
                        <button className="send-btn" onClick={handleSend} aria-label="Enviar mensaje">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                className="whatsapp-toggle-btn"
                onClick={toggleWidget}
                aria-label="Abrir chat de WhatsApp"
            >
                <svg className="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.506-.669-.514-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.296-1.04 1.015-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                {hasUnread && <span className="notification-badge">1</span>}
            </button>
        </div>
    );
};

export default SmartWhatsApp;
