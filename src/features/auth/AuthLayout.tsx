import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import Logo from '../../components/Logo';
import styles from './AuthLayout.module.css';

export default function AuthLayout({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={styles.wrap}>
      <aside className={styles.brandPanel}>
        <Logo onDark size={30} />
        <div>
          <h2 className={styles.brandHeadline}>Tudo o que importa no aluguel, em um só lugar.</h2>
          <p className={styles.brandSub}>
            Cobranças, contratos e comunicação entre proprietários e inquilinos — sem papelada, sem atrito.
          </p>
        </div>
        <div className={styles.brandFoot}>
          <ShieldCheck size={18} strokeWidth={2.5} />
          Acesso protegido por código de uso único
        </div>
      </aside>
      <main className={styles.formPanel}>
        <div className={`${styles.formInner} ${wide ? styles.formInnerWide : ''}`}>
          <div className={styles.mobileLogo}>
            <Logo size={34} />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
