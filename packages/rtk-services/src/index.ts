/**
 * @jamendo/rtk-services Package Exports
 *
 * Public API for Redux Toolkit Query services.
 */

// Store and types
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// API and hooks
export { jamendoApi, useSearchTracksQuery, useGetTrackDetailQuery } from './api/jamendoApi';
export { jamendoApi as api } from './api/jamendoApi'; // Alias for test compatibility

// Types
export type * from './types/jamendo';
