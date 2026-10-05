import { Plus, Search } from 'lucide-react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { Button } from '../../../../../shared/components/Button/Button.tsx';
import { TextField } from '../../../../../shared/components/TextField/TextField.tsx';
import { useDataBoxLookupMutation } from '../../../hooks/queries/useAresQueries.ts';
import { DATA_BOX_ID_PATTERN } from '../../../schemas/subjectForm.schema.ts';
import type { SubjectForm } from '../../../schemas/subjectForm.schema.ts';
import { hasEconomicSubject } from '../../../utils/subjectUtils.ts';
import { SubjectFormSection } from '../../card/SubjectFormSection/SubjectFormSection.tsx';
import { SubjectContactsTable } from '../SubjectContactsTable/SubjectContactsTable.tsx';
import styles from './SubjectContactsFields.module.scss';

export interface SubjectContactsFieldsProps {
  form: SubjectForm;
}

export function SubjectContactsFields({ form }: Readonly<SubjectContactsFieldsProps>) {
  const type = useWatch({ control: form.control, name: 'type' });

  const dataBoxId = useWatch({ control: form.control, name: 'dataBoxId' });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'contacts' });

  const lookupMutation = useDataBoxLookupMutation();

  const canSearch =
    dataBoxId !== '' && DATA_BOX_ID_PATTERN.test(dataBoxId) && !lookupMutation.isPending;

  function addContact() {
    append(
      { type: 'PHONE', value: '', note: '', isPreferred: false },
      { focusName: `contacts.${fields.length}.value` },
    );
  }

  return (
    <SubjectFormSection
      title="Kontakty"
      action={
        <Button icon={Plus} onClick={addContact}>
          Přidat kontakt
        </Button>
      }
    >
      <div className={styles.subjectContactsFields}>
        <div className={styles.subjectContactsFields__dataBox}>
          <TextField
            label="ID datové schránky"
            registration={form.register('dataBoxId')}
            error={form.formState.errors.dataBoxId?.message}
          />
          {hasEconomicSubject(type) && (
            <Button
              icon={Search}
              disabled={!canSearch}
              onClick={() => lookupMutation.mutate(dataBoxId)}
            >
              Vyhledat
            </Button>
          )}
        </div>
        {fields.length === 0 ? (
          <p className="emptyState">Žádné kontakty</p>
        ) : (
          <SubjectContactsTable form={form} fields={fields} onRemove={remove} />
        )}
      </div>
    </SubjectFormSection>
  );
}
