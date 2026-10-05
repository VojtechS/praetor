import type {
  CaseSubject,
  CaseSubjectRole,
} from '../features/caseSubjects/api/caseSubjectApi/caseSubjectApi.types.ts';
import type { Case } from '../features/caseSubjects/api/caseApi/caseApi.types.ts';
import type { CodelistItem, CodelistName } from '../features/codelists/api/codelistApi/codelistApi.types.ts';
import type { AresSubject, AresSubjectDetail } from '../features/subjects/api/aresApi/aresApi.types.ts';
import type {
  Address,
  EconomicSubject,
  PhysicalPerson,
  Subject,
  SubjectRequest,
} from '../features/subjects/api/subjectApi/subjectApi.types.ts';

// Summary fields of a case subject are derived from the subject on read.
export type CaseSubjectRecord = Omit<
  CaseSubject,
  | 'subjectName'
  | 'subjectType'
  | 'subjectRegNumber'
  | 'subjectBirthDate'
  | 'legalRepresentativeName'
  | 'legalRepresentativeRegNumber'
>;

function createSubjectRequest(
  subject: Partial<SubjectRequest> & Pick<SubjectRequest, 'type'>,
): SubjectRequest {
  return {
    country: 'CZ',
    language: 'CS',
    clientNumber: null,
    abbreviation: null,
    labels: [],
    note: null,
    category: null,
    group: null,
    responsibleEmployee: null,
    economicSubject: null,
    physicalPerson: null,
    dataBoxId: null,
    addresses: [],
    connections: [],
    contacts: [],
    ...subject,
  };
}

function createSubject(subject: Partial<Subject> & Pick<Subject, 'id' | 'type'>): Subject {
  const { id, ...request } = subject;

  return { id, ...createSubjectRequest(request) };
}

function createEconomicSubject(
  companyName: string,
  regNumber: string,
  extra: Partial<EconomicSubject> = {},
): EconomicSubject {
  return { companyName, regNumber, vatNumber: null, legalForm: null, registryNote: null, ...extra };
}

function createPerson(
  firstName: string,
  lastName: string,
  extra: Partial<PhysicalPerson> = {},
): PhysicalPerson {
  return {
    titleBefore: null,
    firstName,
    lastName,
    titleAfter: null,
    birthDate: null,
    salutation: null,
    personalId: null,
    documents: [],
    ...extra,
  };
}

function createAddress(id: number, extra: Partial<Address> & Pick<Address, 'city'>): Address {
  return {
    id,
    line1: null,
    line2: null,
    line3: null,
    useSubjectName: true,
    street: null,
    houseNumber: null,
    orientationNumber: null,
    cityPart: null,
    zipCode: null,
    region: null,
    district: null,
    country: 'CZ',
    isSeat: false,
    isDelivery: false,
    isBranch: false,
    isBilling: false,
    ...extra,
  };
}

export const seedCase: Case = {
  id: '2026-001',
  number: '2026/001',
  name: '[VZOR ODVOLÁNÍ] — INVESTIT Group',
};

export const seedSubjects: Subject[] = [
  createSubject({
    id: 1,
    type: 'LEGAL',
    clientNumber: 'K-0001',
    labels: ['VIP'],
    group: 'BUSINESS_PARTNERS',
    responsibleEmployee: 'NOVAK',
    economicSubject: createEconomicSubject('INVESTIT Group', '38227805', { legalForm: 'JSC' }),
    addresses: [
      createAddress(1, {
        street: 'Pobřežní',
        houseNumber: '12',
        city: 'Praha',
        zipCode: '186 00',
        isSeat: true,
        isDelivery: true,
      }),
    ],
    connections: [
      { id: 1, type: 'PHONE', value: '+420 222 333 444', note: 'Ústředna', isPreferred: true },
      { id: 2, type: 'EMAIL', value: 'info@investit.example', note: null, isPreferred: false },
    ],
    contacts: [
      { id: 1, fullName: 'Ing. Václav Kladenský', personalId: null, regNumber: null },
      { id: 2, fullName: 'Milan Pelikán', personalId: '720714425', regNumber: null },
      { id: 3, fullName: 'Ondřej Smutný', personalId: null, regNumber: null },
      { id: 4, fullName: 'Roman Mička', personalId: null, regNumber: '67329985' },
    ],
  }),
  createSubject({
    id: 2,
    type: 'LEGAL',
    economicSubject: createEconomicSubject('WOLTERS PACKAGING CZECH s.r.o.', '26200651', {
      vatNumber: 'CZ26200651',
      legalForm: 'LLC',
      registryNote:
        'Společnost je zapsána v obchodním rejstříku vedeném Krajským soudem v Hradci Králové, oddíl C, vložka 24140.',
    }),
    dataBoxId: 'k7bq3xy',
    addresses: [
      createAddress(2, {
        street: 'Kostěnice',
        houseNumber: '196',
        city: 'Kostěnice',
        zipCode: '530 02',
        isSeat: true,
        isDelivery: true,
        isBilling: true,
      }),
    ],
    connections: [
      { id: 3, type: 'EMAIL', value: 'office@wolters.example', note: null, isPreferred: true },
    ],
  }),
  createSubject({
    id: 3,
    type: 'PHYSICAL_NON_ENTREPRENEUR',
    physicalPerson: createPerson('Adam', 'Masaryk', { birthDate: '1979-08-25' }),
  }),
  createSubject({
    id: 4,
    type: 'LEGAL',
    category: 'COURT',
    economicSubject: createEconomicSubject('Obvodní soud pro Prahu 1', '00024473'),
    dataBoxId: 'sd7kq2m',
  }),
  createSubject({
    id: 5,
    type: 'PHYSICAL_ENTREPRENEUR',
    economicSubject: createEconomicSubject('JUDr. Pavel Tomášek', '155322365', {
      legalForm: 'ASSOCIATION',
    }),
    physicalPerson: createPerson('Pavel', 'Tomášek', { titleBefore: 'JUDr.' }),
  }),
  createSubject({
    id: 6,
    type: 'PHYSICAL_ENTREPRENEUR',
    economicSubject: createEconomicSubject('JUDr. Jakub Radil', '78523843245'),
    physicalPerson: createPerson('Jakub', 'Radil', { titleBefore: 'JUDr.' }),
    addresses: [
      createAddress(3, {
        street: 'Mlýnská',
        houseNumber: '13',
        orientationNumber: '21',
        city: 'Praha 1',
        zipCode: '110 00',
        isSeat: true,
      }),
    ],
  }),
  createSubject({
    id: 7,
    type: 'PHYSICAL_ENTREPRENEUR',
    economicSubject: createEconomicSubject('JUDr. Kateřina Malá', '12345678'),
    physicalPerson: createPerson('Kateřina', 'Malá', {
      titleBefore: 'JUDr.',
      birthDate: '1978-04-03',
    }),
  }),
  createSubject({
    id: 8,
    type: 'PHYSICAL_NON_ENTREPRENEUR',
    physicalPerson: createPerson('Marek', 'Horáček', {
      birthDate: '1964-09-17',
      personalId: '640917/2000',
      documents: [{ id: 1, number: '123456789', type: 'ID_CARD' }],
    }),
  }),
  createSubject({
    id: 9,
    type: 'PHYSICAL_NON_ENTREPRENEUR',
    physicalPerson: createPerson('Filip', 'Petr', { titleBefore: 'Mgr.' }),
  }),
  createSubject({
    id: 10,
    type: 'LEGAL',
    category: 'STATE_ADMIN',
    economicSubject: createEconomicSubject(
      'Okresní správa sociálního zabezpečení Rokycany',
      '00006963',
    ),
  }),
  createSubject({
    id: 11,
    type: 'PHYSICAL_ENTREPRENEUR',
    economicSubject: createEconomicSubject('Novák Karel, JUDr., advokát', '13117971'),
    physicalPerson: createPerson('Karel', 'Novák', { titleAfter: 'JUDr., advokát' }),
  }),
  createSubject({
    id: 12,
    type: 'UNDETERMINED',
    category: 'STATE_ADMIN',
    economicSubject: createEconomicSubject('Grantová agentura České republiky', '48549037'),
  }),
  createSubject({
    id: 13,
    type: 'PHYSICAL_NON_ENTREPRENEUR',
    physicalPerson: createPerson('Milan', 'Kundera'),
  }),
];

export const seedCaseSubjects: CaseSubjectRecord[] = [
  caseSubject(1, 1, 'CLIENT', 'PLAINTIFF', 'BROKER', {
    legalRepresentativeId: 5,
    preferredContactIds: [2, 3],
    isMainClient: true,
    isMainPayer: true,
  }),
  caseSubject(2, 2, 'CLIENT', 'PLAINTIFF', null),
  caseSubject(3, 3, 'OPPOSING_PARTY', 'DEFENDANT', 'SELLER', { legalRepresentativeId: 6 }),
  caseSubject(4, 8, 'PARTICIPANT', 'INTERVENER', null),
  caseSubject(5, 4, 'DECIDING_AUTHORITY', null, null, { caseFileNumber: '3 T 133/2026' }),
];

function caseSubject(
  id: number,
  subjectId: number,
  role: CaseSubjectRole,
  proceduralRole: string | null,
  materialLegalRole: string | null,
  extra: Partial<CaseSubjectRecord> = {},
): CaseSubjectRecord {
  return {
    id,
    caseId: seedCase.id,
    subjectId,
    role,
    proceduralRole,
    materialLegalRole,
    legalRepresentativeId: null,
    caseFileNumber: null,
    preferredContactIds: [],
    isMainClient: false,
    isMainPayer: false,
    ...extra,
  };
}

export const seedAresSubjects: AresSubject[] = [
  {
    regNumber: '02936186',
    name: 'Wolters Real Estate s.r.o.',
    address: 'Kostěnice 196, 530 02 Kostěnice',
  },
  {
    regNumber: '04639693',
    name: 'Simon Felix Wolters',
    address: 'Wolkerova 80/14, 418 01 Bílina',
  },
  {
    regNumber: '26200651',
    name: 'WOLTERS PACKAGING CZECH s.r.o.',
    address: 'Kostěnice 196, 530 02 Kostěnice',
  },
  {
    regNumber: '63077639',
    name: 'Wolters Kluwer ČR, a.s.',
    address: 'U nákladového nádraží 3265/10, 130 00 Praha – Strašnice',
  },
];

// Only this record has a full detail, other records are pre-filled with name and reg. number.
export const seedAresDetails: Record<string, AresSubjectDetail> = {
  '26200651': createSubjectRequest({
    type: 'LEGAL',
    economicSubject: createEconomicSubject('WOLTERS PACKAGING CZECH s.r.o.', '26200651', {
      vatNumber: 'CZ26200651',
      legalForm: 'LLC',
      registryNote:
        'Společnost je zapsána v obchodním rejstříku vedeném Krajským soudem v Hradci Králové, oddíl C, vložka 24140.',
    }),
    dataBoxId: 'k7bq3xy',
    addresses: [
      createAddress(0, {
        street: 'Kostěnice',
        houseNumber: '196',
        city: 'Kostěnice',
        zipCode: '530 02',
        isSeat: true,
      }),
    ],
  }),
};

export function createAresDetail(record: AresSubject): AresSubjectDetail {
  return createSubjectRequest({
    type: 'LEGAL',
    economicSubject: createEconomicSubject(record.name, record.regNumber),
  });
}

export const seedCodelists: Record<CodelistName, CodelistItem[]> = {
  'procedural-roles': [
    { code: 'PLAINTIFF', label: 'Žalobce' },
    { code: 'DEFENDANT', label: 'Žalovaný' },
    { code: 'ENTITLED', label: 'Oprávněný' },
    { code: 'OBLIGED', label: 'Povinný' },
    { code: 'INTERVENER', label: 'Vedlejší účastník' },
    { code: 'AFFECTED_AUTHORITY', label: 'Dotčený orgán' },
  ],
  'material-legal-roles': [
    { code: 'BUYER', label: 'Kupující' },
    { code: 'SELLER', label: 'Prodávající' },
    { code: 'OWNER', label: 'Vlastník' },
    { code: 'HOA', label: 'SVJ' },
    { code: 'CREDITOR', label: 'Věřitel' },
    { code: 'DEBTOR', label: 'Dlužník' },
    { code: 'BROKER', label: 'Zprostředkovatel' },
  ],
  categories: [
    { code: 'STATE_ADMIN', label: 'Orgán státní správy' },
    { code: 'REGIONAL_OFFICE', label: 'Krajský úřad' },
    { code: 'MINISTRY', label: 'Ministerstvo' },
    { code: 'COURT', label: 'Soud' },
  ],
  countries: [
    { code: 'CZ', label: 'Česká republika' },
    { code: 'SK', label: 'Slovenská republika' },
  ],
  languages: [
    { code: 'CS', label: 'Česky' },
    { code: 'SK', label: 'Slovensky' },
    { code: 'EN', label: 'Anglicky' },
  ],
  'legal-forms': [
    { code: 'LLC', label: 'Společnost s ručením omezeným' },
    { code: 'JSC', label: 'Akciová společnost' },
    { code: 'GENERAL_PARTNERSHIP', label: 'Veřejná obchodní společnost' },
    { code: 'ASSOCIATION', label: 'Spolek' },
  ],
  'document-types': [
    { code: 'ID_CARD', label: 'Občanský průkaz' },
    { code: 'PASSPORT', label: 'Cestovní pas' },
    { code: 'DRIVING_LICENCE', label: 'Řidičský průkaz' },
  ],
  labels: [
    { code: 'VIP', label: 'VIP' },
    { code: 'LONG_TERM', label: 'Dlouhodobý klient' },
    { code: 'PAYMENT_RISK', label: 'Platební riziko' },
  ],
  groups: [
    { code: 'BUSINESS_PARTNERS', label: 'Obchodní partneři' },
    { code: 'AUTHORITIES', label: 'Úřady a soudy' },
    { code: 'LAWYERS', label: 'Právníci' },
  ],
  employees: [
    { code: 'NOVAK', label: 'JUDr. Pavel Novák' },
    { code: 'DVORAKOVA', label: 'Mgr. Jana Dvořáková' },
    { code: 'SVOBODA', label: 'Ing. Martin Svoboda' },
  ],
};
