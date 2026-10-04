import type { SubjectRequest } from './subjectApi.types.ts';

export interface AresSubject {
  regNumber: string;
  name: string;
  address: string;
}

export type AresSubjectDetail = SubjectRequest;

export interface AresSubjectListResponse {
  data: AresSubject[];
}

export interface AresSubjectDetailResponse {
  data: AresSubjectDetail;
}
