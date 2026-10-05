import { LoadingOverlay } from '../../../../../shared/components/LoadingOverlay/LoadingOverlay.tsx';
import { SelectField } from '../../../../../shared/components/SelectField/SelectField.tsx';
import { TextField } from '../../../../../shared/components/TextField/TextField.tsx';
import { useCodelistQuery } from '../../../../codelists/hooks/useCodelistQuery.ts';
import { toSelectOptions } from '../../../../codelists/utils/codelistUtils.ts';
import type { SubjectForm } from '../../../schemas/subjectForm.schema.ts';
import { SubjectFormSection } from '../SubjectFormSection/SubjectFormSection.tsx';
import styles from './SubjectEconomicFields.module.scss';

export interface SubjectEconomicFieldsProps {
  form: SubjectForm;
  hasLegalForm: boolean;
}

export function SubjectEconomicFields({
  form,
  hasLegalForm,
}: Readonly<SubjectEconomicFieldsProps>) {
  const { register, formState } = form;

  const errors =
    'economicSubject' in formState.errors ? formState.errors.economicSubject : undefined;

  const legalForms = useCodelistQuery('legal-forms').data;

  return (
    <SubjectFormSection title="Ekonomický subjekt">
      {legalForms ? (
        <div className={styles.subjectEconomicFields}>
          <div className={styles.subjectEconomicFields__full}>
            <TextField
              label="Název společnosti"
              registration={register('economicSubject.companyName')}
              error={errors?.companyName?.message}
            />
          </div>
          <TextField
            label="IČO"
            registration={register('economicSubject.regNumber')}
            error={errors?.regNumber?.message}
          />
          {hasLegalForm && (
            <SelectField
              label="Právní forma"
              registration={register('economicSubject.legalForm')}
              options={toSelectOptions(legalForms)}
              hasEmptyOption
            />
          )}
          <TextField
            label="DIČ (VAT No.)"
            registration={register('economicSubject.vatNumber')}
            error={errors?.vatNumber?.message}
          />
          <div className={styles.subjectEconomicFields__full}>
            <TextField
              label="Zápis v rejstříku"
              registration={register('economicSubject.registryNote')}
            />
          </div>
        </div>
      ) : (
        <LoadingOverlay label="Načítání" />
      )}
    </SubjectFormSection>
  );
}
