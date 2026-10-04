import type { ReactNode } from 'react';
import styles from './Badge.module.scss';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'muted';
}

export function Badge({ children, variant = 'muted' }: Readonly<BadgeProps>) {
  const modifier = styles[`badge--${variant}`];

  return <span className={`${styles.badge} ${modifier}`}>{children}</span>;
}
