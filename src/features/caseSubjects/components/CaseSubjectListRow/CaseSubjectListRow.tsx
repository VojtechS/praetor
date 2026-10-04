import { Building2, Landmark, Scale, Star, User, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkValue } from '../../../../shared/utils/checkValue.ts';
import type { CodelistItem } from '../../../codelists/api/codelistApi.types.ts';
import { getCodelistLabel } from '../../../codelists/utils/codelistUtils.ts';
import { getSubjectTypeLabel } from '../../../subjects/constants/subjectLabels.ts';
import { getSubjectIdentification } from '../../../subjects/utils/subjectUtils.ts';
import type { CaseSubjectListItem } from '../../model/caseSubject.types.ts';
import { formatLegalRepresentative } from '../../utils/caseSubjectUtils.ts';
import { CaseSubjectRowActions } from '../CaseSubjectRowActions/CaseSubjectRowActions.tsx';
import styles from './CaseSubjectListRow.module.scss';

export interface CaseSubjectListRowProps {
  item: CaseSubjectListItem;
  materialLegalRoles: CodelistItem[] | undefined;
  proceduralRoles: CodelistItem[] | undefined;
  isSelected: boolean;
}

function TypeIcon({ item }: Readonly<{ item: CaseSubjectListItem }>) {
  const props = {
    className: styles.caseSubjectListRow__icon,
    role: 'img',
    'aria-label': getSubjectTypeLabel(item.subjectType),
  };

  if (item.role === 'DECIDING_AUTHORITY') {
    return <Landmark {...props} />;
  }

  return item.subjectType.startsWith('PHYSICAL') ? <User {...props} /> : <Building2 {...props} />;
}

export function CaseSubjectListRow({
  item,
  materialLegalRoles,
  proceduralRoles,
  isSelected,
}: Readonly<CaseSubjectListRowProps>) {
  const hasRepresentative = item.legalRepresentativeId !== null;
  const rowClass = `${styles.caseSubjectListRow} ${isSelected ? styles['caseSubjectListRow--selected'] : ''}`;

  return (
    <>
      <tr className={`${rowClass} ${hasRepresentative ? styles['caseSubjectListRow--open'] : ''}`}>
        <th scope="row">
          <span className={styles.caseSubjectListRow__name}>
            <TypeIcon item={item} />
            <Link
              className={styles.caseSubjectListRow__link}
              to={{ search: `?subjectId=${item.subjectId}` }}
              aria-current={isSelected ? 'true' : undefined}
            >
              {item.subjectName}
            </Link>
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
        <td className={styles.caseSubjectListRow__actions}>
          <CaseSubjectRowActions item={item} />
        </td>
      </tr>
      {hasRepresentative && (
        <tr className={`${rowClass} ${styles.caseSubjectListRow__representativeRow}`}>
          <td colSpan={6}>
            <span className={styles.caseSubjectListRow__representative}>
              <Scale className={styles.caseSubjectListRow__icon} aria-hidden="true" />
              {formatLegalRepresentative(item)}
            </span>
          </td>
        </tr>
      )}
    </>
  );
}
