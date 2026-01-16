import React, { useState } from 'react';

export default function ContactForm({ serviceType = '', title = '', subtitle = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: serviceType,
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirect to Thank You page
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
    // This state might not be reachable if we redirect, 
    // but kept as a fallback if redirection fails or logic changes.
    return (
      <div className="form-success">
        <h3>¡Mensaje Enviado!</h3>
        <p>Gracias por cotizar con Limpik. Nos pondremos en contacto contigo a la brevedad.</p>
        <button onClick={() => setStatus('idle')} className="btn-reset">Enviar otro mensaje</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {title && <h3 className="form-title">{title}</h3>}
      {subtitle && <p className="form-subtitle" dangerouslySetInnerHTML={{ __html: subtitle }}></p>}
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

      <div className="form-grid">
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

      <div className="form-group">
        <label htmlFor="message">Detalles del Requerimiento</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          placeholder="Mecione m2 aproximados, ubicación, frecuencia, etc."
        ></textarea>
      </div>

      <button
        type="submit"
        className="btn-submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Enviando...' : 'Solicitar Cotización'}
      </button>

      {status === 'error' && (
        <p className="error-msg">Hubo un error al enviar el mensaje. Por favor intente nuevamente.</p>
      )}

      <style>{`
        .contact-form {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          width: 100%; /* Fluid width */
          margin-bottom: 2rem;
          text-align: left; /* Force left alignment for labels/inputs */
        }
        
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        @media (max-width: 600px) {
            .contact-form {
                padding: 1.5rem; /* Slightly less padding on mobile */
                border-radius: 0.5rem;
                margin: 0; /* Remove potential margins */
            }
            .form-grid {
                grid-template-columns: 1fr;
            }
        }

        .form-group {
          margin-bottom: 1.25rem;
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
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #0056b3;
          box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.1);
        }

        .btn-submit {
          width: 100%;
          background-color: #FF8000;
          color: white;
          padding: 1rem;
          border: none;
          border-radius: 0.375rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
          background-color: #FF9933;
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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
            color: #1e3a8a; /* Corporate Blue */
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
