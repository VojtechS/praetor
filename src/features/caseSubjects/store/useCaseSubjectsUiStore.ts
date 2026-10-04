import { create } from 'zustand';

export type PickerTarget = 'subject' | 'representative';

export interface RoleDialogState {
  mode: 'add' | 'edit';
  caseSubjectId: number | null;
}

export interface PickerState {
  target: PickerTarget;
}

export interface SubjectCardState {
  mode: 'create' | 'edit';
  subjectId: number | null;
  aresPrefill: string | null;
  returnTarget: PickerTarget | null;
}

// A null subjectId of the representative means "Smazat" (remove the representative).
export interface PickedSubjectState {
  target: PickerTarget;
  subjectId: number | null;
}

export interface CaseSubjectsUiState {
  roleDialog: RoleDialogState | null;
  picker: PickerState | null;
  subjectCard: SubjectCardState | null;
  pickedSubject: PickedSubjectState | null;
  confirmRemoveId: number | null;
  openRoleDialog: (mode: RoleDialogState['mode'], caseSubjectId?: number | null) => void;
  closeRoleDialog: () => void;
  openPicker: (target: PickerTarget) => void;
  closePicker: () => void;
  openSubjectCard: (subjectCard: SubjectCardState) => void;
  closeSubjectCard: () => void;
  setPickedSubject: (target: PickerTarget, subjectId: number | null) => void;
  clearPickedSubject: () => void;
  requestRemove: (caseSubjectId: number) => void;
  cancelRemove: () => void;
}

export const useCaseSubjectsUiStore = create<CaseSubjectsUiState>()((set) => ({
  roleDialog: null,
  picker: null,
  subjectCard: null,
  pickedSubject: null,
  confirmRemoveId: null,
  openRoleDialog: (mode, caseSubjectId = null) => set({ roleDialog: { mode, caseSubjectId } }),
  closeRoleDialog: () => set({ roleDialog: null, pickedSubject: null }),
  openPicker: (target) => set({ picker: { target } }),
  closePicker: () => set({ picker: null }),
  openSubjectCard: (subjectCard) => set({ subjectCard }),
  closeSubjectCard: () => set({ subjectCard: null }),
  setPickedSubject: (target, subjectId) => set({ pickedSubject: { target, subjectId } }),
  clearPickedSubject: () => set({ pickedSubject: null }),
  requestRemove: (caseSubjectId) => set({ confirmRemoveId: caseSubjectId }),
  cancelRemove: () => set({ confirmRemoveId: null }),
}));

export const selectRoleDialog = (state: CaseSubjectsUiState) => state.roleDialog;
export const selectPicker = (state: CaseSubjectsUiState) => state.picker;
export const selectSubjectCard = (state: CaseSubjectsUiState) => state.subjectCard;
export const selectPickedSubject = (state: CaseSubjectsUiState) => state.pickedSubject;
export const selectConfirmRemoveId = (state: CaseSubjectsUiState) => state.confirmRemoveId;
export const selectOpenRoleDialog = (state: CaseSubjectsUiState) => state.openRoleDialog;
export const selectCloseRoleDialog = (state: CaseSubjectsUiState) => state.closeRoleDialog;
export const selectOpenPicker = (state: CaseSubjectsUiState) => state.openPicker;
export const selectClosePicker = (state: CaseSubjectsUiState) => state.closePicker;
export const selectOpenSubjectCard = (state: CaseSubjectsUiState) => state.openSubjectCard;
export const selectCloseSubjectCard = (state: CaseSubjectsUiState) => state.closeSubjectCard;
export const selectSetPickedSubject = (state: CaseSubjectsUiState) => state.setPickedSubject;
export const selectClearPickedSubject = (state: CaseSubjectsUiState) => state.clearPickedSubject;
export const selectRequestRemove = (state: CaseSubjectsUiState) => state.requestRemove;
export const selectCancelRemove = (state: CaseSubjectsUiState) => state.cancelRemove;
