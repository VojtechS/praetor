import { Globe } from 'lucide-react';
import { useId, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { MIN_SEARCH_LENGTH } from '../../constants/subjectSearch.ts';
import { AresResultsDialog } from '../AresResultsDialog/AresResultsDialog.tsx';
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

  function handleChange(nextValue: string) {
    setValue(nextValue);
    setIsTooShort(false);
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

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

  return (
    <search className={styles.subjectAresSearch}>
      <form className={styles.subjectAresSearch__form} onSubmit={handleSubmit}>
        <label className="visuallyHidden" htmlFor={id}>
          Název / IČO / IDS
        </label>
        <input
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
        <Button type="submit" icon={Globe}>
          Vyhledat v ARES (CZ)
        </Button>
      </form>
      {isTooShort && (
        <p id={validationMessageId} className={styles.subjectAresSearch__validation} role="alert">
          Zadejte alespoň {MIN_SEARCH_LENGTH} znaky
        </p>
      )}
      <AresResultsDialog
        submittedSearch={submittedSearch}
        onSelect={handleSelect}
        onClose={() => setSubmittedSearch(null)}
      />
    </search>
  );
}
