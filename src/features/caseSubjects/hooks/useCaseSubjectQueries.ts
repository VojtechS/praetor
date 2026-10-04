import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { caseApi } from '../api/caseApi.ts';
import { caseSubjectApi } from '../api/caseSubjectApi.ts';
import type {
  CaseSubjectCreateRequest,
  CaseSubjectUpdateRequest,
} from '../api/caseSubjectApi.types.ts';
import { CASE_ID } from '../constants/currentCase.ts';
import { useDataToast } from '../../../shared/hooks/useDataToast.ts';

const CASE_QUERY_KEY = (caseId: string) => ['cases', caseId] as const;
export const CASE_SUBJECTS_QUERY_KEY = ['caseSubjects', CASE_ID] as const;

const HTTP_CONFLICT = 409;

export function useCaseQuery() {
  const query = useQuery({
    queryKey: CASE_QUERY_KEY(CASE_ID),
    queryFn: () => caseApi.getById(CASE_ID),
  });

  useDataToast(query.isError, 'Nepodařilo se načíst spis.');

  return query;
}

export function useCaseSubjectsQuery() {
  const query = useQuery({
    queryKey: CASE_SUBJECTS_QUERY_KEY,
    queryFn: () => caseSubjectApi.getAll(CASE_ID),
    placeholderData: keepPreviousData,
  });

  useDataToast(query.isError, 'Nepodařil se načíst seznam subjektů na spisu.');

  return query;
}

export function useAddCaseSubjectMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (request: CaseSubjectCreateRequest) => caseSubjectApi.create(CASE_ID, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CASE_SUBJECTS_QUERY_KEY });
      toast.success('Subjekt byl přidán na spis.');
    },
  });
  const isConflict =
    isAxiosError(mutation.error) && mutation.error.response?.status === HTTP_CONFLICT;

  useDataToast(
    mutation.isError,
    isConflict ? 'Subjekt už na spisu je' : 'Nepodařilo se přidat subjekt na spis.',
  );

  return mutation;
}

export function useUpdateCaseSubjectMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: CaseSubjectUpdateRequest }) =>
      caseSubjectApi.update(CASE_ID, id, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CASE_SUBJECTS_QUERY_KEY });
      toast.success('Změny byly uloženy.');
    },
  });

  useDataToast(mutation.isError, 'Nepodařilo se uložit změny.');

  return mutation;
}

export function useRemoveCaseSubjectMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: number) => caseSubjectApi.remove(CASE_ID, id),
    // Not awaited on purpose: the caller closes the detail of the removed subject before the
    // list is refreshed, otherwise the detail would flash "Subjekt nenalezen".
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CASE_SUBJECTS_QUERY_KEY });
      toast.success('Subjekt byl odebrán ze spisu.');
    },
  });

  useDataToast(mutation.isError, 'Nepodařilo se odebrat subjekt ze spisu.');

  return mutation;
}
