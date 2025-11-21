/**
 * Base RTK Query API Configuration
 *
 * Configures the base API with fetchBaseQuery for Jamendo API.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Base API configuration for Jamendo
 *
 * This sets up:
 * - Base URL for all Jamendo API requests
 * - Common headers
 * - Client ID injection for all requests
 */
export const baseApi = createApi({
  reducerPath: 'jamendoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.jamendo.com/v3.0',
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  endpoints: () => ({}),
});
