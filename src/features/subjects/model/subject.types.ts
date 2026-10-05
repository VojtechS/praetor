import type { Subject as SubjectApi } from '../api/subjectApi/subjectApi.types.ts';

export type SubjectDetail = Pick<
  SubjectApi,
  | 'id'
  | 'type'
  | 'country'
  | 'language'
  | 'clientNumber'
  | 'abbreviation'
  | 'labels'
  | 'note'
  | 'category'
  | 'group'
  | 'responsibleEmployee'
  | 'economicSubject'
  | 'physicalPerson'
  | 'dataBoxId'
  | 'addresses'
  | 'connections'
  | 'contacts'
>;
