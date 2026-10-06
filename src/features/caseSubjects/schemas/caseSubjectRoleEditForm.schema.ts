import { z } from 'zod';
import { caseSubjectRoleSchema } from './caseSubjectForm.schema.ts';

export const caseSubjectRoleEditFormSchema = z.object({
  role: caseSubjectRoleSchema,
  proceduralRole: z.string(),
  materialLegalRole: z.string(),
});

export type CaseSubjectRoleEditFormInput = z.input<typeof caseSubjectRoleEditFormSchema>;
export type CaseSubjectRoleEditFormValues = z.output<typeof caseSubjectRoleEditFormSchema>;
