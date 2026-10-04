import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';
import styles from './Dialog.module.scss';

export interface DialogProps {
  isOpen: boolean;
  title: string;
  size?: 'sm' | 'md' | 'lg';
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  headerExtra?: ReactNode;
}

export function Dialog({
  isOpen,
  title,
  size = 'md',
  onClose,
  children,
  footer,
  headerExtra,
}: Readonly<DialogProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const modifier = styles[`dialog--${size}`];

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen && !dialog?.open) {
      dialog?.showModal();
    } else if (!isOpen && dialog?.open) {
      dialog.close();
    }
  }, [isOpen]);

  // React bubbles the close event of a nested dialog to its parents, only the own closing counts.
  function handleClose(event: SyntheticEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${modifier}`}
      aria-labelledby={titleId}
      onClose={handleClose}
    >
      {isOpen && (
        <>
          <header className={styles.dialog__header}>
            <h2 id={titleId} className={styles.dialog__title}>
              {title}
            </h2>
            {headerExtra && <div className={styles.dialog__headerExtra}>{headerExtra}</div>}
            <button
              type="button"
              className={styles.dialog__close}
              aria-label="Zavřít"
              onClick={onClose}
            >
              <X aria-hidden="true" />
            </button>
          </header>
          <div className={styles.dialog__body}>{children}</div>
          {footer && <footer className={styles.dialog__footer}>{footer}</footer>}
        </>
      )}
    </dialog>
  );
}
