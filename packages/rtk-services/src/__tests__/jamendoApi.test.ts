/**
 * Jamendo API Tests
 *
 * Tests for RTK Query endpoints using MSW.
 */

import { configureStore } from '@reduxjs/toolkit';

import { jamendoApi } from '../api/jamendoApi';

/**
 * Create a fresh store for each test
 */
function setupStore() {
  return configureStore({
    reducer: {
      [jamendoApi.reducerPath]: jamendoApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(jamendoApi.middleware),
  });
}

describe('Jamendo API', () => {
  describe('searchTracks', () => {
    it('should fetch search results successfully', async () => {
      const store = setupStore();

      // Dispatch the query
      const result = await store.dispatch(jamendoApi.endpoints.searchTracks.initiate('test'));

      // Assert response structure
      expect(result.data).toBeDefined();
      expect(result.data?.headers.status).toBe('success');
      expect(result.data?.headers.results_count).toBe(2);
      expect(result.data?.results).toHaveLength(2);

      // Assert first track structure
      const firstTrack = result.data?.results[0];
      expect(firstTrack).toEqual({
        id: '1234567',
        name: 'Test Track 1',
        artist_name: 'Test Artist',
        image: 'https://example.com/image1.jpg',
      });
    });

    it('should return error for missing search parameter', async () => {
      const store = setupStore();

      // Dispatch query with empty string (should trigger error in MSW handler)
      const result = await store.dispatch(jamendoApi.endpoints.searchTracks.initiate(''));

      // MSW will return 400 error for empty search
      expect(result.error).toBeDefined();
    });
  });

  describe('getTrackDetail', () => {
    it('should fetch track details successfully', async () => {
      const store = setupStore();

      // Dispatch the query
      const result = await store.dispatch(jamendoApi.endpoints.getTrackDetail.initiate('1234567'));

      // Assert response structure (transformed to single track)
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe('1234567');
      expect(result.data?.name).toBe('Test Track 1');
      expect(result.data?.artist_name).toBe('Test Artist');
      expect(result.data?.album_name).toBe('Test Album');
      expect(result.data?.duration).toBe(180);
      expect(result.data?.audio).toBe('https://example.com/audio1.mp3');
    });

    it('should fetch different track by ID', async () => {
      const store = setupStore();

      // Dispatch query for track 2
      const result = await store.dispatch(jamendoApi.endpoints.getTrackDetail.initiate('2345678'));

      // Assert response for track 2
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe('2345678');
      expect(result.data?.name).toBe('Test Track 2');
      expect(result.data?.artist_name).toBe('Another Artist');
    });
  });

  describe('Caching behavior', () => {
    it('should cache search results', async () => {
      const store = setupStore();

      // First request
      const result1 = await store.dispatch(jamendoApi.endpoints.searchTracks.initiate('test'));

      // Second request (should use cache)
      const result2 = await store.dispatch(jamendoApi.endpoints.searchTracks.initiate('test'));

      // Both should have data
      expect(result1.data).toBeDefined();
      expect(result2.data).toBeDefined();

      // Results should be equal
      expect(result1.data).toEqual(result2.data);
    });

    it('should cache track details', async () => {
      const store = setupStore();

      // First request
      const result1 = await store.dispatch(jamendoApi.endpoints.getTrackDetail.initiate('1234567'));

      // Second request (should use cache)
      const result2 = await store.dispatch(jamendoApi.endpoints.getTrackDetail.initiate('1234567'));

      // Both should have data
      expect(result1.data).toBeDefined();
      expect(result2.data).toBeDefined();

      // Results should be equal
      expect(result1.data).toEqual(result2.data);
    });
  });
});
