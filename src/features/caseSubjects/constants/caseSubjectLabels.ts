import type { CaseSubjectRole } from '../api/caseSubjectApi/caseSubjectApi.types.ts';

export const CASE_SUBJECT_ROLE_ORDER = [
  'CLIENT',
  'OPPOSING_PARTY',
  'PARTICIPANT',
  'DECIDING_AUTHORITY',
] as const satisfies readonly CaseSubjectRole[];

export const CASE_SUBJECT_ROLE_LABELS: Record<CaseSubjectRole, string> = {
  CLIENT: 'Klient',
  OPPOSING_PARTY: 'Protistrana',
  PARTICIPANT: 'Zúčastněný subjekt',
  DECIDING_AUTHORITY: 'Rozhodující orgán',
};

export const CASE_SUBJECT_ROLE_OPTIONS = CASE_SUBJECT_ROLE_ORDER.map((role) => ({
  value: role,
  label: CASE_SUBJECT_ROLE_LABELS[role],
}));

export const CASE_SUBJECT_ROLE_GROUP_LABELS: Record<CaseSubjectRole, string> = {
  CLIENT: 'Klient',
  OPPOSING_PARTY: 'Protistrana',
  PARTICIPANT: 'Zúčastněné subjekty',
  DECIDING_AUTHORITY: 'Rozhodující orgány',
};
