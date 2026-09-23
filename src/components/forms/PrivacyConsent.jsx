import React from 'react';
import { business } from '../../data/business';

export { PRIVACY_POLICY_VERSION } from '../../data/business';

// Aviso de privacidad por capas + casilla de consentimiento (Ley 21.719).
// La casilla nunca viene marcada: el consentimiento debe ser una acción del usuario.
export default function PrivacyConsent({ id, checked, onChange, purpose, label, required = true, showNotice = true }) {
    return (
        <div className="privacy-consent">
            {showNotice && <p className="privacy-notice">
                <strong>Responsable:</strong> {business.legalName} ({business.name}). <strong>Finalidad:</strong> {purpose}{' '}
                <strong>Derechos:</strong> acceso, rectificación, supresión, oposición, portabilidad y bloqueo, escribiendo a{' '}
                <a href={`mailto:${business.privacyEmail}`}>{business.privacyEmail}</a>. Más información en la{' '}
                <a href="/politica-de-privacidad" target="_blank" rel="noopener">Política de Privacidad</a>.
            </p>}
            <label className="privacy-check" htmlFor={id}>
                <input
                    type="checkbox"
                    id={id}
                    name={id}
                    required={required}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span>{label ?? <>He leído y acepto la <a href="/politica-de-privacidad" target="_blank" rel="noopener">Política de Privacidad</a> y autorizo el tratamiento de mis datos para esta finalidad.</>}{required && ' *'}</span>
            </label>
            <style>{`
                .privacy-consent { margin: 0.5rem 0 1.25rem; }
                .privacy-notice {
                    font-size: 0.78rem;
                    line-height: 1.5;
                    color: #64748b;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.375rem;
                    padding: 0.65rem 0.8rem;
                    margin: 0 0 0.75rem;
                    text-align: left;
                }
                .privacy-notice a, .privacy-check a { color: #0056b3; text-decoration: underline; }
                .privacy-check {
                    display: flex !important;
                    gap: 0.6rem;
                    align-items: flex-start;
                    font-size: 0.85rem !important;
                    font-weight: 400 !important;
                    line-height: 1.45;
                    color: #334155;
                    cursor: pointer;
                    text-align: left;
                }
                .privacy-check input {
                    width: 18px !important;
                    height: 18px;
                    min-width: 18px;
                    margin-top: 2px;
                    padding: 0 !important;
                    accent-color: #0056b3;
                    cursor: pointer;
                }
                .hp-field { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
            `}</style>
        </div>
    );
}

// Campo trampa para bots: oculto a personas y lectores de pantalla
export function Honeypot({ id = 'website', value, onChange }) {
    return (
        <div className="hp-field" aria-hidden="true">
            <label htmlFor={id}>No completar</label>
            <input type="text" id={id} name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}

