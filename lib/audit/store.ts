import { randomUUID } from 'crypto';

import { OWNERS } from '@/lib/documents/owners';

import {
  AUDIT_ACTION_LABELS,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SEVERITY,
} from './constants';
import { SEED_AUDIT_EVENTS } from './seed';
import type {
  AuditEvent,
  AuditQuery,
  AuditQueryResult,
  AuditRecordInput,
} from './types';

function resolveUser(userId: string) {
  const owner = Object.values(OWNERS).find((o) => o.id === userId);
  if (owner) {
    return {
      userName: owner.name,
      userInitials: owner.initials,
      userAvatarColor: owner.avatarColor,
    };
  }
  if (userId === 'system') {
    return {
      userName: 'System Automator',
      userInitials: 'SA',
      userAvatarColor: '#6b7280',
    };
  }
  return {
    userName: 'Unknown User',
    userInitials: '??',
    userAvatarColor: '#9ca3af',
  };
}

function formatActionLabel(
  actionType: AuditRecordInput['actionType'],
  metadata?: Record<string, unknown>,
): string {
  const base = AUDIT_ACTION_LABELS[actionType];
  if (
    (actionType === 'document.version' ||
      actionType === 'document.version_upload') &&
    metadata?.version
  ) {
    return `Created Version v${metadata.version}`;
  }
  if (actionType === 'document.version_restore' && metadata?.restoredVersion) {
    return `Restored Version v${metadata.restoredVersion}`;
  }
  return base;
}

class AuditStore {
  private events: AuditEvent[] = [...SEED_AUDIT_EVENTS];

  record(input: AuditRecordInput): AuditEvent {
    const profile = resolveUser(input.userId);
    const severity = input.severity ?? DEFAULT_SEVERITY[input.actionType];
    const event: AuditEvent = {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      userId: input.userId,
      ...profile,
      action: formatActionLabel(input.actionType, input.metadata),
      actionType: input.actionType,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      resourceLabel: input.resourceLabel,
      resourceCount: input.resourceCount,
      ip: input.ip ?? '127.0.0.1',
      location: input.location ?? 'Local',
      severity,
      metadata: input.metadata ?? {},
    };

    this.events.unshift(event);
    return event;
  }

  query(query: AuditQuery = {}): AuditQueryResult {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(
      100,
      Math.max(1, query.pageSize ?? DEFAULT_PAGE_SIZE),
    );

    let filtered = [...this.events];

    if (query.dateRange && query.dateRange !== 'all') {
      const cutoff = this.dateRangeCutoff(query.dateRange);
      filtered = filtered.filter(
        (e) => new Date(e.timestamp).getTime() >= cutoff.getTime(),
      );
    }

    if (query.eventType && query.eventType !== 'all') {
      filtered = filtered.filter((e) => e.actionType === query.eventType);
    }

    if (query.userId && query.userId !== 'all') {
      filtered = filtered.filter((e) => e.userId === query.userId);
    }

    if (query.severity && query.severity !== 'all') {
      filtered = filtered.filter((e) => e.severity === query.severity);
    }

    filtered.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;

    return {
      events: filtered.slice(start, start + pageSize),
      pagination: { page, pageSize, total, totalPages },
    };
  }

  getRecent(limit = 5): AuditEvent[] {
    return this.query({ page: 1, pageSize: limit, dateRange: 'all' }).events;
  }

  getDistinctUsers(): { id: string; name: string }[] {
    const seen = new Map<string, string>();
    for (const event of this.events) {
      if (!seen.has(event.userId)) {
        seen.set(event.userId, event.userName);
      }
    }
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }

  private dateRangeCutoff(range: NonNullable<AuditQuery['dateRange']>): Date {
    const now = Date.now();
    const ms =
      range === '24h'
        ? 24 * 60 * 60 * 1000
        : range === '7d'
          ? 7 * 24 * 60 * 60 * 1000
          : 30 * 24 * 60 * 60 * 1000;
    return new Date(now - ms);
  }
}

const globalForAudit = globalThis as unknown as { auditStore?: AuditStore };

export const auditStore = globalForAudit.auditStore ?? new AuditStore();

if (process.env.NODE_ENV !== 'production') {
  globalForAudit.auditStore = auditStore;
}

export function recordAuditEvent(input: AuditRecordInput): AuditEvent {
  return auditStore.record(input);
}

export function queryAuditEvents(query: AuditQuery): AuditQueryResult {
  return auditStore.query(query);
}

export function getRecentAuditEvents(limit = 5): AuditEvent[] {
  return auditStore.getRecent(limit);
}

export function getAuditUsers(): { id: string; name: string }[] {
  return auditStore.getDistinctUsers();
}

/** In-memory index keys for timestamp, userId, actionType, severity */
export const AUDIT_INDEX_KEYS = [
  'timestamp',
  'userId',
  'actionType',
  'severity',
] as const;
