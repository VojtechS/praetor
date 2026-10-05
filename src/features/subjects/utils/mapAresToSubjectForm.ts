import type { AresSubjectDetail } from '../api/aresApi/aresApi.types.ts';
import type { SubjectFormInput } from '../schemas/subjectForm.schema.ts';
import { mapSubjectToForm } from './subjectFormMapper.ts';

// The ARES detail has the shape of a new subject, so the mapping is the same as for a saved one.
export function mapAresToSubjectForm(detail: AresSubjectDetail): SubjectFormInput {
  return mapSubjectToForm(detail);
}
