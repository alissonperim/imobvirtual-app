import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, Home, Plus, Wallet } from 'lucide-react';
import { useData } from '../../lib/DataContext';
import { useAuth } from '../../lib/AuthContext';
import { useToast } from '../../lib/ToastContext';
import { formatBRL } from '../../lib/format';
import { ImovelStatusTag } from '../../components/StatusTag';
import styles from './OwnerPages.module.css';

function dotColor(cor: string) {
  switch (cor) {
    case 'danger': return '#ef4444';
    case 'accent': return 'var(--color-accent)';
    case 'accent-2': return 'var(--color-accent-2)';
    default: return 'var(--color-neutral-400)';
  }
}

export default function DashboardPage() {
  const { imoveis, cobrancas, alertas, inquilinoNome } = useData();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const kpis = useMemo(() => {
    const recebidoMes = cobrancas.filter((c) => c.status === 'pago' && c.competencia.startsWith('Jul')).reduce((s, c) => s + c.valor, 0);
    const pendentes = cobrancas.filter((c) => c.status === 'pendente');
    const aReceber = pendentes.reduce((s, c) => s + c.valor, 0);
    const atrasados = cobrancas.filter((c) => c.status === 'atrasado');
    const emAtraso = atrasados.reduce((s, c) => s + c.valor, 0);
    const ocupados = imoveis.filter((i) => i.status !== 'vago').length;
    const ocupacao = imoveis.length ? Math.round((ocupados / imoveis.length) * 100) : 0;
    return { recebidoMes, pendentesCount: pendentes.length, aReceber, atrasados, emAtraso, ocupados, ocupacao };
  }, [cobrancas, imoveis]);

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h3 style={{ fontSize: 22, margin: 0 }}>Visão geral</h3>
          <div className="text-muted" style={{ fontSize: 12 }}>Olá, {currentUser?.nome} · São Paulo</div>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-primary" onClick={() => showToast('Disponível em breve nesta prototipagem.')}>
            <Plus size={16} strokeWidth={2.75} /> Novo imóvel
          </button>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={`card elev-sm ${styles.kpiCard}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: 12 }}>Recebido em julho</span>
            <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--color-accent-2-100)', display: 'grid', placeItems: 'center' }}>
              <Wallet size={15} color="var(--color-accent-2-700)" strokeWidth={2.75} />
            </span>
          </div>
          <div className={styles.kpiValue}>{formatBRL(kpis.recebidoMes)}</div>
          <div style={{ fontSize: 11, color: 'var(--color-accent-2-700)' }}>Pagamentos confirmados no mês</div>
        </div>

        <div className={`card elev-sm ${styles.kpiCard}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: 12 }}>A receber</span>
            <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--color-accent-100)', display: 'grid', placeItems: 'center' }}>
              <Clock size={15} color="var(--color-accent-700)" strokeWidth={2.75} />
            </span>
          </div>
          <div className={styles.kpiValue}>{formatBRL(kpis.aReceber)}</div>
          <div className="text-muted" style={{ fontSize: 11 }}>{kpis.pendentesCount} cobrança(s) em aberto</div>
        </div>

        <div className={`card elev-sm ${styles.kpiCard}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: 12 }}>Em atraso</span>
            <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--color-danger-bg)', display: 'grid', placeItems: 'center' }}>
              <AlertTriangle size={15} color="var(--color-danger-text)" strokeWidth={2.75} />
            </span>
          </div>
          <div className={styles.kpiValue} style={{ color: 'var(--color-danger-text)' }}>{formatBRL(kpis.emAtraso)}</div>
          <div style={{ fontSize: 11, color: 'var(--color-danger-text)' }}>
            {kpis.atrasados.length} inquilino(s) · {kpis.atrasados[0]?.diasEmAtraso ?? 0} dias
          </div>
        </div>

        <div className={`card elev-sm ${styles.kpiCard}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: 12 }}>Taxa de ocupação</span>
            <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--color-neutral-100)', display: 'grid', placeItems: 'center' }}>
              <Home size={15} color="var(--color-neutral-700)" strokeWidth={2.75} />
            </span>
          </div>
          <div className={styles.kpiValue}>{kpis.ocupacao}%</div>
          <div className="text-muted" style={{ fontSize: 11 }}>{kpis.ocupados} de {imoveis.length} imóveis ocupados</div>
        </div>
      </div>

      <div className={styles.splitGrid}>
        <div className="card elev-sm" style={{ padding: 20, gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Receita dos últimos 6 meses</span>
            <span className="tag st-paid">+ R$ 68.300 no período</span>
          </div>
          <svg viewBox="0 0 460 170" style={{ width: '100%', height: 180 }}>
            <g fontSize="10" fill="var(--color-neutral-500)" fontFamily="var(--font-body)">
              <text x="0" y="20">14k</text><text x="0" y="70">10k</text><text x="0" y="120">6k</text>
            </g>
            <g stroke="var(--color-divider)">
              <line x1="30" y1="16" x2="460" y2="16" /><line x1="30" y1="66" x2="460" y2="66" /><line x1="30" y1="116" x2="460" y2="116" /><line x1="30" y1="150" x2="460" y2="150" />
            </g>
            <g fill="var(--color-accent-300)">
              <rect x="52" y="88" width="42" height="62" rx="8" />
              <rect x="122" y="66" width="42" height="84" rx="8" />
              <rect x="192" y="72" width="42" height="78" rx="8" />
              <rect x="262" y="52" width="42" height="98" rx="8" />
              <rect x="332" y="56" width="42" height="94" rx="8" />
            </g>
            <rect x="402" y="46" width="42" height="104" rx="8" fill="var(--color-accent)" />
            <g fontSize="10" fill="var(--color-neutral-500)" fontFamily="var(--font-body)" textAnchor="middle">
              <text x="73" y="164">Fev</text><text x="143" y="164">Mar</text><text x="213" y="164">Abr</text><text x="283" y="164">Mai</text><text x="353" y="164">Jun</text>
              <text x="423" y="164" fill="var(--color-accent-700)" fontWeight="700">Jul</text>
            </g>
          </svg>
        </div>
        <div className="card elev-sm" style={{ padding: 20, gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Alertas recentes</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {alertas.map((a) => (
              <div key={a.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor(a.cor), marginTop: 6, flex: 'none' }} />
                <div style={{ lineHeight: 1.3 }}>
                  <div style={{ fontSize: 13 }}>{a.titulo}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{a.detalhe}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`card elev-sm ${styles.tableCard}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Meus imóveis</span>
          <Link to="/painel/imoveis" style={{ fontSize: 12, fontWeight: 600 }}>Gerenciar</Link>
        </div>
        <div className={styles.tableWrap}>
          <table className="table">
            <thead><tr><th>Imóvel</th><th>Inquilino</th><th>Aluguel</th><th>Vencimento</th><th>Status</th></tr></thead>
            <tbody>
              {imoveis.map((im) => (
                <tr key={im.id}>
                  <td>
                    <strong>{im.endereco}</strong>
                    <div className="text-muted" style={{ fontSize: 11 }}>{im.bairro} · {im.tipo}</div>
                  </td>
                  <td>{im.inquilinoId ? inquilinoNome(im.inquilinoId) : <span className="text-muted">—</span>}</td>
                  <td>{formatBRL(im.aluguel)}</td>
                  <td>{im.inquilinoId ? `Dia ${String(im.diaVencimento).padStart(2, '0')}` : <span className="text-muted">—</span>}</td>
                  <td><ImovelStatusTag status={im.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
