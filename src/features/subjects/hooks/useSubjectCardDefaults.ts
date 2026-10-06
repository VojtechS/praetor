import type { AresSubjectDetail } from '../api/aresApi/aresApi.types.ts';
import type { Subject } from '../api/subjectApi/subjectApi.types.ts';
import type { SubjectFormInput } from '../schemas/subjectForm.schema.ts';
import { getNewSubjectFormDefaults, mapSubjectToForm } from '../utils/subjectFormMapper.ts';
import { useAresDetailQuery } from './queries/useAresQueries.ts';
import { useSubjectQuery } from './queries/useSubjectQueries.ts';

export interface SubjectCardState {
  mode: 'create' | 'edit' | 'view';
  subjectId: number | null;
  aresPrefill: string | null;
}

interface CardParams {
  isEdit: boolean;
  subjectId: number;
  regNumber: string | null;
  formKey: string;
}

function getCardParams(
  subjectCard: SubjectCardState | null,
  aresRegNumber: string | null,
): CardParams {
  const regNumber = aresRegNumber ?? subjectCard?.aresPrefill ?? null;
  const subjectId = subjectCard?.subjectId ?? 0;

  return {
    isEdit: subjectCard?.mode === 'edit' || subjectCard?.mode === 'view',
    subjectId,
    regNumber,
    formKey: `${subjectCard?.mode}-${subjectId}-${regNumber}`,
  };
}

function resolveDefaults(
  isEdit: boolean,
  subject: Subject | undefined,
  aresDetail: AresSubjectDetail | undefined,
  isWaitingForAres: boolean,
): SubjectFormInput | null {
  if (aresDetail) {
    return mapSubjectToForm(aresDetail);
  }

  if (isEdit) {
    return subject ? mapSubjectToForm(subject) : null;
  }

  return isWaitingForAres ? null : getNewSubjectFormDefaults();
}

export function useSubjectCardDefaults(
  subjectCard: SubjectCardState | null,
  aresRegNumber: string | null,
) {
  const { isEdit, subjectId, regNumber, formKey } = getCardParams(subjectCard, aresRegNumber);

  const subjectQuery = useSubjectQuery(subjectId, isEdit);
  const aresQuery = useAresDetailQuery(regNumber);

  const subject = subjectQuery.data?.data;
  const ares = aresQuery.data?.data;
  const isWaitingForAres = regNumber !== null && !aresQuery.isError;

  const defaultValues = resolveDefaults(isEdit, subject, ares, isWaitingForAres);

  return { defaultValues, subject, formKey };
}
