import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, MessageCircle, Phone, Smartphone } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import BackHeader from './BackHeader';

const CHANNEL_LABEL: Record<string, string> = { sms: 'SMS', whatsapp: 'WhatsApp', email: 'E-mail' };

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 20px 24px', gap: 16 }}>
      <BackHeader title="Perfil" to="/app" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="avatar" style={{ width: 56, height: 56, fontSize: 20 }}>{currentUser.iniciais}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{currentUser.nome} {currentUser.sobrenome}</div>
          <span className="tag tag-accent-2">Inquilino</span>
        </div>
      </div>

      <div className="card elev-sm" style={{ gap: 12 }}>
        <div className="card-kicker">Dados de contato</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
          <Mail size={15} color="var(--color-neutral-500)" strokeWidth={2.5} /> {currentUser.email}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
          <Phone size={15} color="var(--color-neutral-500)" strokeWidth={2.5} /> {currentUser.telefone}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
          {currentUser.canalPreferido === 'whatsapp' ? (
            <MessageCircle size={15} color="var(--color-neutral-500)" strokeWidth={2.5} />
          ) : (
            <Smartphone size={15} color="var(--color-neutral-500)" strokeWidth={2.5} />
          )}
          Recebe códigos por {CHANNEL_LABEL[currentUser.canalPreferido]}
        </div>
      </div>

      <button
        className="btn btn-secondary btn-block"
        style={{ marginTop: 'auto', color: 'var(--color-danger-text)' }}
        onClick={() => { logout(); navigate('/entrar'); }}
      >
        <LogOut size={16} strokeWidth={2.5} /> Sair da conta
      </button>
    </div>
  );
}
