import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Home, KeyRound, MessageCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import SegmentedControl from '../../components/SegmentedControl';
import { useAuth, type SignupDraft } from '../../lib/AuthContext';
import type { Channel, Role } from '../../lib/types';
import styles from './SignupPage.module.css';

const CANAL_OPTIONS: { value: Channel; label: string; icon?: React.ReactNode }[] = [
  { value: 'sms', label: 'SMS' },
  { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={14} /> },
  { value: 'email', label: 'E-mail' },
];

export default function SignupPage() {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [canal, setCanal] = useState<Channel>('whatsapp');
  const [role, setRole] = useState<Role | null>(null);
  const [documento, setDocumento] = useState('');
  const [codigoConvite, setCodigoConvite] = useState('');
  const [aceite, setAceite] = useState(false);
  const [touched, setTouched] = useState(false);

  const { requestSignupOtp } = useAuth();
  const navigate = useNavigate();

  const baseValid = nome.trim() && sobrenome.trim() && telefone.trim() && email.trim() && role && documento.trim() && aceite;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!baseValid || !role) return;
    const draft: SignupDraft = { nome, sobrenome, telefone, email, canalPreferido: canal, role, documento, codigoConvite };
    requestSignupOtp(draft);
    navigate('/criar-conta/codigo');
  }

  return (
    <AuthLayout wide>
      <h3 style={{ fontSize: 26, margin: '0 0 4px' }}>Criar conta</h3>
      <p className="text-muted" style={{ fontSize: 14, margin: '0 0 22px' }}>
        Leva menos de dois minutos. Você confirma o contato por um código de acesso.
      </p>

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div className={styles.grid2}>
          <div className="field">
            <label htmlFor="nome">Nome</label>
            <input id="nome" className="input" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="sobrenome">Sobrenome</label>
            <input id="sobrenome" className="input" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="telefone">Telefone</label>
            <input id="telefone" className="input" placeholder="(11) 98812-4477" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" className="input" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label>Como deseja receber os códigos de acesso?</label>
          <SegmentedControl name="canal" value={canal} onChange={setCanal} options={CANAL_OPTIONS} />
          <div className="field-hint">Você pode alterar depois em Configurações.</div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}>
            Tipo de cadastro <span style={{ color: 'var(--color-accent)' }}>*</span>
          </label>
          <div className={styles.roleGrid}>
            <button
              type="button"
              className={`${styles.roleCard} ${role === 'proprietario' ? styles.roleCardActive : ''}`}
              onClick={() => setRole('proprietario')}
            >
              <span className={styles.roleIcon} style={{ background: role === 'proprietario' ? 'var(--color-accent)' : 'var(--color-neutral-200)' }}>
                <Home size={20} color={role === 'proprietario' ? '#fff' : 'var(--color-neutral-700)'} strokeWidth={2.5} />
              </span>
              <span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 15, color: role === 'proprietario' ? 'var(--color-accent-800)' : 'var(--color-text)' }}>
                  Proprietário {role === 'proprietario' && <CheckCircle2 size={16} fill="var(--color-accent)" color="#fff" />}
                </span>
                <span style={{ display: 'block', fontSize: 12, color: role === 'proprietario' ? 'var(--color-accent-800)' : 'var(--color-neutral-600)', opacity: 0.9, marginTop: 2 }}>
                  Cadastro imóveis, contratos e cobranças
                </span>
              </span>
            </button>
            <button
              type="button"
              className={`${styles.roleCard} ${role === 'inquilino' ? styles.roleCardActive : ''}`}
              onClick={() => setRole('inquilino')}
            >
              <span className={styles.roleIcon} style={{ background: role === 'inquilino' ? 'var(--color-accent)' : 'var(--color-accent-2-200)' }}>
                <KeyRound size={20} color={role === 'inquilino' ? '#fff' : 'var(--color-accent-2-800)'} strokeWidth={2.5} />
              </span>
              <span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 15, color: role === 'inquilino' ? 'var(--color-accent-800)' : 'var(--color-text)' }}>
                  Inquilino {role === 'inquilino' && <CheckCircle2 size={16} fill="var(--color-accent)" color="#fff" />}
                </span>
                <span className="text-muted" style={{ display: 'block', fontSize: 12, marginTop: 2 }}>
                  Pago aluguel, assino contrato e abro chamados
                </span>
              </span>
            </button>
          </div>
          {touched && !role && <div className="field-error">Selecione o tipo de cadastro para continuar.</div>}
        </div>

        {role && (
          <div style={{ background: 'var(--color-surface)', borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent-700)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={14} strokeWidth={2.75} />
              Dados de {role === 'proprietario' ? 'proprietário' : 'inquilino'}
            </div>
            <div className="field" style={{ maxWidth: 280 }}>
              <label htmlFor="documento">{role === 'proprietario' ? 'CPF ou CNPJ' : 'CPF'}</label>
              <input id="documento" className="input" placeholder="000.000.000-00" value={documento} onChange={(e) => setDocumento(e.target.value)} />
            </div>
            {role === 'inquilino' && (
              <div className="field" style={{ maxWidth: 320 }}>
                <label htmlFor="convite">Código de convite do proprietário (opcional)</label>
                <input id="convite" className="input" placeholder="Ex: CONVITE-8F2A" value={codigoConvite} onChange={(e) => setCodigoConvite(e.target.value)} />
                <div className="field-hint">Recebeu um convite do seu proprietário? Cole o código aqui para já vincular seu imóvel. Sem ele, você pode se vincular depois.</div>
              </div>
            )}
            <label className="radio" style={{ alignItems: 'flex-start' }}>
              <input type="checkbox" checked={aceite} onChange={(e) => setAceite(e.target.checked)} />
              <span className="dot" style={{ borderRadius: 5, marginTop: 1 }} />
              <span style={{ fontSize: 13 }}>
                Li e aceito os <a href="#" onClick={(e) => e.preventDefault()}>Termos de Uso</a> e a{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>Política de Privacidade</a>.
              </span>
            </label>
            {touched && !aceite && <div className="field-error">É necessário aceitar os termos para continuar.</div>}
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-block" style={{ minHeight: 48, marginTop: 0 }}>
          Criar conta e receber código
        </button>
      </form>

      <div className="text-muted" style={{ fontSize: 13, marginTop: 22, textAlign: 'center' }}>
        Já tem conta? <Link to="/entrar" style={{ fontWeight: 700 }}>Entrar</Link>
      </div>
    </AuthLayout>
  );
}
