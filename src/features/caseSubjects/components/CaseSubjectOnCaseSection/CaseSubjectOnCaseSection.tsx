import { checkValue } from '../../../../shared/utils/checkValue.ts';
import { useCodelistQuery } from '../../../codelists/hooks/useCodelistQuery.ts';
import { getCodelistLabel } from '../../../codelists/utils/codelistUtils.ts';
import type { Contact } from '../../../subjects/api/subjectApi.types.ts';
import { getCaseSubjectRoleLabel } from '../../constants/caseSubjectLabels.ts';
import type { CaseSubjectDetail } from '../../model/caseSubject.types.ts';
import { CaseSubjectDetailRow } from '../CaseSubjectDetailRow/CaseSubjectDetailRow.tsx';
import { CaseSubjectDetailSection } from '../CaseSubjectDetailSection/CaseSubjectDetailSection.tsx';
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
    <CaseSubjectDetailSection title="Na spisu" isOpen>
      <dl>
        <CaseSubjectDetailRow label="Role" value={getCaseSubjectRoleLabel(caseSubject.role)} />
        <CaseSubjectDetailRow
          label="Procesní role"
          value={getCodelistLabel(proceduralRoles.data, caseSubject.proceduralRole)}
        />
        <CaseSubjectDetailRow
          label="Hmotně právní role"
          value={getCodelistLabel(materialLegalRoles.data, caseSubject.materialLegalRole)}
        />
        <CaseSubjectDetailRow
          label="Právní zástupce"
          value={checkValue(caseSubject.legalRepresentativeName)}
        />
        <CaseSubjectDetailRow
          label="Spisová značka"
          value={checkValue(caseSubject.caseFileNumber)}
        />
      </dl>
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
    </CaseSubjectDetailSection>
  );
}
