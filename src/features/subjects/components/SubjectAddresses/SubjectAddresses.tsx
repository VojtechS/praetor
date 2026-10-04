import { Plus } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFieldArray } from 'react-hook-form';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { useCodelistQuery } from '../../../codelists/hooks/useCodelistQuery.ts';
import type { AddressFormValues, SubjectForm } from '../../schemas/subjectForm.schema.ts';
import { getNewAddressDefaults } from '../../utils/subjectFormMapper.ts';
import { AddressDialog } from '../AddressDialog/AddressDialog.tsx';
import { SubjectAddressesTable } from '../SubjectAddressesTable/SubjectAddressesTable.tsx';
import { SubjectFormSection } from '../SubjectFormSection/SubjectFormSection.tsx';

export interface SubjectAddressesProps {
  form: SubjectForm;
}

interface AddressDialogState {
  key: number;
  index: number | null;
  isOpen: boolean;
}

export function SubjectAddresses({ form }: Readonly<SubjectAddressesProps>) {
  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: 'addresses',
  });
  const countries = useCodelistQuery('countries').data;
  const [dialog, setDialog] = useState<AddressDialogState | null>(null);
  const editedIndex = dialog?.index ?? null;

  function openDialog(index: number | null) {
    setDialog((previous) => ({ key: (previous?.key ?? 0) + 1, index, isOpen: true }));
  }

  function closeDialog() {
    setDialog((previous) => previous && { ...previous, isOpen: false });
  }

  function handleSave(values: AddressFormValues) {
    if (editedIndex === null) {
      append(values);
    } else {
      update(editedIndex, values);
    }

    closeDialog();
  }

  const editedAddress = editedIndex === null ? undefined : fields[editedIndex];

  return (
    <SubjectFormSection
      title="Adresy"
      action={
        <Button icon={Plus} onClick={() => openDialog(null)}>
          Přidat adresu
        </Button>
      }
    >
      {fields.length === 0 ? (
        <p className="emptyState">Žádné adresy</p>
      ) : (
        <SubjectAddressesTable
          fields={fields}
          countries={countries}
          onEdit={openDialog}
          onRemove={remove}
        />
      )}
      {dialog &&
        createPortal(
          <AddressDialog
            key={dialog.key}
            isOpen={dialog.isOpen}
            isEdit={editedIndex !== null}
            defaultValues={editedAddress ?? getNewAddressDefaults()}
            onSave={handleSave}
            onClose={closeDialog}
          />,
          document.body,
        )}
    </SubjectFormSection>
  );
}
