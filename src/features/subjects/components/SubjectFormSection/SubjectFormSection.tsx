import type { ReactNode } from 'react';
import styles from './SubjectFormSection.module.scss';

export interface SubjectFormSectionProps {
  title: string;
  children: ReactNode;
}

export function SubjectFormSection({ title, children }: Readonly<SubjectFormSectionProps>) {
  return (
    <section className={styles.subjectFormSection}>
      <h3 className={styles.subjectFormSection__title}>{title}</h3>
      {children}
    </section>
  );
}
