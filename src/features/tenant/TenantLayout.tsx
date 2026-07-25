import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, CreditCard, FileText, Home, LogOut, Settings, Wrench, FileStack } from 'lucide-react';
import Logo from '../../components/Logo';
import { useAuth } from '../../lib/AuthContext';
import { useToast } from '../../lib/ToastContext';
import BottomNav from './BottomNav';
import styles from '../../styles/DashboardShell.module.css';

const NAV_ITEMS = [
  { to: '/app', label: 'Início', icon: Home, end: true },
  { to: '/app/pagar', label: 'Pagar aluguel', icon: CreditCard },
  { to: '/app/contrato', label: 'Contrato', icon: FileText },
  { to: '/app/chamados', label: 'Chamados', icon: Wrench },
  { to: null, label: 'Documentos', icon: FileStack },
];

export default function TenantLayout() {
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  if (!currentUser) return null;

  function comingSoon() {
    showToast('Disponível em breve nesta prototipagem.');
  }

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${styles.sidebarTenant}`}>
        <div className={styles.brandRow}>
          <Logo size={32} />
        </div>

        <div className={styles.profileRow} onClick={() => setProfileOpen((o) => !o)}>
          <div className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>{currentUser.iniciais}</div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{currentUser.nome} {currentUser.sobrenome}</div>
            <div style={{ fontSize: 11, color: 'var(--color-accent-700)', fontWeight: 600 }}>Inquilino</div>
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
        <NavLink to="/app/perfil" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
          <Settings size={17} strokeWidth={2.5} />
          Configurações
        </NavLink>
      </aside>

      <div className={styles.main}>
        <div className={`${styles.topbar} ${styles.topbarTenant}`}>
          <div className={styles.spacer} />
          <button className="btn btn-icon btn-secondary" style={{ position: 'relative' }} aria-label="Notificações">
            <Bell size={18} strokeWidth={2.75} />
            <span style={{ position: 'absolute', top: 7, right: 8, width: 8, height: 8, borderRadius: '50%', background: 'var(--color-danger)', border: '1.5px solid var(--color-bg)' }} />
          </button>
        </div>
        <div className={`${styles.content} ${styles.contentTenant}`}>
          <Outlet />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
