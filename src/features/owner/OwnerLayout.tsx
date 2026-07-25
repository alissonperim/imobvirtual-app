import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell, Building2, CreditCard, FileText, Home, LogOut, Menu, Settings, Users, Wrench, BarChart3, X,
} from 'lucide-react';
import Logo from '../../components/Logo';
import { useAuth } from '../../lib/AuthContext';
import { useData } from '../../lib/DataContext';
import { useToast } from '../../lib/ToastContext';
import styles from '../../styles/DashboardShell.module.css';

const NAV_ITEMS = [
  { to: '/painel', label: 'Visão geral', icon: Home, end: true },
  { to: '/painel/imoveis', label: 'Imóveis', icon: Building2 },
  { to: '/painel/contratos', label: 'Contratos', icon: FileText },
  { to: null, label: 'Inquilinos', icon: Users },
  { to: '/painel/cobrancas', label: 'Cobranças', icon: CreditCard },
  { to: null, label: 'Chamados', icon: Wrench },
  { to: null, label: 'Relatórios', icon: BarChart3 },
];

export default function OwnerLayout() {
  const { currentUser, logout } = useAuth();
  const { alertas } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  if (!currentUser) return null;

  function comingSoon() {
    showToast('Disponível em breve nesta prototipagem.');
    setSidebarOpen(false);
  }

  return (
    <div className={styles.shell}>
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brandRow}>
          <Logo size={32} />
        </div>

        <div className={styles.profileRow} onClick={() => setProfileOpen((o) => !o)}>
          <div className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>{currentUser.iniciais}</div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{currentUser.nome} {currentUser.sobrenome}</div>
            <div style={{ fontSize: 11, color: 'var(--color-accent-700)', fontWeight: 600 }}>Proprietário</div>
          </div>
          {profileOpen && (
            <div className={styles.profilePopover} onClick={(e) => e.stopPropagation()}>
              <button className={styles.navLink} onClick={() => { setProfileOpen(false); logout(); navigate('/entrar'); }}>
                <LogOut size={16} strokeWidth={2.5} /> Sair da conta
              </button>
            </div>
          )}
        </div>

        {NAV_ITEMS.map((item) =>
          item.to ? (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={17} strokeWidth={2.5} />
              {item.label}
            </NavLink>
          ) : (
            <button key={item.label} className={styles.navLink} onClick={comingSoon}>
              <item.icon size={17} strokeWidth={2.5} />
              {item.label}
            </button>
          ),
        )}

        <div className={styles.spacer} />
        <button className={styles.navLink} onClick={comingSoon}>
          <Settings size={17} strokeWidth={2.5} />
          Configurações
        </button>
      </aside>

      <div className={styles.main}>
        <div className={styles.topbar}>
          <button className={`btn btn-icon btn-secondary ${styles.menuBtn}`} onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <Menu size={18} />
          </button>
          <div className={styles.spacer} />
          <div className={styles.searchBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
            Buscar imóvel, inquilino…
          </div>
          <div style={{ position: 'relative' }}>
            <button className="btn btn-icon btn-secondary" style={{ position: 'relative' }} onClick={() => setNotifOpen((o) => !o)} aria-label="Notificações">
              <Bell size={18} strokeWidth={2.75} />
              {alertas.length > 0 && (
                <span style={{ position: 'absolute', top: 7, right: 8, width: 8, height: 8, borderRadius: '50%', background: 'var(--color-danger)', border: '1.5px solid var(--color-bg)' }} />
              )}
            </button>
            {notifOpen && (
              <div className={styles.notifPopover}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Alertas recentes</span>
                  <button className="btn btn-icon btn-secondary" style={{ width: 26, height: 26 }} onClick={() => setNotifOpen(false)}><X size={13} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {alertas.map((a) => (
                    <div key={a.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 6, flex: 'none', background: dotColor(a.cor) }} />
                      <div style={{ lineHeight: 1.35 }}>
                        <div style={{ fontSize: 12.5 }}>{a.titulo}</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>{a.detalhe}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function dotColor(cor: string) {
  switch (cor) {
    case 'danger': return 'var(--color-danger)';
    case 'accent': return 'var(--color-accent)';
    case 'accent-2': return 'var(--color-accent-2)';
    default: return 'var(--color-neutral-400)';
  }
}
