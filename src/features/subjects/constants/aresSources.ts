export type AresSource = 'ARES' | 'OR' | 'OPTEN';

export const ARES_SOURCES: { value: AresSource; label: string }[] = [
  { value: 'ARES', label: 'ARES (CZ)' },
  { value: 'OR', label: 'OR (SK)' },
  { value: 'OPTEN', label: 'Opten (HU)' },
];
