import { subjectFormSchema } from './subjectForm.schema.ts';

const common = {
  country: 'CZ',
  language: 'CS',
  clientNumber: '',
  abbreviation: '',
  labels: [],
  note: '',
  category: '',
  group: '',
  responsibleEmployee: '',
  addresses: [],
  connections: [],
};

const economicSubject = {
  companyName: 'INVESTIT Group',
  regNumber: '38227805',
  vatNumber: '',
  legalForm: '',
  registryNote: '',
};

const physicalPerson = {
  titleBefore: '',
  firstName: 'Adam',
  lastName: 'Masaryk',
  titleAfter: '',
  birthDate: '',
  salutation: '',
  personalId: '',
  documents: [],
};

function getErrorPaths(input: unknown): string[] {
  const result = subjectFormSchema.safeParse(input);

  return result.success ? [] : result.error.issues.map((issue) => issue.path.join('.'));
}

describe('subjectFormSchema', () => {
  it('requires the company name of a legal person', () => {
    const input = {
      type: 'LEGAL',
      ...common,
      dataBoxId: '',
      economicSubject: { ...economicSubject, companyName: '' },
    };

    expect(getErrorPaths(input)).toEqual(['economicSubject.companyName']);
  });

  it('requires the first and last name of a physical person', () => {
    const input = {
      type: 'PHYSICAL_NON_ENTREPRENEUR',
      ...common,
      dataBoxId: '',
      physicalPerson: { ...physicalPerson, firstName: '', lastName: '' },
    };

    expect(getErrorPaths(input)).toEqual(['physicalPerson.firstName', 'physicalPerson.lastName']);
  });

  it('does not require the economic subject of a physical non-entrepreneur', () => {
    const input = { type: 'PHYSICAL_NON_ENTREPRENEUR', ...common, dataBoxId: '', physicalPerson };

    expect(getErrorPaths(input)).toEqual([]);
  });

  it('checks the format of the registration number', () => {
    const input = {
      type: 'LEGAL',
      ...common,
      dataBoxId: '',
      economicSubject: { ...economicSubject, regNumber: '1234' },
    };

    expect(getErrorPaths(input)).toEqual(['economicSubject.regNumber']);
  });

  it('checks the format of the personal id', () => {
    const invalid = {
      type: 'PHYSICAL_NON_ENTREPRENEUR',
      ...common,
      dataBoxId: '',
      physicalPerson: { ...physicalPerson, personalId: '12-34' },
    };
    const valid = {
      type: 'PHYSICAL_NON_ENTREPRENEUR',
      ...common,
      dataBoxId: '',
      physicalPerson: { ...physicalPerson, personalId: '640917/2000' },
    };

    expect(getErrorPaths(invalid)).toEqual(['physicalPerson.personalId']);
    expect(getErrorPaths(valid)).toEqual([]);
  });
});
