import IntlMessageFormat from 'intl-messageformat';
import trim from './lib/trim';

function isNumeric (type) {
  return !['literal', 'unit'].includes(type);
}

class DurationUnitFormat {
  constructor (locales, options = defaultOptions) {
    this.locales = locales;
    // TODO I'm ignoring the unit for now, value is always expressed in seconds
    this.unit = 'second';
    // .style determines how the placeholders are converted to plain text
    this.style = options.style || DurationUnitFormat.styles.WIDE;
    // .isTimer determines some special behaviour, we want to keep the 0s
    this.isTimer = this.style === DurationUnitFormat.styles.DOTTED;
    /*
    "all" // Hide all the fields that have a zero-value
    "leadingAndTrailing" // Hide all the zero fields in the leading or the trailing
    "leadingOnly"
    "trailingOnly"
    "none" // Do not hide any zero-valued fields
    */
    this._hideZeroValues = options.hideZeroValues || 'none';
    // .format used `seconds`, `minutes`, `hours`, ... as placeholders
    this._format = options.format || (this.isTimer ? '{minutes}:{seconds}' : '{seconds}');
    // How to format unit according to style
    this.formatUnits = options.formatUnits || defaultOptions.formatUnits;
    // .formatDuration determines whether we use a space or not
    this.formatDuration = options.formatDuration || defaultOptions.formatDuration;

    this._unitValue = this.formatDuration.match(/\{unit\}.*\{value\}/);

    this.shouldRound = options.round === true;
  }

  format (value) {
    return this.formatToParts(value).map(({ value }) => value).join('');
  }

  formatToParts (value) {
    // Extract all the parts that are actually used from the localised format
    const parts = new IntlMessageFormat(this._format, this.locales).formatToParts({
      second: { unit: DurationUnitFormat.units.SECOND },
      seconds: { unit: DurationUnitFormat.units.SECOND },
      minute: { unit: DurationUnitFormat.units.MINUTE },
      minutes: { unit: DurationUnitFormat.units.MINUTE },
      hour: { unit: DurationUnitFormat.units.HOUR },
      hours: { unit: DurationUnitFormat.units.HOUR },
      day: { unit: DurationUnitFormat.units.DAY },
      days: { unit: DurationUnitFormat.units.DAY },
    });
    // Compute the value of each bucket depending on which parts are used
    const buckets = splitSecondsInBuckets(value, this.unit, parts, this.shouldRound);
    // Each part from the format message could potentially contain multiple parts
    const result = parts.flatMap((token) => this._formatToken(token, buckets));
    return this._trimOutput(result, parts);
  }

  _formatToken (token, buckets) {
    const {value} = token;
    // istanbul ignore if
    if (!value) {
      return [];
    }
    if (value.unit) {
      const number = buckets[value.unit];
      return typeof number === 'number' ? this._formatDurationToParts(value.unit, number) : [];
    }

    // If there is no .unit it's text, but it could be an empty string
    return[{ type: 'literal', value }];
  }

  _formatDurationToParts (unit, number) {
    if (this.isTimer) {
      // With dotted style, we only show the value
      return [{ type: unit, value: this._formatValue(number) }];
    }
    if (isSpecialStyle(this.style)) {
      return new Intl.NumberFormat(this.locales, {
        style: 'unit',
        unit: unit,
        unitDisplay: this.style === 'wide' ? 'long' : this.style,
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
    const hideLeadingZeroes = ['all', 'leadingAndTrailing', 'leadingOnly'].includes(this._hideZeroValues);
    const hideMiddleZeroes = this._hideZeroValues === 'all';
    const hideEndZeroes = ['all', 'leadingAndTrailing', 'trailingOnly'].includes(this._hideZeroValues);

    let state = 'leading';
    let trimmed = trim(result, this.isTimer);

    if (hideLeadingZeroes) {
      for (let idx = 0; idx < trimmed.length; idx++) {
        const {type, value} = trimmed[idx];
        const numeric = isNumeric(type);
        if (numeric && value !== '0') {
          state = 'middle';
          // We check `hideMiddleZeroes` and `hideEndZeroes` later
          break;
        }
        if (numeric) {
          trimmed.splice(0, idx + 1);
          if (!this._unitValue) {
            while (trimmed[0] && !isNumeric(trimmed[0].type)) {
              trimmed.splice(0, 1);
            }
          }
          idx = -1;
        }
      }
    }

    state = 'end';
    if (hideMiddleZeroes || hideEndZeroes) {
      trimmed.reverse();
      for (let idx = 0; idx < trimmed.length; idx++) {
        const {type, value} = trimmed[idx];
        const numeric = isNumeric(type);
        if (numeric && value !== '0') {
          if (state === 'end') {
            state = 'middle';
          } else if (state === 'middle' && !hideMiddleZeroes) {
            state = 'leading';
            break;
          }
          continue;
        }
        if (state === 'middle') {
          if (hideMiddleZeroes && numeric) {
            while (trimmed[idx]) {
              trimmed.splice(idx--, 1);
              if (isNumeric(trimmed[idx].type) && trimmed[idx].value !== '0') {
                break;
              }
            }
          }
          continue;
        }
        if (hideEndZeroes && numeric) {
          // Get final literal as well
          trimmed.splice(0, idx + 2);
          if (trimmed[idx] && trimmed[idx].type === 'unit') {
            trimmed.splice(0, 1);
          }
          idx = -1;
        }
      }
      trimmed.reverse();
    }

    if (trimmed.every(({type}) => type === 'literal')) {
      // if everything cancels out and there are only literals,
      // then return 0 on the lowest available unit
      const minUnit = [
        DurationUnitFormat.units.SECOND,
        DurationUnitFormat.units.MINUTE,
        DurationUnitFormat.units.HOUR,
        DurationUnitFormat.units.DAY,
      ].find((unit) => has(parts, unit));
      return this._formatDurationToParts(minUnit, 0);
    }
    return trimmed;
  }
}

DurationUnitFormat.units = {
  DAY: 'day',
  HOUR: 'hour',
  MINUTE: 'minute',
  SECOND: 'second',
};

DurationUnitFormat.styles = {
  CUSTOM: 'custom',
  DOTTED: 'dotted',
  // https://www.unicode.org/cldr/cldr-aux/charts/27/summary/pl.html#5556
  WIDE: 'wide',
  SHORT: 'short',
  NARROW: 'narrow',
};

const defaultOptions = {
  // unit: DurationUnitFormat.units.SECOND,
  formatDuration: '{value} {unit}',
  formatUnits: {
    // custom values
    [DurationUnitFormat.units.DAY]: '{value, plural, one {day} other {days}}',
    [DurationUnitFormat.units.HOUR]: '{value, plural, one {hour} other {hours}}',
    [DurationUnitFormat.units.MINUTE]: '{value, plural, one {minute} other {minutes}}',
    [DurationUnitFormat.units.SECOND]: '{value, plural, one {second} other {seconds}}',
  },
  style: DurationUnitFormat.styles.WIDE,
};

const SPLIT_POINTS = /(\{value\}|\{unit\})/;

const SECONDS_IN = {
  day: 24 * 60 * 60,
  hour: 60 * 60,
  minute: 60,
  second: 1,
};

function has(parts, unit) {
  return parts.some((_) => _.value.unit === unit);
}

function splitSecondsInBuckets(value, valueUnit, parts, shouldRound) {
  let seconds = value * SECONDS_IN[valueUnit];
  // Rounding will only affect the lowest unit
  // check how many seconds we need to add
  if (shouldRound) {
    const lowestUnit = [
      DurationUnitFormat.units.SECOND,
      DurationUnitFormat.units.MINUTE,
      DurationUnitFormat.units.HOUR,
      DurationUnitFormat.units.DAY,
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
    DurationUnitFormat.units.DAY,
    DurationUnitFormat.units.HOUR,
    DurationUnitFormat.units.MINUTE,
    DurationUnitFormat.units.SECOND,
  ].forEach((unit) => {
    if (has(parts, unit)) {
      buckets[unit] = Math.floor(seconds / SECONDS_IN[unit]);
      seconds -= buckets[unit] * SECONDS_IN[unit];
    }
  });
  return buckets;
}

function isSpecialStyle(style) {
  return [
    DurationUnitFormat.styles.WIDE,
    DurationUnitFormat.styles.SHORT,
    DurationUnitFormat.styles.NARROW,
  ].includes(style);
}

export default DurationUnitFormat;
