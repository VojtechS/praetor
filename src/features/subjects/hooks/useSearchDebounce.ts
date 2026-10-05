import { useEffect, useRef } from 'react';
import { SEARCH_DEBOUNCE_MS } from '../constants/subjectSearch.ts';

export function useSearchDebounce() {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function cancel() {
    clearTimeout(timer.current);
  }

  function schedule(callback: () => void) {
    clearTimeout(timer.current);
    timer.current = setTimeout(callback, SEARCH_DEBOUNCE_MS);
  }

  return { schedule, cancel };
}
