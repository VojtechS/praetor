import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { LoadingOverlay } from '../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import { SelectField } from '../../../../shared/components/SelectField/SelectField.tsx';
import { TextField } from '../../../../shared/components/TextField/TextField.tsx';
import { useCodelistQuery } from '../../../codelists/hooks/useCodelistQuery.ts';
import { toSelectOptions } from '../../../codelists/utils/codelistUtils.ts';
import type { SubjectForm } from '../../schemas/subjectForm.schema.ts';
import styles from './SubjectDocumentRows.module.scss';

export interface SubjectDocumentRowsProps {
  form: SubjectForm;
}

export function SubjectDocumentRows({ form }: Readonly<SubjectDocumentRowsProps>) {
  const { register, control, formState } = form;
  const documentTypes = useCodelistQuery('document-types').data;
  const { fields, append, remove } = useFieldArray({ control, name: 'physicalPerson.documents' });
  const personErrors =
    'physicalPerson' in formState.errors ? formState.errors.physicalPerson : undefined;

  if (!documentTypes) {
    return <LoadingOverlay label="Načítání číselníků" />;
  }

  return (
    <div className={styles.subjectDocumentRows}>
      {fields.map((field, index) => (
        <div key={field.id} className={styles.subjectDocumentRows__row}>
          <TextField
            label="Číslo dokladu"
            registration={register(`physicalPerson.documents.${index}.number`)}
            error={personErrors?.documents?.[index]?.number?.message}
          />
          <SelectField
            label="Typ dokladu"
            registration={register(`physicalPerson.documents.${index}.type`)}
            options={toSelectOptions(documentTypes)}
            hasEmptyOption
          />
          <Button
            variant="danger"
            size="small"
            icon={Trash2}
            aria-label="Odebrat doklad"
            title="Odebrat doklad"
            onClick={() => remove(index)}
          />
        </div>
      ))}
      <div>
        <Button variant="ghost" icon={Plus} onClick={() => append({ number: '', type: '' })}>
          Přidat doklad
        </Button>
      </div>
    </div>
  );
}
