import DurationUnitFormat from '../index';

describe('formatToParts', () => {
  it('formats to dotted parts with default format of seconds and minutes', () => {
    const parts = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', {
      style: 'dotted',
    }));

    expect(parts(0)).toEqual([
      { type: 'minute', value: '0' },
      { type: 'literal', value: ':' },
      { type: 'second', value: '00' },
    ]);
    expect(parts(1)).toEqual([
      { type: 'minute', value: '0' },
      { type: 'literal', value: ':' },
      { type: 'second', value: '01' },
    ]);
    expect(parts(30)).toEqual([
      { type: 'minute', value: '0' },
      { type: 'literal', value: ':' },
      { type: 'second', value: '30' },
    ]);
    expect(parts(59)).toEqual([
      { type: 'minute', value: '0' },
      { type: 'literal', value: ':' },
      { type: 'second', value: '59' },
    ]);
    expect(parts(60)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'literal', value: ':' },
      { type: 'second', value: '00' },
    ]);
    expect(parts(61)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'literal', value: ':' },
      { type: 'second', value: '01' },
    ]);
    expect(parts(120)).toEqual([
      { type: 'minute', value: '2' },
      { type: 'literal', value: ':' },
      { type: 'second', value: '00' },
    ]);
    expect(parts(1200)).toEqual([
      { type: 'minute', value: '20' },
      { type: 'literal', value: ':' },
      { type: 'second', value: '00' },
    ]);
    expect(parts(60 * 60)).toEqual([
      { type: 'minute', value: '60' },
      { type: 'literal', value: ':' },
      { type: 'second', value: '00' },
    ]);
    expect(parts(10 * 60 * 60)).toEqual([
      { type: 'minute', value: '600' },
      { type: 'literal', value: ':' },
      { type: 'second', value: '00' },
    ]);
  });
});
