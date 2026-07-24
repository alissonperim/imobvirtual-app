import { useState } from 'react';
import { Check, Download, Plus } from 'lucide-react';
import { useData } from '../../lib/DataContext';
import { useToast } from '../../lib/ToastContext';
import { formatBRL } from '../../lib/format';
import { ContratoStatusTag } from '../../components/StatusTag';
import styles from './OwnerPages.module.css';

export default function ContractsPage() {
  const { contratos, imovelById } = useData();
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState(contratos[0]?.id ?? '');

  const selected = contratos.find((c) => c.id === selectedId) ?? contratos[0];
  const imovel = selected ? imovelById(selected.imovelId) : undefined;

  function comingSoon() {
    showToast('Disponível em breve nesta prototipagem.');
  }

  return (
    <div>
      <div className={styles.header}>
        <h3 style={{ fontSize: 22, margin: 0 }}>Contratos</h3>
        <div className={styles.headerActions}>
          <button className="btn btn-primary" onClick={comingSoon}>
            <Plus size={16} strokeWidth={2.75} /> Criar contrato digital
          </button>
        </div>
      </div>

      <div className={styles.contractsGrid}>
        <div className="card elev-sm" style={{ padding: '8px 18px 12px', gap: 0 }}>
          <div className={styles.tableWrap}>
            <table className="table">
              <thead><tr><th>Inquilino / Imóvel</th><th>Valor</th><th>Status</th></tr></thead>
              <tbody>
                {contratos.map((c) => (
                  <tr
                    key={c.id}
                    className={`is-clickable ${c.id === selected?.id ? 'is-selected' : ''}`}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <td>
                      <strong>{c.inquilinoNome}</strong>
                      <div className="text-muted" style={{ fontSize: 11 }}>{imovelById(c.imovelId)?.endereco}</div>
                    </td>
                    <td>{formatBRL(c.valor)}</td>
                    <td><ContratoStatusTag status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="card elev-sm" style={{ padding: 20, gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="card-kicker">Contrato · locação residencial</div>
                <div style={{ fontWeight: 700, fontSize: 17, marginTop: 2 }}>{selected.inquilinoNome}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>{imovel?.endereco} — {imovel?.bairro}</div>
              </div>
              <ContratoStatusTag status={selected.status} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', fontSize: 13 }}>
              <div><div className="text-muted" style={{ fontSize: 11 }}>Aluguel</div>{formatBRL(selected.valor)} / mês</div>
              <div><div className="text-muted" style={{ fontSize: 11 }}>Vigência</div>{selected.vigenciaMeses} meses</div>
              <div><div className="text-muted" style={{ fontSize: 11 }}>Início</div>{selected.inicio}</div>
              <div><div className="text-muted" style={{ fontSize: 11 }}>Reajuste</div>{selected.indiceReajuste} · {selected.proximoReajuste}</div>
            </div>

            <hr className="hr" style={{ margin: '4px 0' }} />
            <div className="card-kicker">Andamento da assinatura</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {selected.eventos.map((ev, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span
                      style={{
                        width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center',
                        background: ev.concluido ? 'var(--color-accent-2)' : 'var(--color-neutral-300)',
                      }}
                    >
                      {ev.concluido && <Check size={12} color="#fff" strokeWidth={3.5} />}
                    </span>
                    {i < selected.eventos.length - 1 && (
                      <span style={{ width: 2, flex: 1, minHeight: 20, background: ev.concluido ? 'var(--color-accent-2)' : 'var(--color-neutral-300)' }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: ev.concluido ? 'var(--color-text)' : 'var(--color-neutral-500)' }}>{ev.titulo}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>{ev.data}{ev.detalhe ? ` · ${ev.detalhe}` : ''}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={comingSoon}>
                <Download size={15} strokeWidth={2.75} /> PDF
              </button>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={comingSoon}>Renovar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
