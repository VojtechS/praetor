import { Check, Plus } from 'lucide-react';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import styles from './SubjectPickerFooter.module.scss';

export interface SubjectPickerFooterProps {
  canChoose: boolean;
  onChoose: () => void;
  onCreate: () => void;
  onCancel: () => void;
  onRemove?: () => void;
}

export function SubjectPickerFooter({
  canChoose,
  onChoose,
  onCreate,
  onCancel,
  onRemove,
}: Readonly<SubjectPickerFooterProps>) {
  return (
    <div className={styles.subjectPickerFooter}>
      <div className={styles.subjectPickerFooter__group}>
        <Button icon={Plus} onClick={onCreate}>
          Založit nový
        </Button>
        {onRemove && <Button onClick={onRemove}>Smazat</Button>}
      </div>
      <div className={styles.subjectPickerFooter__group}>
        <Button variant="primary" icon={Check} disabled={!canChoose} onClick={onChoose}>
          Vybrat
        </Button>
        <Button onClick={onCancel}>Storno</Button>
      </div>
    </div>
  );
}
