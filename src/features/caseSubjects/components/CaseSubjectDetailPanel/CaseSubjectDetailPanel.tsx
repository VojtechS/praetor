import { LoadingOverlay } from '../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import type { SubjectDetail } from '../../../subjects/model/subject.types.ts';
import type { CaseSubjectDetail } from '../../model/caseSubject.types.ts';
import { CaseSubjectDetailContent } from './CaseSubjectDetailContent/CaseSubjectDetailContent.tsx';
import styles from './CaseSubjectDetailPanel.module.scss';

export interface CaseSubjectDetailPanelProps {
  caseSubject?: CaseSubjectDetail;
  subject?: SubjectDetail;
  onClose: () => void;
  isOpen: boolean;
  isLoading?: boolean;
}

export function CaseSubjectDetailPanel({
  caseSubject,
  subject,
  onClose,
  isOpen,
  isLoading = false,
}: Readonly<CaseSubjectDetailPanelProps>) {
  if (!isOpen) {
    return null;
  }

  let content = <LoadingOverlay label="Načítání detailu subjektu" />;

  if (caseSubject && subject) {
    content = (
      <CaseSubjectDetailContent caseSubject={caseSubject} subject={subject} onClose={onClose} />
    );
  } else if (!isLoading) {
    content = <p className="emptyState">Žádné údaje o subjektu</p>;
  }

  return (
    <aside className={styles.panel} aria-label="Detail subjektu" aria-busy={isLoading}>
      {content}
    </aside>
  );
}
