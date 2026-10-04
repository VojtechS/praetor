export function checkValue(value: string | null | undefined, fallbackValue: string = '-'): string {
  return value ?? fallbackValue;
}
