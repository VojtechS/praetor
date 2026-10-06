import { useState } from 'react';
import { MIN_SEARCH_LENGTH } from '../../../constants/subjectSearch.ts';
import { useSearchDebounce } from '../../../hooks/useSearchDebounce.ts';
import type { SubjectCardState } from '../../../hooks/useSubjectCardDefaults.ts';
import { SubjectCardDialog } from '../../card/SubjectCardDialog/SubjectCardDialog.tsx';
import { SubjectPickerAresResults } from '../SubjectPickerAresResults/SubjectPickerAresResults.tsx';
import { SubjectPickerPraetorResults } from '../SubjectPickerPraetorResults/SubjectPickerPraetorResults.tsx';
import { SubjectPickerSearch } from '../SubjectPickerSearch/SubjectPickerSearch.tsx';
import styles from './SubjectPickerPanel.module.scss';

interface SubmittedSearch {
  source: 'praetor' | 'ares';
  term: string;
}

export interface SubjectPickerPanelProps {
  target: 'subject' | 'representative';
  onChoose: (subjectId: number | null) => void;
}

export function SubjectPickerPanel({ target, onChoose }: Readonly<SubjectPickerPanelProps>) {
  const [subjectCard, setSubjectCard] = useState<SubjectCardState | null>(null);
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState<SubmittedSearch>({ source: 'praetor', term: '' });
  const [isAresTooShort, setIsAresTooShort] = useState(false);
  const debounce = useSearchDebounce();

  const isRepresentative = target === 'representative';

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

  function openCard(aresPrefill: string | null) {
    setSubjectCard({ mode: 'create', subjectId: null, aresPrefill });
  }

  return (
    <div className={styles.subjectPickerPanel}>
      <SubjectPickerSearch
        value={search}
        onChange={handleSearchChange}
        onSearch={searchPraetor}
        onAresSearch={isRepresentative ? undefined : searchAres}
        onCreate={() => openCard(null)}
        onRemove={isRepresentative ? () => onChoose(null) : undefined}
        isAresTooShort={isAresTooShort}
      />
      {submitted.source === 'ares' ? (
        <SubjectPickerAresResults submittedSearch={submitted.term} onChoose={openCard} />
      ) : (
        <SubjectPickerPraetorResults
          submittedSearch={submitted.term}
          showBirthDate={isRepresentative}
          onChoose={onChoose}
        />
      )}
      <SubjectCardDialog
        subjectCard={subjectCard}
        onClose={() => setSubjectCard(null)}
        onCreated={onChoose}
      />
    </div>
  );
}
