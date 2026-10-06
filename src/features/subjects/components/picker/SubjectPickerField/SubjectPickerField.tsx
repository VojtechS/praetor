import clsx from 'clsx';
import { Search } from 'lucide-react';
import { useId } from 'react';
import { FieldError } from '../../../../../shared/components/FieldError/FieldError.tsx';
import styles from './SubjectPickerField.module.scss';

export interface SubjectPickerFieldProps {
  label: string;
  value?: string;
  placeholder: string;
  onClick: () => void;
  error?: string;
  isExpanded?: boolean;
  isRequired?: boolean;
}

export function SubjectPickerField({
  label,
  value,
  placeholder,
  onClick,
  error,
  isExpanded = false,
  isRequired = false,
}: Readonly<SubjectPickerFieldProps>) {
  const id = useId();
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const errorId = `${id}-error`;

  return (
    <div className={styles.subjectPickerField}>
      <span
        id={labelId}
        className={clsx(
          styles.subjectPickerField__label,
          isRequired && styles['subjectPickerField__label--required'],
        )}
      >
        {label}
      </span>
      <button
        type="button"
        className={clsx(
          styles.subjectPickerField__control,
          error && styles['subjectPickerField__control--invalid'],
        )}
        aria-expanded={isExpanded}
        aria-labelledby={`${labelId} ${valueId}`}
        aria-describedby={error ? errorId : undefined}
        onClick={onClick}
      >
        <span
          id={valueId}
          className={
            value ? styles.subjectPickerField__value : styles.subjectPickerField__placeholder
          }
        >
          {value ?? placeholder}
        </span>
        <Search className={styles.subjectPickerField__icon} aria-hidden="true" />
      </button>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
