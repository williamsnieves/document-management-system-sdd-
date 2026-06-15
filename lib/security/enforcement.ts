import { getSecurityPolicy } from './store';
import type { AuthUser } from '@/lib/auth/types';
import { isGlobalAdmin } from '@/lib/roles/hasPermission';

export function validateSessionTimeout(lastActiveTime: number): boolean {
  const policy = getSecurityPolicy();
  const now = Date.now();
  const inactiveMinutes = (now - lastActiveTime) / (1000 * 60);
  
  return inactiveMinutes <= policy.inactivityTimeoutMin;
}

export function validateMaxSessionDuration(sessionStartTime: number): boolean {
  const policy = getSecurityPolicy();
  const now = Date.now();
  const sessionHours = (now - sessionStartTime) / (1000 * 60 * 60);
  
  return sessionHours <= policy.maxSessionHours;
}

export function requiresTwoFactor(user: AuthUser): boolean {
  const policy = getSecurityPolicy();
  if (!policy.twoFactorRequired) {
    return false;
  }
  
  // Enforce for admin roles
  return isGlobalAdmin(user);
}

export function isIpWhitelisted(clientIp: string): boolean {
  const policy = getSecurityPolicy();
  if (policy.ipWhitelist.length === 0) {
    return true; // If no whitelist is configured, allow all
  }
  
  // Simple exact match for now, in a real app this would check CIDR ranges
  return policy.ipWhitelist.some(entry => entry.range === clientIp);
}
