import { api } from '../../../services/api/axios.ts';
import type { CodelistName, CodelistResponse } from './codelistApi.types.ts';

export const codelistApi = {
  getByName: async (name: CodelistName): Promise<CodelistResponse> => {
    const response = await api.get<CodelistResponse>(`/codelists/${name}`);
    return response.data;
  },
};
