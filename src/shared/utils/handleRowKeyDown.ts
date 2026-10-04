import type { KeyboardEvent } from 'react';

// Space selects the row, Enter chooses it, the same as a double click.
export function handleRowKeyDown(
  event: KeyboardEvent<HTMLTableRowElement>,
  select: () => void,
  choose: () => void,
): void {
  if (event.key === 'Enter') {
    choose();
  } else if (event.key === ' ') {
    event.preventDefault();
    select();
  }
}
