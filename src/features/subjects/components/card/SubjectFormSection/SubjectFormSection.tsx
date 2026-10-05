import type { ReactNode } from 'react';
import styles from './SubjectFormSection.module.scss';

export interface SubjectFormSectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export function SubjectFormSection({ title, action, children }: Readonly<SubjectFormSectionProps>) {
  return (
    <section className={styles.subjectFormSection}>
      <div className={styles.subjectFormSection__header}>
        <h3 className={styles.subjectFormSection__title}>{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}
