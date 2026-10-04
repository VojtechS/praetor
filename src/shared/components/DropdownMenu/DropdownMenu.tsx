import { ChevronDown } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import type { ToggleEvent } from 'react';
import styles from './DropdownMenu.module.scss';

export interface DropdownMenuItem {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  label: string;
  items: DropdownMenuItem[];
  disabled?: boolean;
}

export function DropdownMenu({ label, items, disabled = false }: Readonly<DropdownMenuProps>) {
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle(event: ToggleEvent<HTMLDivElement>) {
    const rect = buttonRef.current?.getBoundingClientRect();

    setIsOpen(event.newState === 'open');

    if (rect) {
      event.currentTarget.style.top = `${rect.bottom + 4}px`;
      event.currentTarget.style.left = `${rect.left}px`;
    }
  }

  function handleSelect(item: DropdownMenuItem) {
    menuRef.current?.hidePopover();
    item.onSelect();
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.dropdownMenu__button}
        popoverTarget={menuId}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        {label}
        <ChevronDown className={styles.dropdownMenu__icon} aria-hidden="true" />
      </button>
      <div
        ref={menuRef}
        id={menuId}
        popover="auto"
        role="menu"
        className={styles.dropdownMenu__menu}
        onToggle={handleToggle}
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
    </>
  );
}
