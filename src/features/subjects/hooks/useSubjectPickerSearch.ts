import { useEffect, useRef, useState } from 'react';
import { MIN_SEARCH_LENGTH, SEARCH_DEBOUNCE_MS } from '../constants/subjectSearch.ts';

type SubjectPickerSource = 'praetor' | 'ares';

// Search state of the subject picker. The source of the results is not a switch, it follows the
// last search. Typing searches Praetor after a pause (empty or at least MIN_SEARCH_LENGTH
// characters), the buttons search immediately.
export function useSubjectPickerSearch() {
  const [search, setSearch] = useState('');
  const [praetorSearch, setPraetorSearch] = useState('');
  const [aresSearch, setAresSearch] = useState('');
  const [source, setSource] = useState<SubjectPickerSource>('praetor');
  const [isAresTooShort, setIsAresTooShort] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  function applyPraetorSearch(term: string) {
    setPraetorSearch(term);
    setSource('praetor');
    setIsAresTooShort(false);
  }

  function handleSearchChange(value: string) {
    const trimmed = value.trim();

    setSearch(value);
    setIsAresTooShort(false);
    clearTimeout(debounceTimer.current);

    if (trimmed.length === 0 || trimmed.length >= MIN_SEARCH_LENGTH) {
      debounceTimer.current = setTimeout(() => applyPraetorSearch(trimmed), SEARCH_DEBOUNCE_MS);
    }
  }

  function searchPraetor() {
    clearTimeout(debounceTimer.current);
    applyPraetorSearch(search.trim());
  }

  function searchAres() {
    clearTimeout(debounceTimer.current);

    const trimmed = search.trim();

    if (trimmed.length < MIN_SEARCH_LENGTH) {
      setIsAresTooShort(true);

      return;
    }

    setAresSearch(trimmed);
    setSource('ares');
  }

  return {
    search,
    praetorSearch,
    aresSearch,
    source,
    isAresTooShort,
    handleSearchChange,
    searchPraetor,
    searchAres,
  };
}
