import type { CaseSubjectRole } from '../caseSubjectApi/caseSubjectApi.types.ts';

export interface Case {
  id: string;
  number: string;
  name: string;
}

export interface SubjectCase extends Case {
  role: CaseSubjectRole;
  proceduralRole: string | null;
  materialLegalRole: string | null;
}

export interface SubjectCaseListResponse {
  data: SubjectCase[];
}

export interface CaseResponse {
  data: Case;
}
