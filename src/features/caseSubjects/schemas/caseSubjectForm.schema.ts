import { z } from 'zod';

const CASE_FILE_NUMBER_MAX_LENGTH = 50;

function toRelatedSubjectIds(value: string[] | string | false): number[] {
  if (Array.isArray(value)) {
    return value.map(Number);
  }

  return value ? [Number(value)] : [];
}

export const caseSubjectFormSchema = z
  .object({
    subjectId: z.number({ error: 'Vyberte subjekt' }),
    role: z.enum(['CLIENT', 'OPPOSING_PARTY', 'PARTICIPANT', 'DECIDING_AUTHORITY'], {
      error: 'Vyberte roli',
    }),
    proceduralRole: z.string(),
    materialLegalRole: z.string(),
    legalRepresentativeId: z.number().nullable(),
    caseFileNumber: z
      .string()
      .max(CASE_FILE_NUMBER_MAX_LENGTH, 'Spisová značka může mít nejvýše 50 znaků'),
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
