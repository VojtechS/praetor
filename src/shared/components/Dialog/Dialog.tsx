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
  isFocusedOnOpen?: boolean;
}

function raiseToasterLayer() {
  const layer = document.querySelector<HTMLElement>('[data-toaster-layer]');

  layer?.hidePopover();
  layer?.showPopover();
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
      raiseToasterLayer();

      if (isFocusedOnOpen) {
        dialog?.focus();
      }
    } else if (!isOpen && dialog?.open) {
      dialog.close();
    }
  }, [isOpen, isFocusedOnOpen]);

  function handleOwnEvent(event: SyntheticEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    // Backdrop click is a mouse-only shortcut; keyboard users close the modal natively with Esc.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      className={clsx(styles.dialog, styles[`dialog--${size}`])}
      aria-labelledby={titleId}
      tabIndex={isFocusedOnOpen ? -1 : undefined}
      onClose={handleOwnEvent}
      onMouseDown={handleOwnEvent}
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
