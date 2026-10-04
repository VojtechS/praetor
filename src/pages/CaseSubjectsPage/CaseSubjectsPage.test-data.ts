import { caseApi } from '../../features/caseSubjects/api/caseApi.ts';
import { caseSubjectApi } from '../../features/caseSubjects/api/caseSubjectApi.ts';
import { codelistApi } from '../../features/codelists/api/codelistApi.ts';
import { subjectApi } from '../../features/subjects/api/subjectApi.ts';
import { getCase, getCodelist, getSubject, listCaseSubjects } from '../../mocks/db.ts';

// The page tests reuse the in-memory mock database, only the API modules are replaced.
export function setupApiMocks() {
  vi.mocked(caseApi.getById).mockResolvedValue({ data: getCase() });
  vi.mocked(caseSubjectApi.getAll).mockResolvedValue({ data: listCaseSubjects() });

  vi.mocked(subjectApi.getById).mockImplementation((id) => {
    const subject = getSubject(id);

    return subject ? Promise.resolve({ data: subject }) : Promise.reject(new Error('Not found'));
  });

  vi.mocked(codelistApi.getByName).mockImplementation((name) =>
    Promise.resolve({ data: getCodelist(name) ?? [] }),
  );
}
