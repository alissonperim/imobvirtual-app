import { NavLink } from 'react-router-dom';
import { CreditCard, FileText, Home, User, Wrench } from 'lucide-react';
import styles from './TenantLayout.module.css';

const ITEMS = [
  { to: '/app', label: 'Início', icon: Home, end: true },
  { to: '/app/pagar', label: 'Pagar', icon: CreditCard },
  { to: '/app/contrato', label: 'Contrato', icon: FileText },
  { to: '/app/chamados', label: 'Chamados', icon: Wrench },
  { to: '/app/perfil', label: 'Perfil', icon: User },
];

export default function BottomNav() {
  return (
    <nav className={styles.navBar}>
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <item.icon size={20} strokeWidth={2.5} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
