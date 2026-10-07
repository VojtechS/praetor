import clsx from 'clsx';
import { useId } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { FieldError } from '../FieldError/FieldError.tsx';
import styles from './TextField.module.scss';

export interface TextFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  type?: 'text' | 'date' | 'password';
  placeholder?: string;
  isLabelHidden?: boolean;
  isRequired?: boolean;
  disabled?: boolean;
}

export function TextField({
  label,
  registration,
  error,
  type = 'text',
  placeholder,
  isLabelHidden = false,
  isRequired = false,
  disabled = false,
}: Readonly<TextFieldProps>) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={styles.textField}>
      <label
        htmlFor={id}
        className={
          isLabelHidden
            ? 'visuallyHidden'
            : clsx(styles.textField__label, isRequired && styles['textField__label--required'])
        }
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={styles.textField__control}
        aria-required={isRequired}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        disabled={disabled}
        {...registration}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
