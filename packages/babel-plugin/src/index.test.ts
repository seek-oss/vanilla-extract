import { transformSync } from '@babel/core';
import { Options } from './types';
import plugin from './';

const transform = (
  source: string,
  options: Options = {},
  filename = './my-app/dir/mockFilename.css.ts',
) => {
  const result = transformSync(source, {
    filename,
    root: './my-app',
    plugins: [[plugin, options]],
    configFile: false,
  });

  if (!result) {
    throw new Error('No result');
  }

  return result.code;
};

describe('babel plugin', () => {
  it('should handle style assigned to const', () => {
    const source = `
      import { style } from '@vanilla-extract/css';

      const one = style({
          zIndex: 2,
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { style } from '@vanilla-extract/css';
      const one = style({
        zIndex: 2
      }, \\"one\\");
      endFileScope()"
    `);
  });

  it('should handle mapToStyles assigned to const', () => {
    const source = `
      import { mapToStyles } from '@vanilla-extract/css';

      const colors = mapToStyles({
        red: { color: 'red' }
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { mapToStyles } from '@vanilla-extract/css';
      const colors = mapToStyles({
        red: {
          color: 'red'
        }
      }, \\"colors\\");
      endFileScope()"
    `);
  });

  it('should handle mapToStyles with mapper assigned to const', () => {
    const source = `
      import { mapToStyles } from '@vanilla-extract/css';

      const colors = mapToStyles({
        red: 'red'
      }, (color) => ({ color }));
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { mapToStyles } from '@vanilla-extract/css';
      const colors = mapToStyles({
        red: 'red'
      }, color => ({
        color
      }), \\"colors\\");
      endFileScope()"
    `);
  });

  it('should handle style assigned to default export', () => {
    const source = `
      import { style } from '@vanilla-extract/css';

      export default style({
          zIndex: 2,
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { style } from '@vanilla-extract/css';
      export default style({
        zIndex: 2
      }, \\"default\\");
      endFileScope()"
    `);
  });

  it('should handle style assigned to object property', () => {
    const source = `
      import { style } from '@vanilla-extract/css';

      const test = {
        one: {
          two: style({
            zIndex: 2,
          })
        }
      };
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { style } from '@vanilla-extract/css';
      const test = {
        one: {
          two: style({
            zIndex: 2
          }, \\"test_one_two\\")
        }
      };
      endFileScope()"
    `);
  });

  it('should handle style returned from an arrow function', () => {
    const source = `
      import { style } from '@vanilla-extract/css';

      const test = () => {
        return style({
          color: 'red'
        });
      };
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { style } from '@vanilla-extract/css';

      const test = () => {
        return style({
          color: 'red'
        }, \\"test\\");
      };

      endFileScope()"
    `);
  });

  it('should handle style returned implicitly from an arrow function', () => {
    const source = `
      import { style } from '@vanilla-extract/css';

      const test = () => style({
        color: 'red'
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { style } from '@vanilla-extract/css';

      const test = () => style({
        color: 'red'
      }, \\"test\\");

      endFileScope()"
    `);
  });

  it('should handle style returned from a function', () => {
    const source = `
      import { style } from '@vanilla-extract/css';

      function test() {
        return style({
          color: 'red'
        });
      }
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { style } from '@vanilla-extract/css';

      function test() {
        return style({
          color: 'red'
        }, \\"test\\");
      }

      endFileScope()"
    `);
  });

  it('should handle globalStyle', () => {
    const source = `
      import { globalStyle } from '@vanilla-extract/css';

      globalStyle('html, body', { margin: 0 });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { globalStyle } from '@vanilla-extract/css';
      globalStyle('html, body', {
        margin: 0
      });
      endFileScope()"
    `);
  });

  it('should handle createVar assigned to const', () => {
    const source = `
      import { createVar } from '@vanilla-extract/css';

      const myVar = createVar();
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { createVar } from '@vanilla-extract/css';
      const myVar = createVar(\\"myVar\\");
      endFileScope()"
    `);
  });

  it('should handle fontFace assigned to const', () => {
    const source = `
      import { fontFace } from '@vanilla-extract/css';

      const myFont = fontFace({
        src: 'local("Comic Sans MS")',
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { fontFace } from '@vanilla-extract/css';
      const myFont = fontFace({
        src: 'local(\\"Comic Sans MS\\")'
      }, \\"myFont\\");
      endFileScope()"
    `);
  });

  it('should handle globalFontFace', () => {
    const source = `
      import { globalFontFace } from '@vanilla-extract/css';

      globalFontFace('myFont', {
        src: 'local("Comic Sans MS")',
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { globalFontFace } from '@vanilla-extract/css';
      globalFontFace('myFont', {
        src: 'local(\\"Comic Sans MS\\")'
      });
      endFileScope()"
    `);
  });

  it('should handle keyframes assigned to const', () => {
    const source = `
      import { keyframes } from '@vanilla-extract/css';

      const myAnimation = keyframes({
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' }
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { keyframes } from '@vanilla-extract/css';
      const myAnimation = keyframes({
        from: {
          transform: 'rotate(0deg)'
        },
        to: {
          transform: 'rotate(360deg)'
        }
      }, \\"myAnimation\\");
      endFileScope()"
    `);
  });

  it('should handle global keyframes', () => {
    const source = `
      import { globalKeyframes } from '@vanilla-extract/css';

      globalKeyframes('myKeyframes', {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' }
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { globalKeyframes } from '@vanilla-extract/css';
      globalKeyframes('myKeyframes', {
        from: {
          transform: 'rotate(0deg)'
        },
        to: {
          transform: 'rotate(360deg)'
        }
      });
      endFileScope()"
    `);
  });

  it('should handle createTheme assigned to const', () => {
    const source = `
      import { createTheme } from '@vanilla-extract/css';

      const darkTheme = createTheme({}, {});
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { createTheme } from '@vanilla-extract/css';
      const darkTheme = createTheme({}, {}, \\"darkTheme\\");
      endFileScope()"
    `);
  });

  it('should handle createTheme using destructuring', () => {
    const source = `
      import { createTheme } from '@vanilla-extract/css';

      const [theme, vars] = createTheme({}, {});
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { createTheme } from '@vanilla-extract/css';
      const [theme, vars] = createTheme({}, {}, \\"theme\\");
      endFileScope()"
    `);
  });

  it('should handle createGlobalTheme', () => {
    const source = `
      import { createGlobalTheme } from '@vanilla-extract/css';

      const themeVars = createGlobalTheme(':root', { foo: 'bar' });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { createGlobalTheme } from '@vanilla-extract/css';
      const themeVars = createGlobalTheme(':root', {
        foo: 'bar'
      });
      endFileScope()"
    `);
  });

  it('should handle createThemeVars', () => {
    const source = `
      import { createThemeVars } from '@vanilla-extract/css';

      const themeVars = createThemeVars({
        foo: 'bar'
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { createThemeVars } from '@vanilla-extract/css';
      const themeVars = createThemeVars({
        foo: 'bar'
      });
      endFileScope()"
    `);
  });

  it('should ignore functions that already supply a debug name', () => {
    const source = `
      import { style, mapToStyles } from '@vanilla-extract/css';

      const three = style({
          testStyle: {
            zIndex: 2,
          }
      }, 'myDebugValue');

      const four = mapToStyles({
        red: { color: 'red' }
      }, 'myDebugValue');
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { style, mapToStyles } from '@vanilla-extract/css';
      const three = style({
        testStyle: {
          zIndex: 2
        }
      }, 'myDebugValue');
      const four = mapToStyles({
        red: {
          color: 'red'
        }
      }, 'myDebugValue', \\"four\\");
      endFileScope()"
    `);
  });

  it('should only apply to functions imported from the relevant package', () => {
    const source = `
      import { style } from 'some-other-package';

      const three = style({
        zIndex: 2,  
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from 'some-other-package';
      const three = style({
        zIndex: 2
      });"
    `);
  });

  it('should handle renaming imports', () => {
    const source = `
      import { style as specialStyle } from '@vanilla-extract/css';

      const four = specialStyle({
        zIndex: 2,  
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { style as specialStyle } from '@vanilla-extract/css';
      const four = specialStyle({
        zIndex: 2
      }, \\"four\\");
      endFileScope()"
    `);
  });

  it('should handle package aliases', () => {
    const source = `
      import { style } from 'my-alias';

      const four = style({
        zIndex: 2,  
      });
    `;

    expect(transform(source, { alias: 'my-alias' })).toMatchInlineSnapshot(`
      "import { style } from 'my-alias';
      const four = style({
        zIndex: 2
      });"
    `);
  });

  it('should handle anonymous style in arrays', () => {
    const source = `
       import { style } from '@vanilla-extract/css';

       export const height = [
        style({
          zIndex: 2,  
        })
      ];
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { style } from '@vanilla-extract/css';
      export const height = [style({
        zIndex: 2
      }, \\"height\\")];
      endFileScope()"
    `);
  });

  it('should handle object key with anonymous style in arrays', () => {
    const source = `
       import { style } from '@vanilla-extract/css';

       export const height = {
        full: [style({
          zIndex: 2,  
        })]
       };
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import { style } from '@vanilla-extract/css';
      export const height = {
        full: [style({
          zIndex: 2
        }, \\"height_full\\")]
      };
      endFileScope()"
    `);
  });

  it('should handle namespace imports', () => {
    const source = `
      import * as css from '@vanilla-extract/css';

      const one = css.style({
          zIndex: 2,
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
      setFileScope(\\"my-app/dir/mockFilename.css.ts\\", \\"vanilla-extract\\");
      import * as css from '@vanilla-extract/css';
      const one = css.style({
        zIndex: 2
      }, \\"one\\");
      endFileScope()"
    `);
  });
});
