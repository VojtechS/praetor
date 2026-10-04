import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { subjectFormSchema } from '../../schemas/subjectForm.schema.ts';
import type { SubjectFormInput, SubjectFormValues } from '../../schemas/subjectForm.schema.ts';
import { hasEconomicSubject, hasLegalForm, hasPhysicalPerson } from '../../utils/subjectUtils.ts';
import { SubjectAddresses } from '../SubjectAddresses/SubjectAddresses.tsx';
import { SubjectBasicFields } from '../SubjectBasicFields/SubjectBasicFields.tsx';
import { SubjectConnections } from '../SubjectConnections/SubjectConnections.tsx';
import { SubjectEconomicFields } from '../SubjectEconomicFields/SubjectEconomicFields.tsx';
import { SubjectPersonFields } from '../SubjectPersonFields/SubjectPersonFields.tsx';
import styles from './SubjectCardForm.module.scss';

export interface SubjectCardFormProps {
  formId: string;
  defaultValues: SubjectFormInput;
  onSave: (values: SubjectFormValues) => void;
}

export function SubjectCardForm({ formId, defaultValues, onSave }: Readonly<SubjectCardFormProps>) {
  const form = useForm<SubjectFormInput, unknown, SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues,
  });
  const type = useWatch({ control: form.control, name: 'type' });

  return (
    <form id={formId} onSubmit={(event) => void form.handleSubmit(onSave)(event)} noValidate>
      <div className={styles.subjectCardForm}>
        <div className={styles.subjectCardForm__column}>
          <SubjectBasicFields form={form} />
          {hasEconomicSubject(type) && (
            <SubjectEconomicFields form={form} hasLegalForm={hasLegalForm(type)} />
          )}
          {hasPhysicalPerson(type) && <SubjectPersonFields form={form} />}
        </div>
        <div className={styles.subjectCardForm__column}>
          <SubjectAddresses form={form} />
          <SubjectConnections form={form} />
        </div>
      </div>
    </form>
  );
}
