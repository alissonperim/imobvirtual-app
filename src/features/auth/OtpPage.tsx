import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import OtpInput from '../../components/OtpInput';
import { useAuth } from '../../lib/AuthContext';
import { useToast } from '../../lib/ToastContext';

const CHANNEL_LABEL: Record<string, string> = { sms: 'SMS', whatsapp: 'WhatsApp', email: 'e-mail' };

export default function OtpPage() {
  const { pendingAuth, verifyOtp, resendOtp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [errorState, setErrorState] = useState<'expired' | 'invalid' | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [submittedCode, setSubmittedCode] = useState('');
  const verifiedRef = useRef(false);

  useEffect(() => {
    if (!pendingAuth && !verifiedRef.current) navigate('/entrar', { replace: true });
  }, [pendingAuth, navigate]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!pendingAuth) return null;

  const secondsLeft = Math.max(0, Math.round((pendingAuth.resendAvailableAt - now) / 1000));
  const canResend = secondsLeft <= 0;
  const backTo = pendingAuth.mode === 'signup' ? '/criar-conta' : '/entrar';

  function handleComplete(code: string) {
    setSubmittedCode(code);
    const result = verifyOtp(code);
    if (result.ok) {
      verifiedRef.current = true;
      setErrorState(null);
      if (pendingAuth?.mode === 'signup') navigate('/criar-conta/confirmacao');
      else navigate('/');
      return;
    }
    setErrorState(result.reason);
  }

  function handleResend() {
    resendOtp();
    setErrorState(null);
    setResetSignal((s) => s + 1);
    showToast(`Enviamos um novo código por ${CHANNEL_LABEL[pendingAuth!.channel]}.`);
  }

  return (
    <AuthLayout>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: 22 }}
        onClick={() => navigate(backTo)}
      >
        <ArrowLeft size={15} /> Voltar
      </button>
      <h3 style={{ fontSize: 23, margin: '0 0 8px' }}>Digite o código</h3>
      <p className="text-muted" style={{ fontSize: 13.5, margin: '0 0 24px' }}>
        Enviamos um código de 6 dígitos por {CHANNEL_LABEL[pendingAuth.channel]} para{' '}
        <strong style={{ color: 'var(--color-text)' }}>{pendingAuth.identifier}</strong>.
      </p>

      <div style={{ marginBottom: errorState ? 14 : 18 }}>
        <OtpInput
          error={!!errorState}
          resetSignal={resetSignal}
          onComplete={handleComplete}
        />
      </div>

      {errorState ? (
        <>
          <div
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px',
              background: 'var(--color-danger-bg)', borderRadius: 12,
            }}
          >
            <AlertTriangle size={16} color="var(--color-danger-text)" strokeWidth={2.75} style={{ flex: 'none', marginTop: 1 }} />
            <span style={{ fontSize: 12, color: 'var(--color-danger-text)' }}>
              {errorState === 'expired'
                ? 'Código expirado. Reenviamos um novo — verifique suas mensagens.'
                : 'Código inválido. Verifique os dígitos e tente novamente.'}
            </span>
          </div>
          <button type="button" className="btn btn-ghost" style={{ marginTop: 10, alignSelf: 'flex-start' }} onClick={handleResend}>
            Reenviar código
          </button>
        </>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
          <span className="text-muted">Não recebeu?</span>
          {canResend ? (
            <button type="button" className="btn btn-ghost" style={{ padding: '2px 4px', fontSize: 12 }} onClick={handleResend}>
              Reenviar código
            </button>
          ) : (
            <span className="text-muted">
              Reenviar em <strong style={{ color: 'var(--color-text)' }}>0:{String(secondsLeft).padStart(2, '0')}</strong>
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary btn-block"
        style={{ minHeight: 48, marginTop: 22 }}
        disabled={submittedCode.length < 6}
        onClick={() => submittedCode.length === 6 && handleComplete(submittedCode)}
      >
        Confirmar
      </button>

      {pendingAuth.mode === 'login' ? (
        <p className="text-muted" style={{ fontSize: 11, textAlign: 'center', margin: '12px 0 0' }}>
          Perdeu acesso a este contato?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/entrar'); }}>Usar outro canal</a>
        </p>
      ) : null}

      <p className="text-muted" style={{ fontSize: 11, textAlign: 'center', margin: '18px 0 0', lineHeight: 1.6 }}>
        Prototipo: qualquer código de 6 dígitos confirma. Use <strong>000000</strong> para simular expiração ou{' '}
        <strong>111111</strong> para simular código inválido.
      </p>
    </AuthLayout>
  );
}
