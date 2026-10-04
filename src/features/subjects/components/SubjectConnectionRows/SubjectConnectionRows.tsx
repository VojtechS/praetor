import { Trash2 } from 'lucide-react';
import type { UseFieldArrayReturn } from 'react-hook-form';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { CheckboxField } from '../../../../shared/components/CheckboxField/CheckboxField.tsx';
import { SelectField } from '../../../../shared/components/SelectField/SelectField.tsx';
import { TextField } from '../../../../shared/components/TextField/TextField.tsx';
import { CONNECTION_TYPE_OPTIONS } from '../../constants/subjectLabels.ts';
import type { SubjectForm, SubjectFormInput } from '../../schemas/subjectForm.schema.ts';
import styles from './SubjectConnectionRows.module.scss';

export interface SubjectConnectionRowsProps {
  form: SubjectForm;
  fields: UseFieldArrayReturn<SubjectFormInput, 'connections'>['fields'];
  onRemove: (index: number) => void;
}

// The labels are hidden, the column headers describe the cells.
export function SubjectConnectionRows({
  form,
  fields,
  onRemove,
}: Readonly<SubjectConnectionRowsProps>) {
  const { register, formState } = form;

  return (
    <table className={styles.subjectConnectionRows}>
      <thead>
        <tr>
          <th scope="col">Spojení</th>
          <th scope="col">Typ spojení</th>
          <th scope="col">Poznámka</th>
          <th scope="col">Pref.</th>
          <th scope="col">
            <span className="visuallyHidden">Odebrat</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field, index) => (
          <tr key={field.id}>
            <td>
              <TextField
                label={`Spojení ${index + 1}`}
                registration={register(`connections.${index}.value`)}
                error={formState.errors.connections?.[index]?.value?.message}
                isLabelHidden
              />
            </td>
            <td>
              <SelectField
                label={`Typ spojení ${index + 1}`}
                registration={register(`connections.${index}.type`)}
                options={CONNECTION_TYPE_OPTIONS}
                isLabelHidden
              />
            </td>
            <td>
              <TextField
                label={`Poznámka ${index + 1}`}
                registration={register(`connections.${index}.note`)}
                isLabelHidden
              />
            </td>
            <td>
              <CheckboxField
                label={`Preferované ${index + 1}`}
                registration={register(`connections.${index}.isPreferred`)}
                isLabelHidden
              />
            </td>
            <td>
              <Button
                variant="ghost"
                icon={Trash2}
                aria-label="Odebrat spojení"
                title="Odebrat spojení"
                onClick={() => onRemove(index)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
