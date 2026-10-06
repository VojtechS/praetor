import { create } from 'zustand';
import type { SubjectCardState } from '../../subjects/hooks/useSubjectCardDefaults.ts';

export type CaseSubjectsDialog =
  | { type: 'roleAdd' }
  | { type: 'roleEdit'; caseSubjectId: number }
  | { type: 'remove'; caseSubjectId: number }
  | { type: 'subjectCard'; subjectCard: SubjectCardState };

interface CaseSubjectsUiState {
  dialog: CaseSubjectsDialog | null;
  openDialog: (dialog: CaseSubjectsDialog) => void;
  closeDialog: () => void;
}

export const useCaseSubjectsUiStore = create<CaseSubjectsUiState>()((set) => ({
  dialog: null,
  openDialog: (dialog) => set({ dialog }),
  closeDialog: () => set({ dialog: null }),
}));
