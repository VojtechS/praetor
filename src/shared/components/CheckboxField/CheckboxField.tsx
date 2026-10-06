import { useId } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import styles from './CheckboxField.module.scss';

export interface CheckboxFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  value?: string;
  isLabelHidden?: boolean;
}

export function CheckboxField({
  label,
  registration,
  value,
  isLabelHidden = false,
}: Readonly<CheckboxFieldProps>) {
  const id = useId();

  return (
    <div className={styles.checkboxField}>
      <input
        id={id}
        type="checkbox"
        className={styles.checkboxField__control}
        value={value}
        {...registration}
      />
      <label
        htmlFor={id}
        className={isLabelHidden ? 'visuallyHidden' : styles.checkboxField__label}
      >
        {label}
      </label>
    </div>
  );
}
