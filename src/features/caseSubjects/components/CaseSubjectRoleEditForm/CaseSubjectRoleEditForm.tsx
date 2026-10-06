import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SelectField } from '../../../../shared/components/SelectField/SelectField.tsx';
import type { SelectOption } from '../../../../shared/components/SelectField/SelectField.tsx';
import { CASE_SUBJECT_ROLE_OPTIONS } from '../../constants/caseSubjectLabels.ts';
import { caseSubjectRoleEditFormSchema } from '../../schemas/caseSubjectRoleEditForm.schema.ts';
import type {
  CaseSubjectRoleEditFormInput,
  CaseSubjectRoleEditFormValues,
} from '../../schemas/caseSubjectRoleEditForm.schema.ts';
import styles from './CaseSubjectRoleEditForm.module.scss';

export interface CaseSubjectRoleEditFormProps {
  formId: string;
  defaultValues: CaseSubjectRoleEditFormInput;
  proceduralRoleOptions: SelectOption[];
  materialLegalRoleOptions: SelectOption[];
  onSave: (values: CaseSubjectRoleEditFormValues) => void;
}

export function CaseSubjectRoleEditForm({
  formId,
  defaultValues,
  proceduralRoleOptions,
  materialLegalRoleOptions,
  onSave,
}: Readonly<CaseSubjectRoleEditFormProps>) {
  const { register, handleSubmit, formState } = useForm<
    CaseSubjectRoleEditFormInput,
    unknown,
    CaseSubjectRoleEditFormValues
  >({ resolver: zodResolver(caseSubjectRoleEditFormSchema), defaultValues });

  return (
    <form
      id={formId}
      className={styles.caseSubjectRoleEditForm}
      onSubmit={(event) => void handleSubmit(onSave)(event)}
      noValidate
    >
      <SelectField
        label="Role"
        registration={register('role')}
        options={CASE_SUBJECT_ROLE_OPTIONS}
        error={formState.errors.role?.message}
      />
      <SelectField
        label="Procesní role"
        registration={register('proceduralRole')}
        options={proceduralRoleOptions}
        hasEmptyOption
      />
      <SelectField
        label="Hmotně právní role"
        registration={register('materialLegalRole')}
        options={materialLegalRoleOptions}
        hasEmptyOption
      />
    </form>
  );
}
