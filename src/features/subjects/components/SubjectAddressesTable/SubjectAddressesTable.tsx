import { Trash2 } from 'lucide-react';
import type { FieldArrayWithId } from 'react-hook-form';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import type { CodelistItem } from '../../../codelists/api/codelistApi.types.ts';
import { getCodelistLabel } from '../../../codelists/utils/codelistUtils.ts';
import type { SubjectFormInput } from '../../schemas/subjectForm.schema.ts';
import { formatAddress, getAddressTypeNote } from '../../utils/addressUtils.ts';
import styles from './SubjectAddressesTable.module.scss';

export interface SubjectAddressesTableProps {
  fields: FieldArrayWithId<SubjectFormInput, 'addresses'>[];
  countries: CodelistItem[] | undefined;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export function SubjectAddressesTable({
  fields,
  countries,
  onEdit,
  onRemove,
}: Readonly<SubjectAddressesTableProps>) {
  return (
    <table className={styles.subjectAddressesTable__table}>
      <thead>
        <tr>
          <th scope="col">Adresa</th>
          <th scope="col">Poznámka</th>
          <th scope="col">
            <span className="visuallyHidden">Odebrat</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field, index) => (
          <tr key={field.id} className={styles.subjectAddressesTable__row}>
            <td>
              <button
                type="button"
                className={styles.subjectAddressesTable__edit}
                onClick={() => onEdit(index)}
              >
                {formatAddress({ ...field, country: getCodelistLabel(countries, field.country) })}
              </button>
            </td>
            <td>{getAddressTypeNote(field)}</td>
            <td className={styles.subjectAddressesTable__remove}>
              <Button
                variant="danger"
                size="small"
                icon={Trash2}
                aria-label="Odebrat adresu"
                title="Odebrat adresu"
                onClick={() => onRemove(index)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
