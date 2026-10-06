import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { subjectFormSchema } from '../../../schemas/subjectForm.schema.ts';
import type { SubjectFormInput, SubjectFormValues } from '../../../schemas/subjectForm.schema.ts';
import {
  hasEconomicSubject,
  hasLegalForm,
  hasPhysicalPerson,
} from '../../../utils/subjectUtils.ts';
import { SubjectAddressesFields } from '../../addresses/SubjectAddressesFields/SubjectAddressesFields.tsx';
import { SubjectBasicFields } from '../SubjectBasicFields/SubjectBasicFields.tsx';
import { SubjectContactsFields } from '../../contacts/SubjectContactsFields/SubjectContactsFields.tsx';
import { SubjectEconomicFields } from '../SubjectEconomicFields/SubjectEconomicFields.tsx';
import { SubjectPersonFields } from '../SubjectPersonFields/SubjectPersonFields.tsx';
import styles from './SubjectCardForm.module.scss';

export interface SubjectCardFormProps {
  formId: string;
  defaultValues: SubjectFormInput;
  isReadOnly: boolean;
  onSave: (values: SubjectFormValues) => void;
}

export function SubjectCardForm({
  formId,
  defaultValues,
  isReadOnly,
  onSave,
}: Readonly<SubjectCardFormProps>) {
  const form = useForm<SubjectFormInput, unknown, SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues,
  });
  const type = useWatch({ control: form.control, name: 'type' });

  return (
    <form id={formId} onSubmit={(event) => void form.handleSubmit(onSave)(event)} noValidate>
      <fieldset className={styles.subjectCardForm__fieldset} disabled={isReadOnly}>
        <div className={styles.subjectCardForm}>
          <div className={styles.subjectCardForm__column}>
            <SubjectBasicFields form={form} isReadOnly={isReadOnly} />
            {hasEconomicSubject(type) && (
              <SubjectEconomicFields form={form} hasLegalForm={hasLegalForm(type)} />
            )}
            {hasPhysicalPerson(type) && <SubjectPersonFields form={form} isReadOnly={isReadOnly} />}
          </div>
          <div className={styles.subjectCardForm__column}>
            <SubjectAddressesFields form={form} isReadOnly={isReadOnly} />
            <SubjectContactsFields form={form} isReadOnly={isReadOnly} />
          </div>
        </div>
      </fieldset>
    </form>
  );
}
