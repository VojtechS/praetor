export type SubjectType =
  'UNDETERMINED' | 'LEGAL' | 'PHYSICAL_ENTREPRENEUR' | 'PHYSICAL_NON_ENTREPRENEUR';

export type ContactType = 'PHONE' | 'EMAIL';

export interface EconomicSubject {
  companyName: string;
  regNumber: string | null;
  vatNumber: string | null;
  legalForm: string | null;
  registryNote: string | null;
}

interface PersonDocument {
  id: number;
  number: string;
  type: string;
}

export interface PhysicalPerson {
  titleBefore: string | null;
  firstName: string;
  lastName: string;
  titleAfter: string | null;
  birthDate: string | null;
  salutation: string | null;
  personalId: string | null;
  documents: PersonDocument[];
}

export interface Address {
  id: number;
  line1: string | null;
  line2: string | null;
  line3: string | null;
  useSubjectName: boolean;
  street: string | null;
  houseNumber: string | null;
  orientationNumber: string | null;
  city: string;
  cityPart: string | null;
  zipCode: string | null;
  region: string | null;
  district: string | null;
  country: string;
  isSeat: boolean;
  isDelivery: boolean;
  isBranch: boolean;
  isBilling: boolean;
}

export interface Contact {
  id: number;
  type: ContactType;
  value: string;
  note: string | null;
  isPreferred: boolean;
}

export interface RelatedSubject {
  id: number;
  fullName: string;
  personalId: string | null;
  regNumber: string | null;
}

export interface Subject {
  id: number;
  type: SubjectType;
  country: string | null;
  language: string | null;
  clientNumber: string | null;
  abbreviation: string | null;
  labels: string[];
  note: string | null;
  category: string | null;
  group: string | null;
  responsibleEmployee: string | null;
  economicSubject: EconomicSubject | null;
  physicalPerson: PhysicalPerson | null;
  dataBoxId: string | null;
  addresses: Address[];
  contacts: Contact[];
  relatedSubjects: RelatedSubject[];
}

// The server assigns ids to subject and to its rows, a request does not carry any.
export type PhysicalPersonRequest = Omit<PhysicalPerson, 'documents'> & {
  documents: Omit<PersonDocument, 'id'>[];
};
export type AddressRequest = Omit<Address, 'id'>;
export type ContactRequest = Omit<Contact, 'id'>;

export type SubjectRequest = Omit<Subject, 'id' | 'physicalPerson' | 'addresses' | 'contacts'> & {
  physicalPerson: PhysicalPersonRequest | null;
  addresses: AddressRequest[];
  contacts: ContactRequest[];
};

export interface SubjectListParams {
  fulltext?: string;
}

export interface SubjectListResponse {
  data: Subject[];
}

export interface SubjectResponse {
  data: Subject;
}
