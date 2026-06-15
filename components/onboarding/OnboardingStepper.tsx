import styles from './UserOnboarding.module.css';

interface StepperProps {
  currentStep: 'welcome' | 'compliance' | 'training' | 'launch';
}

const STEPS = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'training', label: 'Training' },
  { id: 'launch', label: 'Launch' },
];

export function OnboardingStepper({ currentStep }: StepperProps) {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className={styles.stepper}>
      <div className={styles.stepperLine} />
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        
        return (
          <div key={step.id} className={styles.step}>
            <div className={`${styles.stepCircle} ${isActive ? styles.stepCircleActive : ''} ${isCompleted ? styles.stepCircleCompleted : ''}`}>
              {isCompleted ? '✓' : index + 1}
            </div>
            <div className={`${styles.stepLabel} ${isActive || isCompleted ? styles.stepLabelActive : ''}`}>
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
