/**
 * Jest Setup File
 *
 * Configures MSW server lifecycle for all tests.
 */

import { server } from './mocks/server';

/**
 * Start MSW server before all tests
 */
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  });
});

/**
 * Reset handlers between tests to ensure test isolation
 */
afterEach(() => {
  server.resetHandlers();
});

/**
 * Clean up and close MSW server after all tests
 */
afterAll(() => {
  server.close();
});
