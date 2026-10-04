import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { SelectField } from '../../../../shared/components/SelectField/SelectField.tsx';
import type { SelectOption } from '../../../../shared/components/SelectField/SelectField.tsx';
import { TextField } from '../../../../shared/components/TextField/TextField.tsx';
import { CASE_SUBJECT_ROLE_OPTIONS } from '../../constants/caseSubjectLabels.ts';
import type { CaseSubjectFormInput } from '../../schemas/caseSubjectForm.schema.ts';
import { SubjectPickerField } from '../SubjectPickerField/SubjectPickerField.tsx';
import styles from './CaseSubjectRoleFields.module.scss';

export interface CaseSubjectRoleFieldsProps {
  register: UseFormRegister<CaseSubjectFormInput>;
  errors: FieldErrors<CaseSubjectFormInput>;
  subjectName?: string;
  representativeName?: string;
  proceduralRoleOptions: SelectOption[];
  materialLegalRoleOptions: SelectOption[];
  isEdit: boolean;
  onPickSubject: () => void;
  onPickRepresentative: () => void;
}

export function CaseSubjectRoleFields({
  register,
  errors,
  subjectName,
  representativeName,
  proceduralRoleOptions,
  materialLegalRoleOptions,
  isEdit,
  onPickSubject,
  onPickRepresentative,
}: Readonly<CaseSubjectRoleFieldsProps>) {
  return (
    <div className={styles.caseSubjectRoleFields}>
      <div className={styles.caseSubjectRoleFields__full}>
        <SubjectPickerField
          label="Subjekt / osoba"
          value={subjectName}
          placeholder="Vyberte subjekt"
          onClick={onPickSubject}
          error={errors.subjectId?.message}
          disabled={isEdit}
        />
      </div>
      <SelectField
        label="Role"
        registration={register('role')}
        options={CASE_SUBJECT_ROLE_OPTIONS}
        error={errors.role?.message}
      />
      <SelectField
        label="Procesní role"
        registration={register('proceduralRole')}
        options={proceduralRoleOptions}
        hasEmptyOption
      />
      <SelectField
        label="Hmotně právní role"
        registration={register('materialLegalRole')}
        options={materialLegalRoleOptions}
        hasEmptyOption
      />
      <SubjectPickerField
        label="Právní zástupce"
        value={representativeName}
        placeholder="Vyberte právního zástupce"
        onClick={onPickRepresentative}
        error={errors.legalRepresentativeId?.message}
      />
      <div className={styles.caseSubjectRoleFields__full}>
        <TextField
          label="Sp. zn. vedená subjektem"
          registration={register('caseFileNumber')}
          error={errors.caseFileNumber?.message}
        />
      </div>
    </div>
  );
}
