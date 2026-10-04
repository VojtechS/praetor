import type { ReactNode } from 'react';
import { LoadingOverlay } from '../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import { formatRecordCount } from '../../utils/subjectUtils.ts';
import styles from './SubjectPickerResults.module.scss';

export interface SubjectPickerResultsProps {
  sourceLabel: string;
  count: number;
  isLoading: boolean;
  isError: boolean;
  children: ReactNode;
}

export function SubjectPickerResults({
  sourceLabel,
  count,
  isLoading,
  isError,
  children,
}: Readonly<SubjectPickerResultsProps>) {
  let content = children;

  if (isError) {
    content = <p className="emptyState">Hledání se nezdařilo</p>;
  } else if (count === 0 && !isLoading) {
    content = <p className="emptyState">Žádné výsledky</p>;
  }

  return (
    <div>
      <p className={styles.subjectPickerResults__source}>
        {sourceLabel} · {formatRecordCount(count)}
      </p>
      <div className={styles.subjectPickerResults__table} aria-busy={isLoading}>
        {isLoading && <LoadingOverlay label="Načítání výsledků" />}
        {content}
      </div>
    </div>
  );
}
