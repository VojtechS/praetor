import { useState } from 'react';
import { MIN_SEARCH_LENGTH } from '../constants/subjectSearch.ts';
import { useSearchDebounce } from './useSearchDebounce.ts';

interface SubmittedSearch {
  source: 'praetor' | 'ares';
  term: string;
}

export function useSubjectPickerSearch() {
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState<SubmittedSearch>({ source: 'praetor', term: '' });
  const [isAresTooShort, setIsAresTooShort] = useState(false);
  const debounce = useSearchDebounce();

  function handleSearchChange(value: string) {
    const trimmed = value.trim();

    setSearch(value);
    setIsAresTooShort(false);
    debounce.cancel();

    if (trimmed.length === 0 || trimmed.length >= MIN_SEARCH_LENGTH) {
      debounce.schedule(() => setSubmitted({ source: 'praetor', term: trimmed }));
    }
  }

  function searchPraetor() {
    debounce.cancel();
    setIsAresTooShort(false);
    setSubmitted({ source: 'praetor', term: search.trim() });
  }

  function searchAres() {
    debounce.cancel();

    const trimmed = search.trim();

    if (trimmed.length < MIN_SEARCH_LENGTH) {
      setIsAresTooShort(true);

      return;
    }

    setSubmitted({ source: 'ares', term: trimmed });
  }

  return { search, submitted, isAresTooShort, handleSearchChange, searchPraetor, searchAres };
}
