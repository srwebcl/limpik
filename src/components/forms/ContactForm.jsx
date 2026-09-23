import React, { useId, useState } from 'react';
import PrivacyConsent, { Honeypot, PRIVACY_POLICY_VERSION } from './PrivacyConsent.jsx';

export default function ContactForm({ serviceType = '', title = '', subtitle = '' }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    service: serviceType,
    staff: '',
    schedule: '',
    frequency: '',
    area: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [website, setWebsite] = useState('');
  const consentId = `privacy-${useId().replace(/:/g, '')}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if(!formData.name || !formData.email || !formData.phone || !formData.company || !formData.address) {
      alert("Por favor, completa los campos obligatorios (*) antes de continuar.");
      return;
    }
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: 'contact',
          website,
          consent: { privacy: privacyAccepted, policyVersion: PRIVACY_POLICY_VERSION },
        }),
      });

      if (response.ok) {
        window.location.href = '/gracias';
      } else {
        const errorData = await response.json();
        console.error('Error submitting form:', errorData);
        setStatus('error');
      }
    } catch (error) {
      console.error('Network error:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="form-success">
        <h3>¡Mensaje Enviado!</h3>
        <p>Gracias por cotizar con Limpik. Nos pondremos en contacto contigo a la brevedad.</p>
        <button onClick={() => {setStatus('idle'); setStep(1);}} className="btn-reset">Enviar otro mensaje</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {title && <h3 className="form-title">{title}</h3>}
      {subtitle && <p className="form-subtitle" dangerouslySetInnerHTML={{ __html: subtitle }}></p>}
      
      <div className="step-indicator">
        <span className={step >= 1 ? 'active' : ''}>1. Datos de Contacto</span>
        <span className="separator">{'>'}</span>
        <span className={step >= 2 ? 'active' : ''}>2. Detalles</span>
      </div>

      {step === 1 && (
        <div className="form-step fade-in">
          <div className="form-group">
            <label htmlFor="name">Nombre Completo *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Corporativo *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="nombre@empresa.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Teléfono *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+56 9 1234 5678"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Empresa / Organización *</label>
            <input
              type="text"
              id="company"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              placeholder="Nombre de su empresa"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Dirección donde se solicita el servicio *</label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="Ej: Av. Providencia 1234, Santiago"
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">Servicio de Interés</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
            >
              <option value="">Seleccione un servicio...</option>
              <option value="Limpieza de Empresas">Limpieza de Empresas</option>
              <option value="Limpieza de Edificios">Limpieza de Edificios</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <button type="button" onClick={nextStep} className="btn-submit">
            Siguiente Paso &rarr;
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="form-step fade-in">
          
          <div className="form-group">
            <label htmlFor="staff">Dotación que se requiere</label>
            <input
              type="text"
              id="staff"
              name="staff"
              value={formData.staff}
              onChange={handleChange}
              placeholder="Ej: 2 operarios"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="schedule">Horario de trabajo para el personal</label>
            <input
              type="text"
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              placeholder="Ej: Lunes a Viernes 08:00 a 17:00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="frequency">Frecuencia del Servicio</label>
            <input
              type="text"
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              placeholder="Ej: Diario, 3 veces por semana"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="area">Cantidad de M2</label>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Ej: 500 m2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensaje Adicional</label>
            <textarea
              id="message"
              name="message"
              rows="3"
              value={formData.message}
              onChange={handleChange}
              placeholder="Algún detalle adicional importante..."
            ></textarea>
          </div>

          <PrivacyConsent
            id={consentId}
            checked={privacyAccepted}
            onChange={setPrivacyAccepted}
            purpose="responder su solicitud y enviarle una cotización."
          />
          <Honeypot id={`${consentId}-hp`} value={website} onChange={setWebsite} />

          <div className="button-group">
            <button type="button" onClick={prevStep} className="btn-secondary">
              &larr; Atrás
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={status === 'submitting' || !privacyAccepted}
            >
              {status === 'submitting' ? 'Enviando...' : 'Solicitar Cotización'}
            </button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <p className="error-msg">Hubo un error al enviar el mensaje. Por favor intente nuevamente.</p>
      )}

      <style>{`
        .contact-form {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          width: 100%;
          margin-bottom: 2rem;
          text-align: left;
        }

        .step-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #94a3b8;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 1rem;
        }

        .step-indicator .active {
          color: #1e3a8a;
        }

        .step-indicator .separator {
          color: #cbd5e1;
          font-size: 0.8rem;
        }

        .fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 600px) {
            .contact-form {
                padding: 1.5rem;
                border-radius: 0.5rem;
                margin: 0;
            }
        }

        .form-group {
          margin-bottom: 1.25rem;
          width: 100%;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.9rem;
          color: #333;
        }

        input, select, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-family: inherit;
          font-size: 1rem;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #0056b3;
          box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.1);
        }

        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .btn-submit {
          flex: 1;
          background-color: #FF8000;
          color: white;
          padding: 1rem;
          border: none;
          border-radius: 0.375rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
          width: 100%;
        }

        .btn-submit:hover:not(:disabled) {
          background-color: #FF9933;
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-secondary {
          background-color: #f1f5f9;
          color: #475569;
          padding: 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.375rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-secondary:hover {
          background-color: #e2e8f0;
          color: #1e293b;
        }
        
        .form-success {
            text-align: center;
            padding: 3rem 1rem;
            background: #f0fff4;
            border-radius: 0.5rem;
            border: 1px solid #c6f6d5;
        }
        
        .form-success h3 {
            color: #2f855a;
            margin-bottom: 1rem;
        }
        
        .btn-reset {
            background: none;
            border: none;
            color: #2f855a;
            text-decoration: underline;
            cursor: pointer;
            margin-top: 1rem;
        }

        .error-msg {
            color: #e53e3e;
            margin-top: 1rem;
            font-size: 0.9rem;
        }

        .form-title {
            text-align: left;
            font-size: 1.5rem;
            font-weight: 800;
            color: #1e3a8a;
            margin-bottom: 0.5rem;
            margin-top: 0;
        }

        .form-subtitle {
            text-align: left;
            font-size: 0.95rem;
            color: #64748b;
            margin-bottom: 1.5rem;
            line-height: 1.4;
        }
      `}</style>
    </form>
  );
}
