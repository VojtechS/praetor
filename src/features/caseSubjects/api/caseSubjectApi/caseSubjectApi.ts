import { api } from '../../../../services/api/axios.ts';
import type {
  CaseSubjectCreateRequest,
  CaseSubjectListResponse,
  CaseSubjectResponse,
  CaseSubjectUpdateRequest,
} from './caseSubjectApi.types.ts';

export const caseSubjectApi = {
  getAll: async (caseId: string): Promise<CaseSubjectListResponse> => {
    const response = await api.get<CaseSubjectListResponse>(`/cases/${caseId}/subjects`);
    return response.data;
  },

  create: async (
    caseId: string,
    request: CaseSubjectCreateRequest,
  ): Promise<CaseSubjectResponse> => {
    const response = await api.post<CaseSubjectResponse>(`/cases/${caseId}/subjects`, request);
    return response.data;
  },

  update: async (
    caseId: string,
    id: number,
    request: CaseSubjectUpdateRequest,
  ): Promise<CaseSubjectResponse> => {
    const response = await api.patch<CaseSubjectResponse>(
      `/cases/${caseId}/subjects/${id}`,
      request,
    );
    return response.data;
  },

  remove: async (caseId: string, id: number): Promise<void> => {
    await api.delete(`/cases/${caseId}/subjects/${id}`);
  },
};
