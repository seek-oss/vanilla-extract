# 🧁 vanilla-extract

**Zero-runtime Stylesheets-in-TypeScript.**

Write your styles in TypeScript (or JavaScript) with locally scoped class names and CSS Variables, then generate static CSS files at build time.

Basically, it’s [“CSS Modules](https://github.com/css-modules/css-modules)-in-TypeScript” but with scoped CSS Variables + heaps more.

🔥 &nbsp; All styles generated at build time — just like [Sass](https://sass-lang.com), [Less](http://lesscss.org), etc.

✨ &nbsp; Minimal abstraction over standard CSS.

🦄 &nbsp; Works with any front-end framework — or even without one.

🌳 &nbsp; Locally scoped class names — just like [CSS Modules.](https://github.com/css-modules/css-modules)

🚀 &nbsp; Locally scoped [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), `@keyframes` and `@font-face` rules.

🎨 &nbsp; High-level theme system with support for simultaneous themes. No globals!

🛠 &nbsp; Utils for generating variable-based `calc` expressions.

💪 &nbsp; Type-safe styles via [CSSType.](https://github.com/frenic/csstype)

🏃‍♂️ &nbsp; Optional runtime version for development and testing.

🙈 &nbsp; Optional API for dynamic runtime theming.

---

🖥 &nbsp; [Try it out for yourself in CodeSandbox.](https://codesandbox.io/s/github/seek-oss/vanilla-extract/tree/master/examples/webpack-react?file=/src/App.css.ts)

---

**Write your styles in `.css.ts` files.**

```ts
// styles.css.ts

import { createTheme, style } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});

export const exampleStyle = style({
  backgroundColor: vars.color.brand,
  fontFamily: vars.font.body,
  color: 'white',
  padding: 10
});
```

> 💡 These `.css.ts` files will be evaluated at build time. None of the code in these files will be included in your final bundle. Think of it as using TypeScript as your preprocessor instead of Sass, Less, etc.

**Then consume them in your markup.**

```ts
// app.ts

import { themeClass, exampleStyle } from './styles.css.ts';

document.write(`
  <section class="${themeClass}">
    <h1 class="${exampleStyle}">Hello world!</h1>
  </section>
`);
```

---

Want to work at a higher level while maximising style re-use? Check out  🍨 [Sprinkles](https://github.com/seek-oss/vanilla-extract/tree/master/packages/sprinkles), our official zero-runtime atomic CSS framework, built on top of vanilla-extract.

---

- [Setup](#setup)
  - [webpack](#webpack)
  - [esbuild](#esbuild)
  - [Vite](#vite)
  - [Snowpack](#snowpack)
  - [Gatsby](#gatsby)
  - [Test environments](#test-environments)
- [Styling API](#styling-api)
  - [style](#style)
  - [styleVariants](#styleVariants)
  - [globalStyle](#globalstyle)
  - [composeStyles](#composestyles)
  - [createTheme](#createtheme)
  - [createGlobalTheme](#createglobaltheme)
  - [createThemeContract](#createthemecontract)
  - [assignVars](#assignvars)
  - [createVar](#createvar)
  - [fallbackVar](#fallbackvar)
  - [fontFace](#fontface)
  - [globalFontFace](#globalfontface)
  - [keyframes](#keyframes)
  - [globalKeyframes](#globalkeyframes)
- [Dynamic API](#dynamic-api)
  - [assignInlineVars](#assigninlinevars)
  - [setElementVars](#setelementvars)
- [Utility functions](#utility-functions)
  - [calc](#calc)
- [Thanks](#thanks)
- [License](#license)

---

## Setup

There are currently a few integrations to choose from.

### webpack

1. Install the dependencies.

```bash
npm install @vanilla-extract/css @vanilla-extract/babel-plugin @vanilla-extract/webpack-plugin
```

2. Add the [Babel](https://babeljs.io) plugin.

```json
{
  "plugins": ["@vanilla-extract/babel-plugin"]
}
```

3. Add the [webpack](https://webpack.js.org) plugin.

```js
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');

module.exports = {
  plugins: [new VanillaExtractPlugin()],
};
```

<details>
  <summary>You'll need to ensure you're handling CSS files in your webpack config.</summary>

  <br/>
  For example:
  
  ```js
  const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');

  module.exports = {
    plugins: [
      new VanillaExtractPlugin(),
      new MiniCssExtractPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.vanilla\.css$/i, // Targets only CSS files generated by vanilla-extract
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                url: false // Required as image imports should be handled via JS/TS import statements
              }
            }
          ]
        }
      ]
    }
  };
  ```
</details>

### esbuild

1. Install the dependencies.

```bash
npm install @vanilla-extract/css @vanilla-extract/esbuild-plugin
```

2. Add the [esbuild](https://esbuild.github.io/) plugin to your build script.

```js
const { vanillaExtractPlugin } = require('@vanilla-extract/esbuild-plugin');

require('esbuild').build({
  entryPoints: ['app.ts'],
  bundle: true,
  plugins: [vanillaExtractPlugin()],
  outfile: 'out.js',
}).catch(() => process.exit(1))
```

> Please note: There are currently no automatic readable class names during development. However, you can still manually provide a debug ID as the last argument to functions that generate scoped styles, e.g. `export const className = style({ ... }, 'className');`

3. Process CSS

As [esbuild](https://esbuild.github.io/) currently doesn't have a way to process the CSS generated by vanilla-extract, you can optionally use the `processCss` option.

For example, to run autoprefixer over the generated CSS.

```js
const {
  vanillaExtractPlugin
} = require('@vanilla-extract/esbuild-plugin');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

async function processCss(css) {
  const result = await postcss([autoprefixer]).process(
    css,
    {
      from: undefined /* suppress source map warning */
    }
  );

  return result.css;
}

require('esbuild')
  .build({
    entryPoints: ['app.ts'],
    bundle: true,
    plugins: [
      vanillaExtractPlugin({
        processCss
      })
    ],
    outfile: 'out.js'
  })
  .catch(() => process.exit(1));
```

### Vite

> Warning: Currently the Vite plugin doesn't rebuild files when dependent files change, e.g. updating `theme.css.ts` should rebuild `styles.css.ts` which imports `theme.css.ts`. This is a limitation in the Vite Plugin API that will hopefully be resolved soon. You can track the Vite issue here: https://github.com/vitejs/vite/issues/3216

1. Install the dependencies.

```bash
npm install @vanilla-extract/css @vanilla-extract/vite-plugin
```

2. Add the [Vite](https://vitejs.dev/) plugin to your Vite config.

```js
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// vite.config.js
export default {
  plugins: [vanillaExtractPlugin()]
}
```

> Please note: There are currently no automatic readable class names during development. However, you can still manually provide a debug ID as the last argument to functions that generate scoped styles, e.g. `export const className = style({ ... }, 'className');`

### Snowpack

1. Install the dependencies.

```bash
npm install @vanilla-extract/css @vanilla-extract/snowpack-plugin
```

2. Add the [Snowpack](https://www.snowpack.dev/) plugin to your snowpack config.

```js
// snowpack.config.json
{
  "plugins": ["@vanilla-extract/snowpack-plugin"]
}
```

> Please note: There are currently no automatic readable class names during development. However, you can still manually provide a debug ID as the last argument to functions that generate scoped styles, e.g. `export const className = style({ ... }, 'className');`

### Gatsby

To add to your [Gatsby](https://www.gatsbyjs.com) site, use the [gatsby-plugin-vanilla-extract](https://github.com/KyleAMathews/gatsby-plugin-vanilla-extract) plugin.

### Test environments

1. Install the dependencies.

```bash
$ npm install @vanilla-extract/babel-plugin
```

2. Add the [Babel](https://babeljs.io) plugin.

```json
{
  "plugins": ["@vanilla-extract/babel-plugin"]
}
```

3. Disable runtime styles (Optional)

In testing environments (like `jsdom`) vanilla-extract will create and insert styles. While this is often desirable, it can be a major slowdown in your tests. If your tests don’t require styles to be available, the `disableRuntimeStyles` import will disable all style creation.

```ts
// setupTests.ts
import '@vanilla-extract/css/disableRuntimeStyles';
```


---

## Styling API

> 🍬 If you're a [treat](https://seek-oss.github.io/treat) user, check out our [migration guide.](./docs/treat-migration-guide.md)

### style

Creates styles attached to a locally scoped class name.

```ts
import { style } from '@vanilla-extract/css';

export const className = style({
  display: 'flex'
});
```

CSS Variables, simple pseudos, selectors and media/feature queries are all supported.

```ts
import { style } from '@vanilla-extract/css';
import { vars } from './vars.css.ts';

export const className = style({
  display: 'flex',
  vars: {
    [vars.localVar]: 'green',
    '--global-variable': 'purple'
  },
  ':hover': {
    color: 'red'
  },
  selectors: {
    '&:nth-child(2n)': {
      background: '#fafafa'
    }
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: 10
    }
  },
  '@supports': {
    '(display: grid)': {
      display: 'grid'
    }
  }
});
```

Selectors can also contain references to other scoped class names.

```ts
import { style } from '@vanilla-extract/css';

export const parentClass = style({});

export const childClass = style({
  selectors: {
    [`${parentClass}:focus &`]: {
      background: '#fafafa'
    }
  },
});
```

> 💡 To improve maintainability, each `style` block can only target a single element. To enforce this, all selectors must target the `&` character which is a reference to the current element. For example, `'&:hover:not(:active)'` is considered valid, while `'& > a'` and ``[`& ${childClass}`]`` are not.
>
>If you want to target another scoped class then it should be defined within the `style` block of that class instead. For example, ``[`& ${childClass}`]`` is invalid since it targets `${childClass}`, so it should instead be defined in the `style` block for `childClass`.
>
>If you want to globally target child nodes within the current element (e.g. `'& > a'`), you should use [`globalStyle`](#globalstyle) instead.

### styleVariants

Creates a collection of named style variants.

```ts
import { styleVariants } from '@vanilla-extract/css';

export const variant = styleVariants({
  primary: { background: 'blue' },
  secondary: { background: 'aqua' },
});
```

> 💡 This is useful for mapping component props to styles, e.g. `<button className={styles.variant[props.variant]}>`

You can also transform the values by providing a map function as the second argument.

```ts
import { styleVariants } from '@vanilla-extract/css';

const spaceScale = {
  small: 4,
  medium: 8,
  large: 16
};

export const padding = styleVariants(spaceScale, (space) => ({
  padding: space
}));
```

### globalStyle

Creates styles attached to a global selector.

```ts
import { globalStyle } from '@vanilla-extract/css';

globalStyle('html, body', {
  margin: 0
});
```

Global selectors can also contain references to other scoped class names.

```ts
import { globalStyle } from '@vanilla-extract/css';

export const parentClass = style({});

globalStyle(`${parentClass} > a`, {
  color: 'pink'
});
```

### composeStyles

Combines multiple styles into a single class string, while also deduplicating and removing unnecessary spaces.

```ts
import { style, composeStyles } from '@vanilla-extract/css';

const button = style({
  padding: 12,
  borderRadius: 8
});

export const primaryButton = composeStyles(
  button,
  style({ background: 'coral' })
);

export const secondaryButton = composeStyles(
  button,
  style({ background: 'peachpuff' })
);
```

> 💡 Styles can also be provided in shallow and deeply nested arrays, similar to [classnames.](https://github.com/JedWatson/classnames)

When style compositions are used in selectors, they are assigned an additional class so they can be uniquely identified. When selectors are processed internally, the composed classes are removed, only leaving behind the unique identifier classes. This allows you to treat them as if they were a single class within vanilla-extract selectors.

```ts
import {
  style,
  globalStyle,
  composeStyles
} from '@vanilla-extract/css';

const background = style({ background: 'mintcream' });
const padding = style({ padding: 12 });

export const container = composeStyles(background, padding);

globalStyle(`${container} *`, {
  boxSizing: 'border-box'
});
```

### createTheme

Creates a locally scoped theme class and a theme contract which can be consumed within your styles.

```ts
// theme.css.ts

import { createTheme } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});
```

You can create theme variants by passing a theme contract as the first argument to `createTheme`.

```ts
// themes.css.ts

import { createTheme } from '@vanilla-extract/css';

export const [themeA, vars] = createTheme({
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});

export const themeB = createTheme(vars, {
  color: {
    brand: 'pink'
  },
  font: {
    body: 'comic sans ms'
  }
});
```

> 💡 All theme variants must provide a value for every variable or it’s a type error.

### createGlobalTheme

Creates a theme attached to a global selector, but with locally scoped variable names.

```ts
// theme.css.ts

import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});
```

> 💡 All theme variants must provide a value for every variable or it’s a type error.

### createThemeContract

Creates a contract for themes to implement.

**Ensure this function is called within a `.css.ts` context, otherwise variable names will be mismatched between themes.**

> 💡 This is useful if you want to split your themes into different bundles. In this case, your themes would be defined in separate files, but we'll keep this example simple.

```ts
// themes.css.ts

import {
  createThemeContract,
  createTheme
} from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    brand: null
  },
  font: {
    body: null
  }
});

export const themeA = createTheme(vars, {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});

export const themeB = createTheme(vars, {
  color: {
    brand: 'pink'
  },
  font: {
    body: 'comic sans ms'
  }
});
```

### assignVars

Assigns a collection of CSS Variables anywhere within a style block.

> 💡 This is useful for creating responsive themes since it can be used within `@media` blocks.

```ts
import { createThemeContract, style, assignVars } from '@vanilla-extract/css';

export const vars = createThemeContract({
  space: {
    small: null,
    medium: null,
    large: null
  }
});

export const responsiveSpaceTheme = style({
  vars: assignVars(vars.space, {
    small: '4px',
    medium: '8px',
    large: '16px'
  }),
  '@media': {
    'screen and (min-width: 1024px)': {
      vars: assignVars(vars.space, {
        small: '8px',
        medium: '16px',
        large: '32px'
      })
    }
  }
});
```

> 💡 All variables passed into this function must be assigned or it’s a type error.

### createVar

Creates a single CSS Variable.

```ts
import { createVar, style } from '@vanilla-extract/css';

export const colorVar = createVar();

export const exampleStyle = style({
  color: colorVar
});
```

Scoped variables can be set via the `vars` property on style objects.

```ts
import { createVar, style } from '@vanilla-extract/css';
import { colorVar } from './vars.css.ts';

export const parentStyle = style({
  vars: {
    [colorVar]: 'blue'
  }
});
```

### fallbackVar

Provides fallback values when consuming variables.

```ts
import { createVar, fallbackVar, style } from '@vanilla-extract/css';

export const colorVar = createVar();

export const exampleStyle = style({
  color: fallbackVar(colorVar, 'blue');
});
```

Multiple fallbacks are also supported.

```ts
import { createVar, fallbackVar, style } from '@vanilla-extract/css';

export const primaryColorVar = createVar();
export const secondaryColorVar = createVar();

export const exampleStyle = style({
  color: fallbackVar(primaryColorVar, secondaryColorVar, 'blue');
});
```

### fontFace

Creates a custom font attached to a locally scoped font name.

```ts
import { fontFace, style } from '@vanilla-extract/css';

const myFont = fontFace({
  src: 'local("Comic Sans MS")'
});

export const text = style({
  fontFamily: myFont
});
```

### globalFontFace

Creates a globally scoped custom font.

```ts
import {
  globalFontFace,
  style
} from '@vanilla-extract/css';

globalFontFace('MyGlobalFont', {
  src: 'local("Comic Sans MS")'
});

export const text = style({
  fontFamily: 'MyGlobalFont'
});
```

### keyframes

Creates a locally scoped set of keyframes.

```ts
import { keyframes, style } from '@vanilla-extract/css';

const rotate = keyframes({
  '0%': { rotate: '0deg' },
  '100%': { rotate: '360deg' },
});

export const animated = style({
  animation: `3s infinite ${rotate}`,
});
```

### globalKeyframes

Creates a globally scoped set of keyframes.

```ts
import { globalKeyframes, style } from '@vanilla-extract/css';

globalKeyframes('rotate', {
  '0%': { rotate: '0deg' },
  '100%': { rotate: '360deg' },
});

export const animated = style({
  animation: `3s infinite rotate`,
});
```

## Dynamic API

We also provide a lightweight standalone package to support dynamic runtime theming.

```bash
npm install @vanilla-extract/dynamic
```

### assignInlineVars

Assigns CSS Variables as inline styles.

```tsx
// app.tsx

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { vars } from './vars.css.ts';

const MyComponent = () => (
  <section
    style={assignInlineVars({
      [vars.colors.brand]: 'pink',
      [vars.colors.accent]: 'green'
    })}
  >
    ...
  </section>
);
```

You can also assign collections of variables by passing a theme contract as the first argument. All variables must be assigned or it’s a type error.

```tsx
// app.tsx

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { vars } from './vars.css.ts';

const MyComponent = () => (
  <section
    style={assignInlineVars(vars.colors, {
      brand: 'pink',
      accent: 'green'
    })}
  >
    ...
  </section>
);
```

Even though this function returns an object of inline styles, its `toString` method returns a valid `style` attribute value so that it can be used in string templates.

```tsx
// app.ts

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { vars } from './vars.css.ts';

document.write(`
  <section style="${assignInlineVars({
    [vars.colors.brand]: 'pink',
    [vars.colors.accent]: 'green'
  })}">
    ...
  </section>
`);
```

### setElementVars

Sets CSS Variables on a DOM element.

```tsx
// app.ts

import { setElementVars } from '@vanilla-extract/dynamic';
import { vars } from './styles.css.ts';

const el = document.getElementById('myElement');

setElementVars(el, {
  [vars.colors.brand]: 'pink',
  [vars.colors.accent]: 'green'
});
```

You can also set collections of variables by passing a theme contract as the second argument. All variables must be set or it’s a type error.

```tsx
// app.ts

import { setElementVars } from '@vanilla-extract/dynamic';
import { vars } from './styles.css.ts';

const el = document.getElementById('myElement');

setElementVars(el, vars.colors, {
  brand: 'pink',
  accent: 'green'
});
```

## Utility functions

We also provide a standalone package of optional utility functions to make it easier to work with CSS in TypeScript.

> 💡 This package can be used with any CSS-in-JS library.

```bash
npm install @vanilla-extract/css-utils
```

### calc

Streamlines the creation of CSS calc expressions.

```ts
import { calc } from '@vanilla-extract/css-utils';

const styles = {
  height: calc.multiply('var(--grid-unit)', 2)
};
```

The following functions are available.

- `calc.add`
- `calc.subtract`
- `calc.multiply`
- `calc.divide`
- `calc.negate`

The `calc` export is also a function, providing a chainable API for complex calc expressions.

```ts
import { calc } from '@vanilla-extract/css-utils';

const styles = {
  marginTop: calc('var(--space-large)')
    .divide(2)
    .negate()
    .toString()
};
```

---

## Thanks

- [Nathan Nam Tran](https://twitter.com/naistran) for creating [css-in-js-loader](https://github.com/naistran/css-in-js-loader), which served as the initial starting point for [treat](https://seek-oss.github.io/treat), the precursor to this library.
- [Stitches](https://stitches.dev/) for getting us excited about CSS-Variables-in-JS.
- [SEEK](https://www.seek.com.au) for giving us the space to do interesting work.

## License

MIT.
