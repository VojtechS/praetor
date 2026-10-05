import { useState } from 'react';
import { Button } from '../../../../../shared/components/Button/Button.tsx';
import { Dialog } from '../../../../../shared/components/Dialog/Dialog.tsx';
import { LoadingOverlay } from '../../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import {
  selectCloseSubjectCard,
  selectSetPickedSubject,
  selectSubjectCard,
  useCaseSubjectsUiStore,
} from '../../../../caseSubjects/store/useCaseSubjectsUiStore.ts';
import { useSubjectCardDefaults } from '../../../hooks/useSubjectCardDefaults.ts';
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
} from '../../../hooks/useSubjectQueries.ts';
import type { SubjectFormValues } from '../../../schemas/subjectForm.schema.ts';
import { mapFormToRequest } from '../../../utils/mapFormToRequest.ts';
import { getSubjectDisplayName } from '../../../utils/subjectUtils.ts';
import { SubjectAresSearch } from '../SubjectAresSearch/SubjectAresSearch.tsx';
import { SubjectCardForm } from '../SubjectCardForm/SubjectCardForm.tsx';

const SUBJECT_FORM_ID = 'subjectCardForm';

export function SubjectCardDialog() {
  const subjectCard = useCaseSubjectsUiStore(selectSubjectCard);
  const closeSubjectCard = useCaseSubjectsUiStore(selectCloseSubjectCard);
  const setPickedSubject = useCaseSubjectsUiStore(selectSetPickedSubject);
  const [aresRegNumber, setAresRegNumber] = useState<string | null>(null);
  const createMutation = useCreateSubjectMutation();
  const updateMutation = useUpdateSubjectMutation();
  const { defaultValues, subject, formKey } = useSubjectCardDefaults(subjectCard, aresRegNumber);

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const title =
    subject && subjectCard?.mode === 'edit' ? getSubjectDisplayName(subject) : 'Nový subjekt';

  function close() {
    setAresRegNumber(null);
    closeSubjectCard();
  }

  // A subject created from the picker is handed back to the field the picker was opened from.
  function handleCreated(subjectId: number) {
    if (subjectCard?.returnTarget) {
      setPickedSubject(subjectCard.returnTarget, subjectId);
    }

    close();
  }

  function handleSave(values: SubjectFormValues) {
    const request = mapFormToRequest(values);

    if (subjectCard?.mode === 'edit' && subjectCard.subjectId !== null) {
      updateMutation.mutate({ id: subjectCard.subjectId, request }, { onSuccess: close });
    } else {
      createMutation.mutate(request, { onSuccess: (response) => handleCreated(response.data.id) });
    }
  }

  return (
    <Dialog
      isOpen={subjectCard !== null}
      title={title}
      size="xl"
      isFocusedOnOpen
      onClose={close}
      headerExtra={<SubjectAresSearch onSelect={setAresRegNumber} />}
      footer={
        <>
          <Button type="submit" form={SUBJECT_FORM_ID} variant="primary" disabled={isSaving}>
            Uložit
          </Button>
          <Button onClick={close}>Storno</Button>
        </>
      }
    >
      {defaultValues ? (
        <SubjectCardForm
          key={formKey}
          formId={SUBJECT_FORM_ID}
          defaultValues={defaultValues}
          onSave={handleSave}
        />
      ) : (
        <LoadingOverlay label="Načítání subjektu" />
      )}
    </Dialog>
  );
}
