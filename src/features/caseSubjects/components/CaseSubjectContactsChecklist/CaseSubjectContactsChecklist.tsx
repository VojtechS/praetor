import type { UseFormRegisterReturn } from 'react-hook-form';
import { CheckboxField } from '../../../../shared/components/CheckboxField/CheckboxField.tsx';
import type { Contact } from '../../../subjects/api/subjectApi/subjectApi.types.ts';
import styles from './CaseSubjectContactsChecklist.module.scss';

function formatContactLabel(contact: Contact): string {
  if (contact.personalId) {
    return `${contact.fullName} (r. č.: ${contact.personalId})`;
  }

  return contact.regNumber ? `${contact.fullName} (IČO: ${contact.regNumber})` : contact.fullName;
}

export interface CaseSubjectContactsChecklistProps {
  contacts: Contact[];
  registration: UseFormRegisterReturn;
  hasSubject: boolean;
}

export function CaseSubjectContactsChecklist({
  contacts,
  registration,
  hasSubject,
}: Readonly<CaseSubjectContactsChecklistProps>) {
  let content = (
    <ul className={styles.caseSubjectContactsChecklist__list}>
      {contacts.map((contact) => (
        <li key={contact.id} className={styles.caseSubjectContactsChecklist__item}>
          <CheckboxField
            label={formatContactLabel(contact)}
            value={String(contact.id)}
            registration={registration}
          />
        </li>
      ))}
    </ul>
  );

  if (!hasSubject) {
    content = <p className="emptyState">Nejdřív vyberte subjekt</p>;
  } else if (contacts.length === 0) {
    content = <p className="emptyState">Subjekt nemá žádné kontaktní osoby</p>;
  }

  return content;
}
