import { Globe, Search, X } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent, SyntheticEvent } from 'react';
import { Button } from '../../../../../shared/components/Button/Button.tsx';
import { MIN_SEARCH_LENGTH } from '../../../constants/subjectSearch.ts';
import { useSearchDebounce } from '../../../hooks/useSearchDebounce.ts';
import { SubjectPickerAresResults } from '../../picker/SubjectPickerAresResults/SubjectPickerAresResults.tsx';
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
  const debounce = useSearchDebounce();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(nextValue: string) {
    const trimmed = nextValue.trim();

    setValue(nextValue);
    setIsTooShort(false);
    debounce.cancel();

    if (trimmed.length === 0) {
      setSubmittedSearch(null);
    } else if (trimmed.length >= MIN_SEARCH_LENGTH) {
      debounce.schedule(() => setSubmittedSearch(trimmed));
    }
  }

  function handleClear() {
    handleChange('');
    inputRef.current?.focus();
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    debounce.cancel();

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
          <SubjectPickerAresResults submittedSearch={submittedSearch} onChoose={handleSelect} />
        </div>
      )}
    </search>
  );
}
