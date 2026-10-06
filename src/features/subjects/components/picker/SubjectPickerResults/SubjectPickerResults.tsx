import type { ReactNode } from 'react';
import { LoadingOverlay } from '../../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import styles from './SubjectPickerResults.module.scss';

function formatRecordCount(count: number): string {
  if (count === 1) {
    return '1 záznam';
  }

  return count >= 2 && count <= 4 ? `${count} záznamy` : `${count} záznamů`;
}

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
        {sourceLabel} <span className={styles.subjectPickerResults__separator}>·</span>{' '}
        {formatRecordCount(count)}
      </p>
      <div className={styles.subjectPickerResults__table} aria-busy={isLoading}>
        {isLoading && <LoadingOverlay label="Načítání výsledků" />}
        {content}
      </div>
    </div>
  );
}
