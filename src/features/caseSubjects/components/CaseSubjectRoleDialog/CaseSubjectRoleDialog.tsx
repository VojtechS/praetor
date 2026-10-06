import { Save } from 'lucide-react';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { Dialog } from '../../../../shared/components/Dialog/Dialog.tsx';
import { LoadingOverlay } from '../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import { useCodelistQuery } from '../../../codelists/hooks/useCodelistQuery.ts';
import { toSelectOptions } from '../../../codelists/utils/codelistUtils.ts';
import {
  useAddCaseSubjectMutation,
  useCaseSubjectsQuery,
  useUpdateCaseSubjectMutation,
} from '../../hooks/useCaseSubjectQueries.ts';
import type { CaseSubjectFormValues } from '../../schemas/caseSubjectForm.schema.ts';
import { useCaseSubjectsUiStore } from '../../store/useCaseSubjectsUiStore.ts';
import { toCaseSubjectRequest } from '../../utils/caseSubjectUtils.ts';
import { CaseSubjectRoleForm } from '../CaseSubjectRoleForm/CaseSubjectRoleForm.tsx';

const ROLE_FORM_ID = 'caseSubjectRoleForm';

export interface CaseSubjectRoleDialogProps {
  caseId: string;
  onSaved: (subjectId: number) => void;
}

export function CaseSubjectRoleDialog({ caseId, onSaved }: Readonly<CaseSubjectRoleDialogProps>) {
  const isAddOpen = useCaseSubjectsUiStore((state) => state.dialog?.type === 'roleAdd');
  const editId = useCaseSubjectsUiStore((state) =>
    state.dialog?.type === 'caseSubjectEdit' ? state.dialog.caseSubjectId : null,
  );
  const closeDialog = useCaseSubjectsUiStore((state) => state.closeDialog);

  const proceduralRoles = useCodelistQuery('procedural-roles').data;
  const materialLegalRoles = useCodelistQuery('material-legal-roles').data;

  const addMutation = useAddCaseSubjectMutation(caseId);
  const updateMutation = useUpdateCaseSubjectMutation(caseId);

  const editedItem = useCaseSubjectsQuery(caseId).data?.data.find(
    (candidate) => candidate.id === editId,
  );
  const isEditMode = editId !== null;
  const isOpen = isAddOpen || isEditMode;

  function handleSave(values: CaseSubjectFormValues) {
    const request = toCaseSubjectRequest(values);

    if (editedItem) {
      updateMutation.mutate({ id: editedItem.id, request }, { onSuccess: closeDialog });
      return;
    }

    addMutation.mutate(request, {
      onSuccess: () => {
        closeDialog();
        onSaved(values.subjectId);
      },
    });
  }

  let content = <LoadingOverlay label="Načítání formuláře" />;

  if (proceduralRoles && materialLegalRoles && (!isEditMode || editedItem)) {
    content = (
      <CaseSubjectRoleForm
        key={editedItem?.id}
        formId={ROLE_FORM_ID}
        editedItem={editedItem}
        proceduralRoleOptions={toSelectOptions(proceduralRoles)}
        materialLegalRoleOptions={toSelectOptions(materialLegalRoles)}
        onSave={handleSave}
      />
    );
  }

  return (
    <Dialog
      isOpen={isOpen}
      title={isEditMode ? 'Úprava subjektu na spisu' : 'Přidání subjektu'}
      size="lg"
      onClose={closeDialog}
      footer={
        <Button
          type="submit"
          form={ROLE_FORM_ID}
          variant="success"
          icon={Save}
          disabled={addMutation.isPending || updateMutation.isPending}
        >
          Uložit
        </Button>
      }
    >
      {content}
    </Dialog>
  );
}
