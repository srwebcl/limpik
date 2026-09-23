import React, { useState } from 'react';
import PrivacyConsent, { Honeypot, PRIVACY_POLICY_VERSION } from './PrivacyConsent.jsx';

export default function WorkWithUsForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        type: 'recruitment',
        attachments: []
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error, file-error
    const [fileError, setFileError] = useState('');
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [futureProcesses, setFutureProcesses] = useState(false);
    const [website, setWebsite] = useState('');

    const resetForm = () => {
        setFormData({ name: '', email: '', phone: '', message: '', type: 'recruitment', attachments: [] });
        setPrivacyAccepted(false);
        setFutureProcesses(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 3MB Limit
        if (file.size > 3 * 1024 * 1024) {
            setFileError('El archivo es demasiado grande. El máximo permitido es 3MB (use un compresor PDF si es necesario).');
            e.target.value = ''; // Reset input
            return;
        }

        setFileError('');
        setStatus('idle');

        // Convert to Base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = reader.result.split(',')[1]; // Remove "data:application/pdf;base64," prefix
            setFormData(prev => ({
                ...prev,
                attachments: [{
                    content: base64String,
                    filename: file.name,
                    type: file.type || 'application/octet-stream', // Fallback type
                    disposition: 'attachment'
                }]
            }));
        };
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            setStatus('file-error');
        };
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
                    website,
                    consent: { privacy: privacyAccepted, futureProcesses, policyVersion: PRIVACY_POLICY_VERSION },
                }),
            });

            if (response.ok) {
                setStatus('success');
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
                <h3>¡Postulación Enviada!</h3>
                <p>Gracias por tu interés en trabajar con nosotros. Hemos recibido tus datos correctamente.</p>
                <button onClick={() => {
                    setStatus('idle');
                    resetForm();
                }} className="btn-reset">Enviar otra postulación</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="contact-form">
            <h3 className="form-title">Postula a Limpik</h3>
            <p className="form-subtitle">Únete a nuestro equipo de limpieza profesional.</p>

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
                <label htmlFor="email">Email *</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tucorreo@ejemplo.com"
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
                <label htmlFor="message">Experiencia / Presentación</label>
                <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Cuéntanos brevemente sobre tu experiencia laboral previa..."
                ></textarea>
            </div>

            <div className="form-group">
                <label htmlFor="cv">Adjuntar CV (PDF, DOC, DOCX - Máx 3MB)</label>
                <input
                    type="file"
                    id="cv"
                    name="cv"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                />
                <small style={{ display: 'block', marginTop: '0.5rem', color: '#64748b' }}>
                    Si no tienes tu CV a mano, puedes enviarlo después. No incluyas datos sensibles (salud, religión, afiliación sindical, etc.) ni fotografías.
                </small>
                {fileError && <p className="error-msg" style={{ marginTop: '0.5rem' }}>{fileError}</p>}
            </div>

            <PrivacyConsent
                id="privacy-recruitment"
                checked={privacyAccepted}
                onChange={setPrivacyAccepted}
                purpose="evaluar tu postulación en nuestros procesos de selección. Conservamos tus datos 6 meses, salvo que autorices lo contrario."
            />
            <PrivacyConsent
                id="privacy-future"
                checked={futureProcesses}
                onChange={setFutureProcesses}
                required={false}
                showNotice={false}
                label="(Opcional) Autorizo que Limpik conserve mis datos hasta 24 meses para considerarme en futuros procesos de selección."
            />
            <Honeypot value={website} onChange={setWebsite} />

            <button
                type="submit"
                className="btn-submit"
                disabled={status === 'submitting' || !!fileError || !privacyAccepted}
            >
                {status === 'submitting' ? 'Enviando...' : 'Enviar Postulación'}
            </button>

            {status === 'error' && (
                <p className="error-msg">Hubo un error al enviar el formulario. Por favor intente nuevamente.</p>
            )}

            <style>{`
        .contact-form {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          width: 100%;
          text-align: left;
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

        input, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-family: inherit;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        input:focus, textarea:focus {
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
        
        @media (max-width: 600px) {
            .contact-form {
                padding: 1.5rem;
            }
        }
      `}</style>
        </form>
    );
}
