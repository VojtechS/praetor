import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './Badge.module.scss';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'muted';
}

export function Badge({ children, variant = 'muted' }: Readonly<BadgeProps>) {
  return <span className={clsx(styles.badge, styles[`badge--${variant}`])}>{children}</span>;
}
