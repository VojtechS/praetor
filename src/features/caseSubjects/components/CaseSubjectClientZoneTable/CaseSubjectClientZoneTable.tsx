import { Pencil } from 'lucide-react';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { checkValue } from '../../../../shared/utils/checkValue.ts';
import { CLIENT_ZONE_PERMISSION_LABELS } from '../../constants/clientZoneLabels.ts';
import type { ClientZoneUser } from '../../schemas/clientZoneUserForm.schema.ts';
import styles from './CaseSubjectClientZoneTable.module.scss';

export interface CaseSubjectClientZoneTableProps {
  users: ClientZoneUser[];
  subjectName: string | undefined;
  onEdit: (user: ClientZoneUser) => void;
}

export function CaseSubjectClientZoneTable({
  users,
  subjectName,
  onEdit,
}: Readonly<CaseSubjectClientZoneTableProps>) {
  return (
    <table className={styles.caseSubjectClientZoneTable}>
      <thead>
        <tr>
          <th scope="col">E-mail</th>
          <th scope="col">Název oprávnění</th>
          <th scope="col">Subjekt</th>
          <th scope="col">Poznámka</th>
          <th scope="col">
            <span className="visuallyHidden">Akce</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.email}</td>
            <td>{CLIENT_ZONE_PERMISSION_LABELS[user.permission]}</td>
            <td>{checkValue(subjectName)}</td>
            <td>{user.note || '-'}</td>
            <td className={styles.caseSubjectClientZoneTable__actions}>
              <Button
                variant="ghost"
                size="small"
                icon={Pencil}
                aria-label="Upravit uživatele"
                title="Upravit uživatele"
                onClick={() => onEdit(user)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
