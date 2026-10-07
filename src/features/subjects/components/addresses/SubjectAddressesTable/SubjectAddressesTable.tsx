import { Pencil, Trash2 } from 'lucide-react';
import type { FieldArrayWithId } from 'react-hook-form';
import { Button } from '../../../../../shared/components/Button/Button.tsx';
import type { CodelistItem } from '../../../../codelists/api/codelistApi/codelistApi.types.ts';
import { getCodelistLabel } from '../../../../codelists/utils/codelistUtils.ts';
import type { SubjectFormInput } from '../../../schemas/subjectForm.schema.ts';
import { formatAddress } from '../../../utils/addressUtils.ts';
import styles from './SubjectAddressesTable.module.scss';

export interface SubjectAddressesTableProps {
  fields: FieldArrayWithId<SubjectFormInput, 'addresses'>[];
  countries: CodelistItem[] | undefined;
  isReadOnly: boolean;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export function SubjectAddressesTable({
  fields,
  countries,
  isReadOnly,
  onEdit,
  onRemove,
}: Readonly<SubjectAddressesTableProps>) {
  return (
    <table className={styles.subjectAddressesTable__table}>
      <thead>
        <tr>
          <th scope="col">Adresa</th>
          {!isReadOnly && (
            <th scope="col">
              <span className="visuallyHidden">Akce</span>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {fields.map((field, index) => (
          <tr key={field.id}>
            <td>
              <button
                type="button"
                className={styles.subjectAddressesTable__edit}
                onClick={() => onEdit(index)}
              >
                {formatAddress({ ...field, country: getCodelistLabel(countries, field.country) })}
              </button>
            </td>
            {!isReadOnly && (
              <td className={styles.subjectAddressesTable__actions}>
                <Button
                  variant="ghost"
                  size="small"
                  icon={Pencil}
                  aria-label="Upravit adresu"
                  title="Upravit adresu"
                  onClick={() => onEdit(index)}
                />
                <Button
                  variant="danger"
                  size="small"
                  icon={Trash2}
                  aria-label="Odebrat adresu"
                  title="Odebrat adresu"
                  onClick={() => onRemove(index)}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
