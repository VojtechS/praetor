import type {
  CaseSubject,
  CaseSubjectCreateRequest,
  CaseSubjectRole,
} from '../api/caseSubjectApi/caseSubjectApi.types.ts';
import { CASE_SUBJECT_ROLE_ORDER } from '../constants/caseSubjectLabels.ts';
import type {
  CaseSubjectFormInput,
  CaseSubjectFormValues,
} from '../schemas/caseSubjectForm.schema.ts';

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

const NEW_CASE_SUBJECT_DEFAULTS: Partial<CaseSubjectFormInput> = {
  role: 'CLIENT',
  proceduralRole: '',
  materialLegalRole: '',
  legalRepresentativeId: null,
  caseFileNumber: '',
  preferredRelatedSubjectIds: [],
};

export function getCaseSubjectFormDefaults(item?: CaseSubject): Partial<CaseSubjectFormInput> {
  if (!item) {
    return NEW_CASE_SUBJECT_DEFAULTS;
  }

  return {
    subjectId: item.subjectId,
    role: item.role,
    proceduralRole: item.proceduralRole ?? '',
    materialLegalRole: item.materialLegalRole ?? '',
    legalRepresentativeId: item.legalRepresentativeId,
    caseFileNumber: item.caseFileNumber ?? '',
    preferredRelatedSubjectIds: item.preferredRelatedSubjectIds.map(String),
  };
}

export function toCaseSubjectChanges(
  values: CaseSubjectFormValues,
): Omit<CaseSubjectCreateRequest, 'subjectId'> {
  return {
    role: values.role,
    proceduralRole: values.proceduralRole || null,
    materialLegalRole: values.materialLegalRole || null,
    legalRepresentativeId: values.legalRepresentativeId,
    caseFileNumber: values.caseFileNumber.trim() || null,
    preferredRelatedSubjectIds: values.preferredRelatedSubjectIds,
  };
}

export function toCaseSubjectRequest(values: CaseSubjectFormValues): CaseSubjectCreateRequest {
  return { subjectId: values.subjectId, ...toCaseSubjectChanges(values) };
}
