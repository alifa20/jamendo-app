/**
 * Jest setup file for @jamendo/rtk-services package
 *
 * This file is executed after the test framework is installed but before tests run.
 */

// Polyfill fetch API for testing
require('whatwg-fetch');

// Import MSW server
const { server } = require('./src/__tests__/mocks/server');

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
