import { caseApi } from '../../features/caseSubjects/api/caseApi/caseApi.ts';
import { caseSubjectApi } from '../../features/caseSubjects/api/caseSubjectApi/caseSubjectApi.ts';
import { codelistApi } from '../../features/codelists/api/codelistApi/codelistApi.ts';
import { subjectApi } from '../../features/subjects/api/subjectApi/subjectApi.ts';
import {
  createCaseSubject,
  deleteCaseSubject,
  getCase,
  getCodelist,
  getSubject,
  listCaseSubjects,
  listSubjects,
} from '../../mocks/db.ts';

// The page tests reuse the in-memory mock database, only the API modules are replaced.
export function setupApiMocks() {
  vi.mocked(caseApi.getById).mockImplementation(() => Promise.resolve({ data: getCase() }));
  vi.mocked(caseSubjectApi.getAll).mockImplementation(() =>
    Promise.resolve({ data: listCaseSubjects() }),
  );

  vi.mocked(caseSubjectApi.create).mockImplementation((_caseId, request) =>
    Promise.resolve({ data: createCaseSubject(request) }),
  );

  vi.mocked(caseSubjectApi.remove).mockImplementation((_caseId, id) => {
    deleteCaseSubject(id);

    return Promise.resolve();
  });

  vi.mocked(subjectApi.getAll).mockImplementation((params) =>
    Promise.resolve({ data: listSubjects(params?.fulltext ?? '') }),
  );

  vi.mocked(subjectApi.getById).mockImplementation((id) => {
    const subject = getSubject(id);

    return subject ? Promise.resolve({ data: subject }) : Promise.reject(new Error('Not found'));
  });

  vi.mocked(codelistApi.getByName).mockImplementation((name) =>
    Promise.resolve({ data: getCodelist(name) ?? [] }),
  );
}
