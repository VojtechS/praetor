import type {
  CaseSubject as CaseSubjectApi,
  CaseSubjectRole,
} from '../api/caseSubjectApi/caseSubjectApi.types.ts';

export type CaseSubjectListItem = Pick<
  CaseSubjectApi,
  | 'id'
  | 'subjectId'
  | 'subjectName'
  | 'subjectType'
  | 'subjectRegNumber'
  | 'subjectBirthDate'
  | 'role'
  | 'proceduralRole'
  | 'materialLegalRole'
  | 'legalRepresentativeId'
  | 'legalRepresentativeName'
  | 'legalRepresentativeRegNumber'
  | 'caseFileNumber'
  | 'isMainClient'
  | 'isMainPayer'
>;

export type CaseSubjectDetail = Pick<
  CaseSubjectApi,
  | 'id'
  | 'caseId'
  | 'subjectId'
  | 'role'
  | 'proceduralRole'
  | 'materialLegalRole'
  | 'legalRepresentativeId'
  | 'legalRepresentativeName'
  | 'legalRepresentativeRegNumber'
  | 'caseFileNumber'
  | 'preferredContactIds'
  | 'isMainClient'
  | 'isMainPayer'
>;

export interface CaseSubjectGroup {
  role: CaseSubjectRole;
  items: CaseSubjectListItem[];
}
