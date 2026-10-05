import { checkValue } from '../../../../shared/utils/checkValue.ts';
import { useCodelistQuery } from '../../../codelists/hooks/useCodelistQuery.ts';
import { getCodelistLabel } from '../../../codelists/utils/codelistUtils.ts';
import type { RelatedSubject } from '../../../subjects/api/subjectApi/subjectApi.types.ts';
import { CASE_SUBJECT_ROLE_LABELS } from '../../constants/caseSubjectLabels.ts';
import type { CaseSubjectDetail } from '../../model/caseSubject.types.ts';
import { DetailRow } from '../../../../shared/components/DetailRow/DetailRow.tsx';
import { DetailSection } from '../../../../shared/components/DetailSection/DetailSection.tsx';
import styles from './CaseSubjectOnCaseSection.module.scss';

export interface CaseSubjectOnCaseSectionProps {
  caseSubject: CaseSubjectDetail;
  relatedSubjects: RelatedSubject[];
}

export function CaseSubjectOnCaseSection({
  caseSubject,
  relatedSubjects,
}: Readonly<CaseSubjectOnCaseSectionProps>) {
  const proceduralRoles = useCodelistQuery('procedural-roles');
  const materialLegalRoles = useCodelistQuery('material-legal-roles');
  const preferredRelatedSubjects = relatedSubjects.filter((relatedSubject) =>
    caseSubject.preferredRelatedSubjectIds.includes(relatedSubject.id),
  );

  return (
    <DetailSection title="Na spisu" isOpen>
      <div>
        <DetailRow label="Role" value={CASE_SUBJECT_ROLE_LABELS[caseSubject.role]} />
        <DetailRow
          label="Procesní role"
          value={getCodelistLabel(proceduralRoles.data, caseSubject.proceduralRole)}
        />
        <DetailRow
          label="Hmotně právní role"
          value={getCodelistLabel(materialLegalRoles.data, caseSubject.materialLegalRole)}
        />
        <DetailRow
          label="Právní zástupce"
          value={checkValue(caseSubject.legalRepresentativeName)}
        />
        <DetailRow label="Spisová značka" value={checkValue(caseSubject.caseFileNumber)} />
      </div>
      <h3 className={styles.caseSubjectOnCaseSection__title}>Preferované kontakty</h3>
      {preferredRelatedSubjects.length === 0 ? (
        <p>{checkValue(null)}</p>
      ) : (
        <ul className={styles.caseSubjectOnCaseSection__relatedSubjects}>
          {preferredRelatedSubjects.map((relatedSubject) => (
            <li key={relatedSubject.id}>{relatedSubject.fullName}</li>
          ))}
        </ul>
      )}
    </DetailSection>
  );
}
