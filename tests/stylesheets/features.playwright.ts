import { expect } from '@playwright/test';
import test from '../fixture';
import { getStylesheet, startFixture, TestServer } from 'test-helpers';

const buildTypes = ['vite', 'esbuild', 'mini-css-extract'] as const;

buildTypes.forEach((buildType) => {
  test.describe(`features - ${buildType}`, () => {
    let server: TestServer;

    test.beforeAll(async ({ port }) => {
      server = await startFixture('features', {
        type: buildType,
        mode: 'production',
        basePort: port,
      });
    });

    test('should create valid stylesheet', async () => {
      expect(
        await getStylesheet(server.url, server.stylesheet),
      ).toMatchSnapshot(`features.css`);
    });

    test.afterAll(async () => {
      await server.close();
    });
  });
});
