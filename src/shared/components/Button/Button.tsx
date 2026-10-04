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
  const variantClass = styles[`button--${variant}`];
  const sizeClass = styles[`button--${size}`];
  const iconOnlyClass = children ? '' : styles['button--iconOnly'];

  return (
    <button
      type={type}
      className={`${styles.button} ${variantClass} ${sizeClass} ${iconOnlyClass}`}
      {...rest}
    >
      {Icon && <Icon className={styles.button__icon} aria-hidden="true" />}
      {children}
    </button>
  );
}
