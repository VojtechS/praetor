import { api } from '../../../services/api/axios.ts';
import type { DataBoxResponse } from './dataBoxApi.types.ts';

export const dataBoxApi = {
  getById: async (id: string): Promise<DataBoxResponse> => {
    const response = await api.get<DataBoxResponse>(`/data-boxes/${id}`);
    return response.data;
  },
};
