import { create } from 'zustand';
import type { SubjectCardState } from '../../subjects/hooks/useSubjectCardDefaults.ts';

interface CaseSubjectsUiState {
  isRoleDialogOpen: boolean;
  roleEditId: number | null;
  subjectCard: SubjectCardState | null;
  confirmRemoveId: number | null;
  openRoleDialog: () => void;
  closeRoleDialog: () => void;
  openRoleEdit: (caseSubjectId: number) => void;
  closeRoleEdit: () => void;
  openSubjectCard: (subjectCard: SubjectCardState) => void;
  closeSubjectCard: () => void;
  requestRemove: (caseSubjectId: number) => void;
  cancelRemove: () => void;
}

export const useCaseSubjectsUiStore = create<CaseSubjectsUiState>()((set) => ({
  isRoleDialogOpen: false,
  roleEditId: null,
  subjectCard: null,
  confirmRemoveId: null,
  openRoleDialog: () => set({ isRoleDialogOpen: true }),
  closeRoleDialog: () => set({ isRoleDialogOpen: false }),
  openRoleEdit: (caseSubjectId) => set({ roleEditId: caseSubjectId }),
  closeRoleEdit: () => set({ roleEditId: null }),
  openSubjectCard: (subjectCard) => set({ subjectCard }),
  closeSubjectCard: () => set({ subjectCard: null }),
  requestRemove: (caseSubjectId) => set({ confirmRemoveId: caseSubjectId }),
  cancelRemove: () => set({ confirmRemoveId: null }),
}));
