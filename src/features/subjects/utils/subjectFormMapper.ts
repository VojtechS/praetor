import type {
  Address,
  Connection,
  EconomicSubject,
  PhysicalPerson,
  SubjectRequest,
} from '../api/subjectApi.types.ts';
import type { SubjectFormInput } from '../schemas/subjectForm.schema.ts';
import { CZECH_COUNTRY_CODE } from '../constants/addressLabels.ts';

type EconomicSubjectInput = Extract<
  SubjectFormInput,
  { economicSubject: unknown }
>['economicSubject'];
type PhysicalPersonInput = Extract<SubjectFormInput, { physicalPerson: unknown }>['physicalPerson'];
type AddressInput = SubjectFormInput['addresses'][number];
type ConnectionInput = SubjectFormInput['connections'][number];

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

function toPhysicalPersonInput(person: PhysicalPerson | null): PhysicalPersonInput {
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

function toAddressInput(address: Address): AddressInput {
  return {
    line1: orEmpty(address.line1),
    line2: orEmpty(address.line2),
    line3: orEmpty(address.line3),
    useSubjectName: address.useSubjectName,
    street: orEmpty(address.street),
    houseNumber: orEmpty(address.houseNumber),
    orientationNumber: orEmpty(address.orientationNumber),
    city: address.city,
    cityPart: orEmpty(address.cityPart),
    zipCode: orEmpty(address.zipCode),
    region: orEmpty(address.region),
    district: orEmpty(address.district),
    country: address.country,
    isSeat: address.isSeat,
    isDelivery: address.isDelivery,
    isBranch: address.isBranch,
    isBilling: address.isBilling,
  };
}

function toConnectionInput(connection: Connection): ConnectionInput {
  return {
    type: connection.type,
    value: connection.value,
    note: orEmpty(connection.note),
    isPreferred: connection.isPreferred,
  };
}

// New subject: the default type is a legal person, see the README assumptions.
export function getNewSubjectFormDefaults(): SubjectFormInput {
  return {
    type: 'LEGAL',
    country: 'CZ',
    language: 'CS',
    clientNumber: '',
    abbreviation: '',
    labels: [],
    note: '',
    category: '',
    group: '',
    responsibleEmployee: '',
    dataBoxId: '',
    addresses: [],
    connections: [],
    economicSubject: toEconomicSubjectInput(null),
  };
}

// A new address is a seat, delivery and billing address of the subject, see the spec.
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
    connections: subject.connections.map(toConnectionInput),
    economicSubject: toEconomicSubjectInput(subject.economicSubject),
    physicalPerson: toPhysicalPersonInput(subject.physicalPerson),
  };
}
