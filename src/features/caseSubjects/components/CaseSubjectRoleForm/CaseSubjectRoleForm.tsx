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
  selectOpenPicker,
  selectPickedSubject,
  useCaseSubjectsUiStore,
} from '../../store/useCaseSubjectsUiStore.ts';
import { CaseSubjectContactsChecklist } from '../CaseSubjectContactsChecklist/CaseSubjectContactsChecklist.tsx';
import { CaseSubjectRoleFields } from '../CaseSubjectRoleFields/CaseSubjectRoleFields.tsx';

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
  const openPicker = useCaseSubjectsUiStore(selectOpenPicker);
  const pickedSubject = useCaseSubjectsUiStore(selectPickedSubject);
  const clearPickedSubject = useCaseSubjectsUiStore(selectClearPickedSubject);
  const { register, handleSubmit, setValue, getValues, control, formState } = useForm<
    CaseSubjectFormInput,
    unknown,
    CaseSubjectFormValues
  >({ resolver: zodResolver(caseSubjectFormSchema), defaultValues });

  // Undefined until the user picks a subject of a new case subject, the query skips id 0.
  const subjectId: number | undefined = useWatch({ control, name: 'subjectId' });
  const representativeId = useWatch({ control, name: 'legalRepresentativeId' });
  const subjectQuery = useSubjectQuery(subjectId ?? 0);
  const representativeQuery = useSubjectQuery(representativeId ?? 0);
  const subject = subjectQuery.data?.data;
  const representative = representativeQuery.data?.data;

  // The picker stores its result in the UI store, the form takes it over and clears it.
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
        onPickSubject={() => openPicker('subject')}
        onPickRepresentative={() => openPicker('representative')}
      />
      <CaseSubjectContactsChecklist
        contacts={subject?.contacts ?? []}
        registration={register('preferredContactIds')}
        hasSubject={!!subjectId}
      />
    </form>
  );
}
