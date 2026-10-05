import { X } from 'lucide-react';
import type { CaseSubjectDetail } from '../../../model/caseSubject.types.ts';
import { getSubjectTypeLabel } from '../../../../subjects/constants/subjectLabels.ts';
import type { SubjectDetail } from '../../../../subjects/model/subject.types.ts';
import {
  getSubjectDisplayName,
  getSubjectIdentification,
} from '../../../../subjects/utils/subjectUtils.ts';
import { CaseSubjectOnCaseSection } from '../../CaseSubjectOnCaseSection/CaseSubjectOnCaseSection.tsx';
import { SubjectAddressesSection } from '../../../../subjects/components/SubjectAddressesSection/SubjectAddressesSection.tsx';
import { SubjectBasicInfoSection } from '../../../../subjects/components/SubjectBasicInfoSection/SubjectBasicInfoSection.tsx';
import { SubjectConnectionsSection } from '../../../../subjects/components/SubjectConnectionsSection/SubjectConnectionsSection.tsx';
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
            {getSubjectTypeLabel(subject.type)} · {identification}
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
      <SubjectBasicInfoSection subject={subject} />
      <SubjectAddressesSection addresses={subject.addresses} />
      <SubjectConnectionsSection connections={subject.connections} />
    </div>
  );
}
