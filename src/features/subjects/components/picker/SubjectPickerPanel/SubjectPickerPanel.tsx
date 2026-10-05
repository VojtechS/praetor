import {
  selectClosePicker,
  selectOpenSubjectCard,
  selectSetPickedSubject,
  useCaseSubjectsUiStore,
} from '../../../../caseSubjects/store/useCaseSubjectsUiStore.ts';
import { useSubjectPickerSearch } from '../../../hooks/useSubjectPickerSearch.ts';
import { SubjectPickerAresResults } from '../SubjectPickerAresResults/SubjectPickerAresResults.tsx';
import { SubjectPickerPraetorResults } from '../SubjectPickerPraetorResults/SubjectPickerPraetorResults.tsx';
import { SubjectPickerSearch } from '../SubjectPickerSearch/SubjectPickerSearch.tsx';
import styles from './SubjectPickerPanel.module.scss';

export interface SubjectPickerPanelProps {
  target: 'subject' | 'representative';
}

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
      {search.submitted.source === 'ares' ? (
        <SubjectPickerAresResults submittedSearch={search.submitted.term} onChoose={openCard} />
      ) : (
        <SubjectPickerPraetorResults
          submittedSearch={search.submitted.term}
          showBirthDate={isRepresentative}
          onChoose={chooseSubject}
        />
      )}
    </div>
  );
}
