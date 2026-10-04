// A single checkbox of a group is read by react-hook-form as a string (checked) or false.
export function toStringArray(value: string[] | string | false): string[] {
  if (Array.isArray(value)) {
    return value;
  }

  return value ? [value] : [];
}
