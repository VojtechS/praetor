import { Badge } from '../../../../../shared/components/Badge/Badge.tsx';
import type { Contact } from '../../../api/subjectApi/subjectApi.types.ts';
import { CONTACT_TYPE_LABELS } from '../../../constants/subjectLabels.ts';
import { DetailSection } from '../../../../../shared/components/DetailSection/DetailSection.tsx';
import styles from './SubjectContactsDetail.module.scss';

export interface SubjectContactsDetailProps {
  contacts: Contact[];
}

export function SubjectContactsDetail({ contacts }: Readonly<SubjectContactsDetailProps>) {
  return (
    <DetailSection title="Kontakty" count={contacts.length}>
      {contacts.length === 0 && <p className="emptyState">Žádné kontakty</p>}
      <ul className={styles.subjectContactsDetail__list}>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <p>
              <span className={styles.subjectContactsDetail__type}>
                {CONTACT_TYPE_LABELS[contact.type]}
              </span>{' '}
              {contact.value} {contact.isPreferred && <Badge variant="primary">Preferované</Badge>}
            </p>
            {contact.note && <p className={styles.subjectContactsDetail__note}>{contact.note}</p>}
          </li>
        ))}
      </ul>
    </DetailSection>
  );
}
