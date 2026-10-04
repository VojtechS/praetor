import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog/ConfirmDialog.tsx';
import type { CaseSubject } from '../../api/caseSubjectApi.types.ts';
import { useRemoveCaseSubjectMutation } from '../../hooks/useCaseSubjectQueries.ts';
import {
  selectCancelRemove,
  selectConfirmRemoveId,
  useCaseSubjectsUiStore,
} from '../../store/useCaseSubjectsUiStore.ts';

export interface CaseSubjectRemoveDialogProps {
  items: CaseSubject[];
  onRemoved: (subjectId: number) => void;
}

// Only the link of the subject to the case is removed, the subject itself stays.
export function CaseSubjectRemoveDialog({
  items,
  onRemoved,
}: Readonly<CaseSubjectRemoveDialogProps>) {
  const confirmRemoveId = useCaseSubjectsUiStore(selectConfirmRemoveId);
  const cancelRemove = useCaseSubjectsUiStore(selectCancelRemove);
  const removeMutation = useRemoveCaseSubjectMutation();
  const item = items.find((candidate) => candidate.id === confirmRemoveId);

  function handleConfirm() {
    if (!item) {
      return;
    }

    removeMutation.mutate(item.id, {
      onSuccess: () => {
        cancelRemove();
        onRemoved(item.subjectId);
      },
    });
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
