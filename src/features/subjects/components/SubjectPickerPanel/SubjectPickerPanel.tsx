import {
  selectClosePicker,
  selectOpenSubjectCard,
  selectSetPickedSubject,
  useCaseSubjectsUiStore,
} from '../../../caseSubjects/store/useCaseSubjectsUiStore.ts';
import { useSubjectPickerSearch } from '../../hooks/useSubjectPickerSearch.ts';
import { SubjectPickerAresResults } from '../SubjectPickerAresResults/SubjectPickerAresResults.tsx';
import { SubjectPickerPraetorResults } from '../SubjectPickerPraetorResults/SubjectPickerPraetorResults.tsx';
import { SubjectPickerSearch } from '../SubjectPickerSearch/SubjectPickerSearch.tsx';
import styles from './SubjectPickerPanel.module.scss';

export interface SubjectPickerPanelProps {
  target: 'subject' | 'representative';
}

// Rendered by its parent only while open, so the search state starts fresh every time.
export function SubjectPickerPanel({ target }: Readonly<SubjectPickerPanelProps>) {
  const closePicker = useCaseSubjectsUiStore(selectClosePicker);
  const setPickedSubject = useCaseSubjectsUiStore(selectSetPickedSubject);
  const openSubjectCard = useCaseSubjectsUiStore(selectOpenSubjectCard);
  const search = useSubjectPickerSearch();

  const isRepresentative = target === 'representative';

  function chooseSubject(subjectId: number) {
    setPickedSubject(target, subjectId);
    closePicker();
  }

  // The card loads the ARES detail itself, the store keeps only the reg. number.
  function openCard(aresPrefill: string | null) {
    openSubjectCard({ mode: 'create', subjectId: null, aresPrefill, returnTarget: target });
    closePicker();
  }

  function removeRepresentative() {
    setPickedSubject('representative', null);
    closePicker();
  }

  return (
    <div className={styles.subjectPickerPanel}>
      <SubjectPickerSearch
        value={search.search}
        onChange={search.handleSearchChange}
        onSearch={search.searchPraetor}
        onAresSearch={isRepresentative ? undefined : search.searchAres}
        onCreate={() => openCard(null)}
        onRemove={isRepresentative ? removeRepresentative : undefined}
        isAresTooShort={search.isAresTooShort}
      />
      {search.source === 'ares' ? (
        <SubjectPickerAresResults
          submittedSearch={search.aresSearch}
          selectedRegNumber={null}
          onSelect={openCard}
          onChoose={openCard}
        />
      ) : (
        <SubjectPickerPraetorResults
          submittedSearch={search.praetorSearch}
          showBirthDate={isRepresentative}
          onChoose={chooseSubject}
        />
      )}
    </div>
  );
}
