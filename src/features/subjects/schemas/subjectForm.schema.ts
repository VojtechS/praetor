import type { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { CZECH_COUNTRY_CODE } from '../constants/addressLabels.ts';

const PHONE_MIN_LENGTH = 9;
const PHONE_MAX_LENGTH = 15;

const REG_NUMBER_PATTERN = /^(\d{8})?$/;
const VAT_NUMBER_PATTERN = /^([A-Za-z]{2}\d+)?$/;
const PERSONAL_ID_PATTERN = /^(\d{6}\/\d{3,4}|\d{9,10})?$/;
export const DATA_BOX_ID_PATTERN = /^([A-Za-z0-9]{7})?$/;
const ZIP_CODE_PATTERN = /^\d{3} \d{2}$/;
const PHONE_PATTERN = /^\+?[\d ]+$/;

const economicSubjectSchema = z.object({
  companyName: z.string().trim().min(1, 'Zadejte název společnosti'),
  regNumber: z.string().regex(REG_NUMBER_PATTERN, 'IČO musí mít 8 číslic'),
  vatNumber: z.string().regex(VAT_NUMBER_PATTERN, 'DIČ musí mít dvě písmena a číslice'),
  legalForm: z.string(),
  registryNote: z.string(),
});

const documentRowSchema = z.object({
  number: z.string().trim().min(1, 'Zadejte číslo dokladu'),
  type: z.string(),
});

const physicalPersonSchema = z.object({
  titleBefore: z.string(),
  firstName: z.string().trim().min(1, 'Zadejte jméno'),
  lastName: z.string().trim().min(1, 'Zadejte příjmení'),
  titleAfter: z.string(),
  birthDate: z.string(),
  salutation: z.string(),
  personalId: z.string().regex(PERSONAL_ID_PATTERN, 'Rodné číslo musí mít tvar 123456/7890'),
  documents: z.array(documentRowSchema),
});

export const addressRowSchema = z
  .object({
    line1: z.string(),
    line2: z.string(),
    line3: z.string(),
    useSubjectName: z.boolean(),
    street: z.string(),
    houseNumber: z.string(),
    orientationNumber: z.string(),
    city: z.string().trim().min(1, 'Zadejte obec'),
    cityPart: z.string(),
    zipCode: z.string(),
    region: z.string(),
    district: z.string(),
    country: z.string().min(1, 'Vyberte stát'),
    isSeat: z.boolean(),
    isDelivery: z.boolean(),
    isBranch: z.boolean(),
    isBilling: z.boolean(),
  })
  .superRefine((address, context) => {
    const isInvalidZip =
      address.country === CZECH_COUNTRY_CODE &&
      address.zipCode !== '' &&
      !ZIP_CODE_PATTERN.test(address.zipCode);

    if (isInvalidZip) {
      context.addIssue({ code: 'custom', path: ['zipCode'], message: 'PSČ musí mít tvar 123 45' });
    }
  });

const connectionRowSchema = z
  .object({
    type: z.enum(['PHONE', 'EMAIL']),
    value: z.string().trim().min(1, 'Zadejte hodnotu'),
    note: z.string(),
    isPreferred: z.boolean(),
  })
  .superRefine((connection, context) => {
    const { type, value } = connection;
    const isValidPhone =
      PHONE_PATTERN.test(value) &&
      value.length >= PHONE_MIN_LENGTH &&
      value.length <= PHONE_MAX_LENGTH;

    if (value === '') {
      return;
    }

    if (type === 'EMAIL' && !z.email().safeParse(value).success) {
      context.addIssue({ code: 'custom', path: ['value'], message: 'Zadejte platný e-mail' });
    } else if (type === 'PHONE' && !isValidPhone) {
      context.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Zadejte platné telefonní číslo',
      });
    }
  });

const commonShape = {
  country: z.string(),
  language: z.string(),
  clientNumber: z.string(),
  abbreviation: z.string(),
  labels: z.array(z.string()),
  note: z.string(),
  category: z.string(),
  group: z.string(),
  responsibleEmployee: z.string(),
  addresses: z.array(addressRowSchema),
  connections: z.array(connectionRowSchema),
  dataBoxId: z.string().regex(DATA_BOX_ID_PATTERN, 'ID datové schránky musí mít 7 znaků'),
};

export const subjectFormSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(['UNDETERMINED', 'LEGAL']),
    ...commonShape,
    economicSubject: economicSubjectSchema,
  }),
  z.object({
    type: z.literal('PHYSICAL_ENTREPRENEUR'),
    ...commonShape,
    economicSubject: economicSubjectSchema,
    physicalPerson: physicalPersonSchema,
  }),
  z.object({
    type: z.literal('PHYSICAL_NON_ENTREPRENEUR'),
    ...commonShape,
    physicalPerson: physicalPersonSchema,
  }),
]);

export type AddressFormInput = z.input<typeof addressRowSchema>;
export type AddressFormValues = z.output<typeof addressRowSchema>;
export type AddressForm = UseFormReturn<AddressFormInput, unknown, AddressFormValues>;
export type SubjectFormInput = z.input<typeof subjectFormSchema>;
export type SubjectFormValues = z.output<typeof subjectFormSchema>;
export type SubjectForm = UseFormReturn<SubjectFormInput, unknown, SubjectFormValues>;
