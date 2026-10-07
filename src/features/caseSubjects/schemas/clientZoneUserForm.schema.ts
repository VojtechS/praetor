import { z } from 'zod';

export const clientZoneUserFormSchema = z.object({
  name: z.string().trim().min(1, 'Zadejte jméno'),
  email: z.email('Zadejte platný e-mail'),
  phone: z.string(),
  password: z.string(),
  note: z.string(),
  permission: z.enum([
    'SUBJECT_DEFAULT',
    'FORBIDDEN',
    'NO_INVOICES',
    'DOCUMENTS_ONLY',
    'FULL',
    'INVOICES_AND_ATTACHMENTS',
  ]),
});

export type ClientZoneUserFormInput = z.input<typeof clientZoneUserFormSchema>;
export type ClientZoneUserFormValues = z.output<typeof clientZoneUserFormSchema>;

export interface ClientZoneUser extends ClientZoneUserFormValues {
  id: string;
}
