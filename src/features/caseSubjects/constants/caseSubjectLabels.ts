import type { CaseSubjectRole } from '../api/caseSubjectApi/caseSubjectApi.types.ts';
import { checkValue } from '../../../shared/utils/checkValue.ts';

export const CASE_SUBJECT_ROLE_ORDER: CaseSubjectRole[] = [
  'CLIENT',
  'OPPOSING_PARTY',
  'PARTICIPANT',
  'DECIDING_AUTHORITY',
];

const roleLabels: Record<CaseSubjectRole, string> = {
  CLIENT: 'Klient',
  OPPOSING_PARTY: 'Protistrana',
  PARTICIPANT: 'Zúčastněný subjekt',
  DECIDING_AUTHORITY: 'Rozhodující orgán',
};

export const CASE_SUBJECT_ROLE_OPTIONS = CASE_SUBJECT_ROLE_ORDER.map((role) => ({
  value: role,
  label: roleLabels[role],
}));

const roleGroupLabels: Record<CaseSubjectRole, string> = {
  CLIENT: 'Klient',
  OPPOSING_PARTY: 'Protistrana',
  PARTICIPANT: 'Zúčastněné subjekty',
  DECIDING_AUTHORITY: 'Rozhodující orgány',
};

function isCaseSubjectRole(value: string): value is CaseSubjectRole {
  return value in roleLabels;
}

export function getCaseSubjectRoleLabel(value: string | null | undefined): string {
  const role = checkValue(value);

  return isCaseSubjectRole(role) ? roleLabels[role] : role;
}

export function getCaseSubjectRoleGroupLabel(value: string | null | undefined): string {
  const role = checkValue(value);

  return isCaseSubjectRole(role) ? roleGroupLabels[role] : role;
}
