import type { UseFormRegisterReturn } from 'react-hook-form';
import { CheckboxField } from '../../../../shared/components/CheckboxField/CheckboxField.tsx';
import type { RelatedSubject } from '../../../subjects/api/subjectApi/subjectApi.types.ts';
import styles from './CaseSubjectRelatedSubjectsChecklist.module.scss';

function formatRelatedSubjectLabel(relatedSubject: RelatedSubject): string {
  if (relatedSubject.personalId) {
    return `${relatedSubject.fullName} (r. č.: ${relatedSubject.personalId})`;
  }

  return relatedSubject.regNumber
    ? `${relatedSubject.fullName} (IČO: ${relatedSubject.regNumber})`
    : relatedSubject.fullName;
}

export interface CaseSubjectRelatedSubjectsChecklistProps {
  relatedSubjects: RelatedSubject[];
  registration: UseFormRegisterReturn;
  hasSubject: boolean;
}

export function CaseSubjectRelatedSubjectsChecklist({
  relatedSubjects,
  registration,
  hasSubject,
}: Readonly<CaseSubjectRelatedSubjectsChecklistProps>) {
  let content = (
    <ul className={styles.caseSubjectRelatedSubjectsChecklist__list}>
      {relatedSubjects.map((relatedSubject) => (
        <li key={relatedSubject.id} className={styles.caseSubjectRelatedSubjectsChecklist__item}>
          <CheckboxField
            label={formatRelatedSubjectLabel(relatedSubject)}
            value={String(relatedSubject.id)}
            registration={registration}
          />
        </li>
      ))}
    </ul>
  );

  if (!hasSubject) {
    content = <p className="emptyState">Nejdřív vyberte subjekt</p>;
  } else if (relatedSubjects.length === 0) {
    content = <p className="emptyState">Subjekt nemá žádné kontaktní osoby</p>;
  }

  return content;
}
