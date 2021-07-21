import DurationUnitFormat from '../index';

describe('formatToParts', () => {
  it('formats to parts with custom format for units and durations', () => {
    const parts = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', {
      style: 'custom',
      hideZeroValues: 'leadingAndTrailing',
      format: '{hours} + {minutes}',
      formatDuration: '{unit}: {value}',
      formatUnits: {
        hour: 'H',
        minute: 'M',
      },
    }));

    expect(parts(0)).toEqual([
      { type: 'unit', value: 'M' },
      { type: 'literal', value: ': ' },
      { type: 'minute', value: '0' },
    ]);
    expect(parts(1)).toEqual([
      { type: 'unit', value: 'M' },
      { type: 'literal', value: ': ' },
      { type: 'minute', value: '0' },
    ]);
    expect(parts(30)).toEqual([
      { type: 'unit', value: 'M' },
      { type: 'literal', value: ': ' },
      { type: 'minute', value: '0' },
    ]);
    expect(parts(60)).toEqual([
      { type: 'literal', value: ' + ' },
      { type: 'unit', value: 'M' },
      { type: 'literal', value: ': ' },
      { type: 'minute', value: '1' },
    ]);
    expect(parts(119)).toEqual([
      { type: 'literal', value: ' + ' },
      { type: 'unit', value: 'M' },
      { type: 'literal', value: ': ' },
      { type: 'minute', value: '1' },
    ]);
    expect(parts(60 * 60 - 40)).toEqual([ // 40 seconds before 1h
      { type: 'literal', value: ' + ' },
      { type: 'unit', value: 'M' },
      { type: 'literal', value: ': ' },
      { type: 'minute', value: '59' },
    ]);
    expect(parts(60 * 60 - 1)).toEqual([ // 1 second before 1h
      { type: 'literal', value: ' + ' },
      { type: 'unit', value: 'M' },
      { type: 'literal', value: ': ' },
      { type: 'minute', value: '59' },
    ]);
    expect(parts(10 * 60 * 60)).toEqual([
      { type: 'unit', value: 'H' },
      { type: 'literal', value: ': ' },
      { type: 'hour', value: '10' },
      { type: 'literal', value: ' + ' },
    ]);
    expect(parts(100 * 60 * 60)).toEqual([
      { type: 'unit', value: 'H' },
      { type: 'literal', value: ': ' },
      { type: 'hour', value: '100' },
      { type: 'literal', value: ' + ' },
    ]);
  });

  it('falls back to {value} when `formatUnits` not complete', function () {
    const parts = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', {
      style: 'custom',
      format: '{hours} + {minutes}',
      hideZeroValues: 'leadingOnly',
      formatDuration: '{unit}: {value}',
      formatUnits: {
        hour: 'H',
      },
    }));

    expect(parts(0)).toEqual([
      { type: 'unit', value: '0' },
      { type: 'literal', value: ': ' },
      { type: 'minute', value: '0' },
    ]);
  });
});
