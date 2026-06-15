import styles from './AppShell.module.css';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FloatingUploadButton } from './FloatingUploadButton';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>
          {children}
        </main>
        <FloatingUploadButton />
      </div>
    </div>
  );
}
