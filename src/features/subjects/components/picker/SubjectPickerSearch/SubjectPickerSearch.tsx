import { Plus, Search, X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import type { SyntheticEvent } from 'react';
import { Button } from '../../../../../shared/components/Button/Button.tsx';
import styles from './SubjectPickerSearch.module.scss';

export interface SubjectPickerSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onCreate: () => void;
}

export function SubjectPickerSearch({
  value,
  onChange,
  onSearch,
  onCreate,
}: Readonly<SubjectPickerSearchProps>) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  function handleClear() {
    onChange('');
    inputRef.current?.focus();
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
            ref={inputRef}
            className={styles.subjectPickerSearch__input}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Hledat..."
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              className={styles.subjectPickerSearch__clear}
              aria-label="Vymazat hledání"
              onClick={handleClear}
            >
              <X aria-hidden="true" />
            </button>
          )}
        </div>
        <Button icon={Plus} onClick={onCreate}>
          Založit nový
        </Button>
      </form>
    </search>
  );
}
