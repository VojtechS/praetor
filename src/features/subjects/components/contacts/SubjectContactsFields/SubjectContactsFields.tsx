import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { ConfirmDialog } from '../../../../../shared/components/ConfirmDialog/ConfirmDialog.tsx';
import { Button } from '../../../../../shared/components/Button/Button.tsx';
import type { SubjectForm } from '../../../schemas/subjectForm.schema.ts';
import { hasEconomicSubject } from '../../../utils/subjectUtils.ts';
import { SubjectFormSection } from '../../card/SubjectFormSection/SubjectFormSection.tsx';
import { SubjectDataBoxField } from '../SubjectDataBoxField/SubjectDataBoxField.tsx';
import { SubjectContactsTable } from '../SubjectContactsTable/SubjectContactsTable.tsx';
import styles from './SubjectContactsFields.module.scss';

export interface SubjectContactsFieldsProps {
  form: SubjectForm;
  isReadOnly: boolean;
}

export function SubjectContactsFields({ form, isReadOnly }: Readonly<SubjectContactsFieldsProps>) {
  const type = useWatch({ control: form.control, name: 'type' });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'contacts' });

  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const canLookup = hasEconomicSubject(type) && !isReadOnly;

  function addContact() {
    append(
      { type: 'PHONE', value: '', note: '', isPreferred: false },
      { focusName: `contacts.${fields.length}.value` },
    );
  }

  function handleConfirmRemove() {
    if (removeIndex !== null) {
      remove(removeIndex);
    }

    setRemoveIndex(null);
  }

  return (
    <SubjectFormSection title="Spojení">
      <div className={styles.subjectContactsFields}>
        {canLookup && <SubjectDataBoxField form={form} />}
        {fields.length === 0 ? (
          <p className="emptyState">Žádná spojení</p>
        ) : (
          <SubjectContactsTable
            form={form}
            fields={fields}
            isReadOnly={isReadOnly}
            onRemove={setRemoveIndex}
          />
        )}
        {!isReadOnly && (
          <div>
            <Button variant="ghost" icon={Plus} onClick={addContact}>
              Přidat spojení
            </Button>
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={removeIndex !== null}
        title="Smazání spojení"
        message="Opravdu chcete smazat spojení?"
        confirmLabel="Smazat"
        onConfirm={handleConfirmRemove}
        onCancel={() => setRemoveIndex(null)}
      />
    </SubjectFormSection>
  );
}
