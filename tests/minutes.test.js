import DurationUnitFormat from '../index';

describe('formatToParts', () => {
  it('formats to parts with custom format including minutes', () => {
    const parts = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', {
      format: '{minutes} {seconds}',
      hideZeroValues: 'leadingAndTrailing',
    }));

    expect(parts(1)).toEqual([
      { type: 'second', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'second' },
    ]);
    expect(parts(30)).toEqual([
      { type: 'second', value: '30' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);
    expect(parts(59)).toEqual([
      { type: 'second', value: '59' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);
    expect(parts(60)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minute' },
    ]);
    expect(parts(61)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minute' },
      { type: 'literal', value: ' ' },
      { type: 'second', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'second' },
    ]);
    expect(parts(62)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minute' },
      { type: 'literal', value: ' ' },
      { type: 'second', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);
    expect(parts(120)).toEqual([
      { type: 'minute', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ]);
    expect(parts(121)).toEqual([
      { type: 'minute', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
      { type: 'literal', value: ' ' },
      { type: 'second', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'second' },
    ]);
    expect(parts(150)).toEqual([
      { type: 'minute', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
      { type: 'literal', value: ' ' },
      { type: 'second', value: '30' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);
  });
});
