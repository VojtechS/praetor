import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { caseApi } from '../api/caseApi/caseApi.ts';
import { caseSubjectApi } from '../api/caseSubjectApi/caseSubjectApi.ts';
import type {
  CaseSubjectCreateRequest,
  CaseSubjectUpdateRequest,
} from '../api/caseSubjectApi/caseSubjectApi.types.ts';

const CASE_QUERY_KEY = (caseId: string) => ['cases', caseId] as const;
export const CASE_SUBJECTS_QUERY_KEY = ['caseSubjects'] as const;
const CASE_SUBJECTS_BY_CASE_QUERY_KEY = (caseId: string) =>
  [...CASE_SUBJECTS_QUERY_KEY, caseId] as const;

const HTTP_CONFLICT = 409;

export function useCaseQuery(caseId: string) {
  return useQuery({
    queryKey: CASE_QUERY_KEY(caseId),
    queryFn: () => caseApi.getById(caseId),
    meta: { errorMessage: 'Nepodařilo se načíst spis.' },
  });
}

export function useSubjectCasesQuery(subjectId: number) {
  return useQuery({
    queryKey: [...CASE_SUBJECTS_QUERY_KEY, 'bySubject', subjectId],
    queryFn: () => caseApi.getBySubject(subjectId),
    meta: { errorMessage: 'Nepodařilo se načíst spisy subjektu.' },
  });
}

export function useCaseSubjectsQuery(caseId: string) {
  return useQuery({
    queryKey: CASE_SUBJECTS_BY_CASE_QUERY_KEY(caseId),
    queryFn: () => caseSubjectApi.getAll(caseId),
    placeholderData: keepPreviousData,
    meta: { errorMessage: 'Nepodařil se načíst seznam subjektů na spisu.' },
  });
}

export function useAddCaseSubjectMutation(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CaseSubjectCreateRequest) => caseSubjectApi.create(caseId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CASE_SUBJECTS_QUERY_KEY });
      toast.success('Subjekt byl přidán na spis.');
    },
    onError: (error) => {
      const isConflict = isAxiosError(error) && error.response?.status === HTTP_CONFLICT;

      toast.error(isConflict ? 'Subjekt už na spisu je.' : 'Nepodařilo se přidat subjekt na spis.');
    },
  });
}

export function useUpdateCaseSubjectMutation(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: CaseSubjectUpdateRequest }) =>
      caseSubjectApi.update(caseId, id, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CASE_SUBJECTS_QUERY_KEY });
      toast.success('Změny byly uloženy.');
    },
    meta: { errorMessage: 'Nepodařilo se uložit změny.' },
  });
}

export function useRemoveCaseSubjectMutation(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => caseSubjectApi.remove(caseId, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CASE_SUBJECTS_QUERY_KEY });
      toast.success('Subjekt byl odebrán ze spisu.');
    },
    meta: { errorMessage: 'Nepodařilo se odebrat subjekt ze spisu.' },
  });
}
