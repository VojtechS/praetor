import type { Address } from '../api/subjectApi/subjectApi.types.ts';

export type AddressFlags = Pick<Address, 'isSeat' | 'isDelivery' | 'isBranch' | 'isBilling'>;

type AddressTypeFlag = keyof AddressFlags;

export const ADDRESS_TYPE_FLAGS: { key: AddressTypeFlag; label: string }[] = [
  { key: 'isSeat', label: 'sídlo' },
  { key: 'isDelivery', label: 'doručovací' },
  { key: 'isBranch', label: 'pobočka' },
  { key: 'isBilling', label: 'fakturační' },
];

export const CZECH_COUNTRY_CODE = 'CZ';
