import { useQuery } from '@tanstack/react-query';
import { codelistApi } from '../api/codelistApi/codelistApi.ts';
import type { CodelistName } from '../api/codelistApi/codelistApi.types.ts';

const CODELISTS_QUERY_KEY = ['codelists'] as const;

export function useCodelistQuery(name: CodelistName) {
  return useQuery({
    queryKey: [...CODELISTS_QUERY_KEY, name],
    queryFn: () => codelistApi.getByName(name),
    select: (response) => response.data,
    meta: { errorMessage: 'Nepodařilo se načíst číselník.' },
  });
}
