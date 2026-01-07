import React, { useState } from 'react';

export default function ComplaintForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        rut: '',
        email: '',
        phone: '',
        relation: '',
        incidentDate: '',
        incidentType: '', // Acoso Laboral, Acoso Sexual, Violencia
        description: '',
        anonymous: false
    });
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API submission
        console.log('Complaint submitted:', formData);
        setTimeout(() => setSuccess(true), 1000);
    };

    if (success) {
        return (
            <div className="success-message">
                <h3>Denuncia Recibida</h3>
                <p>Hemos recibido su denuncia. Un encargado de cumplimiento se pondrá en contacto a la brevedad dentro de los plazos legales establecidos.</p>
                <p>La confidencialidad de este reporte está garantizada.</p>
                <button onClick={() => setSuccess(false)} className="btn-reset">Ingresar otra denuncia</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="complaint-form">
            <div className="alert-info">
                <p><strong>Canal de Denuncias Ley Karin:</strong> Este formulario es confidencial. Puede optar por realizar una denuncia anónima si lo prefiere.</p>
            </div>

            <div className="form-group checkbox-group">
                <label>
                    <input
                        type="checkbox"
                        name="anonymous"
                        checked={formData.anonymous}
                        onChange={handleChange}
                    />
                    Quiero realizar una denuncia anónima
                </label>
            </div>

            {!formData.anonymous && (
                <>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <input type="text" name="fullName" required={!formData.anonymous} value={formData.fullName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>RUT</label>
                            <input type="text" name="rut" required={!formData.anonymous} value={formData.rut} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email de Contacto</label>
                            <input type="email" name="email" required={!formData.anonymous} value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Relación con la Empresa</label>
                        <select name="relation" required={!formData.anonymous} value={formData.relation} onChange={handleChange}>
                            <option value="">Seleccione...</option>
                            <option value="Colaborador Interno">Colaborador Interno</option>
                            <option value="Proveedor">Proveedor</option>
                            <option value="Cliente">Cliente</option>
                            <option value="Ex-colaborador">Ex-colaborador</option>
                        </select>
                    </div>
                </>
            )}

            <div className="separator"></div>

            <h4>Detalles del Incidente</h4>

            <div className="form-group">
                <label>Tipo de Incidente *</label>
                <select name="incidentType" required value={formData.incidentType} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    <option value="Acoso Laboral">Acoso Laboral</option>
                    <option value="Acoso Sexual">Acoso Sexual</option>
                    <option value="Violencia en el Trabajo">Violencia en el Trabajo</option>
                    <option value="Discriminación">Discriminación</option>
                </select>
            </div>

            <div className="form-group">
                <label>Fecha del Incidente (Aproximada) *</label>
                <input type="date" name="incidentDate" required value={formData.incidentDate} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label>Descripción de los Hechos *</label>
                <textarea
                    name="description"
                    rows="6"
                    required
                    placeholder="Describa detalladamente lo sucedido, involucrados y testigos si los hay."
                    value={formData.description}
                    onChange={handleChange}
                ></textarea>
            </div>

            <button type="submit" className="btn-submit-alert">Enviar Denuncia Confidencial</button>

            <style>{`
        .complaint-form {
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            max-width: 800px;
            margin: 0 auto;
        }
        
        .alert-info {
            background: #ebf8ff;
            border-left: 4px solid #4299e1;
            padding: 1rem;
            margin-bottom: 2rem;
            font-size: 0.9rem;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }
        
        @media (max-width: 600px) {
            .form-row { grid-template-columns: 1fr; }
        }
        
        .form-group { margin-bottom: 1.5rem; }
        
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        input, select, textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.25rem;
        }
        
        .separator {
            border-top: 1px solid #e2e8f0;
            margin: 2rem 0;
        }
        
        .btn-submit-alert {
            width: 100%;
            padding: 1rem;
            background: #e53e3e; /* Red for alert/important */
            color: white;
            border: none;
            border-radius: 0.25rem;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .btn-submit-alert:hover {
            background: #c53030;
        }

        .success-message {
            text-align: center;
            background: #f0fff4;
            padding: 3rem;
            border-radius: 0.5rem;
            color: #2f855a;
        }

        .btn-reset {
            margin-top: 1rem;
            background: none;
            border: none;
            text-decoration: underline;
            color: #2f855a;
            cursor: pointer;
        }
      `}</style>
        </form>
    );
}
