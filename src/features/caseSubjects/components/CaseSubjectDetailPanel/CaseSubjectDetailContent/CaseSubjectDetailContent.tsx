import { X } from 'lucide-react';
import type { CaseSubjectDetail } from '../../../model/caseSubject.types.ts';
import { SUBJECT_TYPE_LABELS } from '../../../../subjects/constants/subjectLabels.ts';
import type { SubjectDetail } from '../../../../subjects/model/subject.types.ts';
import {
  getSubjectDisplayName,
  getSubjectIdentification,
} from '../../../../subjects/utils/subjectUtils.ts';
import { CaseSubjectOnCaseSection } from '../../CaseSubjectOnCaseSection/CaseSubjectOnCaseSection.tsx';
import { SubjectAddressesDetail } from '../../../../subjects/components/detail/SubjectAddressesDetail/SubjectAddressesDetail.tsx';
import { SubjectBasicInfoDetail } from '../../../../subjects/components/detail/SubjectBasicInfoDetail/SubjectBasicInfoDetail.tsx';
import { SubjectConnectionsDetail } from '../../../../subjects/components/detail/SubjectConnectionsDetail/SubjectConnectionsDetail.tsx';
import styles from './CaseSubjectDetailContent.module.scss';

export interface CaseSubjectDetailContentProps {
  caseSubject: CaseSubjectDetail;
  subject: SubjectDetail;
  onClose: () => void;
}

export function CaseSubjectDetailContent({
  caseSubject,
  subject,
  onClose,
}: Readonly<CaseSubjectDetailContentProps>) {
  const identification = getSubjectIdentification(
    subject.economicSubject?.regNumber ?? null,
    subject.physicalPerson?.birthDate ?? null,
  );

  return (
    <div className={styles.caseSubjectDetailContent}>
      <header className={styles.caseSubjectDetailContent__header}>
        <div>
          <h2 className={styles.caseSubjectDetailContent__title}>
            {getSubjectDisplayName(subject)}
          </h2>
          <p className={styles.caseSubjectDetailContent__subtitle}>
            {SUBJECT_TYPE_LABELS[subject.type]} · {identification}
          </p>
        </div>
        <button
          type="button"
          className={styles.caseSubjectDetailContent__closeButton}
          onClick={onClose}
          aria-label="Zavřít detail subjektu"
        >
          <X aria-hidden="true" />
        </button>
      </header>

      <CaseSubjectOnCaseSection caseSubject={caseSubject} contacts={subject.contacts} />
      <SubjectBasicInfoDetail subject={subject} />
      <SubjectAddressesDetail addresses={subject.addresses} />
      <SubjectConnectionsDetail connections={subject.connections} />
    </div>
  );
}
