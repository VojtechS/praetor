import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { aresApi } from '../api/aresApi/aresApi.ts';
import { dataBoxApi } from '../api/dataBoxApi/dataBoxApi.ts';
import { MIN_SEARCH_LENGTH } from '../constants/subjectSearch.ts';
import { useDataToast } from '../../../shared/hooks/useDataToast.ts';

const ARES_QUERY_KEY = ['ares'] as const;

// The query runs only for a submitted search, so typing in the field never triggers it.
export function useAresSearchQuery(submittedSearch: string) {
  const query = useQuery({
    queryKey: [...ARES_QUERY_KEY, 'search', submittedSearch],
    queryFn: () => aresApi.search(submittedSearch),
    enabled: submittedSearch.length >= MIN_SEARCH_LENGTH,
    retry: false,
  });

  useDataToast(query.isError, 'Nepodařilo se vyhledat v ARES.');

  return query;
}

export function useAresDetailQuery(regNumber: string, enabled: boolean = true) {
  const query = useQuery({
    queryKey: [...ARES_QUERY_KEY, 'detail', regNumber],
    queryFn: () => aresApi.getByRegNumber(regNumber),
    enabled: enabled && !!regNumber,
  });

  useDataToast(query.isError, 'Nepodařilo se načíst detail z ARES.');

  return query;
}

export function useDataBoxLookupMutation() {
  const mutation = useMutation({
    mutationFn: (id: string) => dataBoxApi.getById(id),
    onSuccess: (response) => toast.success(response.data.name),
  });

  useDataToast(mutation.isError, 'Datová schránka nenalezena');

  return mutation;
}
