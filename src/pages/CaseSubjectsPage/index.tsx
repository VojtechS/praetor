import { useParams } from 'react-router-dom';
import { CaseSubjectDetailPanel } from '../../features/caseSubjects/components/CaseSubjectDetailPanel/CaseSubjectDetailPanel.tsx';
import { CaseSubjectList } from '../../features/caseSubjects/components/CaseSubjectList/CaseSubjectList.tsx';
import { CaseSubjectRemoveDialog } from '../../features/caseSubjects/components/CaseSubjectRemoveDialog/CaseSubjectRemoveDialog.tsx';
import { CaseSubjectRoleDialog } from '../../features/caseSubjects/components/CaseSubjectRoleDialog/CaseSubjectRoleDialog.tsx';
import { CaseSubjectsToolbar } from '../../features/caseSubjects/components/CaseSubjectsToolbar/CaseSubjectsToolbar.tsx';
import {
  useCaseQuery,
  useCaseSubjectsQuery,
} from '../../features/caseSubjects/hooks/useCaseSubjectQueries.ts';
import { useSelectedCaseSubject } from '../../features/caseSubjects/hooks/useSelectedCaseSubject.ts';
import { useCodelistQuery } from '../../features/codelists/hooks/useCodelistQuery.ts';
import { SubjectCardDialog } from '../../features/subjects/components/SubjectCardDialog/SubjectCardDialog.tsx';
import { useSubjectQuery } from '../../features/subjects/hooks/useSubjectQueries.ts';
import styles from './CaseSubjectsPage.module.scss';

export function CaseSubjectsPage() {
  const { caseId = '' } = useParams<{ caseId: string }>();
  const caseQuery = useCaseQuery(caseId);
  const caseSubjectsQuery = useCaseSubjectsQuery(caseId);
  const proceduralRolesQuery = useCodelistQuery('procedural-roles');
  const materialLegalRolesQuery = useCodelistQuery('material-legal-roles');

  const items = caseSubjectsQuery.data?.data;
  const listItems = items ?? [];
  const { selectedSubjectId, selectedItem, isNotFound, selectSubject, clearSelection } =
    useSelectedCaseSubject(items);
  const subjectQuery = useSubjectQuery(selectedSubjectId ?? 0, selectedItem !== undefined);

  const caseHeader = caseQuery.data?.data;
  const isDetailOpen = selectedSubjectId !== null || isNotFound;
  const isDetailLoading = caseSubjectsQuery.isPending || subjectQuery.isLoading;

  return (
    <>
      <header className={styles.caseSubjectsPage__header}>
        <h1 className={styles.caseSubjectsPage__title}>
          <span className={styles.caseSubjectsPage__caseTitle}>
            {caseHeader && `${caseHeader.number} — ${caseHeader.name}`}
          </span>
          <span className={styles.caseSubjectsPage__subtitle}>Subjekty</span>
        </h1>
        <CaseSubjectsToolbar />
      </header>

      <CaseSubjectRoleDialog caseId={caseId} items={listItems} onSaved={selectSubject} />
      <CaseSubjectRemoveDialog
        caseId={caseId}
        items={listItems}
        onRemoved={(subjectId) => subjectId === selectedSubjectId && clearSelection()}
      />
      <SubjectCardDialog />

      <div className={styles.caseSubjectsPage__layout} data-detail-open={isDetailOpen}>
        <CaseSubjectList
          caseId={caseId}
          items={listItems}
          materialLegalRoles={materialLegalRolesQuery.data}
          proceduralRoles={proceduralRolesQuery.data}
          selectedSubjectId={selectedSubjectId}
          isLoading={caseSubjectsQuery.isPending}
          isError={caseSubjectsQuery.isError}
        />

        <div className={styles.caseSubjectsPage__detail}>
          <CaseSubjectDetailPanel
            caseSubject={selectedItem}
            subject={subjectQuery.data?.data}
            onClose={clearSelection}
            isOpen={isDetailOpen}
            isLoading={isDetailLoading}
            isNotFound={isNotFound}
          />
        </div>
      </div>
    </>
  );
}
