import styles from './CaseSubjectDetailRow.module.scss';

export interface CaseSubjectDetailRowProps {
  label: string;
  value: string;
}

export function CaseSubjectDetailRow({ label, value }: Readonly<CaseSubjectDetailRowProps>) {
  return (
    <div className={styles.caseSubjectDetailRow}>
      <dt className={styles.caseSubjectDetailRow__label}>{label}</dt>
      <dd className={styles.caseSubjectDetailRow__value}>{value}</dd>
    </div>
  );
}
