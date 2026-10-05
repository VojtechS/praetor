import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { SelectOption } from '../../../../shared/components/SelectField/SelectField.tsx';
import { useSubjectQuery } from '../../../subjects/hooks/useSubjectQueries.ts';
import { getSubjectDisplayName } from '../../../subjects/utils/subjectUtils.ts';
import { caseSubjectFormSchema } from '../../schemas/caseSubjectForm.schema.ts';
import type {
  CaseSubjectFormInput,
  CaseSubjectFormValues,
} from '../../schemas/caseSubjectForm.schema.ts';
import {
  selectClearPickedSubject,
  selectPickedSubject,
  selectPicker,
  selectTogglePicker,
  useCaseSubjectsUiStore,
} from '../../store/useCaseSubjectsUiStore.ts';
import { CaseSubjectRoleFields } from '../CaseSubjectRoleFields/CaseSubjectRoleFields.tsx';
import { CaseSubjectRoleTabs } from '../CaseSubjectRoleTabs/CaseSubjectRoleTabs.tsx';

export interface CaseSubjectRoleFormProps {
  formId: string;
  defaultValues: Partial<CaseSubjectFormInput>;
  proceduralRoleOptions: SelectOption[];
  materialLegalRoleOptions: SelectOption[];
  isEdit: boolean;
  onSave: (values: CaseSubjectFormValues) => void;
}

export function CaseSubjectRoleForm({
  formId,
  defaultValues,
  proceduralRoleOptions,
  materialLegalRoleOptions,
  isEdit,
  onSave,
}: Readonly<CaseSubjectRoleFormProps>) {
  const picker = useCaseSubjectsUiStore(selectPicker);
  const togglePicker = useCaseSubjectsUiStore(selectTogglePicker);
  const pickedSubject = useCaseSubjectsUiStore(selectPickedSubject);
  const clearPickedSubject = useCaseSubjectsUiStore(selectClearPickedSubject);
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
        setValue('preferredContactIds', []);
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
        isEdit={isEdit}
        openPickerTarget={picker?.target}
        onPickSubject={() => togglePicker('subject')}
        onPickRepresentative={() => togglePicker('representative')}
      />
      <CaseSubjectRoleTabs
        contacts={subject?.contacts ?? []}
        registration={register('preferredContactIds')}
        hasSubject={!!subjectId}
      />
    </form>
  );
}
