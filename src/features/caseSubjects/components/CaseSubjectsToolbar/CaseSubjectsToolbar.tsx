import { FolderOpen, Plus } from 'lucide-react';
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
import styles from './CaseSubjectsToolbar.module.scss';

export interface CaseSubjectsToolbarProps {
  selectedItem: CaseSubjectListItem | undefined;
}

export function CaseSubjectsToolbar({ selectedItem }: Readonly<CaseSubjectsToolbarProps>) {
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
      onSelect: () => openRoleDialog('edit', selectedItem?.id),
    },
    {
      label: 'Odstranit subjekt ze spisu',
      onSelect: () => selectedItem && requestRemove(selectedItem.id),
    },
    {
      label: 'Nastavit jako hlavního plátce',
      onSelect: () =>
        selectedItem &&
        updateMutation.mutate({ id: selectedItem.id, request: { isMainPayer: true } }),
    },
    {
      label: 'Nastavit jako hlavního klienta',
      onSelect: () =>
        selectedItem &&
        updateMutation.mutate({ id: selectedItem.id, request: { isMainClient: true } }),
    },
    {
      label: 'Zobrazit právního zástupce',
      onSelect: () =>
        selectedItem?.legalRepresentativeId && openCard(selectedItem.legalRepresentativeId),
      disabled: !selectedItem?.legalRepresentativeId,
    },
  ];

  return (
    <div className={styles.caseSubjectsToolbar} role="toolbar" aria-label="Akce nad subjekty">
      <Button variant="primary" icon={Plus} onClick={() => openRoleDialog('add')}>
        Přidat subjekt
      </Button>
      <Button
        icon={FolderOpen}
        disabled={!selectedItem}
        onClick={() => selectedItem && openCard(selectedItem.subjectId)}
      >
        Otevřít
      </Button>
      <DropdownMenu label="Další akce" items={menuItems} disabled={!selectedItem} />
    </div>
  );
}
