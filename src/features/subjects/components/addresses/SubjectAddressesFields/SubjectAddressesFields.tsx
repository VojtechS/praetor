import { Plus } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFieldArray } from 'react-hook-form';
import { Button } from '../../../../../shared/components/Button/Button.tsx';
import { useCodelistQuery } from '../../../../codelists/hooks/useCodelistQuery.ts';
import type { AddressFormValues, SubjectForm } from '../../../schemas/subjectForm.schema.ts';
import { getNewAddressDefaults } from '../../../utils/subjectFormMapper.ts';
import { AddressDialog } from '../AddressDialog/AddressDialog.tsx';
import { SubjectAddressesTable } from '../SubjectAddressesTable/SubjectAddressesTable.tsx';
import { SubjectFormSection } from '../../card/SubjectFormSection/SubjectFormSection.tsx';

export interface SubjectAddressesFieldsProps {
  form: SubjectForm;
  isReadOnly: boolean;
}

export function SubjectAddressesFields({
  form,
  isReadOnly,
}: Readonly<SubjectAddressesFieldsProps>) {
  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: 'addresses',
  });
  const countries = useCodelistQuery('countries').data;
  const [dialog, setDialog] = useState<{ index: number | null } | null>(null);

  function handleSave(index: number | null, values: AddressFormValues) {
    if (index === null) {
      append(values);
    } else {
      update(index, values);
    }

    setDialog(null);
  }

  return (
    <SubjectFormSection
      title="Adresy"
      action={
        isReadOnly ? undefined : (
          <Button icon={Plus} onClick={() => setDialog({ index: null })}>
            Přidat adresu
          </Button>
        )
      }
    >
      {fields.length === 0 ? (
        <p className="emptyState">Žádné adresy</p>
      ) : (
        <SubjectAddressesTable
          fields={fields}
          countries={countries}
          isReadOnly={isReadOnly}
          onEdit={(index) => setDialog({ index })}
          onRemove={remove}
        />
      )}

      {dialog &&
        createPortal(
          <AddressDialog
            isOpen
            isEdit={dialog.index !== null}
            defaultValues={dialog.index === null ? getNewAddressDefaults() : fields[dialog.index]}
            onSave={(values) => handleSave(dialog.index, values)}
            onClose={() => setDialog(null)}
          />,
          document.body,
        )}
    </SubjectFormSection>
  );
}
