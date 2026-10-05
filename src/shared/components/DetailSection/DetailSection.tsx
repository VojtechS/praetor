import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './DetailSection.module.scss';

export interface DetailSectionProps {
  title: string;
  count?: number;
  isOpen?: boolean;
  children: ReactNode;
}

export function DetailSection({
  title,
  count,
  isOpen = false,
  children,
}: Readonly<DetailSectionProps>) {
  return (
    <details className={styles.detailSection} open={isOpen}>
      <summary className={styles.detailSection__summary}>
        {count === undefined ? title : `${title} · ${count}`}
        <ChevronDown className={styles.detailSection__icon} aria-hidden="true" />
      </summary>
      <div className={styles.detailSection__body}>{children}</div>
    </details>
  );
}
