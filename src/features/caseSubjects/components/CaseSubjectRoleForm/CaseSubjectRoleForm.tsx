import { zodResolver } from '@hookform/resolvers/zod';
import type { SyntheticEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { SelectOption } from '../../../../shared/components/SelectField/SelectField.tsx';
import type { CaseSubject } from '../../api/caseSubjectApi/caseSubjectApi.types.ts';
import { useSubjectQuery } from '../../../subjects/hooks/queries/useSubjectQueries.ts';
import { getSubjectDisplayName } from '../../../subjects/utils/subjectUtils.ts';
import { caseSubjectFormSchema } from '../../schemas/caseSubjectForm.schema.ts';
import type {
  CaseSubjectFormInput,
  CaseSubjectFormValues,
} from '../../schemas/caseSubjectForm.schema.ts';
import {
  getCaseSubjectEditDefaults,
  NEW_CASE_SUBJECT_DEFAULTS,
} from '../../utils/caseSubjectUtils.ts';
import { CaseSubjectRoleFields } from '../CaseSubjectRoleFields/CaseSubjectRoleFields.tsx';
import { CaseSubjectRoleTabs } from '../CaseSubjectRoleTabs/CaseSubjectRoleTabs.tsx';

export interface CaseSubjectRoleFormProps {
  formId: string;
  proceduralRoleOptions: SelectOption[];
  materialLegalRoleOptions: SelectOption[];
  onSave: (values: CaseSubjectFormValues) => void;
  editedItem?: CaseSubject;
}

export function CaseSubjectRoleForm({
  formId,
  proceduralRoleOptions,
  materialLegalRoleOptions,
  onSave,
  editedItem,
}: Readonly<CaseSubjectRoleFormProps>) {
  const { register, handleSubmit, setValue, getValues, control, formState } = useForm<
    CaseSubjectFormInput,
    unknown,
    CaseSubjectFormValues
  >({
    resolver: zodResolver(caseSubjectFormSchema),
    defaultValues: editedItem ? getCaseSubjectEditDefaults(editedItem) : NEW_CASE_SUBJECT_DEFAULTS,
  });

  const subjectId: number | undefined = useWatch({ control, name: 'subjectId' });
  const representativeId = useWatch({ control, name: 'legalRepresentativeId' });

  const subjectQuery = useSubjectQuery(subjectId ?? 0);
  const representativeQuery = useSubjectQuery(representativeId ?? 0);

  const subject = subjectQuery.data?.data;
  const representative = representativeQuery.data?.data;
  const subjectName = subject && getSubjectDisplayName(subject);

  function handleChooseSubject(chosenId: number) {
    if (chosenId !== getValues('subjectId')) {
      setValue('preferredRelatedSubjectIds', []);
    }

    setValue('subjectId', chosenId, { shouldValidate: true });
  }

  function handleChooseRepresentative(chosenId: number | null) {
    setValue('legalRepresentativeId', chosenId, { shouldValidate: true });
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
        subjectName={subjectName}
        representativeName={representative && getSubjectDisplayName(representative)}
        proceduralRoleOptions={proceduralRoleOptions}
        materialLegalRoleOptions={materialLegalRoleOptions}
        onChooseSubject={handleChooseSubject}
        onChooseRepresentative={handleChooseRepresentative}
        isEditMode={!!editedItem}
      />
      <CaseSubjectRoleTabs
        relatedSubjects={subject?.relatedSubjects ?? []}
        registration={register('preferredRelatedSubjectIds')}
        hasSubject={!!subjectId}
        subjectName={subjectName}
      />
    </form>
  );
}
