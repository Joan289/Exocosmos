import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    globalSetup: './tests/setup/global-setup.ts', // Single execution before all tests
    setupFiles: ['tests/setup/setup.ts'], // For every test
    testTimeout: 10000,
  }
});
