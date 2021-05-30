import trim from '../lib/trim';

describe('trim', function () {
  it('Falls back to default', function () {
    expect(trim([
      { type: 'literal', value: ' ' },
      { type: 'minute', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minute' },
    ])).toEqual([
      { type: 'minute', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minute' },
    ]);
  });
});
