import { Plus } from 'lucide-react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import type { SubjectForm } from '../../schemas/subjectForm.schema.ts';
import { canLookupDataBox } from '../../utils/subjectUtils.ts';
import { SubjectConnectionRows } from '../SubjectConnectionRows/SubjectConnectionRows.tsx';
import { SubjectDataBoxField } from '../SubjectDataBoxField/SubjectDataBoxField.tsx';
import { SubjectFormSection } from '../SubjectFormSection/SubjectFormSection.tsx';
import styles from './SubjectConnections.module.scss';

export interface SubjectConnectionsProps {
  form: SubjectForm;
}

export function SubjectConnections({ form }: Readonly<SubjectConnectionsProps>) {
  const type = useWatch({ control: form.control, name: 'type' });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'connections' });

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
      <div className={styles.subjectConnections}>
        <SubjectDataBoxField form={form} canLookup={canLookupDataBox(type)} />
        {fields.length === 0 ? (
          <p className="emptyState">Žádná spojení</p>
        ) : (
          <SubjectConnectionRows form={form} fields={fields} onRemove={remove} />
        )}
      </div>
    </SubjectFormSection>
  );
}
