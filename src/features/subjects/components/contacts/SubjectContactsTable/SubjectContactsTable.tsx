import { Trash2 } from 'lucide-react';
import type { UseFieldArrayReturn } from 'react-hook-form';
import { Button } from '../../../../../shared/components/Button/Button.tsx';
import { CheckboxField } from '../../../../../shared/components/CheckboxField/CheckboxField.tsx';
import { SelectField } from '../../../../../shared/components/SelectField/SelectField.tsx';
import { TextField } from '../../../../../shared/components/TextField/TextField.tsx';
import { CONTACT_TYPE_OPTIONS } from '../../../constants/subjectLabels.ts';
import type { SubjectForm, SubjectFormInput } from '../../../schemas/subjectForm.schema.ts';
import styles from './SubjectContactsTable.module.scss';

export interface SubjectContactsTableProps {
  form: SubjectForm;
  fields: UseFieldArrayReturn<SubjectFormInput, 'contacts'>['fields'];
  onRemove: (index: number) => void;
}

export function SubjectContactsTable({
  form,
  fields,
  onRemove,
}: Readonly<SubjectContactsTableProps>) {
  const { register, formState } = form;

  return (
    <table className={styles.subjectContactsTable}>
      <thead>
        <tr>
          <th scope="col">Kontakt</th>
          <th scope="col">Typ kontaktu</th>
          <th scope="col">Pref.</th>
          <th scope="col">
            <span className="visuallyHidden">Odebrat</span>
          </th>
        </tr>
      </thead>
      {fields.map((field, index) => (
        <tbody key={field.id} className={styles.subjectContactsTable__contact}>
          <tr>
            <td>
              <TextField
                label={`Kontakt ${index + 1}`}
                registration={register(`contacts.${index}.value`)}
                error={formState.errors.contacts?.[index]?.value?.message}
                isLabelHidden
              />
            </td>
            <td>
              <SelectField
                label={`Typ kontaktu ${index + 1}`}
                registration={register(`contacts.${index}.type`)}
                options={CONTACT_TYPE_OPTIONS}
                isLabelHidden
              />
            </td>
            <td>
              <CheckboxField
                label={`Preferované ${index + 1}`}
                registration={register(`contacts.${index}.isPreferred`)}
                isLabelHidden
              />
            </td>
            <td>
              <Button
                variant="danger"
                size="small"
                icon={Trash2}
                aria-label="Odebrat kontakt"
                title="Odebrat kontakt"
                onClick={() => onRemove(index)}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <TextField
                label={`Poznámka ${index + 1}`}
                registration={register(`contacts.${index}.note`)}
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
