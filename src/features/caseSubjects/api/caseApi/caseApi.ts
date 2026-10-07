import { api } from '../../../../services/api/axios.ts';
import type { CaseResponse, SubjectCaseListResponse } from './caseApi.types.ts';

export const caseApi = {
  getById: async (caseId: string): Promise<CaseResponse> => {
    const response = await api.get<CaseResponse>(`/cases/${caseId}`);
    return response.data;
  },

  getBySubject: async (subjectId: number): Promise<SubjectCaseListResponse> => {
    const response = await api.get<SubjectCaseListResponse>(`/subjects/${subjectId}/cases`);
    return response.data;
  },
};
