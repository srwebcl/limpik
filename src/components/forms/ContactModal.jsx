import React, { useState, useEffect, useRef, useCallback } from 'react';
import ContactForm from './ContactForm.jsx';

// Bloqueo de scroll compatible con iOS Safari (overflow: hidden no basta ahí)
function lockScroll() {
  const y = window.scrollY;
  const body = document.body;
  body.dataset.scrollY = String(y);
  body.style.position = 'fixed';
  body.style.top = `-${y}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
  document.documentElement.style.overflow = 'hidden';
}

function unlockScroll() {
  const body = document.body;
  if (body.style.position !== 'fixed') return;
  const y = Number(body.dataset.scrollY || 0);
  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';
  body.style.width = '';
  body.style.overflow = '';
  document.documentElement.style.overflow = '';
  delete body.dataset.scrollY;
  window.scrollTo(0, y);
}

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [serviceContext, setServiceContext] = useState('');
  const [formKey, setFormKey] = useState(0);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);

  const close = useCallback(() => {
    setIsOpen(false);
    unlockScroll();
    const trigger = triggerRef.current;
    triggerRef.current = null;
    if (trigger && document.contains(trigger)) trigger.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const handleOpen = (e) => {
      setServiceContext(e.detail?.service || '');
      triggerRef.current = e.detail?.trigger || document.activeElement;
      setFormKey((k) => k + 1); // formulario limpio en cada apertura
      setIsOpen(true);
      lockScroll();
    };
    const handleClose = () => close();

    window.addEventListener('openContactModal', handleOpen);
    window.addEventListener('closeContactModal', handleClose);
    // Al navegar con View Transitions el pop-up no debe quedar abierto ni el scroll bloqueado
    document.addEventListener('astro:before-swap', handleClose);

    return () => {
      window.removeEventListener('openContactModal', handleOpen);
      window.removeEventListener('closeContactModal', handleClose);
      document.removeEventListener('astro:before-swap', handleClose);
      unlockScroll();
    };
  }, [close]);

  // Foco inicial, Esc para cerrar y foco atrapado dentro del diálogo
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]):not([tabindex="-1"]), select, textarea'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={close}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label="Cotizar servicio"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-bar">
          <button ref={closeRef} type="button" className="modal-close" onClick={close} aria-label="Cerrar">
            &times;
          </button>
        </div>

        <ContactForm
          key={formKey}
          serviceType={serviceContext}
          title="Cotizar Servicio"
          subtitle="Presupuesto a la medida en <strong style='color: #FF8000'>menos de 24 horas.</strong>"
        />
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100001; /* sobre el header y el banner de cookies */
          padding: 1rem;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: fadeInOverlay 0.25s ease;
        }

        .modal-content {
          background: white;
          border-radius: 0.75rem;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          max-height: 90dvh;
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          position: relative;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: slideInModal 0.3s ease;
        }

        /* Barra con el botón cerrar: queda fija arriba al hacer scroll dentro del pop-up */
        .modal-bar {
          position: sticky;
          top: 0;
          z-index: 2;
          height: 0;
          display: flex;
          justify-content: flex-end;
        }

        .modal-close {
          margin: 0.6rem 0.6rem 0 0;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          font-size: 1.75rem;
          line-height: 1;
          font-weight: 300;
          cursor: pointer;
          color: #475569;
          padding: 0;
          transition: color 0.2s, background 0.2s;
        }

        .modal-close:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .modal-close:focus-visible {
          outline: 3px solid #FF8000;
          outline-offset: 2px;
        }

        .modal-content .contact-form {
          box-shadow: none;
          margin-bottom: 0;
        }

        /* El título no debe quedar bajo el botón cerrar */
        .modal-content .form-title {
          padding-right: 3.25rem;
        }

        @media (max-width: 600px) {
          .modal-overlay {
            padding: 0;
            align-items: stretch;
          }

          /* En móvil el pop-up ocupa toda la pantalla (100dvh respeta la barra del navegador) */
          .modal-content {
            max-width: none;
            height: 100vh;
            height: 100dvh;
            max-height: none;
            border-radius: 0;
            padding-bottom: env(safe-area-inset-bottom);
            animation: slideUpModal 0.3s ease;
          }

          /* Barra superior propia: el botón cerrar nunca tapa los campos */
          .modal-bar {
            height: 56px;
            align-items: center;
            background: rgba(255, 255, 255, 0.97);
            border-bottom: 1px solid #f1f5f9;
          }

          .modal-close {
            margin: 0 0.5rem 0 0;
          }

          .modal-content .contact-form {
            border-radius: 0;
            padding: 0.5rem 1.25rem 2rem;
          }

          .modal-content .form-title {
            padding-right: 0;
          }
        }

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInModal {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes slideUpModal {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .modal-overlay, .modal-content { animation: none; }
        }
      `}</style>
    </div>
  );
}
