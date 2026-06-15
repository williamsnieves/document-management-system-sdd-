'use client';

import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import styles from './OnboardingShell.module.css';

interface OnboardingShellProps {
  children: React.ReactNode;
  showFooter?: boolean;
  userName?: string;
}

export function OnboardingShell({
  children,
  showFooter = true,
  userName = 'Sarah',
}: OnboardingShellProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>LexVault</span>
          <span className={styles.divider} />
          <span className={styles.sectionLabel}>ONBOARDING</span>
        </div>
        <div className={styles.headerRight}>
          <Link href="#" className={styles.supportLink}>
            <HelpCircle size={16} />
            Support
          </Link>
          <div className={styles.avatar} title={userName}>
            {userName.charAt(0)}
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      {showFooter && (
        <footer className={styles.footer}>
          <span>LexVault © 2024 Enterprise Document Management</span>
          <div className={styles.footerLinks}>
            <Link href="#">Need Help?</Link>
            <Link href="#">Contact Admin</Link>
            <Link href="#">Privacy Policy</Link>
          </div>
        </footer>
      )}
    </div>
  );
}
