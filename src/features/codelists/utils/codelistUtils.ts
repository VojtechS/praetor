import type { CodelistItem } from '../api/codelistApi.types.ts';
import type { SelectOption } from '../../../shared/components/SelectField/SelectField.tsx';
import { checkValue } from '../../../shared/utils/checkValue.ts';

export function getCodelistLabel(
  items: CodelistItem[] | undefined,
  code: string | null | undefined,
): string {
  return checkValue(items?.find((item) => item.code === code)?.label ?? code);
}

export function toSelectOptions(items: CodelistItem[] | undefined): SelectOption[] {
  return (items ?? []).map(({ code, label }) => ({ value: code, label }));
}
