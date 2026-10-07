import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AresSource } from '../../constants/aresSources.ts';
import { aresApi } from '../../api/aresApi/aresApi.ts';
import { dataBoxApi } from '../../api/dataBoxApi/dataBoxApi.ts';

const ARES_QUERY_KEY = ['ares'] as const;

export function useAresSearchQuery(submittedSearch: string, source: AresSource) {
  return useQuery({
    queryKey: [...ARES_QUERY_KEY, 'search', source, submittedSearch],
    queryFn: () => aresApi.search(submittedSearch, source),
    retry: false,
    meta: { errorMessage: 'Nepodařilo se vyhledat v ARES.' },
  });
}

export function useAresDetailQuery(regNumber: string | null) {
  return useQuery({
    queryKey: [...ARES_QUERY_KEY, 'detail', regNumber],
    queryFn: () => aresApi.getByRegNumber(regNumber ?? ''),
    enabled: !!regNumber,
    meta: { errorMessage: 'Nepodařilo se načíst detail z ARES.' },
  });
}

export function useDataBoxLookupMutation() {
  return useMutation({
    mutationFn: (id: string) => dataBoxApi.getById(id),
    onSuccess: (response) => toast.success(response.data.name),
    meta: { errorMessage: 'Datová schránka nebyla nalezena.' },
  });
}
