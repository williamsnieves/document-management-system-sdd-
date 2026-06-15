import type { WorkflowInstance } from '@/lib/approvals/types';
import styles from './WorkflowProgressBar.module.css';

interface WorkflowProgressBarProps {
  workflow: WorkflowInstance;
}

export function WorkflowProgressBar({ workflow }: WorkflowProgressBarProps) {
  const totalSteps = workflow.steps.length;
  const completedSteps = Math.max(0, workflow.currentStep - 1);
  const progressPercent =
    workflow.status === 'approved'
      ? 100
      : Math.round((completedSteps / totalSteps) * 100);

  const currentStepLabel =
    workflow.steps.find((step) => step.order === workflow.currentStep)?.label ??
    workflow.steps[workflow.currentStep - 1]?.label ??
    'Complete';

  const previousStepLabel =
    workflow.currentStep > 1
      ? workflow.steps.find((step) => step.order === workflow.currentStep - 1)
          ?.label
      : null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>Workflow Progress</h3>
        <span className={styles.stepBadge}>
          Step {Math.min(workflow.currentStep, totalSteps)} of {totalSteps}
        </span>
      </div>

      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className={styles.labels}>
        {previousStepLabel && (
          <span className={styles.completedLabel}>
            {previousStepLabel} Complete
          </span>
        )}
        {workflow.status !== 'approved' && (
          <span className={styles.currentLabel}>{currentStepLabel}</span>
        )}
        {workflow.status === 'approved' && (
          <span className={styles.completedLabel}>All Steps Complete</span>
        )}
      </div>
    </section>
  );
}
