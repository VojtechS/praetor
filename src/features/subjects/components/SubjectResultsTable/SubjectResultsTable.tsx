import { checkValue } from '../../../../shared/utils/checkValue.ts';
import type { SubjectListItem } from '../../model/subject.types.ts';
import { formatBirthDate, getSubjectDisplayName } from '../../utils/subjectUtils.ts';
import { handleRowKeyDown } from '../../../../shared/utils/handleRowKeyDown.ts';
import styles from './SubjectResultsTable.module.scss';

export interface SubjectResultsTableProps {
  subjects: SubjectListItem[];
  showBirthDate: boolean;
  onChoose: (id: number) => void;
}

export function SubjectResultsTable({
  subjects,
  showBirthDate,
  onChoose,
}: Readonly<SubjectResultsTableProps>) {
  return (
    <table className={styles.subjectResultsTable} role="grid" aria-label="Výsledky hledání">
      <thead>
        <tr>
          <th scope="col">Označení</th>
          <th scope="col">IČO</th>
          <th scope="col">RČ</th>
          {showBirthDate && <th scope="col">Datum nar.</th>}
        </tr>
      </thead>
      <tbody>
        {subjects.map((subject) => {
          const birthDate = subject.physicalPerson?.birthDate;

          return (
            <tr
              key={subject.id}
              tabIndex={0}
              onClick={() => onChoose(subject.id)}
              onKeyDown={(event) =>
                handleRowKeyDown(
                  event,
                  () => onChoose(subject.id),
                  () => onChoose(subject.id),
                )
              }
            >
              <td>{getSubjectDisplayName(subject)}</td>
              <td>{checkValue(subject.economicSubject?.regNumber)}</td>
              <td>{checkValue(subject.physicalPerson?.personalId)}</td>
              {showBirthDate && (
                <td>{birthDate ? formatBirthDate(birthDate) : checkValue(null)}</td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
