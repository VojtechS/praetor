import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './CaseSubjectDetailSection.module.scss';

export interface CaseSubjectDetailSectionProps {
  title: string;
  count?: number;
  isOpen?: boolean;
  children: ReactNode;
}

export function CaseSubjectDetailSection({
  title,
  count,
  isOpen = false,
  children,
}: Readonly<CaseSubjectDetailSectionProps>) {
  return (
    <details className={styles.caseSubjectDetailSection} open={isOpen}>
      <summary className={styles.caseSubjectDetailSection__summary}>
        {count === undefined ? title : `${title} · ${count}`}
        <ChevronDown className={styles.caseSubjectDetailSection__icon} aria-hidden="true" />
      </summary>
      <div className={styles.caseSubjectDetailSection__body}>{children}</div>
    </details>
  );
}
