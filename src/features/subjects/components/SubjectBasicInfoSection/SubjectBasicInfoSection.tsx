import { checkValue } from '../../../../shared/utils/checkValue.ts';
import { useCodelistQuery } from '../../../codelists/hooks/useCodelistQuery.ts';
import { getCodelistLabel } from '../../../codelists/utils/codelistUtils.ts';
import { getSubjectTypeLabel } from '../../constants/subjectLabels.ts';
import type { SubjectDetail } from '../../model/subject.types.ts';
import {
  canLookupDataBox,
  formatBirthDate,
  hasEconomicSubject,
  hasLegalForm,
  hasPhysicalPerson,
} from '../../utils/subjectUtils.ts';
import { DetailRow } from '../../../../shared/components/DetailRow/DetailRow.tsx';
import { DetailSection } from '../../../../shared/components/DetailSection/DetailSection.tsx';

export interface SubjectBasicInfoSectionProps {
  subject: SubjectDetail;
}

function SubjectEconomicRows({ subject }: Readonly<SubjectBasicInfoSectionProps>) {
  const legalForms = useCodelistQuery('legal-forms').data;
  const { economicSubject } = subject;

  return (
    <>
      <DetailRow label="IČO" value={checkValue(economicSubject?.regNumber)} />
      <DetailRow label="DIČ" value={checkValue(economicSubject?.vatNumber)} />
      {hasLegalForm(subject.type) && (
        <DetailRow
          label="Právní forma"
          value={getCodelistLabel(legalForms, economicSubject?.legalForm)}
        />
      )}
      <DetailRow label="Zápis v rejstříku" value={checkValue(economicSubject?.registryNote)} />
    </>
  );
}

function SubjectPersonRows({ subject }: Readonly<SubjectBasicInfoSectionProps>) {
  const birthDate = subject.physicalPerson?.birthDate;

  return (
    <>
      <DetailRow
        label="Datum narození"
        value={birthDate ? formatBirthDate(birthDate) : checkValue(null)}
      />
      <DetailRow label="Rodné číslo" value={checkValue(subject.physicalPerson?.personalId)} />
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
    <DetailSection title="Základní údaje">
      <div>
        <DetailRow label="Typ subjektu" value={getSubjectTypeLabel(subject.type)} />
        {hasEconomicSubject(subject.type) && <SubjectEconomicRows subject={subject} />}
        {hasPhysicalPerson(subject.type) && <SubjectPersonRows subject={subject} />}
        <DetailRow label="Stát" value={getCodelistLabel(countries, subject.country)} />
        <DetailRow label="Jazyk" value={getCodelistLabel(languages, subject.language)} />
        <DetailRow label="Číslo klienta" value={checkValue(subject.clientNumber)} />
        <DetailRow label="Zkratka" value={checkValue(subject.abbreviation)} />
        <DetailRow label="Štítky" value={labelNames || checkValue(null)} />
        <DetailRow label="Kategorie" value={getCodelistLabel(categories, subject.category)} />
        <DetailRow label="Skupina" value={getCodelistLabel(groups, subject.group)} />
        <DetailRow
          label="Odpovědný pracovník"
          value={getCodelistLabel(employees, subject.responsibleEmployee)}
        />
        {canLookupDataBox(subject.type) && (
          <DetailRow label="ID datové schránky" value={checkValue(subject.dataBoxId)} />
        )}
        <DetailRow label="Poznámka" value={checkValue(subject.note)} />
      </div>
    </DetailSection>
  );
}
