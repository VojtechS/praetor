import type { Subject, SubjectType } from '../api/subjectApi/subjectApi.types.ts';
import { checkValue } from '../../../shared/utils/checkValue.ts';

export function getSubjectDisplayName(subject: Subject): string {
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

export function hasEconomicSubject(type: SubjectType): boolean {
  return type !== 'PHYSICAL_NON_ENTREPRENEUR';
}

export function hasLegalForm(type: SubjectType): boolean {
  return type === 'LEGAL' || type === 'PHYSICAL_ENTREPRENEUR';
}

export function hasPhysicalPerson(type: SubjectType): boolean {
  return type === 'PHYSICAL_ENTREPRENEUR' || type === 'PHYSICAL_NON_ENTREPRENEUR';
}
