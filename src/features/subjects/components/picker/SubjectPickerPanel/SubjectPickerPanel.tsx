import { useState } from 'react';
import type { SubjectCardState } from '../../../hooks/useSubjectCardDefaults.ts';
import { useSubjectSearch } from '../../../hooks/useSubjectSearch.ts';
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
  onChoose: (subjectId: number) => void;
}

export function SubjectPickerPanel({ target, onChoose }: Readonly<SubjectPickerPanelProps>) {
  const [subjectCard, setSubjectCard] = useState<SubjectCardState | null>(null);
  const [submitted, setSubmitted] = useState<SubmittedSearch>({ source: 'praetor', term: '' });
  const search = useSubjectSearch((term) => setSubmitted({ source: 'praetor', term }));

  const isRepresentative = target === 'representative';

  function searchAres() {
    const term = search.validateTerm();

    if (term !== null) {
      setSubmitted({ source: 'ares', term });
    }
  }

  function openCard(aresPrefill: string | null) {
    setSubjectCard({ mode: 'create', subjectId: null, aresPrefill });
  }

  return (
    <div className={styles.subjectPickerPanel}>
      <SubjectPickerSearch
        value={search.value}
        onChange={search.change}
        onSearch={search.searchNow}
        onAresSearch={isRepresentative ? undefined : searchAres}
        onCreate={() => openCard(null)}
        isAresTooShort={search.isTooShort}
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
