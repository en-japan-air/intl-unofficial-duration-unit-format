import DurationUnitFormat from '../index';

describe('formatToParts', () => {
  it('formats to dotted parts with custom format excluding seconds', () => {
    const parts = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', {
      style: 'dotted',
      format: '{hours}h{minutes}m',
      round: true,
    }));

    expect(parts(0)).toEqual([
      { type: 'hour', value: '0' },
      { type: 'literal', value: 'h' },
      { type: 'minute', value: '00' },
      { type: 'literal', value: 'm' },
    ]);
    expect(parts(1)).toEqual([
      { type: 'hour', value: '0' },
      { type: 'literal', value: 'h' },
      { type: 'minute', value: '00' },
      { type: 'literal', value: 'm' },
    ]);
    expect(parts(30)).toEqual([
      { type: 'hour', value: '0' },
      { type: 'literal', value: 'h' },
      { type: 'minute', value: '01' },
      { type: 'literal', value: 'm' },
    ]);
    expect(parts(60)).toEqual([
      { type: 'hour', value: '0' },
      { type: 'literal', value: 'h' },
      { type: 'minute', value: '01' },
      { type: 'literal', value: 'm' },
    ]);
    expect(parts(119)).toEqual([
      { type: 'hour', value: '0' },
      { type: 'literal', value: 'h' },
      { type: 'minute', value: '02' },
      { type: 'literal', value: 'm' },
    ]);
    expect(parts(60 * 60 - 40)).toEqual([ // 40 seconds before 1h
      { type: 'hour', value: '0' },
      { type: 'literal', value: 'h' },
      { type: 'minute', value: '59' },
      { type: 'literal', value: 'm' },
    ]);
    expect(parts(60 * 60 - 1)).toEqual([ // 1 second before 1h
      { type: 'hour', value: '1' },
      { type: 'literal', value: 'h' },
      { type: 'minute', value: '00' },
      { type: 'literal', value: 'm' },
    ]);
    expect(parts(10 * 60 * 60)).toEqual([
      { type: 'hour', value: '10' },
      { type: 'literal', value: 'h' },
      { type: 'minute', value: '00' },
      { type: 'literal', value: 'm' },
    ]);
    expect(parts(100 * 60 * 60)).toEqual([
      { type: 'hour', value: '100' },
      { type: 'literal', value: 'h' },
      { type: 'minute', value: '00' },
      { type: 'literal', value: 'm' },
    ]);
  });
});
