/**
 * Redux Store Configuration
 *
 * Configures the Redux store with RTK Query middleware.
 */

import { configureStore } from '@reduxjs/toolkit';

import { jamendoApi } from './api/jamendoApi';

/**
 * Redux store with RTK Query integration
 *
 * Includes:
 * - jamendoApi reducer for API state management
 * - RTK Query middleware for caching and refetching
 * - Redux DevTools enabled in development mode
 */
export const store = configureStore({
  reducer: {
    [jamendoApi.reducerPath]: jamendoApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(jamendoApi.middleware),
  devTools: typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production',
});

/**
 * Type definitions for typed hooks
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
