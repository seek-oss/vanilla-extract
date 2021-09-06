import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testMatch: '**/*.playwright.ts',
  updateSnapshots: 'none',
  expect: {
    toMatchSnapshot: {
      threshold: 0.1,
    },
  },

  projects: [
    {
      name: 'Desktop - Chromium',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        viewport: {
          width: 1200,
          height: 1080,
        },
      },
    },
    {
      name: 'Mobile - Chromium',
      // Ignore stylesheets tests running over multiple viewports
      testIgnore: /tests\/stylesheets/,
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        viewport: {
          width: 414,
          height: 896,
        },
      },
    },
  ],
};
export default config;
