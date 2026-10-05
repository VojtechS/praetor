import type { Contact, Subject, SubjectType } from '../api/subjectApi/subjectApi.types.ts';
import { checkValue } from '../../../shared/utils/checkValue.ts';

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

export function formatRecordCount(count: number): string {
  if (count === 1) {
    return '1 záznam';
  }

  return count >= 2 && count <= 4 ? `${count} záznamy` : `${count} záznamů`;
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
