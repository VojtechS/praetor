import { useWatch } from 'react-hook-form';
import { LoadingOverlay } from '../../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import { MultiSelectField } from '../../../../../shared/components/MultiSelectField/MultiSelectField.tsx';
import { SelectField } from '../../../../../shared/components/SelectField/SelectField.tsx';
import { TextField } from '../../../../../shared/components/TextField/TextField.tsx';
import { useCodelistQuery } from '../../../../codelists/hooks/useCodelistQuery.ts';
import { toSelectOptions } from '../../../../codelists/utils/codelistUtils.ts';
import { SUBJECT_TYPE_OPTIONS } from '../../../constants/subjectLabels.ts';
import type { SubjectForm } from '../../../schemas/subjectForm.schema.ts';
import { SubjectFormSection } from '../SubjectFormSection/SubjectFormSection.tsx';
import styles from './SubjectBasicFields.module.scss';

export interface SubjectBasicFieldsProps {
  form: SubjectForm;
  isReadOnly: boolean;
}

export function SubjectBasicFields({ form, isReadOnly }: Readonly<SubjectBasicFieldsProps>) {
  const { register, control, formState } = form;

  const countries = useCodelistQuery('countries').data;
  const languages = useCodelistQuery('languages').data;
  const labels = useCodelistQuery('labels').data;
  const categories = useCodelistQuery('categories').data;
  const groups = useCodelistQuery('groups').data;
  const employees = useCodelistQuery('employees').data;
  const selectedLabels = useWatch({ control, name: 'labels' });

  if (!countries || !languages || !labels || !categories || !groups || !employees) {
    return (
      <SubjectFormSection title="Základní údaje">
        <LoadingOverlay label="Načítání číselníků" />
      </SubjectFormSection>
    );
  }

  return (
    <SubjectFormSection title="Základní údaje">
      <div className={styles.subjectBasicFields}>
        <div className={styles.subjectBasicFields__full}>
          <SelectField
            label="Typ subjektu"
            registration={register('type')}
            options={SUBJECT_TYPE_OPTIONS}
          />
        </div>
        <SelectField
          label="Stát"
          registration={register('country')}
          options={toSelectOptions(countries)}
          hasEmptyOption
        />
        <SelectField
          label="Jazyk"
          registration={register('language')}
          options={toSelectOptions(languages)}
          hasEmptyOption
        />
        <TextField label="Číslo klienta" registration={register('clientNumber')} />
        <TextField label="Zkratka" registration={register('abbreviation')} />
        <div className={styles.subjectBasicFields__full}>
          <MultiSelectField
            label="Štítky"
            registration={register('labels')}
            options={toSelectOptions(labels)}
            selectedValues={selectedLabels}
            error={formState.errors.labels?.message}
            isDisabled={isReadOnly}
          />
        </div>
        <TextField label="Poznámka" registration={register('note')} />
        <SelectField
          label="Kategorie"
          registration={register('category')}
          options={toSelectOptions(categories)}
          hasEmptyOption
        />
        <SelectField
          label="Skupina"
          registration={register('group')}
          options={toSelectOptions(groups)}
          hasEmptyOption
        />
        <SelectField
          label="Odpovědný pracovník"
          registration={register('responsibleEmployee')}
          options={toSelectOptions(employees)}
          hasEmptyOption
        />
      </div>
    </SubjectFormSection>
  );
}
