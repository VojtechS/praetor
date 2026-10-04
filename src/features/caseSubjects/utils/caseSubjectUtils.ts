import { CASE_SUBJECT_ROLE_ORDER } from '../constants/caseSubjectLabels.ts';
import type { CaseSubjectGroup, CaseSubjectListItem } from '../model/caseSubject.types.ts';

export function groupCaseSubjectsByRole(items: CaseSubjectListItem[]): CaseSubjectGroup[] {
  return CASE_SUBJECT_ROLE_ORDER.map((role) => ({
    role,
    items: items.filter((item) => item.role === role),
  })).filter((group) => group.items.length > 0);
}

export function formatLegalRepresentative(item: CaseSubjectListItem): string {
  const regNumber = item.legalRepresentativeRegNumber
    ? `, IČO ${item.legalRepresentativeRegNumber}`
    : '';

  return `Právní zástupce: ${item.legalRepresentativeName}${regNumber}`;
}
