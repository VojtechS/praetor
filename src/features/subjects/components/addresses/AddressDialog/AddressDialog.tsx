import { zodResolver } from '@hookform/resolvers/zod';
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
  isOpen: boolean;
  isEdit: boolean;
  defaultValues: AddressFormInput;
  onSave: (values: AddressFormValues) => void;
  onClose: () => void;
}

// It has no <form> element on purpose: the dialog lives inside the subject card, so a nested
// form would submit the card. The parent mounts it again (new key) for every opening.
export function AddressDialog({
  isOpen,
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
      isOpen={isOpen}
      title={isEdit ? 'Úprava adresy' : 'Založení nové adresy'}
      size="md"
      onClose={onClose}
      footer={
        <>
          <Button variant="primary" onClick={() => void form.handleSubmit(onSave)()}>
            Uložit
          </Button>
          <Button onClick={onClose}>Storno</Button>
        </>
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
