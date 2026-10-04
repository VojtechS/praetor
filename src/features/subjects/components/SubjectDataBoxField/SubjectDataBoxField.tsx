import { Search } from 'lucide-react';
import { useWatch } from 'react-hook-form';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { TextField } from '../../../../shared/components/TextField/TextField.tsx';
import { useDataBoxLookupMutation } from '../../hooks/useAresQueries.ts';
import type { SubjectForm } from '../../schemas/subjectForm.schema.ts';
import styles from './SubjectDataBoxField.module.scss';

const DATA_BOX_ID_PATTERN = /^[A-Za-z0-9]{7}$/;

export interface SubjectDataBoxFieldProps {
  form: SubjectForm;
  canLookup: boolean;
}

export function SubjectDataBoxField({ form, canLookup }: Readonly<SubjectDataBoxFieldProps>) {
  const dataBoxId = useWatch({ control: form.control, name: 'dataBoxId' });
  const lookupMutation = useDataBoxLookupMutation();
  const canSearch = DATA_BOX_ID_PATTERN.test(dataBoxId ?? '') && !lookupMutation.isPending;

  return (
    <div className={styles.subjectDataBoxField}>
      <TextField
        label="ID datové schránky"
        registration={form.register('dataBoxId')}
        error={form.formState.errors.dataBoxId?.message}
      />
      {canLookup && (
        <Button
          icon={Search}
          disabled={!canSearch}
          onClick={() => lookupMutation.mutate(dataBoxId ?? '')}
        >
          Vyhledat
        </Button>
      )}
    </div>
  );
}
