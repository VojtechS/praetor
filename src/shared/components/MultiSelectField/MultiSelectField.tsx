import { ChevronDown } from 'lucide-react';
import { useId } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { CheckboxField } from '../CheckboxField/CheckboxField.tsx';
import { FieldError } from '../FieldError/FieldError.tsx';
import type { SelectOption } from '../SelectField/SelectField.tsx';
import styles from './MultiSelectField.module.scss';

export interface MultiSelectFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  options: SelectOption[];
  selectedValues: string[];
  error?: string;
}

export function MultiSelectField({
  label,
  registration,
  options,
  selectedValues,
  error,
}: Readonly<MultiSelectFieldProps>) {
  const id = useId();
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label);

  return (
    <div className={styles.multiSelectField} role="group" aria-labelledby={labelId}>
      <span id={labelId} className={styles.multiSelectField__label}>
        {label}
      </span>
      <details className={styles.multiSelectField__details}>
        <summary
          className={styles.multiSelectField__summary}
          aria-describedby={error ? errorId : undefined}
        >
          <span className={styles.multiSelectField__selected}>{selectedLabels.join(', ')}</span>
          <ChevronDown className={styles.multiSelectField__icon} aria-hidden="true" />
        </summary>
        <div className={styles.multiSelectField__options}>
          {options.map((option) => (
            <CheckboxField
              key={option.value}
              label={option.label}
              value={option.value}
              registration={registration}
            />
          ))}
        </div>
      </details>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
