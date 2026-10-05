import { Search } from 'lucide-react';
import { useId } from 'react';
import { FieldError } from '../../../../shared/components/FieldError/FieldError.tsx';
import styles from './SubjectPickerField.module.scss';

export interface SubjectPickerFieldProps {
  label: string;
  value?: string;
  placeholder: string;
  onClick: () => void;
  error?: string;
  disabled?: boolean;
}

export function SubjectPickerField({
  label,
  value,
  placeholder,
  onClick,
  error,
  disabled = false,
}: Readonly<SubjectPickerFieldProps>) {
  const id = useId();
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const errorId = `${id}-error`;

  return (
    <div className={styles.subjectPickerField}>
      <span id={labelId} className={styles.subjectPickerField__label}>
        {label}
      </span>
      <button
        type="button"
        className={`${styles.subjectPickerField__control} ${error ? styles['subjectPickerField__control--invalid'] : ''}`}
        aria-haspopup="dialog"
        aria-labelledby={`${labelId} ${valueId}`}
        aria-describedby={error ? errorId : undefined}
        disabled={disabled}
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
