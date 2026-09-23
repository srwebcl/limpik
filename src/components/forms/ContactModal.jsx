import React, { useState, useEffect } from 'react';
import ContactForm from './ContactForm.jsx';

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [serviceContext, setServiceContext] = useState('');

  useEffect(() => {
    const handleOpen = (e) => {
      if (e.detail && e.detail.service) {
        setServiceContext(e.detail.service);
      }
      setIsOpen(true);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const handleClose = () => {
      setIsOpen(false);
      document.body.style.overflow = 'unset';
    };

    window.addEventListener('openContactModal', handleOpen);
    window.addEventListener('closeContactModal', handleClose);
    
    return () => {
      window.removeEventListener('openContactModal', handleOpen);
      window.removeEventListener('closeContactModal', handleClose);
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => window.dispatchEvent(new Event('closeContactModal'))}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => window.dispatchEvent(new Event('closeContactModal'))}>&times;</button>
        
        {/* We use the exact same ContactForm */}
        <ContactForm 
          serviceType={serviceContext} 
          title="Cotizar Servicio" 
          subtitle="Presupuesto a la medida en <strong style='color: #FF8000'>menos de 24 horas.</strong>"
        />
        
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 1rem;
          backdrop-filter: blur(4px);
          animation: fadeInOverlay 0.3s ease;
        }
        
        .modal-content {
          background: white;
          border-radius: 0.75rem;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: slideInModal 0.3s ease;
          /* Remove the form's default padding/shadow since modal wrapper handles it */
        }
        
        /* Override form styles slightly for modal context */
        .modal-content .contact-form {
          box-shadow: none;
          margin-bottom: 0;
        }

        .modal-close {
          position: absolute;
          top: 15px;
          right: 20px;
          background: transparent;
          border: none;
          font-size: 2rem;
          line-height: 1;
          font-weight: 300;
          cursor: pointer;
          color: #94a3b8;
          z-index: 10;
          padding: 0;
          transition: color 0.2s;
        }

        .modal-close:hover {
          color: #0f172a;
        }

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInModal {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
