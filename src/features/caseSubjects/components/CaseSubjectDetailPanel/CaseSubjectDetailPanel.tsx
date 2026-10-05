import { X } from 'lucide-react';
import { LoadingOverlay } from '../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import { SUBJECT_TYPE_LABELS } from '../../../subjects/constants/subjectLabels.ts';
import type { Subject } from '../../../subjects/api/subjectApi/subjectApi.types.ts';
import {
  getSubjectDisplayName,
  getSubjectIdentification,
} from '../../../subjects/utils/subjectUtils.ts';
import type { CaseSubjectDetail } from '../../model/caseSubject.types.ts';
import { CaseSubjectOnCaseSection } from '../CaseSubjectOnCaseSection/CaseSubjectOnCaseSection.tsx';
import { SubjectAddressesDetail } from '../../../subjects/components/detail/SubjectAddressesDetail/SubjectAddressesDetail.tsx';
import { SubjectBasicInfoDetail } from '../../../subjects/components/detail/SubjectBasicInfoDetail/SubjectBasicInfoDetail.tsx';
import { SubjectContactsDetail } from '../../../subjects/components/detail/SubjectContactsDetail/SubjectContactsDetail.tsx';
import styles from './CaseSubjectDetailPanel.module.scss';

export interface CaseSubjectDetailPanelProps {
  caseSubject?: CaseSubjectDetail;
  subject?: Subject;
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
    const identification = getSubjectIdentification(
      subject.economicSubject?.regNumber ?? null,
      subject.physicalPerson?.birthDate ?? null,
    );

    content = (
      <div className={styles.caseSubjectDetailPanel__content}>
        <header className={styles.caseSubjectDetailPanel__header}>
          <div>
            <h2 className={styles.caseSubjectDetailPanel__title}>
              {getSubjectDisplayName(subject)}
            </h2>
            <p className={styles.caseSubjectDetailPanel__subtitle}>
              {SUBJECT_TYPE_LABELS[subject.type]} · {identification}
            </p>
          </div>
          <button
            type="button"
            className={styles.caseSubjectDetailPanel__closeButton}
            onClick={onClose}
            aria-label="Zavřít detail subjektu"
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <CaseSubjectOnCaseSection
          caseSubject={caseSubject}
          relatedSubjects={subject.relatedSubjects}
        />
        <SubjectBasicInfoDetail subject={subject} />
        <SubjectAddressesDetail addresses={subject.addresses} />
        <SubjectContactsDetail contacts={subject.contacts} />
      </div>
    );
  } else if (!isLoading) {
    content = <p className="emptyState">Žádné údaje o subjektu</p>;
  }

  return (
    <aside
      className={styles.caseSubjectDetailPanel}
      aria-label="Detail subjektu"
      aria-busy={isLoading}
    >
      {content}
    </aside>
  );
}
