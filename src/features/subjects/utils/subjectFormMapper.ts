import type {
  AddressRequest,
  ContactRequest,
  EconomicSubject,
  PhysicalPersonRequest,
  SubjectRequest,
  SubjectType,
} from '../api/subjectApi/subjectApi.types.ts';
import type { SubjectFormInput } from '../schemas/subjectForm.schema.ts';
import { CZECH_COUNTRY_CODE } from '../constants/addressLabels.ts';

type EconomicSubjectInput = Extract<
  SubjectFormInput,
  { economicSubject: unknown }
>['economicSubject'];
type PhysicalPersonInput = Extract<SubjectFormInput, { physicalPerson: unknown }>['physicalPerson'];
type AddressInput = SubjectFormInput['addresses'][number];
type ContactInput = SubjectFormInput['contacts'][number];

const CZECH_LANGUAGE_CODE = 'CS';

function orEmpty(value: string | null | undefined): string {
  return value ?? '';
}

function toEconomicSubjectInput(economicSubject: EconomicSubject | null): EconomicSubjectInput {
  return {
    companyName: orEmpty(economicSubject?.companyName),
    regNumber: orEmpty(economicSubject?.regNumber),
    vatNumber: orEmpty(economicSubject?.vatNumber),
    legalForm: orEmpty(economicSubject?.legalForm),
    registryNote: orEmpty(economicSubject?.registryNote),
  };
}

function toPhysicalPersonInput(person: PhysicalPersonRequest | null): PhysicalPersonInput {
  return {
    titleBefore: orEmpty(person?.titleBefore),
    firstName: orEmpty(person?.firstName),
    lastName: orEmpty(person?.lastName),
    titleAfter: orEmpty(person?.titleAfter),
    birthDate: orEmpty(person?.birthDate),
    salutation: orEmpty(person?.salutation),
    personalId: orEmpty(person?.personalId),
    documents: (person?.documents ?? []).map(({ number, type }) => ({ number, type })),
  };
}

function toAddressInput(address: AddressRequest): AddressInput {
  return {
    ...address,
    line1: orEmpty(address.line1),
    line2: orEmpty(address.line2),
    line3: orEmpty(address.line3),
    street: orEmpty(address.street),
    houseNumber: orEmpty(address.houseNumber),
    orientationNumber: orEmpty(address.orientationNumber),
    cityPart: orEmpty(address.cityPart),
    zipCode: orEmpty(address.zipCode),
    region: orEmpty(address.region),
    district: orEmpty(address.district),
  };
}

function toContactInput(contact: ContactRequest): ContactInput {
  return { ...contact, note: orEmpty(contact.note) };
}

export function getNewSubjectFormDefaults(): SubjectFormInput {
  return {
    type: 'PHYSICAL_NON_ENTREPRENEUR' as SubjectType,
    country: CZECH_COUNTRY_CODE,
    language: CZECH_LANGUAGE_CODE,
    clientNumber: '',
    abbreviation: '',
    labels: [],
    note: '',
    category: '',
    group: '',
    responsibleEmployee: '',
    dataBoxId: '',
    addresses: [],
    contacts: [],
    economicSubject: toEconomicSubjectInput(null),
    physicalPerson: toPhysicalPersonInput(null),
  };
}

export function getNewAddressDefaults(): AddressInput {
  return {
    line1: '',
    line2: '',
    line3: '',
    useSubjectName: true,
    street: '',
    houseNumber: '',
    orientationNumber: '',
    city: '',
    cityPart: '',
    zipCode: '',
    region: '',
    district: '',
    country: CZECH_COUNTRY_CODE,
    isSeat: true,
    isDelivery: true,
    isBranch: false,
    isBilling: true,
  };
}

export function mapSubjectToForm(subject: SubjectRequest): SubjectFormInput {
  return {
    type: subject.type,
    country: orEmpty(subject.country),
    language: orEmpty(subject.language),
    clientNumber: orEmpty(subject.clientNumber),
    abbreviation: orEmpty(subject.abbreviation),
    labels: subject.labels,
    note: orEmpty(subject.note),
    category: orEmpty(subject.category),
    group: orEmpty(subject.group),
    responsibleEmployee: orEmpty(subject.responsibleEmployee),
    dataBoxId: orEmpty(subject.dataBoxId),
    addresses: subject.addresses.map(toAddressInput),
    contacts: subject.contacts.map(toContactInput),
    economicSubject: toEconomicSubjectInput(subject.economicSubject),
    physicalPerson: toPhysicalPersonInput(subject.physicalPerson),
  };
}
