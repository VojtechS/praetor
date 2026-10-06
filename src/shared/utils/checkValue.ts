export function checkValue(value: string | null | undefined): string {
  return value ?? '-';
}
