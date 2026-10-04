import type { Contact, Subject, SubjectType } from '../api/subjectApi.types.ts';
import { checkValue } from '../../../shared/utils/checkValue.ts';

const PERSONAL_ID_PATTERN = /^(\d{2})(\d{2})(\d{2})\/?(\d{3,4})$/;
const FIRST_YEAR_WITHOUT_LONG_ID = 54;

export function getSubjectDisplayName(
  subject: Pick<Subject, 'economicSubject' | 'physicalPerson'>,
): string {
  const person = subject.physicalPerson;

  if (person) {
    const name = [person.titleBefore, person.firstName, person.lastName].filter(Boolean).join(' ');

    return person.titleAfter ? `${name}, ${person.titleAfter}` : name;
  }

  return checkValue(subject.economicSubject?.companyName);
}

export function formatBirthDate(birthDate: string): string {
  const [year, month, day] = birthDate.split('-');

  return `${Number(day)}. ${Number(month)}. ${year}`;
}

export function getSubjectIdentification(
  regNumber: string | null,
  birthDate: string | null,
): string {
  if (regNumber) {
    return `IČO ${regNumber}`;
  }

  return birthDate ? `dat. nar. ${formatBirthDate(birthDate)}` : checkValue(null);
}

export function parseSubjectId(value: string | null): number | null {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
}

export function formatContactLabel(contact: Contact): string {
  if (contact.personalId) {
    return `${contact.fullName} (r. č.: ${contact.personalId})`;
  }

  return contact.regNumber ? `${contact.fullName} (IČO: ${contact.regNumber})` : contact.fullName;
}

export function hasEconomicSubject(type: SubjectType): boolean {
  return type !== 'PHYSICAL_NON_ENTREPRENEUR';
}

export function hasLegalForm(type: SubjectType): boolean {
  return type === 'LEGAL' || type === 'PHYSICAL_ENTREPRENEUR';
}

export function hasPhysicalPerson(type: SubjectType): boolean {
  return type === 'PHYSICAL_ENTREPRENEUR' || type === 'PHYSICAL_NON_ENTREPRENEUR';
}

export function canLookupDataBox(type: SubjectType): boolean {
  return hasEconomicSubject(type);
}

// Month +50 means a woman, +20 means supplementary numbering.
function getRealMonth(month: number): number {
  const withoutWoman = month > 50 ? month - 50 : month;

  return withoutWoman > 20 ? withoutWoman - 20 : withoutWoman;
}

// Returns an ISO date (yyyy-mm-dd) or null when the personal ID has no valid birth date.
export function getBirthDateFromPersonalId(personalId: string): string | null {
  const match = PERSONAL_ID_PATTERN.exec(personalId.trim());

  if (!match) {
    return null;
  }

  const [, yy, mm, dd, suffix] = match;
  const shortYear = Number(yy);
  const isLongId = suffix.length === 4;

  if (!isLongId && shortYear >= FIRST_YEAR_WITHOUT_LONG_ID) {
    return null;
  }

  const year = (isLongId && shortYear < FIRST_YEAR_WITHOUT_LONG_ID ? 2000 : 1900) + shortYear;
  const month = getRealMonth(Number(mm));
  const day = Number(dd);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isValid =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;

  return isValid ? date.toISOString().slice(0, 10) : null;
}
