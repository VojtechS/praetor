import clsx from 'clsx';
import { useState } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { SelectField } from '../../../../shared/components/SelectField/SelectField.tsx';
import type { SelectOption } from '../../../../shared/components/SelectField/SelectField.tsx';
import { TextField } from '../../../../shared/components/TextField/TextField.tsx';
import { CASE_SUBJECT_ROLE_OPTIONS } from '../../constants/caseSubjectLabels.ts';
import type { CaseSubjectFormInput } from '../../schemas/caseSubjectForm.schema.ts';
import { SubjectPickerField } from '../../../subjects/components/picker/SubjectPickerField/SubjectPickerField.tsx';
import { SubjectPickerPanel } from '../../../subjects/components/picker/SubjectPickerPanel/SubjectPickerPanel.tsx';
import styles from './CaseSubjectRoleFields.module.scss';

type PickerTarget = 'subject' | 'representative';

export interface CaseSubjectRoleFieldsProps {
  register: UseFormRegister<CaseSubjectFormInput>;
  errors: FieldErrors<CaseSubjectFormInput>;
  subjectName?: string;
  representativeName?: string;
  proceduralRoleOptions: SelectOption[];
  materialLegalRoleOptions: SelectOption[];
  onChooseSubject: (subjectId: number) => void;
  onChooseRepresentative: (subjectId: number | null) => void;
  isEditMode?: boolean;
}

export function CaseSubjectRoleFields({
  register,
  errors,
  subjectName,
  representativeName,
  proceduralRoleOptions,
  materialLegalRoleOptions,
  onChooseSubject,
  onChooseRepresentative,
  isEditMode = false,
}: Readonly<CaseSubjectRoleFieldsProps>) {
  const [openPickerTarget, setOpenPickerTarget] = useState<PickerTarget | null>(null);

  function togglePicker(target: PickerTarget) {
    setOpenPickerTarget((current) => (current === target ? null : target));
  }

  function handleChooseSubject(subjectId: number) {
    setOpenPickerTarget(null);
    onChooseSubject(subjectId);
  }

  function handleChooseRepresentative(subjectId: number | null) {
    setOpenPickerTarget(null);
    onChooseRepresentative(subjectId);
  }

  return (
    <div className={styles.caseSubjectRoleFields}>
      {!isEditMode && (
        <div className={styles.caseSubjectRoleFields__full}>
          <SubjectPickerField
            label="Subjekt / osoba"
            value={subjectName}
            placeholder="Vyberte subjekt"
            onClick={() => togglePicker('subject')}
            error={errors.subjectId?.message}
            isExpanded={openPickerTarget === 'subject'}
            isRequired
          />
        </div>
      )}
      {openPickerTarget === 'subject' && (
        <div className={styles.caseSubjectRoleFields__full}>
          <SubjectPickerPanel onChoose={handleChooseSubject} />
        </div>
      )}
      <SelectField
        label="Role"
        registration={register('role')}
        options={CASE_SUBJECT_ROLE_OPTIONS}
        error={errors.role?.message}
        isRequired
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
      <div
        className={clsx(
          styles.caseSubjectRoleFields__full,
          styles.caseSubjectRoleFields__representative,
        )}
      >
        <SubjectPickerField
          label="Právní zástupce"
          value={representativeName}
          placeholder="Vyberte právního zástupce"
          onClick={() => togglePicker('representative')}
          error={errors.legalRepresentativeId?.message}
          isExpanded={openPickerTarget === 'representative'}
        />
        {representativeName && (
          <Button onClick={() => handleChooseRepresentative(null)}>Odebrat zástupce</Button>
        )}
      </div>
      {openPickerTarget === 'representative' && (
        <div className={styles.caseSubjectRoleFields__full}>
          <SubjectPickerPanel isRepresentative onChoose={handleChooseRepresentative} />
        </div>
      )}
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
