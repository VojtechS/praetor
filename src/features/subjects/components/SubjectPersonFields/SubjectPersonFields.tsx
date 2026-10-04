import { CalendarCheck } from 'lucide-react';
import { useWatch } from 'react-hook-form';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { TextField } from '../../../../shared/components/TextField/TextField.tsx';
import type { SubjectForm } from '../../schemas/subjectForm.schema.ts';
import { getBirthDateFromPersonalId } from '../../utils/subjectUtils.ts';
import { SubjectDocumentRows } from '../SubjectDocumentRows/SubjectDocumentRows.tsx';
import { SubjectFormSection } from '../SubjectFormSection/SubjectFormSection.tsx';
import styles from './SubjectPersonFields.module.scss';

export interface SubjectPersonFieldsProps {
  form: SubjectForm;
}

export function SubjectPersonFields({ form }: Readonly<SubjectPersonFieldsProps>) {
  const { register, control, setValue, formState } = form;
  const errors = 'physicalPerson' in formState.errors ? formState.errors.physicalPerson : undefined;
  const personalId = useWatch({ control, name: 'physicalPerson.personalId' });
  const birthDate = getBirthDateFromPersonalId(personalId ?? '');

  function fillBirthDate() {
    if (birthDate) {
      setValue('physicalPerson.birthDate', birthDate, { shouldDirty: true });
    }
  }

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
          <div className={styles.subjectPersonFields__action}>
            <Button icon={CalendarCheck} disabled={!birthDate} onClick={fillBirthDate}>
              Doplnit dat. nar.
            </Button>
          </div>
        </div>
        <SubjectDocumentRows form={form} />
      </div>
    </SubjectFormSection>
  );
}
