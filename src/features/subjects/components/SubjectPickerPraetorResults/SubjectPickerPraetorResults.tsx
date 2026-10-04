import { useSubjectsSearchQuery } from '../../hooks/useSubjectQueries.ts';
import { SubjectPickerResults } from '../SubjectPickerResults/SubjectPickerResults.tsx';
import { SubjectResultsTable } from '../SubjectResultsTable/SubjectResultsTable.tsx';

export interface SubjectPickerPraetorResultsProps {
  submittedSearch: string;
  selectedId: number | null;
  showBirthDate: boolean;
  onSelect: (id: number) => void;
  onChoose: (id: number) => void;
}

// Mounted only while the picker is open, so the list is loaded right after opening.
export function SubjectPickerPraetorResults({
  submittedSearch,
  selectedId,
  showBirthDate,
  onSelect,
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
      <SubjectResultsTable
        subjects={subjects}
        selectedId={selectedId}
        showBirthDate={showBirthDate}
        onSelect={onSelect}
        onChoose={onChoose}
      />
    </SubjectPickerResults>
  );
}
