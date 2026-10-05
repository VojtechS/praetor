import { checkValue } from '../../../../../shared/utils/checkValue.ts';
import { useCodelistQuery } from '../../../../codelists/hooks/useCodelistQuery.ts';
import { getCodelistLabel } from '../../../../codelists/utils/codelistUtils.ts';
import { SUBJECT_TYPE_LABELS } from '../../../constants/subjectLabels.ts';
import type { SubjectDetail } from '../../../model/subject.types.ts';
import {
  formatBirthDate,
  hasEconomicSubject,
  hasLegalForm,
  hasPhysicalPerson,
} from '../../../utils/subjectUtils.ts';
import { DetailRow } from '../../../../../shared/components/DetailRow/DetailRow.tsx';
import { DetailSection } from '../../../../../shared/components/DetailSection/DetailSection.tsx';

export interface SubjectBasicInfoDetailProps {
  subject: SubjectDetail;
}

function SubjectEconomicRows({ subject }: Readonly<SubjectBasicInfoDetailProps>) {
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

function SubjectPersonRows({ subject }: Readonly<SubjectBasicInfoDetailProps>) {
  return (
    <>
      <DetailRow
        label="Datum narození"
        value={formatBirthDate(subject.physicalPerson?.birthDate)}
      />
      <DetailRow label="Rodné číslo" value={checkValue(subject.physicalPerson?.personalId)} />
    </>
  );
}

export function SubjectBasicInfoDetail({ subject }: Readonly<SubjectBasicInfoDetailProps>) {
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
        <DetailRow label="Typ subjektu" value={SUBJECT_TYPE_LABELS[subject.type]} />
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
        {hasEconomicSubject(subject.type) && (
          <DetailRow label="ID datové schránky" value={checkValue(subject.dataBoxId)} />
        )}
        <DetailRow label="Poznámka" value={checkValue(subject.note)} />
      </div>
    </DetailSection>
  );
}
