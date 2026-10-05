import { MapPin } from 'lucide-react';
import { useWatch } from 'react-hook-form';
import { Button } from '../../../../../shared/components/Button/Button.tsx';
import { CheckboxField } from '../../../../../shared/components/CheckboxField/CheckboxField.tsx';
import { SelectField } from '../../../../../shared/components/SelectField/SelectField.tsx';
import type { SelectOption } from '../../../../../shared/components/SelectField/SelectField.tsx';
import { TextField } from '../../../../../shared/components/TextField/TextField.tsx';
import type { AddressForm } from '../../../schemas/subjectForm.schema.ts';
import styles from './AddressFields.module.scss';

export interface AddressFieldsProps {
  form: AddressForm;
  countryOptions: SelectOption[];
}

export function AddressFields({ form, countryOptions }: Readonly<AddressFieldsProps>) {
  const { register, control, formState } = form;
  const { errors } = formState;
  const useSubjectName = useWatch({ control, name: 'useSubjectName' });

  return (
    <div className={styles.addressFields}>
      <div className={styles.addressFields__full}>
        <CheckboxField
          label="Převzít označení z karty subjektu"
          registration={register('useSubjectName')}
        />
      </div>
      <div className={styles.addressFields__full}>
        <TextField label="Řádek 1" registration={register('line1')} disabled={useSubjectName} />
      </div>
      <div className={styles.addressFields__full}>
        <TextField label="Řádek 2" registration={register('line2')} disabled={useSubjectName} />
      </div>
      <div className={styles.addressFields__full}>
        <TextField label="Řádek 3" registration={register('line3')} disabled={useSubjectName} />
      </div>
      <div className={`${styles.addressFields__full} ${styles.addressFields__street}`}>
        <TextField label="Ulice" registration={register('street')} />
        <TextField label="č.p." registration={register('houseNumber')} />
        <TextField label="č.o." registration={register('orientationNumber')} />
      </div>
      <TextField label="Obec" registration={register('city')} error={errors.city?.message} />
      <TextField label="PSČ" registration={register('zipCode')} error={errors.zipCode?.message} />
      <TextField label="Část obce" registration={register('cityPart')} />
      <TextField label="Kraj" registration={register('region')} />
      <SelectField
        label="Stát"
        registration={register('country')}
        options={countryOptions}
        error={errors.country?.message}
        hasEmptyOption
      />
      <TextField label="Okres" registration={register('district')} />
      <div className={`${styles.addressFields__full} ${styles.addressFields__footer}`}>
        <CheckboxField label="Sídlo" registration={register('isSeat')} />
        <CheckboxField label="Doručovací" registration={register('isDelivery')} />
        <CheckboxField label="Pobočka" registration={register('isBranch')} />
        <CheckboxField label="Fakturační" registration={register('isBilling')} />
        {/* Disabled on purpose: the map search is out of scope of the prototype (spec chapter 9). */}
        <Button icon={MapPin} disabled>
          Vyhledat na mapě
        </Button>
      </div>
    </div>
  );
}
