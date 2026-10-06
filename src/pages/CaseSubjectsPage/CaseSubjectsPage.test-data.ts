import { caseApi } from '../../features/caseSubjects/api/caseApi/caseApi.ts';
import { caseSubjectApi } from '../../features/caseSubjects/api/caseSubjectApi/caseSubjectApi.ts';
import type { CaseSubject } from '../../features/caseSubjects/api/caseSubjectApi/caseSubjectApi.types.ts';
import { codelistApi } from '../../features/codelists/api/codelistApi/codelistApi.ts';
import { subjectApi } from '../../features/subjects/api/subjectApi/subjectApi.ts';
import type { Subject } from '../../features/subjects/api/subjectApi/subjectApi.types.ts';

export const CASE_ID = '2026-001';

function createCaseSubject(
  id: number,
  subjectName: string,
  role: CaseSubject['role'],
  extra: Partial<CaseSubject> = {},
): CaseSubject {
  return {
    id,
    caseId: CASE_ID,
    subjectId: id,
    subjectName,
    subjectType: 'PHYSICAL_NON_ENTREPRENEUR',
    subjectRegNumber: null,
    subjectBirthDate: null,
    role,
    proceduralRole: null,
    materialLegalRole: null,
    legalRepresentativeId: null,
    legalRepresentativeName: null,
    legalRepresentativeRegNumber: null,
    caseFileNumber: null,
    preferredRelatedSubjectIds: [],
    isMainClient: false,
    isMainPayer: false,
    ...extra,
  };
}

function createSubject(id: number, firstName: string, lastName: string): Subject {
  return {
    id,
    type: 'PHYSICAL_NON_ENTREPRENEUR',
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
    physicalPerson: {
      titleBefore: null,
      firstName,
      lastName,
      titleAfter: null,
      birthDate: null,
      salutation: null,
      personalId: null,
      documents: [],
    },
    dataBoxId: null,
    addresses: [],
    contacts: [],
    relatedSubjects: [],
  };
}

const caseSubjects = [
  createCaseSubject(1, 'Adam Masaryk', 'CLIENT'),
  createCaseSubject(2, 'Jakub Radil', 'OPPOSING_PARTY'),
];

const subjects = [createSubject(1, 'Adam', 'Masaryk'), createSubject(2, 'Jakub', 'Radil')];

export function setupApiMocks(items: CaseSubject[] = caseSubjects) {
  vi.mocked(caseApi.getById).mockResolvedValue({
    data: { id: CASE_ID, number: '2026/001', name: 'Testovací spis' },
  });

  vi.mocked(caseSubjectApi.getAll).mockResolvedValue({ data: items });
  vi.mocked(caseSubjectApi.remove).mockResolvedValue(undefined);
  vi.mocked(caseSubjectApi.update).mockImplementation((_caseId, id, request) =>
    Promise.resolve({ data: { ...items.find((item) => item.id === id)!, ...request } }),
  );

  vi.mocked(codelistApi.getByName).mockResolvedValue({ data: [] });

  vi.mocked(subjectApi.getById).mockImplementation((id) =>
    Promise.resolve({ data: subjects.find((subject) => subject.id === id)! }),
  );
}
