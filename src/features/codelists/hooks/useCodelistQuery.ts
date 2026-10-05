import { useQuery } from '@tanstack/react-query';
import { codelistApi } from '../api/codelistApi/codelistApi.ts';
import type { CodelistName } from '../api/codelistApi/codelistApi.types.ts';
import { useDataToast } from '../../../shared/hooks/useDataToast.ts';

const CODELISTS_QUERY_KEY = ['codelists'] as const;

export function useCodelistQuery(name: CodelistName) {
  const query = useQuery({
    queryKey: [...CODELISTS_QUERY_KEY, name],
    queryFn: () => codelistApi.getByName(name),
    select: (response) => response.data,
  });

  useDataToast(query.isError, 'Nepodařilo se načíst číselník.');

  return query;
}
