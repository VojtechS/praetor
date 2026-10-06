import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../../../shared/components/Button/Button.tsx';
import { Dialog } from '../../../../../shared/components/Dialog/Dialog.tsx';
import { LoadingOverlay } from '../../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import { useCodelistQuery } from '../../../../codelists/hooks/useCodelistQuery.ts';
import { toSelectOptions } from '../../../../codelists/utils/codelistUtils.ts';
import { addressRowSchema } from '../../../schemas/subjectForm.schema.ts';
import type { AddressFormInput, AddressFormValues } from '../../../schemas/subjectForm.schema.ts';
import { AddressFields } from '../AddressFields/AddressFields.tsx';

export interface AddressDialogProps {
  isEdit: boolean;
  defaultValues: AddressFormInput;
  onSave: (values: AddressFormValues) => void;
  onClose: () => void;
}

export function AddressDialog({
  isEdit,
  defaultValues,
  onSave,
  onClose,
}: Readonly<AddressDialogProps>) {
  const form = useForm<AddressFormInput, unknown, AddressFormValues>({
    resolver: zodResolver(addressRowSchema),
    defaultValues,
  });
  const countries = useCodelistQuery('countries').data;

  return (
    <Dialog
      isOpen
      title={isEdit ? 'Úprava adresy' : 'Založení nové adresy'}
      size="md"
      onClose={onClose}
      footer={
        <Button variant="success" icon={Save} onClick={() => void form.handleSubmit(onSave)()}>
          Uložit
        </Button>
      }
    >
      {countries ? (
        <AddressFields form={form} countryOptions={toSelectOptions(countries)} />
      ) : (
        <LoadingOverlay label="Načítání číselníků" />
      )}
    </Dialog>
  );
}
