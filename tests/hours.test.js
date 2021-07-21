import DurationUnitFormat from '../index';

describe('formatToParts', () => {
  it('formats to parts with custom format including hours', () => {
    const parts = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', {
      format: '{hours} {minutes} {seconds}',
      hideZeroValues: 'all',
    }));

    expect(parts(1)).toEqual([
      { type: 'second', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'second' },
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
    expect(parts(3600)).toEqual([
      { type: 'hour', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'hour' },
    ]);
    expect(parts(3601)).toEqual([
      { type: 'hour', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'hour' },
      { type: 'literal', value: ' ' },
      { type: 'second', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'second' },
    ]);
    expect(parts(3602)).toEqual([
      { type: 'hour', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'hour' },
      { type: 'literal', value: ' ' },
      { type: 'second', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);
    expect(parts(3660)).toEqual([
      { type: 'hour', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'hour' },
      { type: 'literal', value: ' ' },
      { type: 'minute', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minute' },
    ]);
    expect(parts(3661)).toEqual([
      { type: 'hour', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'hour' },
      { type: 'literal', value: ' ' },
      { type: 'minute', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minute' },
      { type: 'literal', value: ' ' },
      { type: 'second', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'second' },
    ]);
    expect(parts(7322)).toEqual([
      { type: 'hour', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'hours' },
      { type: 'literal', value: ' ' },
      { type: 'minute', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
      { type: 'literal', value: ' ' },
      { type: 'second', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);
    expect(parts(90000)).toEqual([
      { type: 'hour', value: '25' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'hours' },
    ]);
  });
});
