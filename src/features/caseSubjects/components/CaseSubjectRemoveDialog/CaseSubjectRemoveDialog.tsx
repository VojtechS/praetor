import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog/ConfirmDialog.tsx';
import {
  useCaseSubjectsQuery,
  useRemoveCaseSubjectMutation,
} from '../../hooks/useCaseSubjectQueries.ts';
import { useCaseSubjectsUiStore } from '../../store/useCaseSubjectsUiStore.ts';

export interface CaseSubjectRemoveDialogProps {
  caseId: string;
}

export function CaseSubjectRemoveDialog({ caseId }: Readonly<CaseSubjectRemoveDialogProps>) {
  const confirmRemoveId = useCaseSubjectsUiStore((state) => state.confirmRemoveId);
  const cancelRemove = useCaseSubjectsUiStore((state) => state.cancelRemove);
  const removeMutation = useRemoveCaseSubjectMutation(caseId);
  const items = useCaseSubjectsQuery(caseId).data?.data ?? [];
  const item = items.find((candidate) => candidate.id === confirmRemoveId);

  function handleConfirm() {
    if (!item) {
      return;
    }

    removeMutation.mutate(item.id, { onSuccess: cancelRemove });
  }

  return (
    <ConfirmDialog
      isOpen={confirmRemoveId !== null}
      title="Odebrat subjekt ze spisu"
      message={`Opravdu chcete odebrat subjekt ${item?.subjectName ?? ''} ze spisu? Subjekt zůstane zachován.`}
      confirmLabel="Odebrat"
      isLoading={removeMutation.isPending}
      onConfirm={handleConfirm}
      onCancel={cancelRemove}
    />
  );
}
