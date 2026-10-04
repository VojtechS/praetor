import { useState } from 'react';
import { MIN_SEARCH_LENGTH } from '../constants/subjectSearch.ts';

export type SubjectPickerSource = 'praetor' | 'ares';

// Search and selection state of the subject picker. The source of the results is not a switch,
// it follows the button the user pressed last.
export function useSubjectPickerSearch() {
  const [search, setSearch] = useState('');
  const [praetorSearch, setPraetorSearch] = useState('');
  const [aresSearch, setAresSearch] = useState('');
  const [source, setSource] = useState<SubjectPickerSource>('praetor');
  const [isAresTooShort, setIsAresTooShort] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedRegNumber, setSelectedRegNumber] = useState<string | null>(null);

  const canChoose = source === 'ares' ? selectedRegNumber !== null : selectedSubjectId !== null;

  function clearSelection() {
    setSelectedSubjectId(null);
    setSelectedRegNumber(null);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setIsAresTooShort(false);
  }

  function searchPraetor() {
    setPraetorSearch(search.trim());
    setSource('praetor');
    setIsAresTooShort(false);
    clearSelection();
  }

  function searchAres() {
    const trimmed = search.trim();

    if (trimmed.length < MIN_SEARCH_LENGTH) {
      setIsAresTooShort(true);

      return;
    }

    setAresSearch(trimmed);
    setSource('ares');
    clearSelection();
  }

  function reset() {
    setSearch('');
    setPraetorSearch('');
    setAresSearch('');
    setSource('praetor');
    setIsAresTooShort(false);
    clearSelection();
  }

  return {
    search,
    praetorSearch,
    aresSearch,
    source,
    isAresTooShort,
    selectedSubjectId,
    selectedRegNumber,
    canChoose,
    setSelectedSubjectId,
    setSelectedRegNumber,
    handleSearchChange,
    searchPraetor,
    searchAres,
    reset,
  };
}
