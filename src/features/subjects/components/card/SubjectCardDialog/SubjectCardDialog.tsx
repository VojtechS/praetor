import { Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../../../shared/components/Button/Button.tsx';
import { Dialog } from '../../../../../shared/components/Dialog/Dialog.tsx';
import { LoadingOverlay } from '../../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import { useSubjectCardDefaults } from '../../../hooks/useSubjectCardDefaults.ts';
import type { SubjectCardState } from '../../../hooks/useSubjectCardDefaults.ts';
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
} from '../../../hooks/queries/useSubjectQueries.ts';
import type { SubjectFormValues } from '../../../schemas/subjectForm.schema.ts';
import { mapFormToRequest } from '../../../utils/mapFormToRequest.ts';
import { getSubjectDisplayName } from '../../../utils/subjectUtils.ts';
import { SubjectAresSearch } from '../SubjectAresSearch/SubjectAresSearch.tsx';
import { SubjectCardForm } from '../SubjectCardForm/SubjectCardForm.tsx';

const SUBJECT_FORM_ID = 'subjectCardForm';

export interface SubjectCardDialogProps {
  subjectCard: SubjectCardState | null;
  onClose: () => void;
  onCreated?: (subjectId: number) => void;
}

export function SubjectCardDialog({
  subjectCard,
  onClose,
  onCreated,
}: Readonly<SubjectCardDialogProps>) {
  const [aresRegNumber, setAresRegNumber] = useState<string | null>(null);

  const createMutation = useCreateSubjectMutation();
  const updateMutation = useUpdateSubjectMutation();

  const { defaultValues, subject, formKey } = useSubjectCardDefaults(subjectCard, aresRegNumber);

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isReadOnly = subjectCard?.mode === 'view';
  const title =
    subject && subjectCard?.mode !== 'create' ? getSubjectDisplayName(subject) : 'Nový subjekt';

  function close() {
    setAresRegNumber(null);
    onClose();
  }

  function handleCreated(subjectId: number) {
    onCreated?.(subjectId);
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
      headerExtra={isReadOnly ? undefined : <SubjectAresSearch onSelect={setAresRegNumber} />}
      footer={
        isReadOnly ? undefined : (
          <Button
            type="submit"
            form={SUBJECT_FORM_ID}
            variant="success"
            icon={Save}
            disabled={isSaving}
          >
            Uložit
          </Button>
        )
      }
    >
      {defaultValues ? (
        <SubjectCardForm
          key={formKey}
          formId={SUBJECT_FORM_ID}
          defaultValues={defaultValues}
          isReadOnly={isReadOnly}
          onSave={handleSave}
        />
      ) : (
        <LoadingOverlay label="Načítání subjektu" />
      )}
    </Dialog>
  );
}
