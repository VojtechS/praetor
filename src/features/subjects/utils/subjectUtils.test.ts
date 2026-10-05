import {
  canLookupDataBox,
  hasEconomicSubject,
  hasLegalForm,
  hasPhysicalPerson,
} from './subjectUtils.ts';

describe('section visibility by subject type', () => {
  it('follows the table in the spec', () => {
    expect(hasEconomicSubject('UNDETERMINED')).toBe(true);
    expect(hasLegalForm('UNDETERMINED')).toBe(false);
    expect(hasPhysicalPerson('LEGAL')).toBe(false);
    expect(hasLegalForm('LEGAL')).toBe(true);
    expect(hasPhysicalPerson('PHYSICAL_ENTREPRENEUR')).toBe(true);
    expect(hasLegalForm('PHYSICAL_ENTREPRENEUR')).toBe(true);
    expect(hasEconomicSubject('PHYSICAL_NON_ENTREPRENEUR')).toBe(false);
    expect(hasPhysicalPerson('PHYSICAL_NON_ENTREPRENEUR')).toBe(true);
    expect(canLookupDataBox('PHYSICAL_NON_ENTREPRENEUR')).toBe(false);
    expect(canLookupDataBox('LEGAL')).toBe(true);
  });
});
