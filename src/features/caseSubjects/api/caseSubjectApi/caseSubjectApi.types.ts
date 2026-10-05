import type { SubjectType } from '../../../subjects/api/subjectApi/subjectApi.types.ts';

export type CaseSubjectRole = 'CLIENT' | 'OPPOSING_PARTY' | 'PARTICIPANT' | 'DECIDING_AUTHORITY';

export interface CaseSubject {
  id: number;
  caseId: string;
  subjectId: number;
  subjectName: string;
  subjectType: SubjectType;
  subjectRegNumber: string | null;
  subjectBirthDate: string | null;
  role: CaseSubjectRole;
  proceduralRole: string | null;
  materialLegalRole: string | null;
  legalRepresentativeId: number | null;
  legalRepresentativeName: string | null;
  legalRepresentativeRegNumber: string | null;
  caseFileNumber: string | null;
  preferredContactIds: number[];
  isMainClient: boolean;
  isMainPayer: boolean;
}

export type CaseSubjectCreateRequest = Pick<
  CaseSubject,
  | 'subjectId'
  | 'role'
  | 'proceduralRole'
  | 'materialLegalRole'
  | 'legalRepresentativeId'
  | 'caseFileNumber'
  | 'preferredContactIds'
>;

export type CaseSubjectUpdateRequest = Partial<
  Omit<CaseSubjectCreateRequest, 'subjectId'> & Pick<CaseSubject, 'isMainClient' | 'isMainPayer'>
>;

export interface CaseSubjectListResponse {
  data: CaseSubject[];
}

export interface CaseSubjectResponse {
  data: CaseSubject;
}
