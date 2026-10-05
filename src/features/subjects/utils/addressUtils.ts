import type { Address } from '../api/subjectApi/subjectApi.types.ts';
import { ADDRESS_TYPE_FLAGS, type AddressFlags } from '../constants/addressLabels.ts';

type AddressLines = Pick<
  Address,
  'street' | 'houseNumber' | 'orientationNumber' | 'zipCode' | 'city' | 'country'
>;

export function formatAddress(address: AddressLines): string {
  const numbers = [address.houseNumber, address.orientationNumber].filter(Boolean).join('/');
  const street = [address.street, numbers].filter(Boolean).join(' ');
  const city = [address.zipCode, address.city].filter(Boolean).join(' ');

  return [street, city, address.country].filter(Boolean).join(', ');
}

export function getAddressTypeNote(address: AddressFlags): string {
  return ADDRESS_TYPE_FLAGS.filter((flag) => address[flag.key])
    .map((flag) => flag.label)
    .join(', ');
}
