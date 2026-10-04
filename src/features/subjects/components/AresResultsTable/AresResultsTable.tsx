import type { KeyboardEvent } from 'react';
import type { AresSubject } from '../../api/aresApi.types.ts';
import styles from './AresResultsTable.module.scss';

export interface AresResultsTableProps {
  subjects: AresSubject[];
  selectedRegNumber: string | null;
  onSelect: (regNumber: string) => void;
  onChoose: (regNumber: string) => void;
}

export function AresResultsTable({
  subjects,
  selectedRegNumber,
  onSelect,
  onChoose,
}: Readonly<AresResultsTableProps>) {
  // Space selects the row, Enter chooses it, the same as a double click.
  function handleKeyDown(event: KeyboardEvent<HTMLTableRowElement>, regNumber: string) {
    if (event.key === 'Enter') {
      onChoose(regNumber);
    } else if (event.key === ' ') {
      event.preventDefault();
      onSelect(regNumber);
    }
  }

  return (
    <table className={styles.aresResultsTable} role="grid" aria-label="Výsledky z ARES">
      <thead>
        <tr>
          <th scope="col">IČO / RČ</th>
          <th scope="col">Název</th>
          <th scope="col">Adresa</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((subject) => (
          <tr
            key={subject.regNumber}
            tabIndex={0}
            aria-selected={subject.regNumber === selectedRegNumber}
            onClick={() => onSelect(subject.regNumber)}
            onDoubleClick={() => onChoose(subject.regNumber)}
            onKeyDown={(event) => handleKeyDown(event, subject.regNumber)}
          >
            <td>{subject.regNumber}</td>
            <td>{subject.name}</td>
            <td>{subject.address}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
