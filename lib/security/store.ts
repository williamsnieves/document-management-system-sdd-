import { randomUUID } from 'crypto';
import type { SecurityPolicy } from './types';

const defaultPolicy: SecurityPolicy = {
  twoFactorRequired: false,
  inactivityTimeoutMin: 15,
  maxSessionHours: 8,
  encryptionEnabled: true,
  lastKeyRotation: new Date().toISOString(),
  ipWhitelist: [],
  ssoProviders: [
    {
      id: 'okta-1',
      type: 'okta',
      status: 'active',
      name: 'Okta',
      description: 'SAML 2.0 Endpoint',
    },
    {
      id: 'azure-1',
      type: 'azure-ad',
      status: 'configurable',
      name: 'Azure AD',
      description: 'OIDC Configuration',
    },
  ],
};

class SecurityStore {
  private policy: SecurityPolicy = { ...defaultPolicy };

  getPolicy(): SecurityPolicy {
    return { ...this.policy };
  }

  updatePolicy(updates: Partial<SecurityPolicy>): SecurityPolicy {
    this.policy = { ...this.policy, ...updates };
    return this.getPolicy();
  }

  rotateKeys(): SecurityPolicy {
    this.policy.lastKeyRotation = new Date().toISOString();
    return this.getPolicy();
  }
}

const globalForSecurity = globalThis as unknown as { securityStore?: SecurityStore };

export const securityStore = globalForSecurity.securityStore ?? new SecurityStore();

if (process.env.NODE_ENV !== 'production') {
  globalForSecurity.securityStore = securityStore;
}

export function getSecurityPolicy(): SecurityPolicy {
  return securityStore.getPolicy();
}

export function updateSecurityPolicy(updates: Partial<SecurityPolicy>): SecurityPolicy {
  return securityStore.updatePolicy(updates);
}

export function rotateEncryptionKeys(): SecurityPolicy {
  return securityStore.rotateKeys();
}
