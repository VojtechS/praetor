import { Landmark, ShieldCheck, Swords, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '../../../../shared/components/Badge/Badge.tsx';
import type { CaseSubjectRole } from '../../api/caseSubjectApi/caseSubjectApi.types.ts';
import { CASE_SUBJECT_ROLE_GROUP_LABELS } from '../../constants/caseSubjectLabels.ts';
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
    <div role="row">
      <div
        role="rowheader"
        aria-colspan={6}
        className={`${styles.caseSubjectGroupHeader} ${modifierClass}`}
      >
        <span className={styles.caseSubjectGroupHeader__content}>
          <Icon className={styles.caseSubjectGroupHeader__icon} aria-hidden="true" />
          <span>{CASE_SUBJECT_ROLE_GROUP_LABELS[role]}</span>
          <Badge>{count}</Badge>
        </span>
      </div>
    </div>
  );
}
