import { MoreHorizontal } from 'lucide-react';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { DropdownMenu } from '../../../../shared/components/DropdownMenu/DropdownMenu.tsx';
import type { DropdownMenuItem } from '../../../../shared/components/DropdownMenu/DropdownMenu.tsx';
import { useUpdateCaseSubjectMutation } from '../../hooks/useCaseSubjectQueries.ts';
import type { CaseSubjectListItem } from '../../model/caseSubject.types.ts';
import {
  selectOpenRoleDialog,
  selectOpenSubjectCard,
  selectRequestRemove,
  useCaseSubjectsUiStore,
} from '../../store/useCaseSubjectsUiStore.ts';
import styles from './CaseSubjectRowActions.module.scss';

export interface CaseSubjectRowActionsProps {
  item: CaseSubjectListItem;
}

export function CaseSubjectRowActions({ item }: Readonly<CaseSubjectRowActionsProps>) {
  const openRoleDialog = useCaseSubjectsUiStore(selectOpenRoleDialog);
  const openSubjectCard = useCaseSubjectsUiStore(selectOpenSubjectCard);
  const requestRemove = useCaseSubjectsUiStore(selectRequestRemove);
  const updateMutation = useUpdateCaseSubjectMutation();

  function openCard(subjectId: number) {
    openSubjectCard({ mode: 'edit', subjectId, aresPrefill: null, returnTarget: null });
  }

  const menuItems: DropdownMenuItem[] = [
    {
      label: 'Nastavit role',
      onSelect: () => openRoleDialog('edit', item.id),
    },
    {
      label: 'Odstranit subjekt ze spisu',
      onSelect: () => requestRemove(item.id),
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
      label: 'Zobrazit právního zástupce',
      disabled: !item.legalRepresentativeId,
      onSelect: () => item.legalRepresentativeId && openCard(item.legalRepresentativeId),
    },
  ];

  return (
    <div className={styles.caseSubjectRowActions}>
      <Button variant="primary" size="small" onClick={() => openCard(item.subjectId)}>
        Otevřít
      </Button>
      <DropdownMenu label="Další akce" icon={MoreHorizontal} items={menuItems} />
    </div>
  );
}
