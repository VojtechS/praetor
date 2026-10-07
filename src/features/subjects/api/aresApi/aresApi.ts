import { api } from '../../../../services/api/axios.ts';
import type { AresSource } from '../../constants/aresSources.ts';
import type { AresSubjectDetailResponse, AresSubjectListResponse } from './aresApi.types.ts';

export const aresApi = {
  search: async (query: string, source: AresSource): Promise<AresSubjectListResponse> => {
    const response = await api.get<AresSubjectListResponse>('/ares/subjects', {
      params: { query, source },
    });
    return response.data;
  },

  getByRegNumber: async (regNumber: string): Promise<AresSubjectDetailResponse> => {
    const response = await api.get<AresSubjectDetailResponse>(`/ares/subjects/${regNumber}`);
    return response.data;
  },
};
