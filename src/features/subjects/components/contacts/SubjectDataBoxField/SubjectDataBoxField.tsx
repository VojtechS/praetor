import { Search } from 'lucide-react';
import { useFormState, useWatch } from 'react-hook-form';
import { Button } from '../../../../../shared/components/Button/Button.tsx';
import { TextField } from '../../../../../shared/components/TextField/TextField.tsx';
import { useDataBoxLookupMutation } from '../../../hooks/queries/useAresQueries.ts';
import { DATA_BOX_ID_PATTERN } from '../../../schemas/subjectForm.schema.ts';
import type { SubjectForm } from '../../../schemas/subjectForm.schema.ts';
import styles from './SubjectDataBoxField.module.scss';

export interface SubjectDataBoxFieldProps {
  form: SubjectForm;
}

export function SubjectDataBoxField({ form }: Readonly<SubjectDataBoxFieldProps>) {
  const { errors } = useFormState({ control: form.control });

  const dataBoxId = useWatch({ control: form.control, name: 'dataBoxId' });

  const lookupMutation = useDataBoxLookupMutation();

  const canSearch =
    dataBoxId !== '' && DATA_BOX_ID_PATTERN.test(dataBoxId) && !lookupMutation.isPending;

  function handleClear() {
    form.setValue('dataBoxId', '', { shouldDirty: true });
  }

  return (
    <div>
      <div className={styles.subjectDataBoxField}>
        <TextField
          label="ID datové schránky"
          registration={form.register('dataBoxId')}
          error={errors.dataBoxId?.message}
          onClear={dataBoxId === '' ? undefined : handleClear}
        />
        <Button
          icon={Search}
          disabled={!canSearch}
          onClick={() => lookupMutation.mutate(dataBoxId)}
        >
          Vyhledat
        </Button>
      </div>
      {!canSearch && !lookupMutation.isPending && (
        <p className={styles.subjectDataBoxField__hint}>
          Pro vyhledání zadejte ID datové schránky o 7 znacích (zadáno {dataBoxId.length}).
        </p>
      )}
    </div>
  );
}
