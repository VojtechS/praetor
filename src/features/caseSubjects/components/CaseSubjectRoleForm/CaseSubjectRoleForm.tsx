import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { SelectOption } from '../../../../shared/components/SelectField/SelectField.tsx';
import { useSubjectQuery } from '../../../subjects/hooks/queries/useSubjectQueries.ts';
import { getSubjectDisplayName } from '../../../subjects/utils/subjectUtils.ts';
import { caseSubjectFormSchema } from '../../schemas/caseSubjectForm.schema.ts';
import type {
  CaseSubjectFormInput,
  CaseSubjectFormValues,
} from '../../schemas/caseSubjectForm.schema.ts';
import { useCaseSubjectsUiStore } from '../../store/useCaseSubjectsUiStore.ts';
import { CaseSubjectRoleFields } from '../CaseSubjectRoleFields/CaseSubjectRoleFields.tsx';
import { CaseSubjectRoleTabs } from '../CaseSubjectRoleTabs/CaseSubjectRoleTabs.tsx';

export interface CaseSubjectRoleFormProps {
  formId: string;
  defaultValues: Partial<CaseSubjectFormInput>;
  proceduralRoleOptions: SelectOption[];
  materialLegalRoleOptions: SelectOption[];
  onSave: (values: CaseSubjectFormValues) => void;
}

export function CaseSubjectRoleForm({
  formId,
  defaultValues,
  proceduralRoleOptions,
  materialLegalRoleOptions,
  onSave,
}: Readonly<CaseSubjectRoleFormProps>) {
  const picker = useCaseSubjectsUiStore((state) => state.picker);
  const togglePicker = useCaseSubjectsUiStore((state) => state.togglePicker);
  const pickedSubject = useCaseSubjectsUiStore((state) => state.pickedSubject);
  const clearPickedSubject = useCaseSubjectsUiStore((state) => state.clearPickedSubject);

  const { register, handleSubmit, setValue, getValues, control, formState } = useForm<
    CaseSubjectFormInput,
    unknown,
    CaseSubjectFormValues
  >({ resolver: zodResolver(caseSubjectFormSchema), defaultValues });

  const subjectId: number | undefined = useWatch({ control, name: 'subjectId' });
  const representativeId = useWatch({ control, name: 'legalRepresentativeId' });

  const subjectQuery = useSubjectQuery(subjectId ?? 0);
  const representativeQuery = useSubjectQuery(representativeId ?? 0);

  const subject = subjectQuery.data?.data;
  const representative = representativeQuery.data?.data;

  useEffect(() => {
    if (!pickedSubject) {
      return;
    }

    if (pickedSubject.target === 'representative') {
      setValue('legalRepresentativeId', pickedSubject.subjectId, { shouldValidate: true });
    } else if (pickedSubject.subjectId !== null) {
      if (pickedSubject.subjectId !== getValues('subjectId')) {
        setValue('preferredRelatedSubjectIds', []);
      }

      setValue('subjectId', pickedSubject.subjectId, { shouldValidate: true });
    }

    clearPickedSubject();
  }, [pickedSubject, setValue, getValues, clearPickedSubject]);

  return (
    <form id={formId} onSubmit={(event) => void handleSubmit(onSave)(event)} noValidate>
      <CaseSubjectRoleFields
        register={register}
        errors={formState.errors}
        subjectName={subject && getSubjectDisplayName(subject)}
        representativeName={representative && getSubjectDisplayName(representative)}
        proceduralRoleOptions={proceduralRoleOptions}
        materialLegalRoleOptions={materialLegalRoleOptions}
        openPickerTarget={picker}
        onPickSubject={() => togglePicker('subject')}
        onPickRepresentative={() => togglePicker('representative')}
      />
      <CaseSubjectRoleTabs
        relatedSubjects={subject?.relatedSubjects ?? []}
        registration={register('preferredRelatedSubjectIds')}
        hasSubject={!!subjectId}
      />
    </form>
  );
}
