import { MoreHorizontal, Pencil } from 'lucide-react';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { DropdownMenu } from '../../../../shared/components/DropdownMenu/DropdownMenu.tsx';
import type { DropdownMenuItem } from '../../../../shared/components/DropdownMenu/DropdownMenu.tsx';
import { useUpdateCaseSubjectMutation } from '../../hooks/useCaseSubjectQueries.ts';
import type { CaseSubject } from '../../api/caseSubjectApi/caseSubjectApi.types.ts';
import { useCaseSubjectsUiStore } from '../../store/useCaseSubjectsUiStore.ts';
import styles from './CaseSubjectRowActions.module.scss';

export interface CaseSubjectRowActionsProps {
  caseId: string;
  item: CaseSubject;
}

export function CaseSubjectRowActions({ caseId, item }: Readonly<CaseSubjectRowActionsProps>) {
  const openRoleEdit = useCaseSubjectsUiStore((state) => state.openRoleEdit);
  const openSubjectCard = useCaseSubjectsUiStore((state) => state.openSubjectCard);
  const requestRemove = useCaseSubjectsUiStore((state) => state.requestRemove);

  const updateMutation = useUpdateCaseSubjectMutation(caseId);

  function openCard(subjectId: number, mode: 'edit' | 'view' = 'edit') {
    openSubjectCard({ mode, subjectId, aresPrefill: null, returnTarget: null });
  }

  const menuItems: DropdownMenuItem[] = [
    {
      label: 'Nastavit role',
      onSelect: () => openRoleEdit(item.id),
    },
    {
      label: 'Nastavit jako hlavního plátce',
      disabled: updateMutation.isPending,
      onSelect: () => updateMutation.mutate({ id: item.id, request: { isMainPayer: true } }),
    },
    {
      label: 'Nastavit jako hlavního klienta',
      disabled: updateMutation.isPending,
      onSelect: () => updateMutation.mutate({ id: item.id, request: { isMainClient: true } }),
    },
    {
      label: 'Odstranit subjekt ze spisu',
      onSelect: () => requestRemove(item.id),
    },
    {
      label: 'Zobrazit právního zástupce',
      disabled: !item.legalRepresentativeId,
      onSelect: () => item.legalRepresentativeId && openCard(item.legalRepresentativeId, 'view'),
    },
  ];

  return (
    <div className={styles.caseSubjectRowActions}>
      <Button variant="primary" size="small" icon={Pencil} onClick={() => openCard(item.subjectId)}>
        Upravit
      </Button>
      <DropdownMenu label="Další akce" icon={MoreHorizontal} items={menuItems} />
    </div>
  );
}
