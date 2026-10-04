import { api } from '../../../services/api/axios.ts';
import type {
  SubjectListParams,
  SubjectListResponse,
  SubjectRequest,
  SubjectResponse,
} from './subjectApi.types.ts';

export const subjectApi = {
  getAll: async (params?: SubjectListParams): Promise<SubjectListResponse> => {
    const response = await api.get<SubjectListResponse>('/subjects', { params });
    return response.data;
  },

  getById: async (id: number): Promise<SubjectResponse> => {
    const response = await api.get<SubjectResponse>(`/subjects/${id}`);
    return response.data;
  },

  create: async (request: SubjectRequest): Promise<SubjectResponse> => {
    const response = await api.post<SubjectResponse>('/subjects', request);
    return response.data;
  },

  update: async (id: number, request: SubjectRequest): Promise<SubjectResponse> => {
    const response = await api.put<SubjectResponse>(`/subjects/${id}`, request);
    return response.data;
  },
};
