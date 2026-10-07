import { useId } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { FieldError } from '../FieldError/FieldError.tsx';
import styles from './TextAreaField.module.scss';

export interface TextAreaFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  rows?: number;
}

export function TextAreaField({
  label,
  registration,
  error,
  rows = 3,
}: Readonly<TextAreaFieldProps>) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={styles.textAreaField}>
      <label htmlFor={id} className={styles.textAreaField__label}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={styles.textAreaField__control}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...registration}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
