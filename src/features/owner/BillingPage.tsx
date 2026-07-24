import { useMemo, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { useData } from '../../lib/DataContext';
import { useToast } from '../../lib/ToastContext';
import { formatBRL } from '../../lib/format';
import { CobrancaStatusTag } from '../../components/StatusTag';
import SegmentedControl from '../../components/SegmentedControl';
import styles from './OwnerPages.module.css';

type Filter = 'todas' | 'pagas' | 'pendentes' | 'atraso';

const METODO_LABEL: Record<string, string> = { pix: 'PIX', boleto: 'Boleto' };

export default function BillingPage() {
  const { cobrancas, imovelById } = useData();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<Filter>('todas');

  const totals = useMemo(() => {
    const pago = cobrancas.filter((c) => c.status === 'pago').reduce((s, c) => s + c.valor, 0);
    const pendente = cobrancas.filter((c) => c.status === 'pendente').reduce((s, c) => s + c.valor, 0);
    const atraso = cobrancas.filter((c) => c.status === 'atrasado').reduce((s, c) => s + c.valor, 0);
    return { pago, pendente, atraso };
  }, [cobrancas]);

  const filtered = useMemo(() => {
    if (filter === 'pagas') return cobrancas.filter((c) => c.status === 'pago');
    if (filter === 'pendentes') return cobrancas.filter((c) => c.status === 'pendente');
    if (filter === 'atraso') return cobrancas.filter((c) => c.status === 'atrasado');
    return cobrancas;
  }, [cobrancas, filter]);

  function comingSoon() {
    showToast('Disponível em breve nesta prototipagem.');
  }

  return (
    <div>
      <div className={styles.header}>
        <h3 style={{ fontSize: 22, margin: 0 }}>Cobranças</h3>
        <div className={styles.headerActions}>
          <button className="btn btn-secondary" onClick={comingSoon}>
            <Download size={15} strokeWidth={2.75} /> Exportar extrato
          </button>
          <button className="btn btn-primary" onClick={comingSoon}>
            <Plus size={16} strokeWidth={2.75} /> Nova cobrança
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div className="card elev-sm" style={{ flex: '1 1 180px', padding: '14px 18px', gap: 2 }}>
          <span className="text-muted" style={{ fontSize: 11 }}>Pago no mês</span>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 20, color: 'var(--color-accent-700)' }}>{formatBRL(totals.pago)}</span>
        </div>
        <div className="card elev-sm" style={{ flex: '1 1 180px', padding: '14px 18px', gap: 2 }}>
          <span className="text-muted" style={{ fontSize: 11 }}>A vencer</span>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 20 }}>{formatBRL(totals.pendente)}</span>
        </div>
        <div className="card elev-sm" style={{ flex: '1 1 180px', padding: '14px 18px', gap: 2 }}>
          <span className="text-muted" style={{ fontSize: 11 }}>Em atraso</span>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 20, color: 'var(--color-danger-text)' }}>{formatBRL(totals.atraso)}</span>
        </div>
        <div className="card elev-sm" style={{ flex: '1 1 220px', padding: '14px 18px', gap: 2, background: 'var(--color-accent-2-100)', border: '1px solid var(--color-accent-2-200)' }}>
          <span style={{ fontSize: 11, color: 'var(--color-accent-2-800)' }}>Cobrança automática</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-accent-2-800)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 24, height: 14, borderRadius: 999, background: 'var(--color-accent-2)', position: 'relative', flex: 'none' }}>
              <span style={{ position: 'absolute', right: 2, top: 2, width: 10, height: 10, borderRadius: '50%', background: '#fff' }} />
            </span>
            Ativa · reajuste IGPM
          </span>
        </div>
      </div>

      <div className="card elev-sm" style={{ padding: '8px 20px 12px', gap: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', flexWrap: 'wrap' }}>
          <SegmentedControl
            name="cf"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'todas', label: 'Todas' },
              { value: 'pagas', label: 'Pagas' },
              { value: 'pendentes', label: 'Pendentes' },
              { value: 'atraso', label: 'Em atraso' },
            ]}
          />
          <div style={{ flex: 1 }} />
          <span className="text-muted" style={{ fontSize: 12 }}>Julho de 2025</span>
        </div>
        <div className={styles.tableWrap}>
          <table className="table">
            <thead><tr><th>Inquilino</th><th>Imóvel</th><th>Competência</th><th>Vencimento</th><th>Valor</th><th>Método</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.inquilinoNome}</strong></td>
                  <td className="text-muted">{imovelById(c.imovelId)?.endereco}</td>
                  <td>{c.competencia}</td>
                  <td>{c.vencimento.slice(0, 5)}</td>
                  <td>{formatBRL(c.valor)}</td>
                  <td>{c.metodo ? METODO_LABEL[c.metodo] : '—'}</td>
                  <td><CobrancaStatusTag status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
