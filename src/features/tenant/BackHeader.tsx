import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackHeader({ title, to }: { title: string; to?: string }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
      <button
        className="btn btn-secondary"
        style={{ width: 32, height: 32, padding: 0 }}
        onClick={() => (to ? navigate(to) : navigate(-1))}
        aria-label="Voltar"
      >
        <ArrowLeft size={16} />
      </button>
      <h3 style={{ fontSize: 19, margin: 0 }}>{title}</h3>
    </div>
  );
}
