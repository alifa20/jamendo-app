/**
 * MSW Server Setup for Node.js Tests
 *
 * Configures Mock Service Worker for testing RTK Query API calls.
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW server instance for testing
 * This will intercept network requests during tests
 */
export const server = setupServer(...handlers);
