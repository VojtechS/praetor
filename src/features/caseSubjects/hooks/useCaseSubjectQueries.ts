import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { caseApi } from '../api/caseApi/caseApi.ts';
import { caseSubjectApi } from '../api/caseSubjectApi/caseSubjectApi.ts';
import type {
  CaseSubjectCreateRequest,
  CaseSubjectUpdateRequest,
} from '../api/caseSubjectApi/caseSubjectApi.types.ts';
import { useDataToast } from '../../../shared/hooks/useDataToast.ts';

const CASE_QUERY_KEY = (caseId: string) => ['cases', caseId] as const;
export const CASE_SUBJECTS_QUERY_KEY = ['caseSubjects'] as const;
const CASE_SUBJECTS_BY_CASE_QUERY_KEY = (caseId: string) =>
  [...CASE_SUBJECTS_QUERY_KEY, caseId] as const;

const HTTP_CONFLICT = 409;

export function useCaseQuery(caseId: string) {
  const query = useQuery({
    queryKey: CASE_QUERY_KEY(caseId),
    queryFn: () => caseApi.getById(caseId),
  });

  useDataToast(query.isError, 'Nepodařilo se načíst spis.');

  return query;
}

export function useCaseSubjectsQuery(caseId: string) {
  const query = useQuery({
    queryKey: CASE_SUBJECTS_BY_CASE_QUERY_KEY(caseId),
    queryFn: () => caseSubjectApi.getAll(caseId),
    placeholderData: keepPreviousData,
  });

  useDataToast(query.isError, 'Nepodařil se načíst seznam subjektů na spisu.');

  return query;
}

export function useAddCaseSubjectMutation(caseId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (request: CaseSubjectCreateRequest) => caseSubjectApi.create(caseId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CASE_SUBJECTS_QUERY_KEY });
      toast.success('Subjekt byl přidán na spis.');
    },
  });
  const isConflict =
    isAxiosError(mutation.error) && mutation.error.response?.status === HTTP_CONFLICT;

  useDataToast(
    mutation.isError,
    isConflict ? 'Subjekt už na spisu je.' : 'Nepodařilo se přidat subjekt na spis.',
  );

  return mutation;
}

export function useUpdateCaseSubjectMutation(caseId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: CaseSubjectUpdateRequest }) =>
      caseSubjectApi.update(caseId, id, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CASE_SUBJECTS_QUERY_KEY });
      toast.success('Změny byly uloženy.');
    },
  });

  useDataToast(mutation.isError, 'Nepodařilo se uložit změny.');

  return mutation;
}

export function useRemoveCaseSubjectMutation(caseId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: number) => caseSubjectApi.remove(caseId, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CASE_SUBJECTS_QUERY_KEY });
      toast.success('Subjekt byl odebrán ze spisu.');
    },
  });

  useDataToast(mutation.isError, 'Nepodařilo se odebrat subjekt ze spisu.');

  return mutation;
}
