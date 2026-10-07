import { delay, http, HttpResponse } from 'msw';
import type {
  CaseSubjectCreateRequest,
  CaseSubjectUpdateRequest,
} from '../features/caseSubjects/api/caseSubjectApi/caseSubjectApi.types.ts';
import type { SubjectRequest } from '../features/subjects/api/subjectApi/subjectApi.types.ts';
import { API_BASE_URL } from '../services/api/axios.ts';
import * as db from './db.ts';

const MOCK_DELAY_MS = 400;
const SUBJECT_NOT_FOUND = 'Subjekt nenalezen';
const CASE_SUBJECT_NOT_FOUND = 'Subjekt na spisu nenalezen';

function url(path: string): string {
  return `${API_BASE_URL}${path}`;
}

function ok(data: unknown, status = 200): Response {
  return HttpResponse.json({ data }, { status });
}

function fail(status: number, message: string): Response {
  return HttpResponse.json({ message }, { status });
}

function found(data: unknown, message: string): Response {
  return data === undefined ? fail(404, message) : ok(data);
}

export const handlers = [
  http.all(url('/*'), () => delay(MOCK_DELAY_MS)),

  http.get(url('/cases/:caseId'), ({ params }) =>
    params.caseId === db.getCase().id ? ok(db.getCase()) : fail(404, 'Spis nenalezen'),
  ),

  http.get(url('/cases/:caseId/subjects'), () => ok(db.listCaseSubjects())),

  http.post(url('/cases/:caseId/subjects'), async ({ request }) => {
    const body = (await request.json()) as CaseSubjectCreateRequest;

    if (!db.getSubject(body.subjectId)) {
      return fail(404, SUBJECT_NOT_FOUND);
    }

    if (db.hasCaseSubject(body.subjectId)) {
      return fail(409, 'Subjekt už na spisu je');
    }

    return ok(db.createCaseSubject(body), 201);
  }),

  http.patch(url('/cases/:caseId/subjects/:id'), async ({ params, request }) => {
    const body = (await request.json()) as CaseSubjectUpdateRequest;

    return found(db.updateCaseSubject(Number(params.id), body), CASE_SUBJECT_NOT_FOUND);
  }),

  http.delete(url('/cases/:caseId/subjects/:id'), ({ params }) =>
    db.deleteCaseSubject(Number(params.id))
      ? new HttpResponse(null, { status: 204 })
      : fail(404, CASE_SUBJECT_NOT_FOUND),
  ),

  http.get(url('/subjects'), ({ request }) =>
    ok(db.listSubjects(new URL(request.url).searchParams.get('fulltext') ?? '')),
  ),

  http.get(url('/subjects/:id/cases'), ({ params }) => ok(db.listSubjectCases(Number(params.id)))),

  http.get(url('/subjects/:id'), ({ params }) =>
    found(db.getSubject(Number(params.id)), SUBJECT_NOT_FOUND),
  ),

  http.post(url('/subjects'), async ({ request }) =>
    ok(db.createSubject((await request.json()) as SubjectRequest), 201),
  ),

  http.put(url('/subjects/:id'), async ({ params, request }) =>
    found(
      db.updateSubject(Number(params.id), (await request.json()) as SubjectRequest),
      SUBJECT_NOT_FOUND,
    ),
  ),

  http.get(url('/ares/subjects'), ({ request }) => {
    const query = new URL(request.url).searchParams.get('query') ?? '';

    return query.trim().toLowerCase() === 'chyba'
      ? fail(500, 'Služba ARES je nedostupná')
      : ok(db.searchAres(query));
  }),

  http.get(url('/ares/subjects/:regNumber'), ({ params }) =>
    found(db.getAresDetail(String(params.regNumber)), 'Záznam v ARES nenalezen'),
  ),

  http.get(url('/data-boxes/:id'), ({ params }) => {
    const id = String(params.id);
    const name = db.getDataBoxName(id);

    return name === undefined ? fail(404, 'Datová schránka nenalezena') : ok({ id, name });
  }),

  http.get(url('/codelists/:name'), ({ params }) =>
    found(db.getCodelist(String(params.name)), 'Číselník nenalezen'),
  ),
];
