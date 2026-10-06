import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subjectApi } from '../../api/subjectApi/subjectApi.ts';
import type { SubjectRequest } from '../../api/subjectApi/subjectApi.types.ts';

const SUBJECTS_QUERY_KEY = ['subjects'] as const;
const SUBJECT_QUERY_KEY = (id: number) => [...SUBJECTS_QUERY_KEY, id] as const;

export function useSubjectsSearchQuery(submittedSearch: string) {
  return useQuery({
    queryKey: [...SUBJECTS_QUERY_KEY, 'search', submittedSearch],
    queryFn: () => subjectApi.getAll(submittedSearch ? { fulltext: submittedSearch } : undefined),
    placeholderData: keepPreviousData,
    meta: { errorMessage: 'Nepodařilo se vyhledat subjekty.' },
  });
}

export function useSubjectQuery(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: SUBJECT_QUERY_KEY(id),
    queryFn: () => subjectApi.getById(id),
    enabled: enabled && !!id,
    meta: { errorMessage: 'Nepodařil se načíst subjekt.' },
  });
}

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SubjectRequest) => subjectApi.create(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
      toast.success('Subjekt byl založen.');
    },
    meta: { errorMessage: 'Nepodařilo se založit subjekt.' },
  });
}

export function useUpdateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: SubjectRequest }) =>
      subjectApi.update(id, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
      toast.success('Subjekt byl uložen.');
    },
    meta: { errorMessage: 'Nepodařilo se uložit subjekt.' },
  });
}
