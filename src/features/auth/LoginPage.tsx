import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../lib/AuthContext';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [touched, setTouched] = useState(false);
  const { requestLoginOtp } = useAuth();
  const navigate = useNavigate();

  const isValid = identifier.trim().length > 4;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    requestLoginOtp(identifier.trim());
    navigate('/entrar/codigo');
  }

  return (
    <AuthLayout>
      <h3 style={{ fontSize: 26, margin: '0 0 6px' }}>Entrar</h3>
      <p className="text-muted" style={{ fontSize: 14, margin: '0 0 26px' }}>
        Informe seu e-mail ou telefone. Enviaremos um código de acesso.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field" style={{ marginBottom: 18 }}>
          <label htmlFor="login-identifier">E-mail ou telefone</label>
          <input
            id="login-identifier"
            className={`input ${touched && !isValid ? 'has-error' : ''}`}
            placeholder="seu@email.com ou (11) 98812-4477"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoFocus
            style={{ minHeight: 44 }}
          />
          {touched && !isValid && <div className="field-error">Informe um e-mail ou telefone válido.</div>}
        </div>
        <button type="submit" className="btn btn-primary btn-block" style={{ minHeight: 46 }}>
          Enviar código de acesso →
        </button>
      </form>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '11px 14px',
          background: 'var(--color-accent-2-100)', borderRadius: 14,
        }}
      >
        <Info size={17} color="var(--color-accent-2-700)" strokeWidth={2.75} />
        <span style={{ fontSize: 12, color: 'var(--color-accent-2-800)' }}>
          Não usamos senha. É mais seguro e você nunca esquece.
        </span>
      </div>
      <div className="text-muted" style={{ fontSize: 13, marginTop: 24, textAlign: 'center' }}>
        Ainda não tem conta? <Link to="/criar-conta" style={{ fontWeight: 700 }}>Criar conta</Link>
      </div>
      <div className="text-muted" style={{ fontSize: 11.5, marginTop: 22, textAlign: 'center', lineHeight: 1.6 }}>
        Prototipo de demonstração — use <strong>ricardo.souza@email.com</strong> (proprietário) ou{' '}
        <strong>mariana.alves@email.com</strong> (inquilina) para ver cada painel.
      </div>
    </AuthLayout>
  );
}
