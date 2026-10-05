import type { AresSubject } from '../../api/aresApi/aresApi.types.ts';
import { handleRowKeyDown } from '../../../../shared/utils/handleRowKeyDown.ts';
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
            onKeyDown={(event) =>
              handleRowKeyDown(
                event,
                () => onSelect(subject.regNumber),
                () => onChoose(subject.regNumber),
              )
            }
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
