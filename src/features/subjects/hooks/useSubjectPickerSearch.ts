import { useEffect, useRef, useState } from 'react';
import { MIN_SEARCH_LENGTH, SEARCH_DEBOUNCE_MS } from '../constants/subjectSearch.ts';

interface SubmittedSearch {
  source: 'praetor' | 'ares';
  term: string;
}

export function useSubjectPickerSearch() {
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState<SubmittedSearch>({ source: 'praetor', term: '' });
  const [isAresTooShort, setIsAresTooShort] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  function handleSearchChange(value: string) {
    const trimmed = value.trim();

    setSearch(value);
    setIsAresTooShort(false);
    clearTimeout(debounceTimer.current);

    if (trimmed.length === 0 || trimmed.length >= MIN_SEARCH_LENGTH) {
      debounceTimer.current = setTimeout(
        () => setSubmitted({ source: 'praetor', term: trimmed }),
        SEARCH_DEBOUNCE_MS,
      );
    }
  }

  function searchPraetor() {
    clearTimeout(debounceTimer.current);
    setIsAresTooShort(false);
    setSubmitted({ source: 'praetor', term: search.trim() });
  }

  function searchAres() {
    clearTimeout(debounceTimer.current);

    const trimmed = search.trim();

    if (trimmed.length < MIN_SEARCH_LENGTH) {
      setIsAresTooShort(true);

      return;
    }

    setSubmitted({ source: 'ares', term: trimmed });
  }

  return { search, submitted, isAresTooShort, handleSearchChange, searchPraetor, searchAres };
}
