import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { Dialog } from '../../../../shared/components/Dialog/Dialog.tsx';
import { SelectField } from '../../../../shared/components/SelectField/SelectField.tsx';
import { TextField } from '../../../../shared/components/TextField/TextField.tsx';
import { CLIENT_ZONE_PERMISSION_OPTIONS } from '../../constants/clientZoneLabels.ts';
import { clientZoneUserFormSchema } from '../../schemas/clientZoneUserForm.schema.ts';
import type {
  ClientZoneUserFormInput,
  ClientZoneUserFormValues,
} from '../../schemas/clientZoneUserForm.schema.ts';
import styles from './CaseSubjectClientZoneDialog.module.scss';

export interface CaseSubjectClientZoneDialogProps {
  defaultValues: ClientZoneUserFormInput;
  onSave: (values: ClientZoneUserFormValues) => void;
  onClose: () => void;
}

export function CaseSubjectClientZoneDialog({
  defaultValues,
  onSave,
  onClose,
}: Readonly<CaseSubjectClientZoneDialogProps>) {
  const { register, handleSubmit, formState } = useForm<
    ClientZoneUserFormInput,
    unknown,
    ClientZoneUserFormValues
  >({
    resolver: zodResolver(clientZoneUserFormSchema),
    defaultValues,
  });
  const noteId = useId();

  return (
    <Dialog
      isOpen
      title="Klientská zóna"
      size="md"
      onClose={onClose}
      footer={
        <Button variant="success" icon={Save} onClick={() => void handleSubmit(onSave)()}>
          Uložit
        </Button>
      }
    >
      <div className={styles.caseSubjectClientZoneDialog}>
        <TextField
          label="Jméno"
          registration={register('name')}
          error={formState.errors.name?.message}
          isRequired
        />
        <TextField
          label="E-mail (login)"
          registration={register('email')}
          error={formState.errors.email?.message}
          isRequired
        />
        <TextField label="Telefon" registration={register('phone')} />
        <TextField label="Heslo" type="password" registration={register('password')} />
        <div className={styles.caseSubjectClientZoneDialog__note}>
          <label htmlFor={noteId} className={styles.caseSubjectClientZoneDialog__label}>
            Poznámka
          </label>
          <textarea
            id={noteId}
            className={styles.caseSubjectClientZoneDialog__control}
            rows={4}
            {...register('note')}
          />
        </div>
        <SelectField
          label="Oprávnění"
          registration={register('permission')}
          options={CLIENT_ZONE_PERMISSION_OPTIONS}
        />
      </div>
    </Dialog>
  );
}
