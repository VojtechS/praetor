import { Globe, Search } from 'lucide-react';
import { useId } from 'react';
import type { SyntheticEvent } from 'react';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { MIN_SEARCH_LENGTH } from '../../constants/subjectSearch.ts';
import styles from './SubjectPickerSearch.module.scss';

export interface SubjectPickerSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onAresSearch?: () => void;
  isAresTooShort?: boolean;
}

export function SubjectPickerSearch({
  value,
  onChange,
  onSearch,
  onAresSearch,
  isAresTooShort = false,
}: Readonly<SubjectPickerSearchProps>) {
  const id = useId();
  const validationMessageId = `${id}-validation-message`;

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  return (
    <search className={styles.subjectPickerSearch}>
      <form className={styles.subjectPickerSearch__form} onSubmit={handleSubmit}>
        <div className={styles.subjectPickerSearch__field}>
          <label className="visuallyHidden" htmlFor={id}>
            Hledaný text
          </label>
          <Search className={styles.subjectPickerSearch__icon} aria-hidden="true" />
          <input
            id={id}
            className={styles.subjectPickerSearch__input}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Hledat..."
            autoComplete="off"
            aria-invalid={isAresTooShort}
            aria-describedby={isAresTooShort ? validationMessageId : undefined}
          />
        </div>
        <Button type="submit">Najít</Button>
        {onAresSearch && (
          <Button icon={Globe} onClick={onAresSearch}>
            Vyhledat v ARES (CZ)
          </Button>
        )}
      </form>
      {isAresTooShort && (
        <p id={validationMessageId} className={styles.subjectPickerSearch__validation} role="alert">
          Zadejte alespoň {MIN_SEARCH_LENGTH} znaky
        </p>
      )}
    </search>
  );
}
