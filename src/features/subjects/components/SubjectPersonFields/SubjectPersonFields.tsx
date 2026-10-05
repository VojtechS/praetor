import { TextField } from '../../../../shared/components/TextField/TextField.tsx';
import type { SubjectForm } from '../../schemas/subjectForm.schema.ts';
import { SubjectDocumentRows } from '../SubjectDocumentRows/SubjectDocumentRows.tsx';
import { SubjectFormSection } from '../SubjectFormSection/SubjectFormSection.tsx';
import styles from './SubjectPersonFields.module.scss';

export interface SubjectPersonFieldsProps {
  form: SubjectForm;
}

export function SubjectPersonFields({ form }: Readonly<SubjectPersonFieldsProps>) {
  const { register, formState } = form;
  const errors = 'physicalPerson' in formState.errors ? formState.errors.physicalPerson : undefined;

  return (
    <SubjectFormSection title="Fyzická osoba">
      <div className={styles.subjectPersonFields}>
        <div className={styles.subjectPersonFields__names}>
          <TextField label="Titul před" registration={register('physicalPerson.titleBefore')} />
          <TextField
            label="Jméno"
            registration={register('physicalPerson.firstName')}
            error={errors?.firstName?.message}
          />
          <TextField
            label="Příjmení"
            registration={register('physicalPerson.lastName')}
            error={errors?.lastName?.message}
          />
          <TextField label="Titul za" registration={register('physicalPerson.titleAfter')} />
        </div>
        <div className={styles.subjectPersonFields__pair}>
          <TextField
            label="Datum narození"
            type="date"
            registration={register('physicalPerson.birthDate')}
          />
          <TextField label="Oslovení" registration={register('physicalPerson.salutation')} />
        </div>
        <div className={styles.subjectPersonFields__pair}>
          <TextField
            label="Rodné číslo"
            registration={register('physicalPerson.personalId')}
            error={errors?.personalId?.message}
          />
        </div>
        <SubjectDocumentRows form={form} />
      </div>
    </SubjectFormSection>
  );
}
