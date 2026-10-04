import { Plus } from 'lucide-react';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import {
  selectOpenRoleDialog,
  useCaseSubjectsUiStore,
} from '../../store/useCaseSubjectsUiStore.ts';
import styles from './CaseSubjectsToolbar.module.scss';

export function CaseSubjectsToolbar() {
  const openRoleDialog = useCaseSubjectsUiStore(selectOpenRoleDialog);

  return (
    <div className={styles.caseSubjectsToolbar} role="toolbar" aria-label="Akce nad subjekty">
      <Button variant="primary" icon={Plus} onClick={() => openRoleDialog('add')}>
        Přidat subjekt
      </Button>
    </div>
  );
}
