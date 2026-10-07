import { DetailSection } from '../../../../shared/components/DetailSection/DetailSection.tsx';
import { useCodelistQuery } from '../../../codelists/hooks/useCodelistQuery.ts';
import { getCodelistLabel } from '../../../codelists/utils/codelistUtils.ts';
import type { SubjectCase } from '../../api/caseApi/caseApi.types.ts';
import { CASE_SUBJECT_ROLE_LABELS } from '../../constants/caseSubjectLabels.ts';
import { useSubjectCasesQuery } from '../../hooks/useCaseSubjectQueries.ts';
import styles from './CaseSubjectCasesSection.module.scss';

export interface CaseSubjectCasesSectionProps {
  subjectId: number;
}

export function CaseSubjectCasesSection({ subjectId }: Readonly<CaseSubjectCasesSectionProps>) {
  const casesQuery = useSubjectCasesQuery(subjectId);
  const proceduralRoles = useCodelistQuery('procedural-roles').data;
  const materialLegalRoles = useCodelistQuery('material-legal-roles').data;

  const cases = casesQuery.data?.data ?? [];

  function getRoles(item: SubjectCase): string {
    return [
      CASE_SUBJECT_ROLE_LABELS[item.role],
      item.proceduralRole && getCodelistLabel(proceduralRoles, item.proceduralRole),
      item.materialLegalRole && getCodelistLabel(materialLegalRoles, item.materialLegalRole),
    ]
      .filter(Boolean)
      .join(', ');
  }

  return (
    <DetailSection title="Spisy" count={cases.length}>
      {cases.length === 0 && <p className="emptyState">Žádné spisy</p>}
      <ul className={styles.caseSubjectCasesSection__list}>
        {cases.map((item) => (
          <li key={`${item.id}-${getRoles(item)}`} className={styles.caseSubjectCasesSection__item}>
            <p className={styles.caseSubjectCasesSection__number}>{item.number}</p>
            <p className={styles.caseSubjectCasesSection__detail}>{item.name}</p>
            <p className={styles.caseSubjectCasesSection__detail}>{getRoles(item)}</p>
          </li>
        ))}
      </ul>
    </DetailSection>
  );
}
