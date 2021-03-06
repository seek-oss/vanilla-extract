---
title: Getting Started
---

# **Zero-runtime<br/>Stylesheets-in-TypeScript.**

Write your styles in TypeScript (or JavaScript) with locally scoped class names and CSS Variables, then generate static CSS files at build time.

Basically, itβs β[CSS Modules](https://github.com/css-modules/css-modules)-in-TypeScriptβ but with scoped CSS Variables and heaps&nbsp;more.

π₯ &nbsp; All styles generated at build time β just like [Sass](https://sass-lang.com), [Less](http://lesscss.org), etc.

β¨ &nbsp; Minimal abstraction over standard CSS.

π¦ &nbsp; Works with any front-end framework β or even without one.

π³ &nbsp; Locally scoped class names β just like [CSS Modules](https://github.com/css-modules/css-modules).

π &nbsp; Locally scoped [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), `@keyframes` and `@font-face` rules.

π¨ &nbsp; High-level theme system with support for simultaneous themes. No globals!

π  &nbsp; Utils for generating variable-based `calc` expressions.

πͺ &nbsp; Type-safe styles via [CSSType](https://github.com/frenic/csstype).

πββοΈ &nbsp; Optional runtime version for development and testing.

π &nbsp; Optional API for dynamic runtime theming.

> π₯ &nbsp; [Try it out for yourself in CodeSandbox.](https://codesandbox.io/s/github/seek-oss/vanilla-extract/tree/master/examples/webpack-react?file=/src/App.css.ts)

**Write your styles in `.css.ts` files.**

```tsx
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

> π‘ Once you've [configured your build tooling,](/documentation/setup) these `.css.ts` files will be evaluated at build time. None of the code in these files will be included in your final bundle. Think of it as using TypeScript as your preprocessor instead of Sass, Less, etc.

**Then consume them in your markup.**

```tsx
// app.ts
import { themeClass, exampleStyle } from './styles.css.ts';

document.write(`
  <section class="${themeClass}">
    <h1 class="${exampleStyle}">Hello world!</h1>
  </section>
`);
```

---

Want to work at a higher level while maximising style re-use? Check out π¨ [Sprinkles](/documentation/sprinkles-api), our official zero-runtime atomic CSS framework, built on top of vanilla-extract.

---
