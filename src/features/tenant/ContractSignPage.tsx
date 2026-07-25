import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, FileSignature } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useData } from '../../lib/DataContext';
import { useToast } from '../../lib/ToastContext';
import { formatBRL } from '../../lib/format';
import { ContratoStatusTag } from '../../components/StatusTag';
import BackHeader from './BackHeader';
import styles from './TenantPages.module.css';

export default function ContractSignPage() {
  const { currentUser } = useAuth();
  const { contratoByInquilino, imovelById, signContrato } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [aceite, setAceite] = useState(false);
  const [demoReopen, setDemoReopen] = useState(false);

  if (!currentUser) return null;
  const contrato = contratoByInquilino(currentUser.id);

  if (!contrato) {
    return (
      <div className={styles.narrowPage} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 20px 24px' }}>
        <BackHeader title="Contrato" to="/app" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 10 }}>
          <FileSignature size={34} color="var(--color-neutral-400)" />
          <div style={{ fontWeight: 700 }}>Você ainda não está vinculado a um imóvel</div>
          <p className="text-muted" style={{ fontSize: 13 }}>
            Peça ao seu proprietário o código de convite ou o link de vínculo para associar seu contrato.
          </p>
        </div>
      </div>
    );
  }

  const imovel = imovelById(contrato.imovelId);
  const showForm = !contrato.assinadoPeloInquilino || demoReopen;

  function handleSign() {
    signContrato(contrato!.id);
    setDemoReopen(false);
    showToast('Contrato assinado com sucesso!');
    navigate('/app');
  }

  return (
    <div className={styles.narrowPage} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 20px 24px', gap: 14 }}>
      <BackHeader title="Assinar contrato" to="/app" />

      {showForm ? (
        <>
          <div style={{ border: '1px solid var(--color-divider)', borderRadius: 16, padding: 16, background: 'var(--color-surface)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Contrato de locação residencial</div>
            <div style={{ fontSize: 11, lineHeight: 1.6, color: 'var(--color-neutral-600)' }}>
              Locador: Ricardo Souza · Locatária: {currentUser.nome} {currentUser.sobrenome}. Objeto: imóvel situado à {imovel?.endereco} — {imovel?.bairro}.
              Aluguel mensal de {formatBRL(contrato.valor)}, vencimento todo dia {String(imovel?.diaVencimento ?? 5).padStart(2, '0')}.
            </div>
            <div className="imv-skel" style={{ height: 8, width: '100%' }} />
            <div className="imv-skel" style={{ height: 8, width: '92%' }} />
            <div className="imv-skel" style={{ height: 8, width: '96%' }} />
            <div className="imv-skel" style={{ height: 8, width: '70%' }} />
            <div style={{ fontSize: 11, color: 'var(--color-accent-700)', fontWeight: 600, marginTop: 2 }}>Ler documento completo (6 páginas)</div>
          </div>
          <label className="radio" style={{ alignItems: 'flex-start' }}>
            <input type="checkbox" checked={aceite} onChange={(e) => setAceite(e.target.checked)} />
            <span className="dot" style={{ borderRadius: 5, marginTop: 1 }} />
            <span style={{ fontSize: 12 }}>Li e concordo com todos os termos do contrato.</span>
          </label>
          <button className="btn btn-primary btn-block" style={{ minHeight: 48, fontSize: 15, marginTop: 0 }} disabled={!aceite} onClick={handleSign}>
            <FileSignature size={17} strokeWidth={2.5} /> Assinar digitalmente
          </button>
          <div className="text-muted" style={{ fontSize: 10, textAlign: 'center', lineHeight: 1.4 }}>
            Assinatura registrada com data, hora e CPF, com validade jurídica.
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-kicker">Contrato · locação residencial</div>
              <div style={{ fontWeight: 700, fontSize: 17, marginTop: 2 }}>{imovel?.endereco}</div>
              <div className="text-muted" style={{ fontSize: 12 }}>{imovel?.bairro}</div>
            </div>
            <ContratoStatusTag status={contrato.status} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', fontSize: 13 }}>
            <div><div className="text-muted" style={{ fontSize: 11 }}>Aluguel</div>{formatBRL(contrato.valor)} / mês</div>
            <div><div className="text-muted" style={{ fontSize: 11 }}>Vigência</div>{contrato.vigenciaMeses} meses</div>
            <div><div className="text-muted" style={{ fontSize: 11 }}>Início</div>{contrato.inicio}</div>
            <div><div className="text-muted" style={{ fontSize: 11 }}>Reajuste</div>{contrato.indiceReajuste} · {contrato.proximoReajuste}</div>
          </div>
          <hr className="hr" style={{ margin: '4px 0' }} />
          <div className="card-kicker">Andamento da assinatura</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {contrato.eventos.map((ev, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--color-accent-2)', display: 'grid', placeItems: 'center' }}>
                    <Check size={12} color="#fff" strokeWidth={3.5} />
                  </span>
                  {i < contrato.eventos.length - 1 && <span style={{ width: 2, flex: 1, minHeight: 20, background: 'var(--color-accent-2)' }} />}
                </div>
                <div style={{ paddingBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{ev.titulo}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{ev.data}{ev.detalhe ? ` · ${ev.detalhe}` : ''}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-muted" style={{ fontSize: 10.5, textAlign: 'center', marginTop: 'auto', paddingTop: 10, borderTop: '1px dashed var(--color-divider)' }}>
            Ambiente de demonstração —{' '}
            <button className="btn btn-ghost" style={{ padding: '2px 4px', fontSize: 10.5 }} onClick={() => setDemoReopen(true)}>
              reabrir tela de assinatura para teste
            </button>
          </div>
        </>
      )}
    </div>
  );
}
