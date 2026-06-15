'use client';

import { Button } from '@base-ui/react/button';
import type { SecurityPolicy } from '@/lib/security/types';
import styles from './Card.module.css';

interface Props {
  policy: SecurityPolicy;
}

export function SsoCard({ policy }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Single Sign-On (SSO)</h2>
        <p className={styles.description}>Manage identity providers.</p>
      </div>
      <div className={styles.content}>
        <div className={styles.providerList}>
          {policy.ssoProviders.map((provider) => (
            <div key={provider.id} className={styles.providerItem}>
              <div className={styles.providerInfo}>
                <h3 className={styles.providerName}>{provider.name}</h3>
                <p className={styles.providerDesc}>{provider.description}</p>
              </div>
              <span
                className={`${styles.badge} ${
                  provider.status === 'active' ? styles.badgeActive : styles.badgeConfigurable
                }`}
              >
                {provider.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        <Button className={styles.actionButton}>
          Manage Custom SAML Provider
        </Button>
      </div>
    </div>
  );
}
