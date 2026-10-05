import { Trash2 } from 'lucide-react';
import type { UseFieldArrayReturn } from 'react-hook-form';
import { Button } from '../../../../../shared/components/Button/Button.tsx';
import { CheckboxField } from '../../../../../shared/components/CheckboxField/CheckboxField.tsx';
import { SelectField } from '../../../../../shared/components/SelectField/SelectField.tsx';
import { TextField } from '../../../../../shared/components/TextField/TextField.tsx';
import { CONNECTION_TYPE_OPTIONS } from '../../../constants/subjectLabels.ts';
import type { SubjectForm, SubjectFormInput } from '../../../schemas/subjectForm.schema.ts';
import styles from './SubjectConnectionsTable.module.scss';

export interface SubjectConnectionsTableProps {
  form: SubjectForm;
  fields: UseFieldArrayReturn<SubjectFormInput, 'connections'>['fields'];
  onRemove: (index: number) => void;
}

export function SubjectConnectionsTable({
  form,
  fields,
  onRemove,
}: Readonly<SubjectConnectionsTableProps>) {
  const { register, formState } = form;

  return (
    <table className={styles.subjectConnectionsTable}>
      <thead>
        <tr>
          <th scope="col">Spojení</th>
          <th scope="col">Typ spojení</th>
          <th scope="col">Pref.</th>
          <th scope="col">
            <span className="visuallyHidden">Odebrat</span>
          </th>
        </tr>
      </thead>
      {fields.map((field, index) => (
        <tbody key={field.id} className={styles.subjectConnectionsTable__connection}>
          <tr>
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
              <CheckboxField
                label={`Preferované ${index + 1}`}
                registration={register(`connections.${index}.isPreferred`)}
                isLabelHidden
              />
            </td>
            <td>
              <Button
                variant="danger"
                size="small"
                icon={Trash2}
                aria-label="Odebrat spojení"
                title="Odebrat spojení"
                onClick={() => onRemove(index)}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <TextField
                label={`Poznámka ${index + 1}`}
                registration={register(`connections.${index}.note`)}
                placeholder="Poznámka"
                isLabelHidden
              />
            </td>
          </tr>
        </tbody>
      ))}
    </table>
  );
}
