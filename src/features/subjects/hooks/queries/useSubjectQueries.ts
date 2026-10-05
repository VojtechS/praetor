import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CASE_SUBJECTS_QUERY_KEY } from '../../../caseSubjects/hooks/useCaseSubjectQueries.ts';
import { subjectApi } from '../../api/subjectApi/subjectApi.ts';
import type { SubjectRequest } from '../../api/subjectApi/subjectApi.types.ts';
import { useDataToast } from '../../../../shared/hooks/useDataToast.ts';

const SUBJECTS_QUERY_KEY = ['subjects'] as const;
const SUBJECT_QUERY_KEY = (id: number) => [...SUBJECTS_QUERY_KEY, id] as const;

export function useSubjectsSearchQuery(submittedSearch: string) {
  const query = useQuery({
    queryKey: [...SUBJECTS_QUERY_KEY, 'search', submittedSearch],
    queryFn: () => subjectApi.getAll(submittedSearch ? { fulltext: submittedSearch } : undefined),
    placeholderData: keepPreviousData,
  });

  useDataToast(query.isError, 'Nepodařilo se vyhledat subjekty.');

  return query;
}

export function useSubjectQuery(id: number, enabled: boolean = true) {
  const query = useQuery({
    queryKey: SUBJECT_QUERY_KEY(id),
    queryFn: () => subjectApi.getById(id),
    enabled: enabled && !!id,
  });

  useDataToast(query.isError, 'Nepodařil se načíst subjekt.');

  return query;
}

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (request: SubjectRequest) => subjectApi.create(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
      toast.success('Subjekt byl založen.');
    },
  });

  useDataToast(mutation.isError, 'Nepodařilo se založit subjekt.');

  return mutation;
}

export function useUpdateSubjectMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: SubjectRequest }) =>
      subjectApi.update(id, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: CASE_SUBJECTS_QUERY_KEY }),
      ]);
      toast.success('Subjekt byl uložen.');
    },
  });

  useDataToast(mutation.isError, 'Nepodařilo se uložit subjekt.');

  return mutation;
}
