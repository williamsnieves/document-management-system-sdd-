import type { Owner } from './types';

export const OWNERS: Record<string, Owner> = {
  'user-james-doe': {
    id: 'user-james-doe',
    name: 'James Doe',
    initials: 'JD',
    avatarColor: '#2563eb',
  },
  'user-maria-rodriguez': {
    id: 'user-maria-rodriguez',
    name: 'Maria Rodriguez',
    initials: 'MR',
    avatarColor: '#7c3aed',
  },
  'user-sarah-chen': {
    id: 'user-sarah-chen',
    name: 'Sarah Chen',
    initials: 'SC',
    avatarColor: '#0891b2',
  },
  'user-admin': {
    id: 'user-admin',
    name: 'Admin User',
    initials: 'AU',
    avatarColor: '#374151',
  },
};
