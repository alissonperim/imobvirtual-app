import { useNavigate } from 'react-router-dom';
import { Bell, FileText, Wrench } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useData } from '../../lib/DataContext';
import { formatBRL } from '../../lib/format';
import { ContratoStatusTag } from '../../components/StatusTag';
import styles from './TenantPages.module.css';

export default function TenantDashboardPage() {
  const { currentUser } = useAuth();
  const { cobrancasByInquilino, contratoByInquilino, chamadosByInquilino, imovelById } = useData();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const cobrancas = cobrancasByInquilino(currentUser.id);
  const contrato = contratoByInquilino(currentUser.id);
  const chamados = chamadosByInquilino(currentUser.id);
  const imovel = contrato ? imovelById(contrato.imovelId) : undefined;

  const cobrancaAtual = cobrancas.find((c) => c.status === 'atrasado') ?? cobrancas.find((c) => c.status === 'pendente');
  const abertos = chamados.filter((c) => c.status !== 'resolvido');
  const chamadoRecente = chamados[0];

  const competenciaLabel = cobrancaAtual ? mesLabel(cobrancaAtual.competencia) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className={styles.mobileOnly} style={{ alignItems: 'center', gap: 10 }}>
        <div className="avatar" style={{ width: 38, height: 38, fontSize: 14 }}>{currentUser.iniciais}</div>
        <div style={{ lineHeight: 1.2 }}>
          <div className="text-muted" style={{ fontSize: 12 }}>Olá,</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{currentUser.nome} {currentUser.sobrenome}</div>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-secondary" style={{ width: 34, height: 34, padding: 0, position: 'relative' }} aria-label="Notificações">
          <Bell size={16} strokeWidth={2.5} />
          <span style={{ position: 'absolute', top: 6, right: 7, width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} />
        </button>
      </div>

      <div className={styles.header}>
        <h3 style={{ fontSize: 22, margin: 0 }}>Olá, {currentUser.nome} 👋</h3>
        <div className="text-muted" style={{ fontSize: 12 }}>{imovel ? `${imovel.endereco} · ${imovel.bairro}` : 'Nenhum imóvel vinculado'}</div>
      </div>

      <div className={styles.dashboardGrid}>
        {cobrancaAtual && (
          <div
            className={styles.heroSpan}
            style={{ background: 'linear-gradient(160deg,#0d1b2e,#1c2f49)', borderRadius: 22, padding: 20, color: '#fff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, opacity: 0.85 }}>Aluguel de {competenciaLabel}</span>
              {cobrancaAtual.status === 'atrasado' ? (
                <span style={{ background: 'rgba(239,68,68,.25)', color: '#fecaca', borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
                  Em atraso · {cobrancaAtual.diasEmAtraso} dias
                </span>
              ) : (
                <span style={{ background: 'rgba(245,158,11,.22)', color: '#fcd88a', borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
                  Vence em {cobrancaAtual.diasParaVencer} dias
                </span>
              )}
            </div>
            <div style={{ fontWeight: 800, fontSize: 34, margin: '8px 0 2px', letterSpacing: '-.01em' }}>
              {formatBRL(cobrancaAtual.valor)}
            </div>
            <div style={{ fontSize: 12, opacity: 0.72, marginBottom: 16 }}>Vencimento {cobrancaAtual.vencimento} · {imovel?.endereco}</div>
            <button className="btn btn-primary btn-block" style={{ minHeight: 46, fontSize: 15, marginTop: 0 }} onClick={() => navigate('/app/pagar')}>
              Pagar agora
            </button>
          </div>
        )}

        <div className="card elev-sm" style={{ padding: 15, gap: 8, cursor: 'pointer' }} onClick={() => navigate('/app/contrato')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <FileText size={15} color="var(--color-accent-600)" strokeWidth={2.5} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Contrato vigente</span>
            </div>
            {contrato && <ContratoStatusTag status={contrato.status} />}
          </div>
          {contrato && (
            <div className={styles.desktopOnly}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px', fontSize: 12.5 }}>
                <div><div className="text-muted" style={{ fontSize: 11 }}>Aluguel</div>{formatBRL(contrato.valor)}/mês</div>
                <div><div className="text-muted" style={{ fontSize: 11 }}>Vigência</div>{contrato.vigenciaMeses} meses</div>
                <div><div className="text-muted" style={{ fontSize: 11 }}>Reajuste</div>{contrato.indiceReajuste}</div>
                <div><div className="text-muted" style={{ fontSize: 11 }}>Vencimento</div>Todo dia {String(imovel?.diaVencimento ?? 5).padStart(2, '0')}</div>
              </div>
            </div>
          )}
          <button
            className={`btn btn-secondary btn-block ${styles.desktopOnly}`}
            style={{ marginTop: 2 }}
            onClick={(e) => { e.stopPropagation(); navigate('/app/contrato'); }}
          >
            Ver contrato
          </button>
        </div>

        <div className="card elev-sm" style={{ padding: 15, gap: 8, cursor: 'pointer' }} onClick={() => navigate('/app/chamados')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Wrench size={15} color="var(--color-accent-2-600)" strokeWidth={2.5} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Chamados abertos</span>
            </div>
            <span className="text-muted" style={{ fontSize: 11 }}>{abertos.length} em aberto</span>
          </div>
          {chamadoRecente && (
            <div className={styles.desktopOnly}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ width: 34, height: 34, flex: 'none', borderRadius: 10, background: 'var(--color-accent-2-100)', display: 'grid', placeItems: 'center' }}>
                  <Wrench size={17} color="var(--color-accent-2-700)" strokeWidth={2.5} />
                </span>
                <div style={{ lineHeight: 1.35 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{chamadoRecente.descricao.slice(0, 40)}{chamadoRecente.descricao.length > 40 ? '…' : ''}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{chamadoRecente.categoria} · {chamadoRecente.urgencia.toLowerCase()} · aberto em {chamadoRecente.criadoEm}</div>
                </div>
              </div>
            </div>
          )}
          <button
            className={`btn btn-secondary btn-block ${styles.desktopOnly}`}
            style={{ marginTop: 2 }}
            onClick={(e) => { e.stopPropagation(); navigate('/app/chamados/novo'); }}
          >
            Abrir novo chamado
          </button>
        </div>

        <div className={styles.fullSpan}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Atividade recente</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {cobrancaAtual && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'var(--color-surface)', borderRadius: 14, padding: '10px 12px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: cobrancaAtual.status === 'atrasado' ? '#ef4444' : 'var(--color-accent)', flex: 'none' }} />
                <span style={{ fontSize: 12, flex: 1 }}>
                  {cobrancaAtual.status === 'atrasado'
                    ? `Aluguel de ${competenciaLabel} em atraso — regularize o quanto antes`
                    : `Aluguel de ${competenciaLabel} disponível para pagamento`}
                </span>
              </div>
            )}
            {chamados.slice(0, 2).map((c) => (
              <div key={c.id} style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'var(--color-surface)', borderRadius: 14, padding: '10px 12px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-neutral-400)', flex: 'none' }} />
                <span style={{ fontSize: 12, flex: 1 }}>Chamado "{c.descricao.slice(0, 28)}{c.descricao.length > 28 ? '…' : ''}" {c.status === 'em_analise' ? 'em análise' : c.status === 'resolvido' ? 'resolvido' : 'aberto'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function mesLabel(competencia: string) {
  const [mes] = competencia.split('/');
  const map: Record<string, string> = { Jan: 'janeiro', Fev: 'fevereiro', Mar: 'março', Abr: 'abril', Mai: 'maio', Jun: 'junho', Jul: 'julho', Ago: 'agosto', Set: 'setembro', Out: 'outubro', Nov: 'novembro', Dez: 'dezembro' };
  return map[mes] ?? competencia;
}
