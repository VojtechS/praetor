import type { ContactType, SubjectType } from '../api/subjectApi/subjectApi.types.ts';

export const SUBJECT_TYPE_LABELS: Record<SubjectType, string> = {
  UNDETERMINED: 'Neurčeno',
  PHYSICAL_NON_ENTREPRENEUR: 'Fyzická osoba – nepodnikatel',
  PHYSICAL_ENTREPRENEUR: 'Fyzická osoba – podnikatel',
  LEGAL: 'Právnická osoba',
};

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  PHONE: 'Telefon',
  EMAIL: 'E-mail',
};

export const SUBJECT_TYPE_OPTIONS = Object.entries(SUBJECT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const CONTACT_TYPE_OPTIONS = Object.entries(CONTACT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));
