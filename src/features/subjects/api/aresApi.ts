import { api } from '../../../services/api/axios.ts';
import type { AresSubjectDetailResponse, AresSubjectListResponse } from './aresApi.types.ts';

export const aresApi = {
  search: async (query: string): Promise<AresSubjectListResponse> => {
    const response = await api.get<AresSubjectListResponse>('/ares/subjects', {
      params: { query, country: 'CZ' },
    });
    return response.data;
  },

  getByRegNumber: async (regNumber: string): Promise<AresSubjectDetailResponse> => {
    const response = await api.get<AresSubjectDetailResponse>(`/ares/subjects/${regNumber}`);
    return response.data;
  },
};
