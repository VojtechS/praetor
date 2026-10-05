import { checkValue } from '../../../../shared/utils/checkValue.ts';
import { useCodelistQuery } from '../../../codelists/hooks/useCodelistQuery.ts';
import { getCodelistLabel } from '../../../codelists/utils/codelistUtils.ts';
import type { Contact } from '../../../subjects/api/subjectApi/subjectApi.types.ts';
import { getCaseSubjectRoleLabel } from '../../constants/caseSubjectLabels.ts';
import type { CaseSubjectDetail } from '../../model/caseSubject.types.ts';
import { DetailRow } from '../../../../shared/components/DetailRow/DetailRow.tsx';
import { DetailSection } from '../../../../shared/components/DetailSection/DetailSection.tsx';
import styles from './CaseSubjectOnCaseSection.module.scss';

export interface CaseSubjectOnCaseSectionProps {
  caseSubject: CaseSubjectDetail;
  contacts: Contact[];
}

export function CaseSubjectOnCaseSection({
  caseSubject,
  contacts,
}: Readonly<CaseSubjectOnCaseSectionProps>) {
  const proceduralRoles = useCodelistQuery('procedural-roles');
  const materialLegalRoles = useCodelistQuery('material-legal-roles');
  const preferredContacts = contacts.filter((contact) =>
    caseSubject.preferredContactIds.includes(contact.id),
  );

  return (
    <DetailSection title="Na spisu" isOpen>
      <div>
        <DetailRow label="Role" value={getCaseSubjectRoleLabel(caseSubject.role)} />
        <DetailRow
          label="Procesní role"
          value={getCodelistLabel(proceduralRoles.data, caseSubject.proceduralRole)}
        />
        <DetailRow
          label="Hmotně právní role"
          value={getCodelistLabel(materialLegalRoles.data, caseSubject.materialLegalRole)}
        />
        <DetailRow
          label="Právní zástupce"
          value={checkValue(caseSubject.legalRepresentativeName)}
        />
        <DetailRow label="Spisová značka" value={checkValue(caseSubject.caseFileNumber)} />
      </div>
      <h3 className={styles.caseSubjectOnCaseSection__title}>Preferované kontakty</h3>
      {preferredContacts.length === 0 ? (
        <p>{checkValue(null)}</p>
      ) : (
        <ul className={styles.caseSubjectOnCaseSection__contacts}>
          {preferredContacts.map((contact) => (
            <li key={contact.id}>{contact.fullName}</li>
          ))}
        </ul>
      )}
    </DetailSection>
  );
}
