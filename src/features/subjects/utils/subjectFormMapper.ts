import type {
  Address,
  Connection,
  EconomicSubject,
  PhysicalPerson,
  SubjectRequest,
} from '../api/subjectApi.types.ts';
import type { SubjectFormInput, SubjectFormValues } from '../schemas/subjectForm.schema.ts';
import { CZECH_COUNTRY_CODE } from '../constants/addressLabels.ts';
import { hasLegalForm } from './subjectUtils.ts';

type EconomicSubjectInput = Extract<
  SubjectFormInput,
  { economicSubject: unknown }
>['economicSubject'];
type PhysicalPersonInput = Extract<SubjectFormInput, { physicalPerson: unknown }>['physicalPerson'];
type AddressInput = SubjectFormInput['addresses'][number];
type ConnectionInput = SubjectFormInput['connections'][number];

// The server assigns the real ids, rows of the form do not carry any.
const NEW_ROW_ID = 0;

function orNull(value: string): string | null {
  return value.trim() || null;
}

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
      documents: person.documents.map((document) => ({ ...document, id: NEW_ROW_ID })),
    },
    dataBoxId: orNull(values.dataBoxId),
    addresses: values.addresses.map((address) => ({
      ...address,
      id: NEW_ROW_ID,
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
    connections: values.connections.map((connection) => ({
      ...connection,
      id: NEW_ROW_ID,
      note: orNull(connection.note),
    })),
    contacts: [],
  };
}
