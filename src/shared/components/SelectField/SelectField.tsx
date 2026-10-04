import { useId } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { FieldError } from '../FieldError/FieldError.tsx';
import styles from './SelectField.module.scss';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  options: SelectOption[];
  error?: string;
  hasEmptyOption?: boolean;
  disabled?: boolean;
}

export function SelectField({
  label,
  registration,
  options,
  error,
  hasEmptyOption = false,
  disabled = false,
}: Readonly<SelectFieldProps>) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={styles.selectField}>
      <label htmlFor={id} className={styles.selectField__label}>
        {label}
      </label>
      <select
        id={id}
        className={styles.selectField__control}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        disabled={disabled}
        {...registration}
      >
        {hasEmptyOption && <option value=""></option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
