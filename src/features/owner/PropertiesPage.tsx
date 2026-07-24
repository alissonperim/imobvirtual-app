import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useData } from '../../lib/DataContext';
import { useToast } from '../../lib/ToastContext';
import { formatBRL } from '../../lib/format';
import { ImovelStatusTag } from '../../components/StatusTag';
import SegmentedControl from '../../components/SegmentedControl';
import type { Imovel } from '../../lib/types';
import styles from './OwnerPages.module.css';

type Filter = 'todos' | 'ocupados' | 'vagos';

const GRADIENTS: Record<Imovel['status'], string> = {
  atraso: 'linear-gradient(135deg,var(--color-accent-200),var(--color-accent-2-200))',
  ocupado: 'linear-gradient(135deg,var(--color-neutral-300),var(--color-accent-200))',
  a_vencer: 'linear-gradient(135deg,var(--color-accent-2-200),var(--color-neutral-300))',
  vago: 'linear-gradient(135deg,var(--color-neutral-200),var(--color-neutral-400))',
};

export default function PropertiesPage() {
  const { imoveis, inquilinoNome } = useData();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<Filter>('todos');

  const filtered = useMemo(() => {
    if (filter === 'ocupados') return imoveis.filter((i) => i.status !== 'vago');
    if (filter === 'vagos') return imoveis.filter((i) => i.status === 'vago');
    return imoveis;
  }, [imoveis, filter]);

  function comingSoon() {
    showToast('Disponível em breve nesta prototipagem.');
  }

  return (
    <div>
      <div className={styles.header}>
        <h3 style={{ fontSize: 22, margin: 0 }}>Imóveis</h3>
        <span className="tag tag-neutral">{imoveis.length} imóveis</span>
        <div className={styles.headerActions} style={{ alignItems: 'center' }}>
          <SegmentedControl
            name="imf"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'todos', label: 'Todos' },
              { value: 'ocupados', label: 'Ocupados' },
              { value: 'vagos', label: 'Vagos' },
            ]}
          />
          <button className="btn btn-primary" onClick={comingSoon}>
            <Plus size={16} strokeWidth={2.75} /> Cadastrar imóvel
          </button>
        </div>
      </div>

      <div className={styles.propGrid}>
        {filtered.map((im) => (
          <div key={im.id} className="card elev-sm" style={{ padding: 0, overflow: 'hidden', gap: 0 }}>
            <div style={{ height: 120, background: GRADIENTS[im.status], position: 'relative' }}>
              <span style={{ position: 'absolute', top: 12, left: 12 }}>
                <ImovelStatusTag status={im.status} />
              </span>
            </div>
            <div style={{ padding: 15, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{im.endereco}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>{im.bairro}, SP · {im.tipo} · {im.metragem}m²</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 17 }}>
                  {formatBRL(im.aluguel)}<span className="text-muted" style={{ fontSize: 11, fontWeight: 400 }}>/mês</span>
                </span>
                {im.inquilinoId ? (
                  <span className="text-muted" style={{ fontSize: 12 }}>{inquilinoNome(im.inquilinoId)}</span>
                ) : (
                  <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={comingSoon}>Anunciar</button>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={comingSoon}
          style={{
            border: '1.5px dashed var(--color-neutral-400)', borderRadius: 'calc(var(--radius-lg) * 1.15)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
            color: 'var(--color-neutral-600)', minHeight: 210, cursor: 'pointer', background: 'transparent',
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-surface)', display: 'grid', placeItems: 'center' }}>
            <Plus size={22} color="var(--color-accent)" strokeWidth={2.75} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>Adicionar imóvel</span>
          <span style={{ fontSize: 11 }}>Fotos, endereço, valor e documentos</span>
        </button>
      </div>
    </div>
  );
}
