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

  function handleToggle(event: ToggleEvent<HTMLDivElement>) {
    const rect = buttonRef.current?.getBoundingClientRect();

    setIsOpen(event.newState === 'open');

    if (rect) {
      // The menu is aligned to the right edge of the trigger.
      event.currentTarget.style.top = `${rect.bottom + 4}px`;
      event.currentTarget.style.left = `${rect.right - event.currentTarget.offsetWidth}px`;
    }
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

  // The menu opens on hover (and on click for keyboard and touch), the gap below the trigger is bridged in the SCSS.
  function show() {
    if (!isOpen) {
      menuRef.current?.showPopover();
    }
  }

  function hide() {
    menuRef.current?.hidePopover();
  }

  function handleSelect(item: DropdownMenuItem) {
    menuRef.current?.hidePopover();
    item.onSelect();
  }

  return (
    <div className={styles.dropdownMenu} onMouseEnter={show} onMouseLeave={hide}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.dropdownMenu__button}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={label}
        disabled={disabled}
        onClick={show}
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
