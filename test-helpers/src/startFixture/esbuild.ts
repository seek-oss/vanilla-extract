import path from 'path';
import { promises as fs } from 'fs';

import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { build } from 'esbuild';
import handler from 'serve-handler';
import http from 'http';

import { TestServer } from './types';

export interface EsbuildFixtureOptions {
  type: 'esbuild';
  mode?: 'development' | 'production';
  port?: number;
}
export const startEsbuildFixture = async (
  fixtureName: string,
  { mode = 'development', port = 3000 }: EsbuildFixtureOptions = {
    type: 'esbuild',
  },
): Promise<TestServer> => {
  const entry = require.resolve(`@fixtures/${fixtureName}`);
  const outdir = path.join(
    path.dirname(require.resolve(`@fixtures/${fixtureName}/package.json`)),
    'dist',
  );

  const result = await build({
    entryPoints: [entry],
    platform: 'browser',
    bundle: true,
    minify: mode === 'production',
    plugins: [vanillaExtractPlugin()],
    outdir,
    watch: true,
  });

  const scripts = [];
  const stylesheets = [];

  for (const file of result.outputFiles || []) {
    if (file.path.endsWith('.css')) {
      stylesheets.push(
        `<link rel="stylesheet" type="text/css" href="${file.path}" />`,
      );
    } else if (file.path.endsWith('.js')) {
      scripts.push(`<script src="${file.path}"></script>`);
    } else {
      console.warn('Unsupported output file:', file.path);
    }
  }

  await fs.writeFile(
    path.join(outdir, 'index.html'),
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>esbuild - dicture</title>
       ${stylesheets.join('\n')}
    </head>
    <body>
        ${scripts.join('\n')}
    </body>
    </html>
  `,
  );

  const server = http.createServer((request, response) => {
    return handler(request, response, { public: outdir });
  });

  const url = `http://localhost:${port}`;

  server.listen(port, () => {
    console.log(`Running at ${url}`);
  });

  return {
    type: 'esbuild',
    url,
    close: () =>
      new Promise<void>((resolve) => {
        if (result.stop) {
          result.stop();
        }

        server.close(() => {
          resolve();
        });
      }),
  };
};