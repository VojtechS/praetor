import { LoadingOverlay } from '../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import type { CodelistItem } from '../../../codelists/api/codelistApi/codelistApi.types.ts';
import type { CaseSubjectListItem } from '../../model/caseSubject.types.ts';
import { groupCaseSubjectsByRole } from '../../utils/caseSubjectUtils.ts';
import { CaseSubjectGroupHeader } from '../CaseSubjectGroupHeader/CaseSubjectGroupHeader.tsx';
import { CaseSubjectListHeader } from '../CaseSubjectListHeader/CaseSubjectListHeader.tsx';
import { CaseSubjectListRow } from '../CaseSubjectListRow/CaseSubjectListRow.tsx';
import styles from './CaseSubjectList.module.scss';

export interface CaseSubjectListProps {
  caseId: string;
  items: CaseSubjectListItem[];
  materialLegalRoles: CodelistItem[] | undefined;
  proceduralRoles: CodelistItem[] | undefined;
  selectedSubjectId: number | null;
  isLoading?: boolean;
  isError?: boolean;
}

export function CaseSubjectList({
  caseId,
  items,
  materialLegalRoles,
  proceduralRoles,
  selectedSubjectId,
  isLoading = false,
  isError = false,
}: Readonly<CaseSubjectListProps>) {
  return (
    <div className={styles.caseSubjectList__wrapper} aria-busy={isLoading}>
      {isLoading && <LoadingOverlay label="Načítání seznamu subjektů" />}

      <div
        role="table"
        className={styles.caseSubjectList__table}
        aria-label="Seznam subjektů na spisu"
      >
        <CaseSubjectListHeader />

        {items.length === 0 && !isLoading && (
          <div role="rowgroup">
            <div role="row">
              <div role="cell" aria-colspan={6}>
                <p className="emptyState">
                  {isError ? 'Seznam subjektů se nepodařilo načíst' : 'Žádné subjekty na spisu'}
                </p>
              </div>
            </div>
          </div>
        )}

        {groupCaseSubjectsByRole(items).map((group) => (
          <div role="rowgroup" key={group.role}>
            <CaseSubjectGroupHeader role={group.role} count={group.items.length} />
            {group.items.map((item) => (
              <CaseSubjectListRow
                caseId={caseId}
                key={item.id}
                item={item}
                materialLegalRoles={materialLegalRoles}
                proceduralRoles={proceduralRoles}
                isSelected={item.subjectId === selectedSubjectId}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
