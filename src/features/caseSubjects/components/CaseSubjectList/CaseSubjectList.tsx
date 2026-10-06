import { LoadingOverlay } from '../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import type { CodelistItem } from '../../../codelists/api/codelistApi/codelistApi.types.ts';
import type { CaseSubject } from '../../api/caseSubjectApi/caseSubjectApi.types.ts';
import { groupCaseSubjectsByRole } from '../../utils/caseSubjectUtils.ts';
import { CaseSubjectGroupHeader } from '../CaseSubjectGroupHeader/CaseSubjectGroupHeader.tsx';
import { CaseSubjectListRow } from '../CaseSubjectListRow/CaseSubjectListRow.tsx';
import styles from './CaseSubjectList.module.scss';

export interface CaseSubjectListProps {
  caseId: string;
  items: CaseSubject[];
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

      <table className={styles.caseSubjectList__table} aria-label="Seznam subjektů na spisu">
        <thead>
          <tr className={styles.caseSubjectList__header}>
            <th scope="col">Označení</th>
            <th scope="col">Identifikace</th>
            <th scope="col">Hmotně právní role</th>
            <th scope="col">Procesní role</th>
            <th scope="col">Spisová značka</th>
            <th scope="col" className={styles.caseSubjectList__actionsHeading}>
              <span className="visuallyHidden">Akce</span>
            </th>
          </tr>
        </thead>

        {items.length === 0 && !isLoading && (
          <tbody>
            <tr>
              <td colSpan={6}>
                <p className="emptyState">
                  {isError ? 'Seznam subjektů se nepodařilo načíst' : 'Žádné subjekty na spisu'}
                </p>
              </td>
            </tr>
          </tbody>
        )}

        {groupCaseSubjectsByRole(items).map((group) => (
          <tbody key={group.role}>
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
          </tbody>
        ))}
      </table>
    </div>
  );
}
