import type { SubjectRequest } from '../api/subjectApi/subjectApi.types.ts';
import type { SubjectFormValues } from '../schemas/subjectForm.schema.ts';
import { hasLegalForm } from './subjectUtils.ts';

function orNull(value: string): string | null {
  return value.trim() || null;
}

export function mapFormToRequest(values: SubjectFormValues): SubjectRequest {
  const economic = 'economicSubject' in values ? values.economicSubject : null;
  const person = 'physicalPerson' in values ? values.physicalPerson : null;

  return {
    type: values.type,
    country: orNull(values.country),
    language: orNull(values.language),
    clientNumber: orNull(values.clientNumber),
    abbreviation: orNull(values.abbreviation),
    labels: values.labels,
    note: orNull(values.note),
    category: orNull(values.category),
    group: orNull(values.group),
    responsibleEmployee: orNull(values.responsibleEmployee),
    economicSubject: economic && {
      companyName: economic.companyName,
      regNumber: orNull(economic.regNumber),
      vatNumber: orNull(economic.vatNumber),
      legalForm: hasLegalForm(values.type) ? orNull(economic.legalForm) : null,
      registryNote: orNull(economic.registryNote),
    },
    physicalPerson: person && {
      titleBefore: orNull(person.titleBefore),
      firstName: person.firstName,
      lastName: person.lastName,
      titleAfter: orNull(person.titleAfter),
      birthDate: orNull(person.birthDate),
      salutation: orNull(person.salutation),
      personalId: orNull(person.personalId),
      documents: person.documents,
    },
    dataBoxId: orNull(values.dataBoxId),
    addresses: values.addresses.map((address) => ({
      ...address,
      line1: orNull(address.line1),
      line2: orNull(address.line2),
      line3: orNull(address.line3),
      street: orNull(address.street),
      houseNumber: orNull(address.houseNumber),
      orientationNumber: orNull(address.orientationNumber),
      cityPart: orNull(address.cityPart),
      zipCode: orNull(address.zipCode),
      region: orNull(address.region),
      district: orNull(address.district),
    })),
    contacts: values.contacts.map((contact) => ({
      ...contact,
      note: orNull(contact.note),
    })),
    relatedSubjects: [],
  };
}
