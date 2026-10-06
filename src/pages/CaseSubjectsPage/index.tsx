import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CaseSubjectDetailPanel } from '../../features/caseSubjects/components/CaseSubjectDetailPanel/CaseSubjectDetailPanel.tsx';
import { CaseSubjectList } from '../../features/caseSubjects/components/CaseSubjectList/CaseSubjectList.tsx';
import { CaseSubjectRemoveDialog } from '../../features/caseSubjects/components/CaseSubjectRemoveDialog/CaseSubjectRemoveDialog.tsx';
import { CaseSubjectRoleEditDialog } from '../../features/caseSubjects/components/CaseSubjectRoleEditDialog/CaseSubjectRoleEditDialog.tsx';
import { CaseSubjectRoleDialog } from '../../features/caseSubjects/components/CaseSubjectRoleDialog/CaseSubjectRoleDialog.tsx';
import {
  CASE_SUBJECTS_QUERY_KEY,
  useCaseQuery,
  useCaseSubjectsQuery,
} from '../../features/caseSubjects/hooks/useCaseSubjectQueries.ts';
import { useCaseSubjectsUiStore } from '../../features/caseSubjects/store/useCaseSubjectsUiStore.ts';
import { SubjectCardDialog } from '../../features/subjects/components/card/SubjectCardDialog/SubjectCardDialog.tsx';
import { useSubjectQuery } from '../../features/subjects/hooks/queries/useSubjectQueries.ts';
import { Button } from '../../shared/components/Button/Button.tsx';
import styles from './CaseSubjectsPage.module.scss';

export function CaseSubjectsPage() {
  const { caseId = '' } = useParams<{ caseId: string }>();
  const caseQuery = useCaseQuery(caseId);
  const caseSubjectsQuery = useCaseSubjectsQuery(caseId);

  const queryClient = useQueryClient();

  const openDialog = useCaseSubjectsUiStore((state) => state.openDialog);
  const closeDialog = useCaseSubjectsUiStore((state) => state.closeDialog);
  const subjectCard = useCaseSubjectsUiStore((state) =>
    state.dialog?.type === 'subjectCard' ? state.dialog.subjectCard : null,
  );

  const items = caseSubjectsQuery.data?.data ?? [];
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const selectedItem = items.find((item) => item.subjectId === selectedSubjectId);
  const subjectQuery = useSubjectQuery(selectedSubjectId ?? 0, selectedItem !== undefined);

  function refreshCaseSubjects() {
    void queryClient.invalidateQueries({ queryKey: CASE_SUBJECTS_QUERY_KEY });
  }

  const caseHeader = caseQuery.data?.data;
  const isDetailOpen = selectedItem !== undefined;

  return (
    <>
      <header className={styles.caseSubjectsPage__header}>
        <h1 className={styles.caseSubjectsPage__title}>
          <span className={styles.caseSubjectsPage__caseTitle}>
            {caseHeader && `${caseHeader.number} — ${caseHeader.name}`}
          </span>
          <span className={styles.caseSubjectsPage__subtitle}>Subjekty</span>
        </h1>
        <div
          className={styles.caseSubjectsPage__toolbar}
          role="toolbar"
          aria-label="Akce nad subjekty"
        >
          <Button variant="primary" icon={Plus} onClick={() => openDialog({ type: 'roleAdd' })}>
            Přidat subjekt
          </Button>
        </div>
      </header>

      <div className={styles.caseSubjectsPage__layout} data-detail-open={isDetailOpen}>
        <CaseSubjectList
          items={items}
          selectedSubjectId={selectedSubjectId}
          onSelect={setSelectedSubjectId}
          isLoading={caseSubjectsQuery.isPending}
          isError={caseSubjectsQuery.isError}
        />

        <div className={styles.caseSubjectsPage__detail}>
          <CaseSubjectDetailPanel
            caseSubject={selectedItem}
            subject={subjectQuery.data?.data}
            onClose={() => setSelectedSubjectId(null)}
            isOpen={isDetailOpen}
            isLoading={subjectQuery.isLoading}
          />
        </div>
      </div>

      <CaseSubjectRoleDialog caseId={caseId} onSaved={setSelectedSubjectId} />
      <CaseSubjectRoleEditDialog caseId={caseId} />
      <CaseSubjectRemoveDialog caseId={caseId} />
      <SubjectCardDialog
        subjectCard={subjectCard}
        onClose={closeDialog}
        onUpdated={refreshCaseSubjects}
      />
    </>
  );
}
