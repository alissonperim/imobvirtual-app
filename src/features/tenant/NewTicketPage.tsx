import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Wrench } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useData } from '../../lib/DataContext';
import { useToast } from '../../lib/ToastContext';
import SegmentedControl from '../../components/SegmentedControl';
import BackHeader from './BackHeader';
import type { ChamadoCategoria, ChamadoUrgencia } from '../../lib/types';

const CATEGORIAS: ChamadoCategoria[] = ['Hidráulica', 'Elétrica', 'Estrutura', 'Outros'];

export default function NewTicketPage() {
  const { currentUser } = useAuth();
  const { contratoByInquilino, addChamado } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState<ChamadoCategoria>('Hidráulica');
  const [urgencia, setUrgencia] = useState<ChamadoUrgencia>('Média');
  const [descricao, setDescricao] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;
  const contrato = contratoByInquilino(currentUser.id);

  if (!contrato) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 20px 24px' }}>
        <BackHeader title="Abrir chamado" to="/app" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 10 }}>
          <Wrench size={32} color="var(--color-neutral-400)" />
          <div style={{ fontWeight: 700 }}>Vincule-se a um imóvel primeiro</div>
          <p className="text-muted" style={{ fontSize: 13 }}>Você precisa estar vinculado a um imóvel para abrir chamados.</p>
        </div>
      </div>
    );
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 3 - fotos.length);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setFotos((prev) => [...prev, String(reader.result)]);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  function handleSubmit() {
    if (!descricao.trim()) return;
    addChamado({ imovelId: contrato!.imovelId, inquilinoId: currentUser!.id, categoria, urgencia, descricao: descricao.trim(), fotos });
    showToast('Chamado enviado! Você pode acompanhar o status por aqui.');
    navigate('/app/chamados');
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 20px 24px', gap: 14 }}>
      <BackHeader title="Abrir chamado" to="/app/chamados" />

      <div className="field">
        <label>Categoria</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 2 }}>
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`tag ${categoria === cat ? '' : 'tag-neutral'}`}
              style={categoria === cat ? { background: 'var(--color-accent-2)', color: '#fff', border: 'none', cursor: 'pointer' } : { cursor: 'pointer', border: 'none' }}
              onClick={() => setCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Urgência</label>
        <SegmentedControl
          name="urg"
          value={urgencia}
          onChange={setUrgencia}
          fill
          options={[{ value: 'Baixa', label: 'Baixa' }, { value: 'Média', label: 'Média' }, { value: 'Alta', label: 'Alta' }]}
        />
      </div>

      <div className="field">
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          className="input"
          style={{ minHeight: 70 }}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva o que está acontecendo…"
        />
      </div>

      <div className="field">
        <label>Fotos</label>
        <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
          {fotos.map((src, i) => (
            <div key={i} style={{ width: 52, height: 52, borderRadius: 12, backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          ))}
          {fotos.length < 3 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{ width: 52, height: 52, borderRadius: 12, border: '1.5px dashed var(--color-neutral-400)', display: 'grid', placeItems: 'center', color: 'var(--color-neutral-500)', background: 'none', cursor: 'pointer' }}
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
        </div>
      </div>

      <button className="btn btn-primary btn-block" style={{ minHeight: 48, fontSize: 15, marginTop: 'auto' }} disabled={!descricao.trim()} onClick={handleSubmit}>
        Enviar chamado
      </button>
    </div>
  );
}
