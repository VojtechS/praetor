import styles from './DetailRow.module.scss';

export interface DetailRowProps {
  label: string;
  value: string;
}

export function DetailRow({ label, value }: Readonly<DetailRowProps>) {
  return (
    <div className={styles.detailRow}>
      <p className={styles.detailRow__label}>{label}</p>
      <p className={styles.detailRow__value}>{value}</p>
    </div>
  );
}
