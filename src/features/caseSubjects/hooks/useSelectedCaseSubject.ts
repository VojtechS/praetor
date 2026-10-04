import { useSearchParams } from 'react-router-dom';
import { parseSubjectId } from '../../subjects/utils/subjectUtils.ts';

const SUBJECT_ID_PARAM = 'subjectId';

export function useSelectedCaseSubject() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSubjectId = parseSubjectId(searchParams.get(SUBJECT_ID_PARAM));

  function selectSubject(subjectId: number) {
    setSearchParams((params) => {
      params.set(SUBJECT_ID_PARAM, String(subjectId));

      return params;
    });
  }

  function clearSelection() {
    setSearchParams((params) => {
      params.delete(SUBJECT_ID_PARAM);

      return params;
    });
  }

  return { selectedSubjectId, selectSubject, clearSelection };
}
