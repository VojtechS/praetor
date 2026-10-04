import { useAresSearchQuery } from '../../hooks/useAresQueries.ts';
import { AresResultsTable } from '../AresResultsTable/AresResultsTable.tsx';
import { SubjectPickerResults } from '../SubjectPickerResults/SubjectPickerResults.tsx';

export interface SubjectPickerAresResultsProps {
  submittedSearch: string;
  selectedRegNumber: string | null;
  onSelect: (regNumber: string) => void;
  onChoose: (regNumber: string) => void;
}

export function SubjectPickerAresResults({
  submittedSearch,
  selectedRegNumber,
  onSelect,
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
      <AresResultsTable
        subjects={subjects}
        selectedRegNumber={selectedRegNumber}
        onSelect={onSelect}
        onChoose={onChoose}
      />
    </SubjectPickerResults>
  );
}
