import { LoaderCircle } from 'lucide-react';
import styles from './LoadingOverlay.module.scss';

export interface LoadingOverlayProps {
  label?: string;
}

export function LoadingOverlay({ label = 'Načítání' }: Readonly<LoadingOverlayProps>) {
  return (
    <div className={styles.loadingOverlay} role="status" aria-label={label}>
      <LoaderCircle className={styles.loadingOverlay__spinner} aria-hidden="true" />
    </div>
  );
}
