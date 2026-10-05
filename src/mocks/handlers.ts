import type {
  CaseSubjectCreateRequest,
  CaseSubjectUpdateRequest,
} from '../features/caseSubjects/api/caseSubjectApi/caseSubjectApi.types.ts';
import type { SubjectRequest } from '../features/subjects/api/subjectApi/subjectApi.types.ts';
import * as db from './db.ts';

interface MockResult {
  status: number;
  data?: unknown;
  message?: string;
}

interface MockRequest {
  args: string[];
  query: Record<string, string | undefined>;
  body: unknown;
}

interface Route {
  method: string;
  pattern: RegExp;
  handler: (request: MockRequest) => MockResult;
}

const SUBJECT_NOT_FOUND = 'Subjekt nenalezen';

function ok(data: unknown, status = 200): MockResult {
  return { status, data };
}

function fail(status: number, message: string): MockResult {
  return { status, message };
}

function found(data: unknown, message: string): MockResult {
  return data === undefined ? fail(404, message) : ok(data);
}

function getCase({ args }: MockRequest): MockResult {
  return args[0] === db.getCase().id ? ok(db.getCase()) : fail(404, 'Spis nenalezen');
}

function getCaseSubjects(): MockResult {
  return ok(db.listCaseSubjects());
}

function createCaseSubject({ body }: MockRequest): MockResult {
  const request = body as CaseSubjectCreateRequest;

  if (!db.getSubject(request.subjectId)) {
    return fail(404, SUBJECT_NOT_FOUND);
  }

  if (db.hasCaseSubject(request.subjectId)) {
    return fail(409, 'Subjekt už na spisu je');
  }

  return ok(db.createCaseSubject(request), 201);
}

function updateCaseSubject({ args, body }: MockRequest): MockResult {
  return found(
    db.updateCaseSubject(Number(args[0]), body as CaseSubjectUpdateRequest),
    'Subjekt na spisu nenalezen',
  );
}

function deleteCaseSubject({ args }: MockRequest): MockResult {
  return db.deleteCaseSubject(Number(args[0]))
    ? ok(null, 204)
    : fail(404, 'Subjekt na spisu nenalezen');
}

function getSubjects({ query }: MockRequest): MockResult {
  return ok(db.listSubjects(query.fulltext ?? ''));
}

function getSubject({ args }: MockRequest): MockResult {
  return found(db.getSubject(Number(args[0])), SUBJECT_NOT_FOUND);
}

function createSubject({ body }: MockRequest): MockResult {
  return ok(db.createSubject(body as SubjectRequest), 201);
}

function updateSubject({ args, body }: MockRequest): MockResult {
  return found(db.updateSubject(Number(args[0]), body as SubjectRequest), SUBJECT_NOT_FOUND);
}

function searchAres({ query }: MockRequest): MockResult {
  const text = query.query ?? '';

  return text.trim().toLowerCase() === 'chyba'
    ? fail(500, 'Služba ARES je nedostupná')
    : ok(db.searchAres(text));
}

function getAresDetail({ args }: MockRequest): MockResult {
  return found(db.getAresDetail(args[0]), 'Záznam v ARES nenalezen');
}

function getDataBox({ args }: MockRequest): MockResult {
  const name = db.getDataBoxName(args[0]);

  return name === undefined ? fail(404, 'Datová schránka nenalezena') : ok({ id: args[0], name });
}

function getCodelist({ args }: MockRequest): MockResult {
  return found(db.getCodelist(args[0]), 'Číselník nenalezen');
}

const routes: Route[] = [
  { method: 'get', pattern: /^\/cases\/([^/]+)$/, handler: getCase },
  { method: 'get', pattern: /^\/cases\/[^/]+\/subjects$/, handler: getCaseSubjects },
  { method: 'post', pattern: /^\/cases\/[^/]+\/subjects$/, handler: createCaseSubject },
  { method: 'patch', pattern: /^\/cases\/[^/]+\/subjects\/(\d+)$/, handler: updateCaseSubject },
  { method: 'delete', pattern: /^\/cases\/[^/]+\/subjects\/(\d+)$/, handler: deleteCaseSubject },
  { method: 'get', pattern: /^\/subjects$/, handler: getSubjects },
  { method: 'get', pattern: /^\/subjects\/(\d+)$/, handler: getSubject },
  { method: 'post', pattern: /^\/subjects$/, handler: createSubject },
  { method: 'put', pattern: /^\/subjects\/(\d+)$/, handler: updateSubject },
  { method: 'get', pattern: /^\/ares\/subjects$/, handler: searchAres },
  { method: 'get', pattern: /^\/ares\/subjects\/([^/]+)$/, handler: getAresDetail },
  { method: 'get', pattern: /^\/data-boxes\/([^/]+)$/, handler: getDataBox },
  { method: 'get', pattern: /^\/codelists\/([^/]+)$/, handler: getCodelist },
];

export function handleMockRequest(
  method: string,
  url: string,
  query: Record<string, string | undefined>,
  body: unknown,
): MockResult {
  for (const route of routes) {
    const match = route.method === method ? route.pattern.exec(url) : null;

    if (match) {
      return route.handler({ args: match.slice(1), query, body });
    }
  }

  return fail(404, 'Cesta nenalezena');
}
