import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import clsx from 'clsx';
import type { ReactNode, SyntheticEvent } from 'react';
import styles from './Dialog.module.scss';

export interface DialogProps {
  isOpen: boolean;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  headerExtra?: ReactNode;
  /** Focuses the dialog itself, not its first control (e.g. a search field in the header). */
  isFocusedOnOpen?: boolean;
}

export function Dialog({
  isOpen,
  title,
  size = 'md',
  onClose,
  children,
  footer,
  headerExtra,
  isFocusedOnOpen = false,
}: Readonly<DialogProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen && !dialog?.open) {
      dialog?.showModal();

      if (isFocusedOnOpen) {
        dialog?.focus();
      }
    } else if (!isOpen && dialog?.open) {
      dialog.close();
    }
  }, [isOpen, isFocusedOnOpen]);

  // React bubbles the close event of a nested dialog to its parents, only the own closing counts.
  function handleClose(event: SyntheticEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={clsx(styles.dialog, styles[`dialog--${size}`])}
      aria-labelledby={titleId}
      tabIndex={isFocusedOnOpen ? -1 : undefined}
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
