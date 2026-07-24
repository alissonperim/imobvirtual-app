import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', gap: 8, zIndex: 1000, alignItems: 'center',
          pointerEvents: 'none', width: '100%', padding: '0 16px',
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--color-accent-2-900)', color: '#fff',
              padding: '11px 18px', borderRadius: 999, fontSize: 13.5, fontWeight: 600,
              boxShadow: 'var(--shadow-lg)', maxWidth: 380, animation: 'imv-fade-in 0.18s ease',
            }}
          >
            <CheckCircle2 size={16} style={{ flex: 'none', color: 'var(--color-accent-300)' }} />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
