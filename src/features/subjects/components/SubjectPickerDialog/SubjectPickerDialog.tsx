import { Dialog } from '../../../../shared/components/Dialog/Dialog.tsx';
import {
  selectClosePicker,
  selectOpenSubjectCard,
  selectPicker,
  selectSetPickedSubject,
  useCaseSubjectsUiStore,
} from '../../../caseSubjects/store/useCaseSubjectsUiStore.ts';
import { useSubjectPickerSearch } from '../../hooks/useSubjectPickerSearch.ts';
import { SubjectPickerAresResults } from '../SubjectPickerAresResults/SubjectPickerAresResults.tsx';
import { SubjectPickerFooter } from '../SubjectPickerFooter/SubjectPickerFooter.tsx';
import { SubjectPickerPraetorResults } from '../SubjectPickerPraetorResults/SubjectPickerPraetorResults.tsx';
import { SubjectPickerSearch } from '../SubjectPickerSearch/SubjectPickerSearch.tsx';
import styles from './SubjectPickerDialog.module.scss';

export function SubjectPickerDialog() {
  const picker = useCaseSubjectsUiStore(selectPicker);
  const closePicker = useCaseSubjectsUiStore(selectClosePicker);
  const setPickedSubject = useCaseSubjectsUiStore(selectSetPickedSubject);
  const openSubjectCard = useCaseSubjectsUiStore(selectOpenSubjectCard);
  const search = useSubjectPickerSearch();

  const target = picker?.target ?? 'subject';
  const isRepresentative = target === 'representative';
  const isAres = search.source === 'ares';

  function close() {
    search.reset();
    closePicker();
  }

  function chooseSubject(subjectId: number) {
    setPickedSubject(target, subjectId);
    close();
  }

  // The card loads the ARES detail itself, the store keeps only the reg. number.
  function openCard(aresPrefill: string | null) {
    openSubjectCard({ mode: 'create', subjectId: null, aresPrefill, returnTarget: target });
    close();
  }

  function removeRepresentative() {
    setPickedSubject('representative', null);
    close();
  }

  function chooseSelected() {
    if (isAres && search.selectedRegNumber) {
      openCard(search.selectedRegNumber);
    } else if (!isAres && search.selectedSubjectId !== null) {
      chooseSubject(search.selectedSubjectId);
    }
  }

  return (
    <Dialog
      isOpen={picker !== null}
      title={isRepresentative ? 'Právní zástupce' : 'Seznam subjektů'}
      size="lg"
      onClose={close}
      footer={
        <SubjectPickerFooter
          canChoose={search.canChoose}
          onChoose={chooseSelected}
          onCreate={() => openCard(null)}
          onCancel={close}
          onRemove={isRepresentative ? removeRepresentative : undefined}
        />
      }
    >
      <div className={styles.subjectPickerDialog}>
        <SubjectPickerSearch
          value={search.search}
          onChange={search.handleSearchChange}
          onSearch={search.searchPraetor}
          onAresSearch={isRepresentative ? undefined : search.searchAres}
          isAresTooShort={search.isAresTooShort}
        />
        {isAres ? (
          <SubjectPickerAresResults
            submittedSearch={search.aresSearch}
            selectedRegNumber={search.selectedRegNumber}
            onSelect={search.setSelectedRegNumber}
            onChoose={openCard}
          />
        ) : (
          <SubjectPickerPraetorResults
            submittedSearch={search.praetorSearch}
            selectedId={search.selectedSubjectId}
            showBirthDate={isRepresentative}
            onSelect={search.setSelectedSubjectId}
            onChoose={chooseSubject}
          />
        )}
      </div>
    </Dialog>
  );
}
