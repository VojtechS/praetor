import { create } from 'zustand';

type PickerTarget = 'subject' | 'representative';

export interface SubjectCardState {
  mode: 'create' | 'edit' | 'view';
  subjectId: number | null;
  aresPrefill: string | null;
  returnTarget: PickerTarget | null;
}

interface PickedSubjectState {
  target: PickerTarget;
  subjectId: number | null;
}

interface CaseSubjectsUiState {
  isRoleDialogOpen: boolean;
  roleEditId: number | null;
  picker: PickerTarget | null;
  subjectCard: SubjectCardState | null;
  pickedSubject: PickedSubjectState | null;
  confirmRemoveId: number | null;
  openRoleDialog: () => void;
  closeRoleDialog: () => void;
  openRoleEdit: (caseSubjectId: number) => void;
  closeRoleEdit: () => void;
  togglePicker: (target: PickerTarget) => void;
  closePicker: () => void;
  openSubjectCard: (subjectCard: SubjectCardState) => void;
  closeSubjectCard: () => void;
  setPickedSubject: (target: PickerTarget, subjectId: number | null) => void;
  clearPickedSubject: () => void;
  requestRemove: (caseSubjectId: number) => void;
  cancelRemove: () => void;
}

export const useCaseSubjectsUiStore = create<CaseSubjectsUiState>()((set) => ({
  isRoleDialogOpen: false,
  roleEditId: null,
  picker: null,
  subjectCard: null,
  pickedSubject: null,
  confirmRemoveId: null,
  openRoleDialog: () => set({ isRoleDialogOpen: true }),
  closeRoleDialog: () => set({ isRoleDialogOpen: false, picker: null, pickedSubject: null }),
  openRoleEdit: (caseSubjectId) => set({ roleEditId: caseSubjectId }),
  closeRoleEdit: () => set({ roleEditId: null }),
  togglePicker: (target) => set((state) => ({ picker: state.picker === target ? null : target })),
  closePicker: () => set({ picker: null }),
  openSubjectCard: (subjectCard) => set({ subjectCard }),
  closeSubjectCard: () => set({ subjectCard: null }),
  setPickedSubject: (target, subjectId) => set({ pickedSubject: { target, subjectId } }),
  clearPickedSubject: () => set({ pickedSubject: null }),
  requestRemove: (caseSubjectId) => set({ confirmRemoveId: caseSubjectId }),
  cancelRemove: () => set({ confirmRemoveId: null }),
}));
