import DurationUnitFormat from '../index';

describe('formatToParts', () => {
  it('formats to parts based on style and format', () => {
    const wide = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', {
      style: DurationUnitFormat.styles.WIDE,
      format: '{minutes} {seconds}',
      hideZeroValues: 'leadingAndTrailing',
    }));
    const short = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', {
      style: DurationUnitFormat.styles.SHORT,
      format: '{minutes} {seconds}',
      hideZeroValues: 'leadingAndTrailing',
    }));
    const narrow = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', {
      style: DurationUnitFormat.styles.NARROW,
      format: '{minutes} {seconds}',
      hideZeroValues: 'leadingAndTrailing',
    }));

    expect(wide(0)).toEqual([
      { type: 'second', value: '0' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);
    expect(wide(1)).toEqual([
      { type: 'second', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'second' },
    ]);
    expect(wide(60)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minute' },
    ]);
    expect(wide(150)).toEqual([
      { type: 'minute', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
      { type: 'literal', value: ' ' },
      { type: 'second', value: '30' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);

    expect(short(0)).toEqual([
      { type: 'second', value: '0' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'sec' },
    ]);
    expect(short(1)).toEqual([
      { type: 'second', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'sec' },
    ]);
    expect(short(60)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'min' },
    ]);
    expect(short(150)).toEqual([
      { type: 'minute', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'min' },
      { type: 'literal', value: ' ' },
      { type: 'second', value: '30' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'sec' },
    ]);

    expect(narrow(0)).toEqual([
      { type: 'second', value: '0' },
      { type: 'unit', value: 's' },
    ]);
    expect(narrow(1)).toEqual([
      { type: 'second', value: '1' },
      { type: 'unit', value: 's' },
    ]);
    expect(narrow(60)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'unit', value: 'm' },
    ]);
    expect(narrow(150)).toEqual([
      { type: 'minute', value: '2' },
      { type: 'unit', value: 'm' },
      { type: 'literal', value: ' ' },
      { type: 'second', value: '30' },
      { type: 'unit', value: 's' },
    ]);
  });
});
