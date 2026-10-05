import { checkValue } from '../../../../../shared/utils/checkValue.ts';
import { useSubjectsSearchQuery } from '../../../hooks/queries/useSubjectQueries.ts';
import { formatBirthDate, getSubjectDisplayName } from '../../../utils/subjectUtils.ts';
import { SubjectPickerResults } from '../SubjectPickerResults/SubjectPickerResults.tsx';
import styles from './SubjectPickerPraetorResults.module.scss';

export interface SubjectPickerPraetorResultsProps {
  submittedSearch: string;
  showBirthDate: boolean;
  onChoose: (id: number) => void;
}

export function SubjectPickerPraetorResults({
  submittedSearch,
  showBirthDate,
  onChoose,
}: Readonly<SubjectPickerPraetorResultsProps>) {
  const query = useSubjectsSearchQuery(submittedSearch);
  const subjects = query.data?.data ?? [];

  return (
    <SubjectPickerResults
      sourceLabel="Praetor"
      count={subjects.length}
      isLoading={query.isFetching}
      isError={query.isError}
    >
      <table className={styles.subjectPickerPraetorResults} aria-label="Výsledky hledání">
        <thead>
          <tr>
            <th scope="col">Označení</th>
            <th scope="col">IČO</th>
            <th scope="col">RČ</th>
            {showBirthDate && <th scope="col">Datum nar.</th>}
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id}>
              <td>
                <button
                  type="button"
                  className={styles.subjectPickerPraetorResults__choose}
                  onClick={() => onChoose(subject.id)}
                >
                  {getSubjectDisplayName(subject)}
                </button>
              </td>
              <td>{checkValue(subject.economicSubject?.regNumber)}</td>
              <td>{checkValue(subject.physicalPerson?.personalId)}</td>
              {showBirthDate && <td>{formatBirthDate(subject.physicalPerson?.birthDate)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </SubjectPickerResults>
  );
}
