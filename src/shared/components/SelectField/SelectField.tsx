import clsx from 'clsx';
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
  isLabelHidden?: boolean;
  isRequired?: boolean;
}

export function SelectField({
  label,
  registration,
  options,
  error,
  hasEmptyOption = false,
  isLabelHidden = false,
  isRequired = false,
}: Readonly<SelectFieldProps>) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={styles.selectField}>
      <label
        htmlFor={id}
        className={
          isLabelHidden
            ? 'visuallyHidden'
            : clsx(styles.selectField__label, isRequired && styles['selectField__label--required'])
        }
      >
        {label}
      </label>
      <select
        id={id}
        className={styles.selectField__control}
        aria-required={isRequired}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
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
