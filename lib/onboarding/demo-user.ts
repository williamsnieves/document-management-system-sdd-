import type { AuthUser } from '@/lib/auth/types';
import { DEFAULT_ROLE_IDS } from '@/lib/roles/store';

/** Demo onboarding persona — Sarah Jenkins, Legal Counsel (screen09–12). */
export function getOnboardingUser(): AuthUser {
  return {
    id: 'user-sarah',
    email: 'sarah.jenkins@legalcorp.com',
    name: 'Sarah Jenkins',
    roleIds: [DEFAULT_ROLE_IDS.legalCounsel],
  };
}

export function getOnboardingFirstName(): string {
  return getOnboardingUser().name.split(' ')[0] ?? 'there';
}
