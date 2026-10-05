import { Trash2 } from 'lucide-react';
import { Button } from '../Button/Button.tsx';
import { Dialog } from '../Dialog/Dialog.tsx';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Potvrdit',
  isLoading = false,
  onConfirm,
  onCancel,
}: Readonly<ConfirmDialogProps>) {
  return (
    <Dialog
      isOpen={isOpen}
      title={title}
      size="sm"
      onClose={onCancel}
      footer={
        <Button variant="dangerSolid" icon={Trash2} disabled={isLoading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      }
    >
      <p>{message}</p>
    </Dialog>
  );
}
