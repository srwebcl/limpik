import React, { useState, useEffect } from 'react';
import './SmartWhatsApp.css';

// Agent Configuration - 2026 Strategy
const agentsConfig = {
    sales: {
        id: 'sales',
        phone: '56990728582',
        message: 'Hola, me interesa el *Plan Empresas* ⚡. Quiero un presupuesto.',
        tooltip: '⚡ Presupuesto en 15 min'
    },
    community: {
        id: 'community',
        phone: '56990728582',
        message: 'Hola, soy del comité/administración. Buscamos mejorar la limpieza del edificio.',
        tooltip: '⚡ Presupuesto en 15 min'
    },
    ethics: {
        id: 'ethics',
        phone: '56990728582',
        message: 'Hola, deseo realizar una denuncia al Canal Ético.',
        tooltip: 'Canal Ético'
    },
    support: {
        id: 'support',
        phone: '56990728582',
        message: 'Hola, soy cliente y necesito ayuda/soporte.',
        tooltip: 'Ayuda Clientes'
    },
    general: {
        id: 'general',
        phone: '56990728582',
        message: 'Hola, vi su web y quiero que me asesoren con una cotización.',
        tooltip: '🔥 Cotización Rápida'
    }
};

const SmartWhatsApp = () => {
    const [agent, setAgent] = useState(agentsConfig.general);
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Context Awareness Logic
    useEffect(() => {
        const path = window.location.pathname;
        let match = agentsConfig.general;

        if (path.includes('denuncias')) {
            match = agentsConfig.ethics;
        } else if (path.includes('limpieza-empresas')) {
            match = agentsConfig.sales;
        } else if (path.includes('limpieza-edificios')) {
            match = agentsConfig.community;
        } else if (path.includes('contacto') || path.includes('nosotros')) {
            match = agentsConfig.support;
            // No menu for support pages, direct link behavior might be desired, 
            // but we'll stick to menu for consistency unless it's ethics
        }

        setAgent(match);

        // Appear animation delay
        setTimeout(() => setIsVisible(true), 500);
    }, []);

    const toggleMenu = () => {
        if (agent.id === 'ethics') {
            // Ethics goes direct (privacy)
            window.open(`https://wa.me/${agent.phone}?text=${encodeURIComponent(agent.message)}`, '_blank');
        } else {
            setIsOpen(!isOpen);
        }
    };

    const handleOptionClick = (type) => {
        let finalMessage = agent.message;
        let finalPhone = agent.phone;

        if (type === 'support') {
            finalMessage = agentsConfig.support.message;
        }

        const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(finalMessage)}`;
        window.open(url, '_blank');
        setIsOpen(false);
    };

    return (
        <div className={`whatsapp-bubble-container ${isVisible ? 'visible' : ''}`}>
            {/* Pre-Chat Menu */}
            <div className={`whatsapp-menu ${isOpen ? 'open' : ''}`}>
                <button className="whatsapp-menu-item sales tracking-whatsapp" onClick={() => handleOptionClick('sales')}>
                    <span className="icon">💰</span>
                    <div className="text">
                        <span className="title">Cotizar (Ventas)</span>
                        <span className="desc">Respuesta inmediata</span>
                    </div>
                </button>
                <button className="whatsapp-menu-item support tracking-whatsapp" onClick={() => handleOptionClick('support')}>
                    <span className="icon">🆘</span>
                    <div className="text">
                        <span className="title">Ayuda / Cliente</span>
                        <span className="desc">Soporte y dudas</span>
                    </div>
                </button>
            </div>

            {/* Tooltip (Only show if menu closed) */}
            {!isOpen && (
                <div className="whatsapp-tooltip">
                    {agent.tooltip}
                    <span className="tooltip-arrow"></span>
                </div>
            )}

            <button
                className={`whatsapp-float-btn ${isOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label="Abrir opciones de contacto"
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="32" height="32" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.506-.669-.514-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.296-1.04 1.015-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default SmartWhatsApp;
