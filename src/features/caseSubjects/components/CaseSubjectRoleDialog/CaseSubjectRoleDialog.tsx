import { Save } from 'lucide-react';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { Dialog } from '../../../../shared/components/Dialog/Dialog.tsx';
import { LoadingOverlay } from '../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import { useCodelistQuery } from '../../../codelists/hooks/useCodelistQuery.ts';
import { toSelectOptions } from '../../../codelists/utils/codelistUtils.ts';
import { useAddCaseSubjectMutation } from '../../hooks/useCaseSubjectQueries.ts';
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
  const isOpen = useCaseSubjectsUiStore((state) => state.isRoleDialogOpen);
  const closeRoleDialog = useCaseSubjectsUiStore((state) => state.closeRoleDialog);

  const proceduralRoles = useCodelistQuery('procedural-roles').data;
  const materialLegalRoles = useCodelistQuery('material-legal-roles').data;

  const addMutation = useAddCaseSubjectMutation(caseId);

  function handleSave(values: CaseSubjectFormValues) {
    addMutation.mutate(toCaseSubjectRequest(values), {
      onSuccess: () => {
        closeRoleDialog();
        onSaved(values.subjectId);
      },
    });
  }

  let content = <LoadingOverlay label="Načítání formuláře" />;

  if (proceduralRoles && materialLegalRoles) {
    content = (
      <CaseSubjectRoleForm
        formId={ROLE_FORM_ID}
        proceduralRoleOptions={toSelectOptions(proceduralRoles)}
        materialLegalRoleOptions={toSelectOptions(materialLegalRoles)}
        onSave={handleSave}
      />
    );
  }

  return (
    <Dialog
      isOpen={isOpen}
      title="Přidání subjektu"
      size="lg"
      onClose={closeRoleDialog}
      footer={
        <Button
          type="submit"
          form={ROLE_FORM_ID}
          variant="success"
          icon={Save}
          disabled={addMutation.isPending}
        >
          Uložit
        </Button>
      }
    >
      {content}
    </Dialog>
  );
}
