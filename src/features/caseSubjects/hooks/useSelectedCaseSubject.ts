import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parseSubjectId } from '../../subjects/utils/subjectUtils.ts';
import type { CaseSubject } from '../api/caseSubjectApi.types.ts';

const SUBJECT_ID_PARAM = 'subjectId';

// `items` is undefined until the case subjects are loaded.
export function useSelectedCaseSubject(items: CaseSubject[] | undefined) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isNotFound, setIsNotFound] = useState(false);
  const selectedSubjectId = parseSubjectId(searchParams.get(SUBJECT_ID_PARAM));
  const selectedItem = items?.find((item) => item.subjectId === selectedSubjectId);
  const isUnknown = selectedSubjectId !== null && items !== undefined && !selectedItem;

  function selectSubject(subjectId: number) {
    setSearchParams((params) => {
      params.set(SUBJECT_ID_PARAM, String(subjectId));

      return params;
    });
  }

  // Stable reference, the effect below depends on it.
  const removeParam = useCallback(() => {
    setSearchParams((params) => {
      params.delete(SUBJECT_ID_PARAM);

      return params;
    });
  }, [setSearchParams]);

  function clearSelection() {
    removeParam();
    setIsNotFound(false);
  }

  // The message has to outlive the invalid ?subjectId=, which is removed right away.
  if (isUnknown && !isNotFound) {
    setIsNotFound(true);
  }

  if (selectedItem && isNotFound) {
    setIsNotFound(false);
  }

  useEffect(() => {
    if (isUnknown) {
      removeParam();
    }
  }, [isUnknown, removeParam]);

  return { selectedSubjectId, selectedItem, isNotFound, selectSubject, clearSelection };
}
