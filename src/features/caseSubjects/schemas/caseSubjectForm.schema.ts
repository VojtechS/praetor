import { z } from 'zod';
import { CASE_SUBJECT_ROLE_ORDER } from '../constants/caseSubjectLabels.ts';

const CASE_FILE_NUMBER_MAX_LENGTH = 50;

function toRelatedSubjectIds(value: string[] | string | false): number[] {
  if (Array.isArray(value)) {
    return value.map(Number);
  }

  return value ? [Number(value)] : [];
}

export const caseSubjectRoleSchema = z.enum(CASE_SUBJECT_ROLE_ORDER, { error: 'Vyberte roli' });

export const caseSubjectFormSchema = z
  .object({
    subjectId: z.number({ error: 'Vyberte subjekt' }),
    role: caseSubjectRoleSchema,
    proceduralRole: z.string(),
    materialLegalRole: z.string(),
    legalRepresentativeId: z.number().nullable(),
    caseFileNumber: z
      .string()
      .max(
        CASE_FILE_NUMBER_MAX_LENGTH,
        `Spisová značka může mít nejvýše ${CASE_FILE_NUMBER_MAX_LENGTH} znaků`,
      ),
    preferredRelatedSubjectIds: z
      .union([z.array(z.string()), z.string(), z.literal(false)])
      .transform(toRelatedSubjectIds),
  })
  .refine((values) => values.legalRepresentativeId !== values.subjectId, {
    path: ['legalRepresentativeId'],
    message: 'Právní zástupce nesmí být stejný subjekt jako subjekt',
  });

export type CaseSubjectFormInput = z.input<typeof caseSubjectFormSchema>;
export type CaseSubjectFormValues = z.output<typeof caseSubjectFormSchema>;
