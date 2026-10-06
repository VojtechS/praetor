import type {
  CaseSubject,
  CaseSubjectCreateRequest,
  CaseSubjectRole,
  CaseSubjectUpdateRequest,
} from '../api/caseSubjectApi/caseSubjectApi.types.ts';
import { CASE_SUBJECT_ROLE_ORDER } from '../constants/caseSubjectLabels.ts';
import type {
  CaseSubjectFormInput,
  CaseSubjectFormValues,
} from '../schemas/caseSubjectForm.schema.ts';
import type {
  CaseSubjectRoleEditFormInput,
  CaseSubjectRoleEditFormValues,
} from '../schemas/caseSubjectRoleEditForm.schema.ts';

export interface CaseSubjectGroup {
  role: CaseSubjectRole;
  items: CaseSubject[];
}

export function groupCaseSubjectsByRole(items: CaseSubject[]): CaseSubjectGroup[] {
  return CASE_SUBJECT_ROLE_ORDER.map((role) => ({
    role,
    items: items.filter((item) => item.role === role),
  })).filter((group) => group.items.length > 0);
}

export function formatLegalRepresentative(item: CaseSubject): string {
  const regNumber = item.legalRepresentativeRegNumber
    ? `, IČO ${item.legalRepresentativeRegNumber}`
    : '';

  return `Právní zástupce: ${item.legalRepresentativeName}${regNumber}`;
}

export const NEW_CASE_SUBJECT_DEFAULTS: Partial<CaseSubjectFormInput> = {
  role: 'CLIENT',
  proceduralRole: '',
  materialLegalRole: '',
  legalRepresentativeId: null,
  caseFileNumber: '',
  preferredRelatedSubjectIds: [],
};

export function toCaseSubjectRequest(values: CaseSubjectFormValues): CaseSubjectCreateRequest {
  return {
    subjectId: values.subjectId,
    role: values.role,
    proceduralRole: values.proceduralRole || null,
    materialLegalRole: values.materialLegalRole || null,
    legalRepresentativeId: values.legalRepresentativeId,
    caseFileNumber: values.caseFileNumber.trim() || null,
    preferredRelatedSubjectIds: values.preferredRelatedSubjectIds,
  };
}

export function getCaseSubjectRoleEditDefaults(item: CaseSubject): CaseSubjectRoleEditFormInput {
  return {
    role: item.role,
    proceduralRole: item.proceduralRole ?? '',
    materialLegalRole: item.materialLegalRole ?? '',
  };
}

export function toCaseSubjectRoleChanges(
  values: CaseSubjectRoleEditFormValues,
): CaseSubjectUpdateRequest {
  return {
    role: values.role,
    proceduralRole: values.proceduralRole || null,
    materialLegalRole: values.materialLegalRole || null,
  };
}
