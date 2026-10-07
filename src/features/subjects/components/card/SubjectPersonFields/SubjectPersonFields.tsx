import { useFormState } from 'react-hook-form';
import { TextField } from '../../../../../shared/components/TextField/TextField.tsx';
import type { SubjectForm } from '../../../schemas/subjectForm.schema.ts';
import { SubjectDocumentRows } from '../SubjectDocumentRows/SubjectDocumentRows.tsx';
import { SubjectFormSection } from '../SubjectFormSection/SubjectFormSection.tsx';
import styles from './SubjectPersonFields.module.scss';

export interface SubjectPersonFieldsProps {
  form: SubjectForm;
  isReadOnly: boolean;
}

export function SubjectPersonFields({ form, isReadOnly }: Readonly<SubjectPersonFieldsProps>) {
  const { register, control } = form;
  const { errors: formErrors } = useFormState({ control });

  const errors = 'physicalPerson' in formErrors ? formErrors.physicalPerson : undefined;

  return (
    <SubjectFormSection title="Fyzická osoba">
      <div className={styles.subjectPersonFields}>
        <div className={styles.subjectPersonFields__names}>
          <TextField label="Titul před" registration={register('physicalPerson.titleBefore')} />
          <TextField
            label="Jméno"
            registration={register('physicalPerson.firstName')}
            error={errors?.firstName?.message}
            isRequired
          />
          <TextField
            label="Příjmení"
            registration={register('physicalPerson.lastName')}
            error={errors?.lastName?.message}
            isRequired
          />
          <TextField label="Titul za" registration={register('physicalPerson.titleAfter')} />
        </div>
        <div className={styles.subjectPersonFields__pair}>
          <TextField
            label="Datum narození"
            type="date"
            registration={register('physicalPerson.birthDate')}
          />
          <TextField
            label="Rodné číslo"
            registration={register('physicalPerson.personalId')}
            error={errors?.personalId?.message}
          />
        </div>
        <div className={styles.subjectPersonFields__pair}>
          <TextField label="Oslovení" registration={register('physicalPerson.salutation')} />
        </div>
        <SubjectDocumentRows form={form} isReadOnly={isReadOnly} />
      </div>
    </SubjectFormSection>
  );
}
