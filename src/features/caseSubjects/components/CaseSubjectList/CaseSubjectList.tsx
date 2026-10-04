import columnStyles from '../../../../styles/caseSubjectListColumns.module.scss';
import { LoadingOverlay } from '../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import type { CodelistItem } from '../../../codelists/api/codelistApi.types.ts';
import type { CaseSubjectListItem } from '../../model/caseSubject.types.ts';
import { groupCaseSubjectsByRole } from '../../utils/caseSubjectUtils.ts';
import { CaseSubjectGroupHeader } from '../CaseSubjectGroupHeader/CaseSubjectGroupHeader.tsx';
import { CaseSubjectListHeader } from '../CaseSubjectListHeader/CaseSubjectListHeader.tsx';
import { CaseSubjectListRow } from '../CaseSubjectListRow/CaseSubjectListRow.tsx';
import styles from './CaseSubjectList.module.scss';

export interface CaseSubjectListProps {
  items: CaseSubjectListItem[];
  materialLegalRoles: CodelistItem[] | undefined;
  proceduralRoles: CodelistItem[] | undefined;
  selectedSubjectId: number | null;
  isLoading?: boolean;
}

export function CaseSubjectList({
  items,
  materialLegalRoles,
  proceduralRoles,
  selectedSubjectId,
  isLoading = false,
}: Readonly<CaseSubjectListProps>) {
  return (
    <div className={styles.caseSubjectList__wrapper} aria-busy={isLoading}>
      {isLoading && <LoadingOverlay label="Načítání seznamu subjektů" />}

      <table className={`${styles.caseSubjectList__table} ${columnStyles.caseSubjectList}`}>
        <caption className="visuallyHidden">Seznam subjektů na spisu</caption>

        <CaseSubjectListHeader />

        {items.length === 0 && !isLoading && (
          <tbody>
            <tr>
              <td colSpan={5}>
                <p className="emptyState">Žádné subjekty na spisu</p>
              </td>
            </tr>
          </tbody>
        )}

        {groupCaseSubjectsByRole(items).map((group) => (
          <tbody key={group.role}>
            <CaseSubjectGroupHeader role={group.role} count={group.items.length} />
            {group.items.map((item) => (
              <CaseSubjectListRow
                key={item.id}
                item={item}
                materialLegalRoles={materialLegalRoles}
                proceduralRoles={proceduralRoles}
                isSelected={item.subjectId === selectedSubjectId}
              />
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
