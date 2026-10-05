export type CodelistName =
  | 'procedural-roles'
  | 'material-legal-roles'
  | 'categories'
  | 'countries'
  | 'languages'
  | 'legal-forms'
  | 'document-types'
  | 'labels'
  | 'groups'
  | 'employees';

export interface CodelistItem {
  code: string;
  label: string;
}

export interface CodelistResponse {
  data: CodelistItem[];
}
