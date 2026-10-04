import type { CodelistItem } from '../api/codelistApi.types.ts';
import { checkValue } from '../../../shared/utils/checkValue.ts';

export function getCodelistLabel(
  items: CodelistItem[] | undefined,
  code: string | null | undefined,
): string {
  return checkValue(items?.find((item) => item.code === code)?.label ?? code);
}
