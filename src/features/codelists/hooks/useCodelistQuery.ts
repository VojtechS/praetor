import { useQuery } from '@tanstack/react-query';
import { codelistApi } from '../api/codelistApi.ts';
import type { CodelistName } from '../api/codelistApi.types.ts';
import { useDataToast } from '../../../shared/hooks/useDataToast.ts';

const CODELISTS_QUERY_KEY = ['codelists'] as const;
const CODELIST_STALE_TIME_MS = 60 * 60 * 1000;

export function useCodelistQuery(name: CodelistName) {
  const query = useQuery({
    queryKey: [...CODELISTS_QUERY_KEY, name],
    queryFn: () => codelistApi.getByName(name),
    select: (response) => response.data,
    staleTime: CODELIST_STALE_TIME_MS,
  });

  useDataToast(query.isError, 'Nepodařilo se načíst číselník.');

  return query;
}
