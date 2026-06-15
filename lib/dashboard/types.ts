import type { FileType } from '@/lib/documents/types';

export interface MetricValue {
  value: number | string;
  delta?: string;
  urgentLabel?: string;
}

export interface StorageMetric {
  usedLabel: string;
  totalLabel: string;
  percentUsed: number;
  usedBytes: number;
  totalBytes: number;
}

export interface DashboardMetrics {
  totalDocuments: MetricValue;
  pendingApprovals: MetricValue;
  storage: StorageMetric;
}

export type DashboardActivityActionType =
  | 'new'
  | 'version'
  | 'uploaded'
  | 'conflict'
  | 'approved'
  | 'resolved'
  | 'edit';

export interface DashboardActivityRow {
  id: string;
  documentId: string;
  documentName: string;
  fileType: FileType;
  classificationTags: string[];
  action: string;
  actionType: DashboardActivityActionType;
  userName: string;
  timestamp: string;
}

export interface LifecycleMilestone {
  version: string;
  label: string;
  status: 'complete' | 'current' | 'pending' | 'conflict';
}

export interface FeaturedDocument {
  id: string;
  name: string;
  milestones: LifecycleMilestone[];
}

export interface SystemStatus {
  operational: boolean;
  encryption: 'active' | 'inactive';
  blockchainAudit: 'verified' | 'pending' | 'failed';
}

export interface DashboardOverview {
  statusDate: string;
  metrics: DashboardMetrics;
  recentActivity: DashboardActivityRow[];
  systemStatus: SystemStatus;
  featuredDocument: FeaturedDocument | null;
}
