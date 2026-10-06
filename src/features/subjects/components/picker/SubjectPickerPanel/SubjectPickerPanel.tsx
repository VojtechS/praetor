import { useState } from 'react';
import { useCaseSubjectsUiStore } from '../../../../caseSubjects/store/useCaseSubjectsUiStore.ts';
import { MIN_SEARCH_LENGTH } from '../../../constants/subjectSearch.ts';
import { useSearchDebounce } from '../../../hooks/useSearchDebounce.ts';
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
}

export function SubjectPickerPanel({ target }: Readonly<SubjectPickerPanelProps>) {
  const closePicker = useCaseSubjectsUiStore((state) => state.closePicker);
  const setPickedSubject = useCaseSubjectsUiStore((state) => state.setPickedSubject);
  const openSubjectCard = useCaseSubjectsUiStore((state) => state.openSubjectCard);
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

  function chooseSubject(subjectId: number) {
    setPickedSubject(target, subjectId);
    closePicker();
  }

  function openCard(aresPrefill: string | null) {
    openSubjectCard({ mode: 'create', subjectId: null, aresPrefill, returnTarget: target });
  }

  function removeRepresentative() {
    setPickedSubject('representative', null);
    closePicker();
  }

  return (
    <div className={styles.subjectPickerPanel}>
      <SubjectPickerSearch
        value={search}
        onChange={handleSearchChange}
        onSearch={searchPraetor}
        onAresSearch={isRepresentative ? undefined : searchAres}
        onCreate={() => openCard(null)}
        onRemove={isRepresentative ? removeRepresentative : undefined}
        isAresTooShort={isAresTooShort}
      />
      {submitted.source === 'ares' ? (
        <SubjectPickerAresResults submittedSearch={submitted.term} onChoose={openCard} />
      ) : (
        <SubjectPickerPraetorResults
          submittedSearch={submitted.term}
          showBirthDate={isRepresentative}
          onChoose={chooseSubject}
        />
      )}
    </div>
  );
}
