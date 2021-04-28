# @vanilla-extract/css

## 0.4.0

### Minor Changes

- [#52](https://github.com/seek-oss/vanilla-extract/pull/52) [`2d98bcc`](https://github.com/seek-oss/vanilla-extract/commit/2d98bccb40603585cf9eab70ff0afc52c33f803d) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Rename `createThemeVars` to `createThemeContract`

  **BREAKING CHANGE**

  ```diff
  import {
  -  createThemeVars,
  +  createThemeContract,
    createTheme
  } from '@vanilla-extract/css';

  -export const vars = createThemeVars({
  +export const vars = createThemeContract({
    color: {
      brand: null
    },
    font: {
      body: null
    }
  });
  ```

### Patch Changes

- [#50](https://github.com/seek-oss/vanilla-extract/pull/50) [`48c4a78`](https://github.com/seek-oss/vanilla-extract/commit/48c4a7866a8361de712b89b06abb380bf4709656) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Allow vars to be passed as values to all style properties

## 0.3.2

### Patch Changes

- [#47](https://github.com/seek-oss/vanilla-extract/pull/47) [`a18bc03`](https://github.com/seek-oss/vanilla-extract/commit/a18bc034885a8b1cc1396b3890111067d4858626) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Improve dev prefixes on generated class names

  - Add file name to class names even if no debug id is present
  - If file is the index file use directory name instead

* [#49](https://github.com/seek-oss/vanilla-extract/pull/49) [`2ae4db3`](https://github.com/seek-oss/vanilla-extract/commit/2ae4db3cd442fc493ccc00fd519841b72f1381bf) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Update the unit-less property map

  The original list was borrowed from the [postcss-js parser](https://github.com/postcss/postcss-js/blob/d5127d4278c133f333f1c66f990f3552a907128e/parser.js#L5), but decided to reverse engineer an updated list from [csstype](https://github.com/frenic/csstype) for more thorough coverage.

## 0.3.1

### Patch Changes

- [#45](https://github.com/seek-oss/vanilla-extract/pull/45) [`e154028`](https://github.com/seek-oss/vanilla-extract/commit/e1540281d327fc0883f47255f710de3f9b342c64) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix `createThemeVars` when using null values

- Updated dependencies [[`e154028`](https://github.com/seek-oss/vanilla-extract/commit/e1540281d327fc0883f47255f710de3f9b342c64)]:
  - @vanilla-extract/private@0.1.1

## 0.3.0

### Minor Changes

- [#38](https://github.com/seek-oss/vanilla-extract/pull/38) [`156b491`](https://github.com/seek-oss/vanilla-extract/commit/156b49182367bf233564eae7fd3ea9d3f50fd68a) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `composeStyles` function

* [#37](https://github.com/seek-oss/vanilla-extract/pull/37) [`ae9864c`](https://github.com/seek-oss/vanilla-extract/commit/ae9864c727c2edd0d415b77f738a3c959c98fca6) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Rename `mapToStyles` to `styleVariants`

  **BREAKING CHANGE**

  ```diff
  -import { mapToStyles } from '@vanilla-extract/css';
  +import { styleVariants } from '@vanilla-extract/css';

  -export const variant = mapToStyles({
  +export const variant = styleVariants({
    primary: { background: 'blue' },
    secondary: { background: 'aqua' },
  });
  ```

### Patch Changes

- [#34](https://github.com/seek-oss/vanilla-extract/pull/34) [`756d9b0`](https://github.com/seek-oss/vanilla-extract/commit/756d9b0d0305e8b8a63f0ca1ebe635ab320a5f5b) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Reduce CSS var and identifier lengths

## 0.2.0

### Minor Changes

- [#20](https://github.com/seek-oss/vanilla-extract/pull/20) [`3311914`](https://github.com/seek-oss/vanilla-extract/commit/3311914d92406cda5d5bb71ee72075501f868bd5) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure generated hashes are scoped by package

  vanilla-extract uses file path to ensure unique identifier (e.g. class names, CSS Variables, keyframes, etc) hashes across your application. This information is added to your `*.css.ts` files at build time. The issue with this approach is it meant `*.css.ts` files couldn't be pre-compiled when being published to npm.

  This change adds support for pre-compilation of packages by adding package name information to identifier hashes.

* [#25](https://github.com/seek-oss/vanilla-extract/pull/25) [`c4bedd5`](https://github.com/seek-oss/vanilla-extract/commit/c4bedd571f0c21291b58e050589b4db9465c0460) Thanks [@markdalgleish](https://github.com/markdalgleish)! - The `createInlineTheme` function has now moved to the `@vanilla-extract/dynamic` package.

  ```diff
  -import { createInlineTheme } from '@vanilla-extract/css/createInlineTheme';
  +import { createInlineTheme } from '@vanilla-extract/dynamic';
  ```

## 0.1.0

### Minor Changes

- e83ad50: Initial release
