import type { ConnectionType, SubjectType } from '../api/subjectApi.types.ts';
import { checkValue } from '../../../shared/utils/checkValue.ts';

const subjectTypeLabels: Record<SubjectType, string> = {
  UNDETERMINED: 'Neurčeno',
  LEGAL: 'Právnická osoba',
  PHYSICAL_ENTREPRENEUR: 'Fyzická osoba – podnikatel',
  PHYSICAL_NON_ENTREPRENEUR: 'Fyzická osoba – nepodnikatel',
};

const connectionTypeLabels: Record<ConnectionType, string> = {
  PHONE: 'Telefon',
  EMAIL: 'E-mail',
};

export const SUBJECT_TYPE_OPTIONS = (Object.keys(subjectTypeLabels) as SubjectType[]).map(
  (type) => ({
    value: type,
    label: subjectTypeLabels[type],
  }),
);

function isSubjectType(value: string): value is SubjectType {
  return value in subjectTypeLabels;
}

function isConnectionType(value: string): value is ConnectionType {
  return value in connectionTypeLabels;
}

export function getSubjectTypeLabel(value: string | null | undefined): string {
  const type = checkValue(value);

  return isSubjectType(type) ? subjectTypeLabels[type] : type;
}

export function getConnectionTypeLabel(value: string | null | undefined): string {
  const type = checkValue(value);

  return isConnectionType(type) ? connectionTypeLabels[type] : type;
}
