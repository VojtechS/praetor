import { useCodelistQuery } from '../../../codelists/hooks/useCodelistQuery.ts';
import { getCodelistLabel } from '../../../codelists/utils/codelistUtils.ts';
import type { Address } from '../../api/subjectApi/subjectApi.types.ts';
import { formatAddress, getAddressTypeNote } from '../../utils/addressUtils.ts';
import { DetailSection } from '../../../../shared/components/DetailSection/DetailSection.tsx';
import styles from './SubjectAddressesSection.module.scss';

export interface SubjectAddressesSectionProps {
  addresses: Address[];
}

export function SubjectAddressesSection({ addresses }: Readonly<SubjectAddressesSectionProps>) {
  const countries = useCodelistQuery('countries').data;

  return (
    <DetailSection title="Adresy" count={addresses.length}>
      {addresses.length === 0 && <p className="emptyState">Žádné adresy</p>}
      <ul className={styles.subjectAddressesSection__list}>
        {addresses.map((address) => (
          <li key={address.id}>
            <address className="fontStyleNormal">
              {formatAddress({ ...address, country: getCodelistLabel(countries, address.country) })}
            </address>
            <p className={styles.subjectAddressesSection__note}>{getAddressTypeNote(address)}</p>
          </li>
        ))}
      </ul>
    </DetailSection>
  );
}
