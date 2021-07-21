## Intl DurationUnitFormat

Format time duration in quantities of units such as years, months, days, hours, minutes and seconds.

## Overview

The goal of this project is to provide a way to format time durations (like `1 minute 30 seconds`) since the standards don't provide a way to do it.

ECMAScript Internationalization has a long-standing [open issue](https://github.com/tc39/ecma402/issues/47) to provide an `Intl.DurationFormat` API that can accommodate time duration use cases, but as of February 2020 the [proposal](https://github.com/younies/proposal-intl-duration-format) is still at [Stage 1](https://github.com/tc39/proposals/blob/master/ecma402/README.md).

This project does its best at creating a `DurationFormat` implementation that resembles other standard APIs, but only work with time durations.

I'm not in any way part of the standardization process, that's why this package is `-unofficial-`.

## Use cases

1. Natural language time: `1 minute 20 seconds`
1. Timers: `01:20`
1. Short formats `1 hr 2 min 30 sec` or `1h 2m 30s`

## Usage

```js
const duration = new DurationUnitFormat(locales, options);
const parts = duration.formatToParts(90);

/*
parts = [
  { type: 'minute', value: '1' },
  { type: 'literal', value: ' ' },
  { type: 'unit', value: 'minute' },
  { type: 'second', value: '30' },
  { type: 'literal', value: ' ' },
  { type: 'unit', value: 'seconds' },
];
 */
```

## Installation

`npm i intl-unofficial-duration-unit-format`

This package depends on [intl-messageformat](https://github.com/yahoo/intl-messageformat) which is listed in `peerDependencies`.

`intl-messageformat` itself depends on the global [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) object. Refer to [`intl-messageformat` README](https://github.com/formatjs/formatjs/tree/master/packages/intl-messageformat#modern-intl-dependency) on how to set it up correctly on node.js or in the browser.

### Webpack / Parcel / Rollup / ....

All modern bundlers allow you to import npm libraries

```js
import DurationUnitFormat from 'intl-unofficial-duration-unit-format';
```


## Public API

### `DurationUnitFormat` constructor

To create a duration unit to format, use the `DurationUnitFormat` constructor, it takes two parameters:

1. `locales: String | Array<String>` A string with a BCP 47 language tag, or an array of such strings. For more details check [this](https://github.com/yahoo/intl-messageformat/blob/master/README.md#locale-resolution).
1. `options: Object` An optional configuration object. Refer to [`Options`](#options) for additional details.

### `formatToParts(number)`

Once the duration object is created with `duration = new DurationUnitFormat()`, you can call `formatToParts` passing a numeric value.

`number` must be expressed in seconds, so a value of `60` corresponds to `1 minute`.


## Options

## `style`

One of

1. `DurationUnitFormat.styles.WIDE` or just `wide` for wide format time (`1 minute 30 seconds`)
1. `DurationUnitFormat.styles.SHORT` or just `short` for short format time (`1 min 30 sec`)
1. `DurationUnitFormat.styles.NARROW` or just `narrow` for narrow format time (`1m 30s`)
1. `DurationUnitFormat.styles.DOTTED` for timers (`1:30`)
1. `DurationUnitFormat.styles.CUSTOM` for custom formats (`1 minute 30 seconds`)

The default is `WIDE`.

When the style is `DOTTED` numbers are padded and different default formats are applied.

The options `formatDuration` and `formatUnits` only apply when the style is `CUSTOM`.

Given the input of `3600` (1 hour), it'll generate

| `style`  | `format` |Output |
|----------|----------|--------|
| `CUSTOM` | undefined (defaults to `{seconds}`) | `3600 seconds` |
| `CUSTOM` | `{minutes} {seconds}` | `60 minutes` |
| `CUSTOM` | `{hour} {minutes} {seconds}` | `1 hour` |
| `DOTTED`  | undefined (defaults to `{minutes}:{seconds}`)| `60:00` |
| `DOTTED`  | `{seconds}s` | `3600s` |
| `DOTTED`  | `{hour}:{minutes}:{seconds}` | `1:00:00` |
| `DOTTED`  | `{days}d {hour}:{minutes}:{seconds}` | `0d 01:00:00` |
| `WIDE`   | undefined (defaults to `{seconds}`) | `3600 seconds` |
| `WIDE`   | `{minutes} {seconds}` | `60 minutes` |
| `WIDE`   | `{hour} {minutes} {seconds}` | `1 hour` |
| `SHORT`  | undefined (defaults to `{seconds}`) | `3600 sec` |
| `SHORT`  | `{minutes} {seconds}` | `60 min` |
| `SHORT`  | `{hour} {minutes} {seconds}` | `1 hr` |
| `NARROW` | undefined (defaults to `{seconds}`) | `3600s` |
| `NARROW` | `{minutes} {seconds}` | `60m` |
| `NARROW` | `{hour} {minutes} {seconds}` | `1h` |

As shown from the examples, when `DOTTED` is used

1. empty units are kept and rendered as `00` or `0` if they're the highest unit in the format. Empty units in `CUSTOM` are discarded.
1. values are padded to at least 2 digits

Note that on Node.js 10.x, the default implementation of Intl.NumberFormat does not support styles, so you need to use the `@formatjs/intl-unified-numberformat` polyfill.

### `format`

Defines the format of the output string. Default to `{seconds}`.

It can be any string containing any of the placeholders `{days}`, `{hours}`, `{minutes}`, `{seconds}` or any other literal. The format of the placeholders can be customized by [`formatDuration`](#formatDuration).

Given the input of `3661` (1 hour, 1 minute and 1 second), it'll generate

| `format` | Output |
|----------|--------|
| `{seconds}` | `3661 seconds` |
| `{minutes} {seconds}` | `61 minutes 1 second` |
| `{minutes} and {seconds}` | `61 minutes and 1 second` |
| `{hours} {minutes} {seconds}` | `1 hour 1 minute 1 second` |
| `{hours} {minutes}` | `1 hour 1 minute` |
| `{hours}` | `1 hour` |
| `{hours}` | `1 hour` |
| `{days}`  | `0 days` |


### `formatDuration`

Defines the format of the output placeholders. Default to `{value} {unit}`.

It can be any string containing `{value}`, `{unit}` or any other literal. `{value}` corresponds to the numeric value (`1`), while `{unit}` is the time unit (`minute`, `second`).

Given the input of `1`, it'll generate

| `formatDuration`  | Output      |
|-------------------|-------------|
| `{value} {unit}`  | `1 second`  |
| `{value}{unit}`   | `1second`   |
| `{unit}: {value}` | `second: 1` |

## `formatUnits`

Defines the format and localization of each placeholder's `{unit}`. Defaults to the object

```js
{
  [DurationUnitFormat.units.DAY]: '{value, plural, one {day} other {days}}',
  [DurationUnitFormat.units.HOUR]: '{value, plural, one {hour} other {hours}}',
  [DurationUnitFormat.units.MINUTE]: '{value, plural, one {minute} other {minutes}}',
  [DurationUnitFormat.units.SECOND]: '{value, plural, one {second} other {seconds}}',
}
```

The object key must be one of the possible units, and the value is a string using the ICU format defined in [intl-messageformat](https://github.com/yahoo/intl-messageformat/).

Given the input of `1`, it'll generate

| `formatUnits[DurationUnitFormat.units.SECOND]` | Output |
|--------|--------|
| `{value, plural, one {second} other {seconds}}` | `second` |
| `{value, plural, other {秒}}` | `秒` |
| `s` | `s` |

## `round`

Whether or not to round results when smaller units are missing. Default to `false`.

Given the input of `30` and the format `{minutes}`

| `round` | Output      |
|---------|-------------|
| `false` | `0 minutes` |
| `true`  | `1 minute`  |
