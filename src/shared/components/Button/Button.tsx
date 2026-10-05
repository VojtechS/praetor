import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'default' | 'small';
  icon?: LucideIcon;
}

export function Button({
  variant = 'secondary',
  size = 'default',
  icon: Icon,
  type = 'button',
  children,
  ...rest
}: Readonly<ButtonProps>) {
  return (
    <button
      type={type}
      className={clsx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        !children && styles['button--iconOnly'],
      )}
      {...rest}
    >
      {Icon && <Icon className={styles.button__icon} aria-hidden="true" />}
      {children}
    </button>
  );
}
