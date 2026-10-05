import { Plus, Search } from 'lucide-react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { Button } from '../../../../../shared/components/Button/Button.tsx';
import { TextField } from '../../../../../shared/components/TextField/TextField.tsx';
import { useDataBoxLookupMutation } from '../../../hooks/useAresQueries.ts';
import type { SubjectForm } from '../../../schemas/subjectForm.schema.ts';
import { hasEconomicSubject } from '../../../utils/subjectUtils.ts';
import { SubjectFormSection } from '../../card/SubjectFormSection/SubjectFormSection.tsx';
import { SubjectConnectionsTable } from '../SubjectConnectionsTable/SubjectConnectionsTable.tsx';
import styles from './SubjectConnectionsFields.module.scss';

const DATA_BOX_ID_PATTERN = /^[A-Za-z0-9]{7}$/;

export interface SubjectConnectionsFieldsProps {
  form: SubjectForm;
}

export function SubjectConnectionsFields({ form }: Readonly<SubjectConnectionsFieldsProps>) {
  const type = useWatch({ control: form.control, name: 'type' });
  const dataBoxId = useWatch({ control: form.control, name: 'dataBoxId' });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'connections' });
  const lookupMutation = useDataBoxLookupMutation();
  const canSearch = DATA_BOX_ID_PATTERN.test(dataBoxId ?? '') && !lookupMutation.isPending;

  function addConnection() {
    append(
      { type: 'PHONE', value: '', note: '', isPreferred: false },
      { focusName: `connections.${fields.length}.value` },
    );
  }

  return (
    <SubjectFormSection
      title="Spojení"
      action={
        <Button icon={Plus} onClick={addConnection}>
          Přidat spojení
        </Button>
      }
    >
      <div className={styles.subjectConnectionsFields}>
        <div className={styles.subjectConnectionsFields__dataBox}>
          <TextField
            label="ID datové schránky"
            registration={form.register('dataBoxId')}
            error={form.formState.errors.dataBoxId?.message}
          />
          {hasEconomicSubject(type) && (
            <Button
              icon={Search}
              disabled={!canSearch}
              onClick={() => lookupMutation.mutate(dataBoxId ?? '')}
            >
              Vyhledat
            </Button>
          )}
        </div>
        {fields.length === 0 ? (
          <p className="emptyState">Žádná spojení</p>
        ) : (
          <SubjectConnectionsTable form={form} fields={fields} onRemove={remove} />
        )}
      </div>
    </SubjectFormSection>
  );
}
