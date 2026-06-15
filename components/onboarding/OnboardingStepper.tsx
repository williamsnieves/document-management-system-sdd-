import styles from './UserOnboarding.module.css';

interface StepperProps {
  currentStep: 'welcome' | 'compliance' | 'training' | 'launch';
}

const STEPS = [
  { id: 'welcome', label: 'Welcome', sub: 'Dynamic Header' },
  { id: 'compliance', label: 'Compliance', sub: '3 Documents' },
  { id: 'training', label: 'Training', sub: '2 Modules' },
  { id: 'launch', label: 'Launch', sub: 'Dashboard Access' },
] as const;

export function OnboardingStepper({ currentStep }: StepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className={styles.stepper}>
      <div className={styles.stepperTrack} />
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;

        return (
          <div key={step.id} className={styles.step}>
            <div
              className={`${styles.stepMarker} ${isActive ? styles.stepMarkerActive : ''} ${isCompleted ? styles.stepMarkerDone : ''}`}
            >
              {isCompleted ? '✓' : index + 1}
            </div>
            <div
              className={`${styles.stepLabel} ${isActive || isCompleted ? styles.stepLabelActive : ''}`}
            >
              {step.label}
            </div>
            <div className={styles.stepSub}>{step.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
