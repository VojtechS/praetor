import { checkValue } from '../../../../shared/utils/checkValue.ts';
import { useCodelistQuery } from '../../../codelists/hooks/useCodelistQuery.ts';
import { getCodelistLabel } from '../../../codelists/utils/codelistUtils.ts';
import { getSubjectTypeLabel } from '../../../subjects/constants/subjectLabels.ts';
import type { SubjectDetail } from '../../../subjects/model/subject.types.ts';
import {
  canLookupDataBox,
  formatBirthDate,
  hasEconomicSubject,
  hasLegalForm,
  hasPhysicalPerson,
} from '../../../subjects/utils/subjectUtils.ts';
import { CaseSubjectDetailRow } from '../CaseSubjectDetailRow/CaseSubjectDetailRow.tsx';
import { CaseSubjectDetailSection } from '../CaseSubjectDetailSection/CaseSubjectDetailSection.tsx';

export interface SubjectBasicInfoSectionProps {
  subject: SubjectDetail;
}

function SubjectEconomicRows({ subject }: Readonly<SubjectBasicInfoSectionProps>) {
  const legalForms = useCodelistQuery('legal-forms').data;
  const { economicSubject } = subject;

  return (
    <>
      <CaseSubjectDetailRow label="IČO" value={checkValue(economicSubject?.regNumber)} />
      <CaseSubjectDetailRow label="DIČ" value={checkValue(economicSubject?.vatNumber)} />
      {hasLegalForm(subject.type) && (
        <CaseSubjectDetailRow
          label="Právní forma"
          value={getCodelistLabel(legalForms, economicSubject?.legalForm)}
        />
      )}
      <CaseSubjectDetailRow
        label="Zápis v rejstříku"
        value={checkValue(economicSubject?.registryNote)}
      />
    </>
  );
}

function SubjectPersonRows({ subject }: Readonly<SubjectBasicInfoSectionProps>) {
  const birthDate = subject.physicalPerson?.birthDate;

  return (
    <>
      <CaseSubjectDetailRow
        label="Datum narození"
        value={birthDate ? formatBirthDate(birthDate) : checkValue(null)}
      />
      <CaseSubjectDetailRow
        label="Rodné číslo"
        value={checkValue(subject.physicalPerson?.personalId)}
      />
    </>
  );
}

export function SubjectBasicInfoSection({ subject }: Readonly<SubjectBasicInfoSectionProps>) {
  const countries = useCodelistQuery('countries').data;
  const languages = useCodelistQuery('languages').data;
  const labels = useCodelistQuery('labels').data;
  const categories = useCodelistQuery('categories').data;
  const groups = useCodelistQuery('groups').data;
  const employees = useCodelistQuery('employees').data;
  const labelNames = subject.labels.map((code) => getCodelistLabel(labels, code)).join(', ');

  return (
    <CaseSubjectDetailSection title="Základní údaje">
      <dl>
        <CaseSubjectDetailRow label="Typ subjektu" value={getSubjectTypeLabel(subject.type)} />
        {hasEconomicSubject(subject.type) && <SubjectEconomicRows subject={subject} />}
        {hasPhysicalPerson(subject.type) && <SubjectPersonRows subject={subject} />}
        <CaseSubjectDetailRow label="Stát" value={getCodelistLabel(countries, subject.country)} />
        <CaseSubjectDetailRow label="Jazyk" value={getCodelistLabel(languages, subject.language)} />
        <CaseSubjectDetailRow label="Číslo klienta" value={checkValue(subject.clientNumber)} />
        <CaseSubjectDetailRow label="Zkratka" value={checkValue(subject.abbreviation)} />
        <CaseSubjectDetailRow label="Štítky" value={labelNames || checkValue(null)} />
        <CaseSubjectDetailRow
          label="Kategorie"
          value={getCodelistLabel(categories, subject.category)}
        />
        <CaseSubjectDetailRow label="Skupina" value={getCodelistLabel(groups, subject.group)} />
        <CaseSubjectDetailRow
          label="Odpovědný pracovník"
          value={getCodelistLabel(employees, subject.responsibleEmployee)}
        />
        {canLookupDataBox(subject.type) && (
          <CaseSubjectDetailRow label="ID datové schránky" value={checkValue(subject.dataBoxId)} />
        )}
        <CaseSubjectDetailRow label="Poznámka" value={checkValue(subject.note)} />
      </dl>
    </CaseSubjectDetailSection>
  );
}
