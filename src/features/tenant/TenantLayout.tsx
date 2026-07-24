import { Outlet } from 'react-router-dom';
import styles from './TenantLayout.module.css';

export default function TenantLayout() {
  return (
    <div className={styles.shell}>
      <Outlet />
    </div>
  );
}
