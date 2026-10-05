import { Button } from '../../../../shared/components/Button/Button.tsx';
import { Dialog } from '../../../../shared/components/Dialog/Dialog.tsx';
import { LoadingOverlay } from '../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import { useCodelistQuery } from '../../../codelists/hooks/useCodelistQuery.ts';
import { toSelectOptions } from '../../../codelists/utils/codelistUtils.ts';
import type { CaseSubject } from '../../api/caseSubjectApi/caseSubjectApi.types.ts';
import {
  useAddCaseSubjectMutation,
  useUpdateCaseSubjectMutation,
} from '../../hooks/useCaseSubjectQueries.ts';
import type { CaseSubjectFormValues } from '../../schemas/caseSubjectForm.schema.ts';
import { useCaseSubjectsUiStore } from '../../store/useCaseSubjectsUiStore.ts';
import {
  getCaseSubjectFormDefaults,
  toCaseSubjectChanges,
  toCaseSubjectRequest,
} from '../../utils/caseSubjectUtils.ts';
import { CaseSubjectRoleForm } from '../CaseSubjectRoleForm/CaseSubjectRoleForm.tsx';

const ROLE_FORM_ID = 'caseSubjectRoleForm';

export interface CaseSubjectRoleDialogProps {
  caseId: string;
  items: CaseSubject[];
  onSaved: (subjectId: number) => void;
}

export function CaseSubjectRoleDialog({
  caseId,
  items,
  onSaved,
}: Readonly<CaseSubjectRoleDialogProps>) {
  const roleDialog = useCaseSubjectsUiStore((state) => state.roleDialog);
  const closeRoleDialog = useCaseSubjectsUiStore((state) => state.closeRoleDialog);

  const proceduralRoles = useCodelistQuery('procedural-roles').data;
  const materialLegalRoles = useCodelistQuery('material-legal-roles').data;

  const addMutation = useAddCaseSubjectMutation(caseId);
  const updateMutation = useUpdateCaseSubjectMutation(caseId);

  const isEdit = roleDialog?.mode === 'edit';
  const editItem = items.find((item) => item.id === roleDialog?.caseSubjectId);
  const isSaving = addMutation.isPending || updateMutation.isPending;

  function handleSaved(subjectId: number) {
    closeRoleDialog();
    onSaved(subjectId);
  }

  function handleSave(values: CaseSubjectFormValues) {
    const onSuccess = () => handleSaved(values.subjectId);

    if (editItem) {
      updateMutation.mutate(
        { id: editItem.id, request: toCaseSubjectChanges(values) },
        { onSuccess },
      );
    } else {
      addMutation.mutate(toCaseSubjectRequest(values), { onSuccess });
    }
  }

  let content = <LoadingOverlay label="Načítání formuláře" />;

  if (proceduralRoles && materialLegalRoles && (!isEdit || editItem)) {
    content = (
      <CaseSubjectRoleForm
        formId={ROLE_FORM_ID}
        defaultValues={getCaseSubjectFormDefaults(editItem)}
        proceduralRoleOptions={toSelectOptions(proceduralRoles)}
        materialLegalRoleOptions={toSelectOptions(materialLegalRoles)}
        isEdit={isEdit}
        onSave={handleSave}
      />
    );
  }

  return (
    <Dialog
      isOpen={roleDialog !== null}
      title="Přidání/editace subjektu"
      size="lg"
      onClose={closeRoleDialog}
      footer={
        <>
          <Button type="submit" form={ROLE_FORM_ID} variant="primary" disabled={isSaving}>
            Uložit
          </Button>
          <Button onClick={closeRoleDialog}>Storno</Button>
        </>
      }
    >
      {content}
    </Dialog>
  );
}
