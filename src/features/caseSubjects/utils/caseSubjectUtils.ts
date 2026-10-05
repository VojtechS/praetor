import type {
  CaseSubject,
  CaseSubjectCreateRequest,
} from '../api/caseSubjectApi/caseSubjectApi.types.ts';
import { CASE_SUBJECT_ROLE_ORDER } from '../constants/caseSubjectLabels.ts';
import type { CaseSubjectGroup, CaseSubjectListItem } from '../model/caseSubject.types.ts';
import type {
  CaseSubjectFormInput,
  CaseSubjectFormValues,
} from '../schemas/caseSubjectForm.schema.ts';

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

const NEW_CASE_SUBJECT_DEFAULTS: Partial<CaseSubjectFormInput> = {
  role: 'CLIENT',
  proceduralRole: '',
  materialLegalRole: '',
  legalRepresentativeId: null,
  caseFileNumber: '',
  preferredContactIds: [],
};

// The subject is not set for a new case subject, the user picks it in the dialog.
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
    preferredContactIds: item.preferredContactIds.map(String),
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
    preferredContactIds: values.preferredContactIds,
  };
}

export function toCaseSubjectRequest(values: CaseSubjectFormValues): CaseSubjectCreateRequest {
  return { subjectId: values.subjectId, ...toCaseSubjectChanges(values) };
}
