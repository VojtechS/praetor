import type { Subject as SubjectApi } from '../api/subjectApi.types.ts';

export type SubjectListItem = Pick<
  SubjectApi,
  'id' | 'type' | 'economicSubject' | 'physicalPerson'
>;

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
