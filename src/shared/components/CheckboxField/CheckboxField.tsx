import { useId } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { FieldError } from '../FieldError/FieldError.tsx';
import styles from './CheckboxField.module.scss';

export interface CheckboxFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  value?: string;
  error?: string;
  isLabelHidden?: boolean;
  disabled?: boolean;
}

export function CheckboxField({
  label,
  registration,
  value,
  error,
  isLabelHidden = false,
  disabled = false,
}: Readonly<CheckboxFieldProps>) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={styles.checkboxField}>
      <div className={styles.checkboxField__row}>
        <input
          id={id}
          type="checkbox"
          className={styles.checkboxField__control}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          disabled={disabled}
          {...registration}
        />
        <label
          htmlFor={id}
          className={isLabelHidden ? 'visuallyHidden' : styles.checkboxField__label}
        >
          {label}
        </label>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
