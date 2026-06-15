export interface IpWhitelistEntry {
  id: string;
  range: string;
  label: string;
}

export interface SsoProviderConfig {
  id: string;
  type: 'okta' | 'azure-ad' | 'custom';
  status: 'active' | 'configurable';
  name: string;
  metadataUrl?: string;
  description?: string;
}

export interface SecurityPolicy {
  twoFactorRequired: boolean;
  inactivityTimeoutMin: number;
  maxSessionHours: number;
  encryptionEnabled: boolean;
  lastKeyRotation: string;
  ipWhitelist: IpWhitelistEntry[];
  ssoProviders: SsoProviderConfig[];
}
