import DurationUnitFormat from '../index';

describe('formatToParts', () => {
  it('formats to parts with custom format rounding missing seconds', () => {
    const parts = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', {
      format: '{hours} {minutes}',
      hideZeroValues: 'leadingAndTrailing',
      round: true,
    }));

    expect(parts(29)).toEqual([
      { type: 'minute', value: '0' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ]);
    expect(parts(30)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minute' },
    ]);
    expect(parts(600)).toEqual([
      { type: 'minute', value: '10' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ]);
    expect(parts(59 * 60 + 29)).toEqual([
      { type: 'minute', value: '59' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ]);
    expect(parts(59 * 60 + 32)).toEqual([
      { type: 'hour', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'hour' },
    ]);
    expect(parts(7179)).toEqual([
      { type: 'hour', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'hours' },
    ]);
    expect(parts(23 * 3600 /* h */ + 59 * 60 /* m */ + 40)).toEqual([
      { type: 'hour', value: '24' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'hours' },
    ]);
  });
});
