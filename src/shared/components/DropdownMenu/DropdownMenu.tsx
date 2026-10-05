import type { LucideIcon } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ToggleEvent } from 'react';
import styles from './DropdownMenu.module.scss';

export interface DropdownMenuItem {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  /** Accessible name of the icon-only trigger button. */
  label: string;
  icon: LucideIcon;
  items: DropdownMenuItem[];
  disabled?: boolean;
}

export function DropdownMenu({
  label,
  icon: Icon,
  items,
  disabled = false,
}: Readonly<DropdownMenuProps>) {
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Runs before the menu is shown, so it never renders at a stale position.
  function handleBeforeToggle(event: ToggleEvent<HTMLDivElement>) {
    const rect = buttonRef.current?.getBoundingClientRect();

    if (rect && event.newState === 'open') {
      // The menu is aligned to the right edge of the trigger.
      event.currentTarget.style.top = `${rect.bottom + 4}px`;
      event.currentTarget.style.left = 'auto';
      event.currentTarget.style.right = `${document.documentElement.clientWidth - rect.right}px`;
    }
  }

  function handleToggle(event: ToggleEvent<HTMLDivElement>) {
    setIsOpen(event.newState === 'open');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];

    if (!step) {
      return;
    }

    event.preventDefault();
    const enabled = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:enabled')];
    const next = enabled.indexOf(document.activeElement as HTMLButtonElement) + step;
    enabled.at(next % enabled.length)?.focus();
  }

  function handleSelect(item: DropdownMenuItem) {
    menuRef.current?.hidePopover();
    item.onSelect();
  }

  return (
    <div className={styles.dropdownMenu}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.dropdownMenu__button}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={label}
        disabled={disabled}
        popoverTarget={menuId}
      >
        <Icon className={styles.dropdownMenu__icon} aria-hidden="true" />
      </button>
      <div
        ref={menuRef}
        id={menuId}
        popover="auto"
        role="menu"
        tabIndex={-1}
        className={styles.dropdownMenu__menu}
        onBeforeToggle={handleBeforeToggle}
        onToggle={handleToggle}
        onKeyDown={handleKeyDown}
      >
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            className={styles.dropdownMenu__item}
            disabled={item.disabled}
            onClick={() => handleSelect(item)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
