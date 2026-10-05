import clsx from 'clsx';
import columnStyles from '../../../../styles/caseSubjectListColumns.module.scss';
import { LoadingOverlay } from '../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import type { CodelistItem } from '../../../codelists/api/codelistApi/codelistApi.types.ts';
import type { CaseSubjectListItem } from '../../model/caseSubject.types.ts';
import { groupCaseSubjectsByRole } from '../../utils/caseSubjectUtils.ts';
import { CaseSubjectGroupHeader } from '../CaseSubjectGroupHeader/CaseSubjectGroupHeader.tsx';
import { CaseSubjectListRow } from '../CaseSubjectListRow/CaseSubjectListRow.tsx';
import styles from './CaseSubjectList.module.scss';

export interface CaseSubjectListProps {
  caseId: string;
  items: CaseSubjectListItem[];
  materialLegalRoles: CodelistItem[] | undefined;
  proceduralRoles: CodelistItem[] | undefined;
  selectedSubjectId: number | null;
  onSelect: (subjectId: number) => void;
  isLoading?: boolean;
  isError?: boolean;
}

export function CaseSubjectList({
  caseId,
  items,
  materialLegalRoles,
  proceduralRoles,
  selectedSubjectId,
  onSelect,
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
        <div role="rowgroup">
          <div
            role="row"
            className={clsx(styles.caseSubjectList__header, columnStyles.caseSubjectListGrid)}
          >
            <div role="columnheader">Označení</div>
            <div role="columnheader">Identifikace</div>
            <div role="columnheader">Hmotně právní role</div>
            <div role="columnheader">Procesní role</div>
            <div role="columnheader">Spisová značka</div>
            <div role="columnheader">
              <span className="visuallyHidden">Akce</span>
            </div>
          </div>
        </div>

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
                onSelect={onSelect}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
