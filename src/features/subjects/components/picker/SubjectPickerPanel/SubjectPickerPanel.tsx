import { useState } from 'react';
import type { SubjectCardState } from '../../../hooks/useSubjectCardDefaults.ts';
import { useSubjectSearch } from '../../../hooks/useSubjectSearch.ts';
import { SubjectCardDialog } from '../../card/SubjectCardDialog/SubjectCardDialog.tsx';
import { SubjectPickerPraetorResults } from '../SubjectPickerPraetorResults/SubjectPickerPraetorResults.tsx';
import { SubjectPickerSearch } from '../SubjectPickerSearch/SubjectPickerSearch.tsx';
import styles from './SubjectPickerPanel.module.scss';

export interface SubjectPickerPanelProps {
  isRepresentative?: boolean;
  onChoose: (subjectId: number) => void;
}

export function SubjectPickerPanel({
  isRepresentative = false,
  onChoose,
}: Readonly<SubjectPickerPanelProps>) {
  const [subjectCard, setSubjectCard] = useState<SubjectCardState | null>(null);
  const [submittedSearch, setSubmittedSearch] = useState('');
  const search = useSubjectSearch(setSubmittedSearch);

  return (
    <div className={styles.subjectPickerPanel}>
      <SubjectPickerSearch
        value={search.value}
        onChange={search.change}
        onSearch={search.searchNow}
        onCreate={() => setSubjectCard({ mode: 'create', subjectId: null, aresPrefill: null })}
      />
      <SubjectPickerPraetorResults
        submittedSearch={submittedSearch}
        showBirthDate={isRepresentative}
        onChoose={onChoose}
      />
      <SubjectCardDialog
        subjectCard={subjectCard}
        onClose={() => setSubjectCard(null)}
        onCreated={onChoose}
      />
    </div>
  );
}
