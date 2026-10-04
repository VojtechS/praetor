import { api } from '../../../services/api/axios.ts';
import type { CaseResponse } from './caseApi.types.ts';

export const caseApi = {
  getById: async (caseId: string): Promise<CaseResponse> => {
    const response = await api.get<CaseResponse>(`/cases/${caseId}`);
    return response.data;
  },
};
