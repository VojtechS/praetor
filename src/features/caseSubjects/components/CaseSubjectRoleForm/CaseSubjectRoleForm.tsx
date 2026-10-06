import { zodResolver } from '@hookform/resolvers/zod';
import type { SyntheticEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { SelectOption } from '../../../../shared/components/SelectField/SelectField.tsx';
import { useSubjectQuery } from '../../../subjects/hooks/queries/useSubjectQueries.ts';
import { getSubjectDisplayName } from '../../../subjects/utils/subjectUtils.ts';
import { caseSubjectFormSchema } from '../../schemas/caseSubjectForm.schema.ts';
import type {
  CaseSubjectFormInput,
  CaseSubjectFormValues,
} from '../../schemas/caseSubjectForm.schema.ts';
import { NEW_CASE_SUBJECT_DEFAULTS } from '../../utils/caseSubjectUtils.ts';
import { CaseSubjectRoleFields } from '../CaseSubjectRoleFields/CaseSubjectRoleFields.tsx';
import { CaseSubjectRoleTabs } from '../CaseSubjectRoleTabs/CaseSubjectRoleTabs.tsx';

type PickerTarget = 'subject' | 'representative';

export interface CaseSubjectRoleFormProps {
  formId: string;
  proceduralRoleOptions: SelectOption[];
  materialLegalRoleOptions: SelectOption[];
  onSave: (values: CaseSubjectFormValues) => void;
}

export function CaseSubjectRoleForm({
  formId,
  proceduralRoleOptions,
  materialLegalRoleOptions,
  onSave,
}: Readonly<CaseSubjectRoleFormProps>) {
  const { register, handleSubmit, setValue, getValues, control, formState } = useForm<
    CaseSubjectFormInput,
    unknown,
    CaseSubjectFormValues
  >({ resolver: zodResolver(caseSubjectFormSchema), defaultValues: NEW_CASE_SUBJECT_DEFAULTS });

  const subjectId: number | undefined = useWatch({ control, name: 'subjectId' });
  const representativeId = useWatch({ control, name: 'legalRepresentativeId' });

  const subjectQuery = useSubjectQuery(subjectId ?? 0);
  const representativeQuery = useSubjectQuery(representativeId ?? 0);

  const subject = subjectQuery.data?.data;
  const representative = representativeQuery.data?.data;

  function handleChoose(target: PickerTarget, chosenId: number | null) {
    if (target === 'representative') {
      setValue('legalRepresentativeId', chosenId, { shouldValidate: true });
    } else if (chosenId !== null) {
      if (chosenId !== getValues('subjectId')) {
        setValue('preferredRelatedSubjectIds', []);
      }

      setValue('subjectId', chosenId, { shouldValidate: true });
    }
  }

  function handleFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
    if (event.target !== event.currentTarget) {
      return;
    }

    void handleSubmit(onSave)(event);
  }

  return (
    <form id={formId} onSubmit={handleFormSubmit} noValidate>
      <CaseSubjectRoleFields
        register={register}
        errors={formState.errors}
        subjectName={subject && getSubjectDisplayName(subject)}
        representativeName={representative && getSubjectDisplayName(representative)}
        proceduralRoleOptions={proceduralRoleOptions}
        materialLegalRoleOptions={materialLegalRoleOptions}
        onChoose={handleChoose}
      />
      <CaseSubjectRoleTabs
        relatedSubjects={subject?.relatedSubjects ?? []}
        registration={register('preferredRelatedSubjectIds')}
        hasSubject={!!subjectId}
      />
    </form>
  );
}
