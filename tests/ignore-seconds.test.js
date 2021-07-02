import DurationUnitFormat from '../index';

describe('formatToParts', () => {
  it('formats to parts with custom format not including seconds', () => {
    const parts = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', {
      format: '{days} {hours} {minutes}',
    }));

    expect(parts(1)).toEqual([
      { type: 'minute', value: '0' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
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
    ]);
    expect(parts(110)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minute' },
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
    ]);
    expect(parts(7179)).toEqual([
      { type: 'hour', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'hour' },
      { type: 'literal', value: ' ' },
      { type: 'minute', value: '59' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ])
    expect(parts(7322)).toEqual([
      { type: 'hour', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'hours' },
      { type: 'literal', value: ' ' },
      { type: 'minute', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ]);
    expect(parts(86400)).toEqual([
      { type: 'day', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'day' },
    ]);
    expect(parts(90000)).toEqual([
      { type: 'day', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'day' },
      { type: 'literal', value: ' ' },
      { type: 'hour', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'hour' },
    ]);
    expect(parts(180000)).toEqual([
      { type: 'day', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'days' },
      { type: 'literal', value: ' ' },
      { type: 'hour', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'hours' },
    ]);
  });

  it('formats to parts with custom format restricted by `fields`', () => {
    const parts = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', {
      fields: ['minute', 'second'],
      format: '{days} {hours} {minutes}',
    }));

    expect(parts(1)).toEqual([
      { type: 'minute', value: '0' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
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
    ]);
    expect(parts(110)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minute' },
    ]);
    expect(parts(3600)).toEqual([
      { type: 'minute', value: '60' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ]);
    expect(parts(3601)).toEqual([
      { type: 'minute', value: '60' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ]);
    expect(parts(3660)).toEqual([
      { type: 'minute', value: '61' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ]);
    expect(parts(3661)).toEqual([
      { type: 'minute', value: '61' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ]);
    expect(parts(7179)).toEqual([
      { type: 'minute', value: '119' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ])
    expect(parts(7322)).toEqual([
      { type: 'minute', value: '122' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ]);
    expect(parts(86400)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'group', value: ',' },
      { type: 'minute', value: '440' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ]);
    expect(parts(90000)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'group', value: ',' },
      { type: 'minute', value: '500' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ]);
    expect(parts(180000)).toEqual([
      { type: 'minute', value: '3' },
      { type: 'group', value: ',' },
      { type: 'minute', value: '000' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
    ]);
  });
});
