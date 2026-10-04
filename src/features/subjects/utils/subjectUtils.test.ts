import {
  canLookupDataBox,
  getBirthDateFromPersonalId,
  hasEconomicSubject,
  hasLegalForm,
  hasPhysicalPerson,
} from './subjectUtils.ts';

describe('getBirthDateFromPersonalId', () => {
  it('derives the birth date of a man', () => {
    expect(getBirthDateFromPersonalId('640917/2000')).toBe('1964-09-17');
  });

  it('derives the birth date of a woman (month + 50)', () => {
    expect(getBirthDateFromPersonalId('756230/1234')).toBe('1975-12-30');
  });

  it('uses year 2000+ for 10 digits and yy < 54', () => {
    expect(getBirthDateFromPersonalId('0101010009')).toBe('2001-01-01');
  });

  it('returns null for an invalid date', () => {
    expect(getBirthDateFromPersonalId('990231/1234')).toBeNull();
  });
});

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
