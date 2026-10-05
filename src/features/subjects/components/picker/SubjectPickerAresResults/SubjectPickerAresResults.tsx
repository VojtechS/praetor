import { useAresSearchQuery } from '../../../hooks/queries/useAresQueries.ts';
import { SubjectPickerResults } from '../SubjectPickerResults/SubjectPickerResults.tsx';
import styles from './SubjectPickerAresResults.module.scss';

export interface SubjectPickerAresResultsProps {
  submittedSearch: string;
  onChoose: (regNumber: string) => void;
}

export function SubjectPickerAresResults({
  submittedSearch,
  onChoose,
}: Readonly<SubjectPickerAresResultsProps>) {
  const query = useAresSearchQuery(submittedSearch);
  const subjects = query.data?.data ?? [];

  return (
    <SubjectPickerResults
      sourceLabel="ARES (CZ)"
      count={subjects.length}
      isLoading={query.isFetching}
      isError={query.isError}
    >
      <table className={styles.subjectPickerAresResults} aria-label="Výsledky z ARES">
        <thead>
          <tr>
            <th scope="col">IČO / RČ</th>
            <th scope="col">Název</th>
            <th scope="col">Adresa</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.regNumber}>
              <td>{subject.regNumber}</td>
              <td>
                <button
                  type="button"
                  className={styles.subjectPickerAresResults__choose}
                  onClick={() => onChoose(subject.regNumber)}
                >
                  {subject.name}
                </button>
              </td>
              <td>{subject.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SubjectPickerResults>
  );
}
