import { Globe, Search, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent, SyntheticEvent } from 'react';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { MIN_SEARCH_LENGTH, SEARCH_DEBOUNCE_MS } from '../../constants/subjectSearch.ts';
import { SubjectPickerAresResults } from '../SubjectPickerAresResults/SubjectPickerAresResults.tsx';
import styles from './SubjectAresSearch.module.scss';

export interface SubjectAresSearchProps {
  onSelect: (regNumber: string) => void;
}

export function SubjectAresSearch({ onSelect }: Readonly<SubjectAresSearchProps>) {
  const id = useId();
  const validationMessageId = `${id}-validation-message`;
  const [value, setValue] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState<string | null>(null);
  const [isTooShort, setIsTooShort] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  // Typing searches after a pause once there are at least MIN_SEARCH_LENGTH characters, a shorter
  // text keeps the previous results, an empty one closes them. The button searches immediately.
  function handleChange(nextValue: string) {
    const trimmed = nextValue.trim();

    setValue(nextValue);
    setIsTooShort(false);
    clearTimeout(debounceTimer.current);

    if (trimmed.length === 0) {
      setSubmittedSearch(null);
    } else if (trimmed.length >= MIN_SEARCH_LENGTH) {
      debounceTimer.current = setTimeout(() => setSubmittedSearch(trimmed), SEARCH_DEBOUNCE_MS);
    }
  }

  function handleClear() {
    handleChange('');
    inputRef.current?.focus();
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    clearTimeout(debounceTimer.current);

    const trimmed = value.trim();

    if (trimmed.length < MIN_SEARCH_LENGTH) {
      setIsTooShort(true);

      return;
    }

    setSubmittedSearch(trimmed);
  }

  function handleSelect(regNumber: string) {
    setSubmittedSearch(null);
    onSelect(regNumber);
  }

  // Escape closes only the results, not the whole dialog.
  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && submittedSearch !== null) {
      event.preventDefault();
      setSubmittedSearch(null);
    }
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setSubmittedSearch(null);
    }
  }

  return (
    <search className={styles.subjectAresSearch} onKeyDown={handleKeyDown} onBlur={handleBlur}>
      <form className={styles.subjectAresSearch__form} onSubmit={handleSubmit}>
        <label className="visuallyHidden" htmlFor={id}>
          Název / IČO / IDS
        </label>
        <div className={styles.subjectAresSearch__field}>
          <Search className={styles.subjectAresSearch__icon} aria-hidden="true" />
          <input
            ref={inputRef}
            id={id}
            className={styles.subjectAresSearch__input}
            type="text"
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            placeholder="Název / IČO / IDS"
            autoComplete="off"
            aria-invalid={isTooShort}
            aria-describedby={isTooShort ? validationMessageId : undefined}
          />
          {value && (
            <button
              type="button"
              className={styles.subjectAresSearch__clear}
              aria-label="Vymazat hledání"
              onClick={handleClear}
            >
              <X aria-hidden="true" />
            </button>
          )}
        </div>
        <Button type="submit" icon={Globe}>
          Vyhledat v ARES (CZ)
        </Button>
      </form>
      {isTooShort && (
        <p id={validationMessageId} className={styles.subjectAresSearch__validation} role="alert">
          Zadejte alespoň {MIN_SEARCH_LENGTH} znaky
        </p>
      )}
      {submittedSearch !== null && (
        <div className={styles.subjectAresSearch__results} tabIndex={-1}>
          <SubjectPickerAresResults
            submittedSearch={submittedSearch}
            selectedRegNumber={null}
            onSelect={handleSelect}
            onChoose={handleSelect}
          />
        </div>
      )}
    </search>
  );
}
