import type { ClientZoneUserFormValues } from '../schemas/clientZoneUserForm.schema.ts';

export const CLIENT_ZONE_PERMISSION_LABELS: Record<ClientZoneUserFormValues['permission'], string> =
  {
    SUBJECT_DEFAULT: 'Dle nastavení subjektu',
    FORBIDDEN: 'Zakázaný přístup',
    NO_INVOICES: 'Bez faktur',
    DOCUMENTS_ONLY: 'Jen dokumenty',
    FULL: 'Full access - plný přístup',
    INVOICES_AND_ATTACHMENTS: 'Faktury a přílohy',
  };

export const CLIENT_ZONE_PERMISSION_OPTIONS = Object.entries(CLIENT_ZONE_PERMISSION_LABELS).map(
  ([value, label]) => ({ value, label }),
);
