import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, MessageCircle, Mail, Smartphone } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../lib/AuthContext';

const CHANNEL_INFO: Record<string, { label: string; icon: typeof Mail }> = {
  whatsapp: { label: 'WhatsApp', icon: MessageCircle },
  sms: { label: 'SMS', icon: Smartphone },
  email: { label: 'e-mail', icon: Mail },
};

export default function SignupConfirmationPage() {
  const { currentUser, homePathFor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate('/criar-conta', { replace: true });
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const channel = CHANNEL_INFO[currentUser.canalPreferido];
  const ChannelIcon = channel.icon;
  const roleLabel = currentUser.role === 'proprietario' ? 'proprietário(a)' : 'inquilino(a)';

  return (
    <AuthLayout>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--color-paid-bg)', display: 'grid', placeItems: 'center', margin: '8px 0 22px' }}>
          <Check size={40} color="var(--color-accent-600)" strokeWidth={2.5} />
        </div>
        <h3 style={{ fontSize: 24, margin: '0 0 10px' }}>Conta ativada!</h3>
        <p className="text-muted" style={{ fontSize: 13.5, margin: '0 0 26px', maxWidth: 320 }}>
          Confirmamos seu {channel.label}. Bem-vindo(a), {currentUser.nome} — sua conta de {roleLabel} está pronta.
        </p>
        <div style={{ width: '100%', background: 'var(--color-surface)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', marginBottom: 28 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--color-accent-2-200)', display: 'grid', placeItems: 'center', flex: 'none' }}>
            <ChannelIcon size={18} color="var(--color-accent-2-800)" strokeWidth={2.75} />
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.3 }}>
            <strong>Verificado por {channel.label}</strong>
            <div className="text-muted">Seus códigos chegam por lá</div>
          </div>
        </div>
        <button className="btn btn-primary btn-block" style={{ minHeight: 48 }} onClick={() => navigate(homePathFor(currentUser.role))}>
          Ir para o painel →
        </button>
      </div>
    </AuthLayout>
  );
}
