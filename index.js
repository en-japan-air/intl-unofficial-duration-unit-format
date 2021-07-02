import IntlMessageFormat from 'intl-messageformat';
import trim from './lib/trim';

class DurationUnitFormat {
  constructor (locales, options = defaultOptions) {
    this.locales = locales;
    // TODO I'm ignoring the unit for now, value is always expressed in seconds
    this.unit = 'second';
    // .style determines how the placeholders are converted to plain text
    this.style = options.style || DurationUnitFormat.styles.LONG;
    // .isTimer determines some special behaviour, we want to keep the 0s
    this.isTimer = this.style === DurationUnitFormat.styles.TIMER;
    // .format used `seconds`, `minutes`, `hours`, ... as placeholders
    this._format = options.format || (this.isTimer ? '{minutes}:{seconds}' : '{seconds}');
    this._fields = options.fields || [
      'year',
      'week',
      'day',
      'hour',
      'minute',
      'second',
      'millisecond',
      'microsecond',
      'nanosecond',
    ];
    // How to format unit according to style
    this.formatUnits = options.formatUnits || defaultOptions.formatUnits;
    // .formatDuration determines whether we use a space or not
    this.formatDuration = options.formatDuration || defaultOptions.formatDuration;
    this.shouldRound = options.round === true;
  }

  format (value) {
    return this.formatToParts(value).map(({ value }) => value).join('');
  }

  formatToParts (value) {
    // Extract all the parts that are actually used from the localised format
    const parts = new IntlMessageFormat(this._format, this.locales).formatToParts({
      nanosecond: { unit: DurationUnitFormat.units.NANOSECOND },
      nanoseconds: { unit: DurationUnitFormat.units.NANOSECOND },
      microsecond: { unit: DurationUnitFormat.units.MICROSECOND },
      microseconds: { unit: DurationUnitFormat.units.MICROSECOND },
      millisecond: { unit: DurationUnitFormat.units.MILLISECOND },
      milliseconds: { unit: DurationUnitFormat.units.MILLISECOND },
      second: { unit: DurationUnitFormat.units.SECOND },
      seconds: { unit: DurationUnitFormat.units.SECOND },
      minute: { unit: DurationUnitFormat.units.MINUTE },
      minutes: { unit: DurationUnitFormat.units.MINUTE },
      hour: { unit: DurationUnitFormat.units.HOUR },
      hours: { unit: DurationUnitFormat.units.HOUR },
      day: { unit: DurationUnitFormat.units.DAY },
      days: { unit: DurationUnitFormat.units.DAY },
      week: { unit: DurationUnitFormat.units.WEEK },
      weeks: { unit: DurationUnitFormat.units.WEEK },
      month: { unit: DurationUnitFormat.units.MONTH },
      months: { unit: DurationUnitFormat.units.MONTH },
      year: { unit: DurationUnitFormat.units.YEAR },
      years: { unit: DurationUnitFormat.units.YEAR },
    });
    // Compute the value of each bucket depending on which parts are used
    const buckets = splitSecondsInBuckets(value, this.unit, parts, this._fields, this.shouldRound);
    // Each part from the format message could potentially contain multiple parts
    const result = parts.flatMap((token) => this._formatToken(token, buckets));
    return this._trimOutput(result, parts);
  }

  _formatToken (token, buckets) {
    const {value} = token;
    if (value.unit) {
      const number = buckets[value.unit];
      return (number || this.isTimer) ? this._formatDurationToParts(value.unit, number) : [];
    } else if (value) {
      // If there is no .unit it's text, but it could be an empty string
      return[{ type: 'literal', value }];
    }
    return [];
  }

  _formatDurationToParts (unit, number) {
    if (this.isTimer) {
      // With timer style, we only show the value
      return [{ type: unit, value: this._formatValue(number) }];
    } else if (isSpecialStyle(this.style)) {
      return new Intl.NumberFormat(this.locales, {
        style: 'unit',
        unit: unit,
        unitDisplay: this.style,
      }).formatToParts(number).map((_) => ({
        // NumberFormat uses 'integer' for types, but I prefer using the unit
        // This is more similar to what happens in DateTimeFormat
        type: _.type === 'integer' ? unit : _.type,
        value: _.value,
      }));
    }
    // This is now only needed for the custom formatting
    return this.formatDuration.split(SPLIT_POINTS).map((text) => {
      if (text === '{value}') {
        return { type: unit, value: this._formatValue(number) };
      }
      if (text === '{unit}') {
        const message = this.formatUnits[unit] || '{value}';
        const formattedUnit = new IntlMessageFormat(message, this.locales).format({ value: number });
        return { type: 'unit', value: formattedUnit };
      }
      if (text) {
        return { type: 'literal', value: text };
      }
    }).filter(Boolean);
  }

  _formatValue (number) {
    return this.isTimer ? number.toString().padStart(2, '0') : number.toString();
  }

  _trimOutput (result, parts) {
    const trimmed = trim(result, this.isTimer);
    if (!trimmed.find((_) => _.type !== 'literal')) {
      // if everything cancels out and there are only literals,
      // then return 0 on the lowest available unit
      const minUnit = [
        DurationUnitFormat.units.NANOSECOND,
        DurationUnitFormat.units.MICROSECOND,
        DurationUnitFormat.units.MILLISECOND,
        DurationUnitFormat.units.SECOND,
        DurationUnitFormat.units.MINUTE,
        DurationUnitFormat.units.HOUR,
        DurationUnitFormat.units.DAY,
        DurationUnitFormat.units.WEEK,
        DurationUnitFormat.units.MONTH,
        DurationUnitFormat.units.YEAR,
      ].find((unit) => has(parts, unit));
      return this._formatDurationToParts(minUnit, 0);
    }
    return trimmed;
  }
}

DurationUnitFormat.units = {
  YEAR: 'year',
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
  HOUR: 'hour',
  MINUTE: 'minute',
  SECOND: 'second',
  MILLISECOND: 'millisecond',
  MICROSECOND: 'microsecond',
  NANOSECOND: 'nanosecond',
};

DurationUnitFormat.styles = {
  CUSTOM: 'custom',
  TIMER: 'timer',
  // http://www.unicode.org/cldr/charts/27/summary/pl.html#5556
  LONG: 'long',
  SHORT: 'short',
  NARROW: 'narrow',
};

const defaultOptions = {
  // unit: DurationUnitFormat.units.SECOND,
  formatDuration: '{value} {unit}',
  formatUnits: {
    // custom values
    [DurationUnitFormat.units.YEAR]: '{value, plural, one {year} other {years}}',
    [DurationUnitFormat.units.MONTH]: '{value, plural, one {month} other {months}}',
    [DurationUnitFormat.units.WEEK]: '{value, plural, one {week} other {weeks}}',
    [DurationUnitFormat.units.DAY]: '{value, plural, one {day} other {days}}',
    [DurationUnitFormat.units.HOUR]: '{value, plural, one {hour} other {hours}}',
    [DurationUnitFormat.units.MINUTE]: '{value, plural, one {minute} other {minutes}}',
    [DurationUnitFormat.units.SECOND]: '{value, plural, one {second} other {seconds}}',
    [DurationUnitFormat.units.MILLISECOND]: '{value, plural, one {millisecond} other {milliseconds}}',
    [DurationUnitFormat.units.MICROSECOND]: '{value, plural, one {microsecond} other {microseconds}}',
    [DurationUnitFormat.units.NANOSECOND]: '{value, plural, one {nanosecond} other {nanoseconds}}',
  },
  style: DurationUnitFormat.styles.LONG,
};

const SPLIT_POINTS = /(\{value\}|\{unit\})/;

const SECONDS_IN = {
  year: 24 * 60 * 60 * 365,
  week: 24 * 60 * 60 * 7,
  day: 24 * 60 * 60,
  hour: 60 * 60,
  minute: 60,
  second: 1,
  millisecond: 1 / 1000,
  microsecond: 1 / 1000000,
  nanosecond: 1 / 1000000000,
};

function has(parts, unit) {
  return !!parts.find((_) => _.value.unit === unit);
}

function splitSecondsInBuckets(value, valueUnit, parts, fields, shouldRound) {
  let seconds = value * SECONDS_IN[valueUnit];
  // Rounding will only affect the lowest unit
  // check how many seconds we need to add
  if (shouldRound) {
    const lowestUnit = [
      DurationUnitFormat.units.NANOSECOND,
      DurationUnitFormat.units.MICROSECOND,
      DurationUnitFormat.units.MILLISECOND,
      DurationUnitFormat.units.SECOND,
      DurationUnitFormat.units.MINUTE,
      DurationUnitFormat.units.HOUR,
      DurationUnitFormat.units.DAY,
      DurationUnitFormat.units.WEEK,
      DurationUnitFormat.units.MONTH,
      DurationUnitFormat.units.YEAR,
    ].find((unit) => has(parts, unit));
    // These many seconds will be ignored by the lowest unit
    const remainder = seconds % SECONDS_IN[lowestUnit];
    if (2 * remainder >= SECONDS_IN[lowestUnit]) {
      // The remainder is large, add enough seconds to increse the lowest unit
      seconds += SECONDS_IN[lowestUnit] - remainder;
    }
  }
  const buckets = {};
  [
    DurationUnitFormat.units.YEAR,
    DurationUnitFormat.units.MONTH,
    DurationUnitFormat.units.WEEK,
    DurationUnitFormat.units.DAY,
    DurationUnitFormat.units.HOUR,
    DurationUnitFormat.units.MINUTE,
    DurationUnitFormat.units.SECOND,
    DurationUnitFormat.units.MILLISECOND,
    DurationUnitFormat.units.MICROSECOND,
    DurationUnitFormat.units.NANOSECOND,
  ].forEach((unit) => {
    if (has(parts, unit) && fields.includes(unit)) {
      buckets[unit] = Math.floor(seconds / SECONDS_IN[unit]);
      seconds -= buckets[unit] * SECONDS_IN[unit];
    }
  });
  return buckets;
}

function isSpecialStyle(style) {
  return [
    DurationUnitFormat.styles.LONG,
    DurationUnitFormat.styles.SHORT,
    DurationUnitFormat.styles.NARROW,
  ].includes(style);
}

export default DurationUnitFormat;
