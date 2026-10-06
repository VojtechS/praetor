import { Save } from 'lucide-react';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { Dialog } from '../../../../shared/components/Dialog/Dialog.tsx';
import { LoadingOverlay } from '../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import { useCodelistQuery } from '../../../codelists/hooks/useCodelistQuery.ts';
import { toSelectOptions } from '../../../codelists/utils/codelistUtils.ts';
import {
  useCaseSubjectsQuery,
  useUpdateCaseSubjectMutation,
} from '../../hooks/useCaseSubjectQueries.ts';
import type { CaseSubjectRoleEditFormValues } from '../../schemas/caseSubjectRoleEditForm.schema.ts';
import { useCaseSubjectsUiStore } from '../../store/useCaseSubjectsUiStore.ts';
import {
  getCaseSubjectRoleEditDefaults,
  toCaseSubjectRoleChanges,
} from '../../utils/caseSubjectUtils.ts';
import { CaseSubjectRoleEditForm } from '../CaseSubjectRoleEditForm/CaseSubjectRoleEditForm.tsx';

const ROLE_EDIT_FORM_ID = 'caseSubjectRoleEditForm';

export interface CaseSubjectRoleEditDialogProps {
  caseId: string;
}

export function CaseSubjectRoleEditDialog({ caseId }: Readonly<CaseSubjectRoleEditDialogProps>) {
  const roleEditId = useCaseSubjectsUiStore((state) =>
    state.dialog?.type === 'roleEdit' ? state.dialog.caseSubjectId : null,
  );
  const closeDialog = useCaseSubjectsUiStore((state) => state.closeDialog);

  const proceduralRoles = useCodelistQuery('procedural-roles').data;
  const materialLegalRoles = useCodelistQuery('material-legal-roles').data;
  const updateMutation = useUpdateCaseSubjectMutation(caseId);

  const items = useCaseSubjectsQuery(caseId).data?.data ?? [];
  const item = items.find((candidate) => candidate.id === roleEditId);

  function handleSave(values: CaseSubjectRoleEditFormValues) {
    if (!item) {
      return;
    }

    updateMutation.mutate(
      { id: item.id, request: toCaseSubjectRoleChanges(values) },
      { onSuccess: closeDialog },
    );
  }

  let content = <LoadingOverlay label="Načítání formuláře" />;

  if (proceduralRoles && materialLegalRoles && item) {
    content = (
      <CaseSubjectRoleEditForm
        formId={ROLE_EDIT_FORM_ID}
        defaultValues={getCaseSubjectRoleEditDefaults(item)}
        proceduralRoleOptions={toSelectOptions(proceduralRoles)}
        materialLegalRoleOptions={toSelectOptions(materialLegalRoles)}
        onSave={handleSave}
      />
    );
  }

  return (
    <Dialog
      isOpen={roleEditId !== null}
      title="Nastavení rolí"
      size="sm"
      onClose={closeDialog}
      footer={
        <Button
          type="submit"
          form={ROLE_EDIT_FORM_ID}
          variant="success"
          icon={Save}
          disabled={updateMutation.isPending}
        >
          Uložit
        </Button>
      }
    >
      {content}
    </Dialog>
  );
}
