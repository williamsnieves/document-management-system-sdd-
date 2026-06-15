export interface RequiredDocument {
  id: string;
  documentId: string;
  requirementType: 'e_signature' | 'read_confirmation';
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  isRequired: boolean;
  order: number;
}

export interface OnboardingConfig {
  roleId: string;
  welcomeHeadline: string;
  welcomeMessage: string;
  bannerUrl: string;
  requiredDocs: RequiredDocument[];
  trainingModules: TrainingModule[];
  publishedAt: string | null;
  updatedAt: string;
}

export interface DocumentCompletion {
  documentId: string;
  completedAt: string;
}

export interface ModuleProgress {
  moduleId: string;
  percentComplete: number;
}

export interface OnboardingProgress {
  userId: string;
  roleId: string;
  currentStep: 'welcome' | 'compliance' | 'training' | 'launch';
  completedDocs: DocumentCompletion[];
  moduleProgress: ModuleProgress[];
  completedAt: string | null;
  updatedAt: string;
}
