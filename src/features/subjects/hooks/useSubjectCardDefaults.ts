import type { AresSubjectDetail } from '../api/aresApi.types.ts';
import type { SubjectDetail } from '../model/subject.types.ts';
import type { SubjectCardState } from '../../caseSubjects/store/useCaseSubjectsUiStore.ts';
import type { SubjectFormInput } from '../schemas/subjectForm.schema.ts';
import { mapAresToSubjectForm } from '../utils/mapAresToSubjectForm.ts';
import { getNewSubjectFormDefaults, mapSubjectToForm } from '../utils/subjectFormMapper.ts';
import { useAresDetailQuery } from './useAresQueries.ts';
import { useSubjectQuery } from './useSubjectQueries.ts';

interface CardParams {
  isEdit: boolean;
  subjectId: number;
  regNumber: string | null;
  formKey: string;
}

// A reg. number chosen in ARES wins over the card state, the form is then filled from ARES.
function getCardParams(
  subjectCard: SubjectCardState | null,
  aresRegNumber: string | null,
): CardParams {
  const regNumber = aresRegNumber ?? subjectCard?.aresPrefill ?? null;
  const subjectId = subjectCard?.subjectId ?? 0;

  return {
    isEdit: subjectCard?.mode === 'edit',
    subjectId,
    regNumber,
    formKey: `${subjectCard?.mode}-${subjectId}-${regNumber}`,
  };
}

function resolveDefaults(
  isEdit: boolean,
  subject: SubjectDetail | undefined,
  aresDetail: AresSubjectDetail | undefined,
  isWaitingForAres: boolean,
): SubjectFormInput | null {
  if (aresDetail) {
    return mapAresToSubjectForm(aresDetail);
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
  const aresQuery = useAresDetailQuery(regNumber ?? '', regNumber !== null);
  const subject = subjectQuery.data?.data;
  const isWaitingForAres = regNumber !== null && !aresQuery.isError;
  const defaultValues = resolveDefaults(isEdit, subject, aresQuery.data?.data, isWaitingForAres);

  return { defaultValues, subject, formKey };
}
