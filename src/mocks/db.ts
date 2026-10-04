import type {
  CaseSubject,
  CaseSubjectCreateRequest,
  CaseSubjectUpdateRequest,
} from '../features/caseSubjects/api/caseSubjectApi.types.ts';
import type { Case } from '../features/caseSubjects/api/caseApi.types.ts';
import type { CodelistItem, CodelistName } from '../features/codelists/api/codelistApi.types.ts';
import type { AresSubject, AresSubjectDetail } from '../features/subjects/api/aresApi.types.ts';
import type { Subject, SubjectRequest } from '../features/subjects/api/subjectApi.types.ts';
import { SUBJECT_SEARCH_LIMIT } from '../features/subjects/constants/subjectSearch.ts';
import { getSubjectDisplayName } from '../features/subjects/utils/subjectUtils.ts';
import {
  createAresDetail,
  seedAresDetails,
  seedAresSubjects,
  seedCase,
  seedCaseSubjects,
  seedCodelists,
  seedSubjects,
} from './seed.ts';
import type { CaseSubjectRecord } from './seed.ts';

const subjects = structuredClone(seedSubjects);
const caseSubjects = structuredClone(seedCaseSubjects);
let lastId = 1000;

function nextId(): number {
  lastId += 1;

  return lastId;
}

// Removes diacritics and case, so the search ignores both.
function normalize(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

function getRegNumber(subject: Subject): string | null {
  return subject.economicSubject?.regNumber ?? null;
}

function toCaseSubject(record: CaseSubjectRecord): CaseSubject {
  const subject = getSubject(record.subjectId);
  const representative = record.legalRepresentativeId
    ? getSubject(record.legalRepresentativeId)
    : undefined;

  if (!subject) {
    throw new Error(`Subject ${record.subjectId} not found`);
  }

  return {
    ...record,
    subjectName: getSubjectDisplayName(subject),
    subjectType: subject.type,
    subjectRegNumber: getRegNumber(subject),
    subjectBirthDate: subject.physicalPerson?.birthDate ?? null,
    legalRepresentativeName: representative ? getSubjectDisplayName(representative) : null,
    legalRepresentativeRegNumber: representative ? getRegNumber(representative) : null,
  };
}

function withNewIds(request: SubjectRequest): SubjectRequest {
  const { physicalPerson } = request;

  return {
    ...request,
    addresses: request.addresses.map((address) => ({ ...address, id: nextId() })),
    connections: request.connections.map((connection) => ({ ...connection, id: nextId() })),
    physicalPerson: physicalPerson && {
      ...physicalPerson,
      documents: physicalPerson.documents.map((document) => ({ ...document, id: nextId() })),
    },
  };
}

export function getCase(): Case {
  return seedCase;
}

export function listCaseSubjects(): CaseSubject[] {
  return caseSubjects.map(toCaseSubject);
}

export function getCaseSubject(id: number): CaseSubject | undefined {
  const record = caseSubjects.find((item) => item.id === id);

  return record && toCaseSubject(record);
}

export function hasCaseSubject(subjectId: number): boolean {
  return caseSubjects.some((item) => item.subjectId === subjectId);
}

export function createCaseSubject(request: CaseSubjectCreateRequest): CaseSubject {
  const record: CaseSubjectRecord = {
    ...request,
    id: nextId(),
    caseId: seedCase.id,
    isMainClient: false,
    isMainPayer: false,
  };

  caseSubjects.push(record);

  return toCaseSubject(record);
}

export function updateCaseSubject(
  id: number,
  request: CaseSubjectUpdateRequest,
): CaseSubject | undefined {
  const record = caseSubjects.find((item) => item.id === id);

  if (!record) {
    return undefined;
  }

  Object.assign(record, request);

  // There is at most one main client and one main payer on a case.
  caseSubjects.forEach((item) => {
    if (item !== record && request.isMainClient) item.isMainClient = false;
    if (item !== record && request.isMainPayer) item.isMainPayer = false;
  });

  return toCaseSubject(record);
}

export function deleteCaseSubject(id: number): boolean {
  const index = caseSubjects.findIndex((item) => item.id === id);

  if (index >= 0) {
    caseSubjects.splice(index, 1);
  }

  return index >= 0;
}

export function listSubjects(fulltext: string): Subject[] {
  const query = normalize(fulltext.trim());
  const matches = subjects.filter(
    (subject) =>
      normalize(getSubjectDisplayName(subject)).includes(query) ||
      (getRegNumber(subject) ?? '').includes(query),
  );

  return matches.slice(0, SUBJECT_SEARCH_LIMIT);
}

export function getSubject(id: number): Subject | undefined {
  return subjects.find((subject) => subject.id === id);
}

export function createSubject(request: SubjectRequest): Subject {
  const subject = { ...withNewIds(request), id: nextId() };

  subjects.push(subject);

  return subject;
}

export function updateSubject(id: number, request: SubjectRequest): Subject | undefined {
  const index = subjects.findIndex((subject) => subject.id === id);

  if (index < 0) {
    return undefined;
  }

  subjects[index] = { ...withNewIds(request), id };

  return subjects[index];
}

export function searchAres(fulltext: string): AresSubject[] {
  const query = normalize(fulltext.trim());

  return seedAresSubjects.filter(
    (record) =>
      normalize(record.name).includes(query) ||
      record.regNumber.includes(query) ||
      normalize(seedAresDetails[record.regNumber]?.dataBoxId ?? '') === query,
  );
}

export function getAresDetail(regNumber: string): AresSubjectDetail | undefined {
  const record = seedAresSubjects.find((item) => item.regNumber === regNumber);
  const detail = seedAresDetails[regNumber];

  return detail ?? (record && createAresDetail(record));
}

export function getDataBoxName(id: string): string | undefined {
  const subject = subjects.find((item) => item.dataBoxId === id);

  return subject && getSubjectDisplayName(subject);
}

export function getCodelist(name: string): CodelistItem[] | undefined {
  return name in seedCodelists ? seedCodelists[name as CodelistName] : undefined;
}
