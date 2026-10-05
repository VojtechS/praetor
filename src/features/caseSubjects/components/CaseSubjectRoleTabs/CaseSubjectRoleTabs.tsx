import { useId, useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import type { Contact } from '../../../subjects/api/subjectApi/subjectApi.types.ts';
import { CaseSubjectContactsChecklist } from '../CaseSubjectContactsChecklist/CaseSubjectContactsChecklist.tsx';
import styles from './CaseSubjectRoleTabs.module.scss';

type RoleTab = 'contacts' | 'clientZone';

const TABS: { id: RoleTab; label: string }[] = [
  { id: 'contacts', label: 'Preferované kontakty na spisu' },
  { id: 'clientZone', label: 'Klientská zóna' },
];

export interface CaseSubjectRoleTabsProps {
  contacts: Contact[];
  registration: UseFormRegisterReturn;
  hasSubject: boolean;
}

// Both panels stay mounted so the checked contacts survive switching tabs.
export function CaseSubjectRoleTabs({
  contacts,
  registration,
  hasSubject,
}: Readonly<CaseSubjectRoleTabsProps>) {
  const [activeTab, setActiveTab] = useState<RoleTab>('contacts');
  const id = useId();

  return (
    <section className={styles.caseSubjectRoleTabs}>
      <div className={styles.caseSubjectRoleTabs__tabs} role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${id}-${tab.id}-tab`}
            aria-selected={activeTab === tab.id}
            aria-controls={`${id}-${tab.id}-panel`}
            className={styles.caseSubjectRoleTabs__tab}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {TABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${id}-${tab.id}-panel`}
          aria-labelledby={`${id}-${tab.id}-tab`}
          hidden={activeTab !== tab.id}
        >
          {tab.id === 'contacts' && (
            <CaseSubjectContactsChecklist
              contacts={contacts}
              registration={registration}
              hasSubject={hasSubject}
            />
          )}
        </div>
      ))}
    </section>
  );
}
