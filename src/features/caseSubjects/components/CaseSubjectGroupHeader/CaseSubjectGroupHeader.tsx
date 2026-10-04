import { Landmark, ShieldCheck, Swords, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '../../../../shared/components/Badge/Badge.tsx';
import type { CaseSubjectRole } from '../../api/caseSubjectApi.types.ts';
import { getCaseSubjectRoleGroupLabel } from '../../constants/caseSubjectLabels.ts';
import styles from './CaseSubjectGroupHeader.module.scss';

const GROUP_STYLES: Record<CaseSubjectRole, { icon: LucideIcon; modifier: string }> = {
  CLIENT: { icon: ShieldCheck, modifier: 'client' },
  OPPOSING_PARTY: { icon: Swords, modifier: 'opposing' },
  PARTICIPANT: { icon: Users, modifier: 'participant' },
  DECIDING_AUTHORITY: { icon: Landmark, modifier: 'authority' },
};

export interface CaseSubjectGroupHeaderProps {
  role: CaseSubjectRole;
  count: number;
}

export function CaseSubjectGroupHeader({ role, count }: Readonly<CaseSubjectGroupHeaderProps>) {
  const { icon: Icon, modifier } = GROUP_STYLES[role];
  const modifierClass = styles[`caseSubjectGroupHeader--${modifier}`];

  return (
    <tr>
      <th
        className={`${styles.caseSubjectGroupHeader} ${modifierClass}`}
        scope="rowgroup"
        colSpan={5}
      >
        <span className={styles.caseSubjectGroupHeader__content}>
          <Icon className={styles.caseSubjectGroupHeader__icon} aria-hidden="true" />
          <span>{getCaseSubjectRoleGroupLabel(role)}</span>
          <Badge>{count}</Badge>
        </span>
      </th>
    </tr>
  );
}
