import { useNavigate } from 'react-router-dom';
import { Plus, Wrench } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useData } from '../../lib/DataContext';
import { ChamadoStatusTag } from '../../components/StatusTag';
import BackHeader from './BackHeader';

export default function ChamadosListPage() {
  const { currentUser } = useAuth();
  const { chamadosByInquilino } = useData();
  const navigate = useNavigate();

  if (!currentUser) return null;
  const chamados = chamadosByInquilino(currentUser.id);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 20px 24px', gap: 14 }}>
      <BackHeader title="Chamados" to="/app" />

      {chamados.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 10 }}>
          <Wrench size={32} color="var(--color-neutral-400)" />
          <div style={{ fontWeight: 700 }}>Nenhum chamado por aqui</div>
          <p className="text-muted" style={{ fontSize: 13, maxWidth: 240 }}>Encontrou algum problema no imóvel? Abra um chamado e acompanhe por aqui.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {chamados.map((c) => (
            <div key={c.id} className="card elev-sm" style={{ gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <span className="tag tag-accent-2" style={{ marginBottom: 6, display: 'inline-block' }}>{c.categoria}</span>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.descricao}</div>
                </div>
                <ChamadoStatusTag status={c.status} />
              </div>
              <div className="text-muted" style={{ fontSize: 11 }}>Aberto em {c.criadoEm} · Urgência {c.urgencia.toLowerCase()}</div>
              {c.mensagens.length > 1 && (
                <div style={{ borderTop: '1px solid var(--color-divider)', marginTop: 4, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {c.mensagens.slice(1).map((m, i) => (
                    <div key={i} style={{ fontSize: 12 }}>
                      <strong>{m.autor}:</strong> <span className="text-muted">{m.texto}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-primary btn-block" style={{ minHeight: 48, marginTop: chamados.length === 0 ? 0 : 4 }} onClick={() => navigate('/app/chamados/novo')}>
        <Plus size={16} strokeWidth={2.75} /> Abrir novo chamado
      </button>
    </div>
  );
}
