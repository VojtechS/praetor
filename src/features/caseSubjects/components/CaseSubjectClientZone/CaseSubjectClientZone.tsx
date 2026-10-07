import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import type {
  ClientZoneUser,
  ClientZoneUserFormValues,
} from '../../schemas/clientZoneUserForm.schema.ts';
import { CaseSubjectClientZoneDialog } from '../CaseSubjectClientZoneDialog/CaseSubjectClientZoneDialog.tsx';
import { CaseSubjectClientZoneTable } from '../CaseSubjectClientZoneTable/CaseSubjectClientZoneTable.tsx';
import styles from './CaseSubjectClientZone.module.scss';

const NEW_USER_DEFAULTS: ClientZoneUserFormValues = {
  name: '',
  email: '',
  phone: '',
  password: '',
  note: '',
  permission: 'FORBIDDEN',
};

export interface CaseSubjectClientZoneProps {
  subjectName: string | undefined;
}

export function CaseSubjectClientZone({ subjectName }: Readonly<CaseSubjectClientZoneProps>) {
  const [users, setUsers] = useState<ClientZoneUser[]>([]);
  const [dialog, setDialog] = useState<{ editedUser: ClientZoneUser | null } | null>(null);

  function handleSave(values: ClientZoneUserFormValues) {
    const editedId = dialog?.editedUser?.id;

    if (editedId) {
      setUsers(users.map((user) => (user.id === editedId ? { ...values, id: editedId } : user)));
    } else {
      setUsers([...users, { ...values, id: crypto.randomUUID() }]);
    }

    setDialog(null);
  }

  return (
    <div className={styles.caseSubjectClientZone}>
      <div className={styles.caseSubjectClientZone__header}>
        <Button icon={Plus} disabled={!subjectName} onClick={() => setDialog({ editedUser: null })}>
          Přidat uživatele
        </Button>
      </div>

      {users.length === 0 ? (
        <p className="emptyState">Žádní uživatelé klientské zóny</p>
      ) : (
        <CaseSubjectClientZoneTable
          users={users}
          subjectName={subjectName}
          onEdit={(editedUser) => setDialog({ editedUser })}
        />
      )}

      {dialog && (
        <CaseSubjectClientZoneDialog
          defaultValues={dialog.editedUser ?? NEW_USER_DEFAULTS}
          onSave={handleSave}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
