import { OnboardingConfig, OnboardingProgress } from './types';
import { defaultLegalCounselConfig } from './seed';

// In-memory mock DB
let configs: Record<string, OnboardingConfig> = {
  [defaultLegalCounselConfig.roleId]: defaultLegalCounselConfig,
};

let progressRecords: Record<string, OnboardingProgress> = {}; // keyed by userId

export async function getOnboardingConfig(roleId: string): Promise<OnboardingConfig | null> {
  return configs[roleId] ?? configs[defaultLegalCounselConfig.roleId] ?? null;
}

export async function saveOnboardingConfig(roleId: string, config: Partial<OnboardingConfig>): Promise<OnboardingConfig> {
  const existing = configs[roleId] || {
    roleId,
    welcomeHeadline: 'Welcome',
    welcomeMessage: 'Please complete your onboarding.',
    bannerUrl: '',
    requiredDocs: [],
    trainingModules: [],
    publishedAt: null,
    updatedAt: new Date().toISOString()
  };

  const updated: OnboardingConfig = {
    ...existing,
    ...config,
    roleId,
    updatedAt: new Date().toISOString()
  };

  configs[roleId] = updated;
  return updated;
}

export async function publishOnboardingConfig(roleId: string): Promise<OnboardingConfig> {
  const config = configs[roleId];
  if (!config) throw new Error('Config not found');
  
  config.publishedAt = new Date().toISOString();
  config.updatedAt = new Date().toISOString();
  configs[roleId] = config;
  return config;
}

export async function getOnboardingProgress(userId: string): Promise<OnboardingProgress | null> {
  return progressRecords[userId] || null;
}

export async function initializeOnboardingProgress(userId: string, roleId: string): Promise<OnboardingProgress> {
  if (!progressRecords[userId]) {
    progressRecords[userId] = {
      userId,
      roleId,
      currentStep: 'welcome',
      completedDocs: [],
      moduleProgress: [],
      completedAt: null,
      updatedAt: new Date().toISOString()
    };
  }
  return progressRecords[userId];
}

export async function updateOnboardingProgress(userId: string, update: Partial<OnboardingProgress>): Promise<OnboardingProgress> {
  const existing = progressRecords[userId];
  if (!existing) throw new Error('Progress not found');

  const updated: OnboardingProgress = {
    ...existing,
    ...update,
    updatedAt: new Date().toISOString()
  };
  
  progressRecords[userId] = updated;
  return updated;
}
