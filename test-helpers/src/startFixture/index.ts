import portfinder from 'portfinder';

import { startWebpackFixture, WebpackFixtureOptions } from './webpack';
import { startEsbuildFixture, EsbuildFixtureOptions } from './esbuild';

type BuildType =
  | 'browser'
  | 'mini-css-extract'
  | 'style-loader'
  | 'esbuild'
  | 'esbuild-runtime';

export interface TestServer {
  type: BuildType;
  url: string;
  close: () => Promise<void>;
}

type SharedOptions = {
  basePort: number;
};

type FixtureOptions = SharedOptions &
  Omit<EsbuildFixtureOptions | WebpackFixtureOptions, 'port'>;
export async function startFixture(
  fixtureName: string,
  { type, basePort, ...options }: FixtureOptions,
): Promise<TestServer> {
  const port = await portfinder.getPortPromise({ port: basePort });

  console.log(
    [
      `Starting ${fixtureName} fixture`,
      ...Object.entries({
        type,
        port,
        ...options,
      }).map(([key, value]) => `- ${key}: ${value}`),
    ].join('\n'),
  );

  if (type === 'esbuild' || type === 'esbuild-runtime') {
    return startEsbuildFixture(fixtureName, {
      type,
      port,
    });
  }

  return startWebpackFixture(fixtureName, { type, ...options, port });
}
