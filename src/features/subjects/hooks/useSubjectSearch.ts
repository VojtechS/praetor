import { useEffect, useRef, useState } from 'react';
import { MIN_SEARCH_LENGTH, SEARCH_DEBOUNCE_MS } from '../constants/subjectSearch.ts';

export function useSubjectSearch(onSearch: (term: string) => void) {
  const [value, setValue] = useState('');
  const [isTooShort, setIsTooShort] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function change(nextValue: string) {
    const trimmed = nextValue.trim();

    setValue(nextValue);
    setIsTooShort(false);
    clearTimeout(timer.current);

    if (trimmed.length === 0 || trimmed.length >= MIN_SEARCH_LENGTH) {
      timer.current = setTimeout(() => onSearch(trimmed), SEARCH_DEBOUNCE_MS);
    }
  }

  function searchNow() {
    clearTimeout(timer.current);
    setIsTooShort(false);
    onSearch(value.trim());
  }

  function validateTerm(): string | null {
    clearTimeout(timer.current);

    const trimmed = value.trim();

    if (trimmed.length < MIN_SEARCH_LENGTH) {
      setIsTooShort(true);

      return null;
    }

    return trimmed;
  }

  return { value, isTooShort, change, searchNow, validateTerm };
}
