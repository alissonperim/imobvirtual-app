import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function Dialog({ open, onClose, title, children, actions }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-label={title}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div className="dialog-title">{title}</div>
          <button className="btn btn-icon btn-secondary" onClick={onClose} aria-label="Fechar" style={{ width: 32, height: 32 }}>
            <X size={16} />
          </button>
        </div>
        <div className="dialog-body">{children}</div>
        {actions && <div className="dialog-actions">{actions}</div>}
      </div>
    </div>
  );
}
