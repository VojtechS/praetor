import { Building2, Landmark, Scale, Star, User, Wallet } from 'lucide-react';
import clsx from 'clsx';
import { memo } from 'react';
import { checkValue } from '../../../../shared/utils/checkValue.ts';
import type { CodelistItem } from '../../../codelists/api/codelistApi/codelistApi.types.ts';
import { getCodelistLabel } from '../../../codelists/utils/codelistUtils.ts';
import { SUBJECT_TYPE_LABELS } from '../../../subjects/constants/subjectLabels.ts';
import { getSubjectIdentification } from '../../../subjects/utils/subjectUtils.ts';
import type { CaseSubject } from '../../api/caseSubjectApi/caseSubjectApi.types.ts';
import { formatLegalRepresentative } from '../../utils/caseSubjectUtils.ts';
import { CaseSubjectRowActions } from '../CaseSubjectRowActions/CaseSubjectRowActions.tsx';
import styles from './CaseSubjectListRow.module.scss';

export interface CaseSubjectListRowProps {
  caseId: string;
  item: CaseSubject;
  materialLegalRoles: CodelistItem[] | undefined;
  proceduralRoles: CodelistItem[] | undefined;
  isSelected: boolean;
  onSelect: (subjectId: number) => void;
}

function TypeIcon({ item }: Readonly<{ item: CaseSubject }>) {
  const props = {
    className: styles.caseSubjectListRow__icon,
    role: 'img',
    'aria-label': SUBJECT_TYPE_LABELS[item.subjectType],
  };

  if (item.role === 'DECIDING_AUTHORITY') {
    return <Landmark {...props} />;
  }

  return item.subjectType.startsWith('PHYSICAL') ? <User {...props} /> : <Building2 {...props} />;
}

export const CaseSubjectListRow = memo(function CaseSubjectListRowView({
  caseId,
  item,
  materialLegalRoles,
  proceduralRoles,
  isSelected,
  onSelect,
}: Readonly<CaseSubjectListRowProps>) {
  const hasRepresentative = item.legalRepresentativeId !== null;
  const rowClass = clsx(
    styles.caseSubjectListRow,
    isSelected && styles['caseSubjectListRow--selected'],
  );

  return (
    <>
      <tr className={clsx(rowClass, hasRepresentative && styles['caseSubjectListRow--open'])}>
        <th scope="row" className={styles.caseSubjectListRow__nameCell}>
          <span className={styles.caseSubjectListRow__name}>
            <TypeIcon item={item} />
            <button
              type="button"
              className={styles.caseSubjectListRow__link}
              aria-current={isSelected ? 'true' : undefined}
              onClick={() => onSelect(item.subjectId)}
            >
              {item.subjectName}
            </button>
            {item.isMainClient && (
              <Star
                className={styles.caseSubjectListRow__flag}
                role="img"
                aria-label="Hlavní klient"
              />
            )}
            {item.isMainPayer && (
              <Wallet
                className={styles.caseSubjectListRow__flag}
                role="img"
                aria-label="Hlavní plátce"
              />
            )}
          </span>
        </th>
        <td>{getSubjectIdentification(item.subjectRegNumber, item.subjectBirthDate)}</td>
        <td>{getCodelistLabel(materialLegalRoles, item.materialLegalRole)}</td>
        <td>{getCodelistLabel(proceduralRoles, item.proceduralRole)}</td>
        <td>{checkValue(item.caseFileNumber)}</td>
        <td rowSpan={hasRepresentative ? 2 : 1} className={styles.caseSubjectListRow__actions}>
          <CaseSubjectRowActions caseId={caseId} item={item} />
        </td>
      </tr>
      {hasRepresentative && (
        <tr className={clsx(rowClass, styles.caseSubjectListRow__representativeRow)}>
          <td colSpan={5}>
            <span className={styles.caseSubjectListRow__representative}>
              <Scale className={styles.caseSubjectListRow__icon} aria-hidden="true" />
              {formatLegalRepresentative(item)}
            </span>
          </td>
        </tr>
      )}
    </>
  );
});
