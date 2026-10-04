import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: LucideIcon;
}

export function Button({
  variant = 'secondary',
  icon: Icon,
  type = 'button',
  children,
  ...rest
}: Readonly<ButtonProps>) {
  const modifier = styles[`button--${variant}`];

  return (
    <button type={type} className={`${styles.button} ${modifier}`} {...rest}>
      {Icon && <Icon className={styles.button__icon} aria-hidden="true" />}
      {children}
    </button>
  );
}
