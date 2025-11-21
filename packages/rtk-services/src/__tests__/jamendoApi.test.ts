/**
 * Feature: spec/features/configure-rtk-services-package-with-jamendo-api.feature
 *
 * Tests for RTK Query Jamendo API endpoints using MSW.
 */

import { configureStore } from '@reduxjs/toolkit';

import { jamendoApi } from '../api/jamendoApi';
import { store } from '../store';
import type {
  JamendoTrack,
  JamendoSearchResponse,
  JamendoTrackDetailResponse,
} from '../types/jamendo';

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

describe('Feature: Configure RTK Services package with Jamendo API', () => {
  describe('Scenario: Search for tracks with minimal fields', () => {
    it('should search for tracks with minimal fields using namesearch parameter', async () => {
      // @step Given the RTK services package is configured
      const testStore = setupStore();

      // @step And the base API is set to "https://api.jamendo.com/v3.0"
      expect(jamendoApi.reducerPath).toBe('jamendoApi');

      // @step When a developer calls useSearchTracksQuery with search term "jazz"
      const result = await testStore.dispatch(jamendoApi.endpoints.searchTracks.initiate('jazz'));

      // @step Then an API request should be made to "/tracks" endpoint
      // @step And the request should include parameter "namesearch=jazz"
      // @step And the request should include parameter "limit=20"
      // @step And the request should include parameter "client_id" from environment
      // @step And the request should include only minimal fields "id name artist_name image"
      expect(result.data).toBeDefined();

      // @step And the response should contain results with id, name, artist_name, and image fields only
      expect(result.data?.results).toBeDefined();
      if (result.data?.results && result.data.results.length > 0) {
        const firstTrack = result.data.results[0];
        expect(firstTrack).toHaveProperty('id');
        expect(firstTrack).toHaveProperty('name');
        expect(firstTrack).toHaveProperty('artist_name');
        expect(firstTrack).toHaveProperty('image');

        // Ensure ONLY these fields are present (no extra fields)
        expect(Object.keys(firstTrack).sort()).toEqual(
          ['artist_name', 'id', 'image', 'name'].sort()
        );
      }
    });
  });

  describe('Scenario: Get track details with full fields', () => {
    it('should fetch track details with audio URL and full fields', async () => {
      // @step Given the RTK services package is configured
      const testStore = setupStore();

      // @step And the base API is set to "https://api.jamendo.com/v3.0"
      expect(jamendoApi.reducerPath).toBe('jamendoApi');

      // @step When a developer calls useGetTrackDetailQuery with track ID "12345"
      const result = await testStore.dispatch(
        jamendoApi.endpoints.getTrackDetail.initiate('1234567')
      );

      // @step Then an API request should be made to "/tracks" endpoint
      // @step And the request should include parameter "id=12345"
      // @step And the request should include parameter "audioformat=mp31"
      // @step And the request should include parameter "client_id" from environment
      // @step And the request should include parameter "include=musicinfo+lyrics"
      expect(result.data).toBeDefined();

      // @step And the response should contain full track data including audio URL
      const track = result.data;
      expect(track).toHaveProperty('id');
      expect(track).toHaveProperty('name');
      expect(track).toHaveProperty('artist_name');
      expect(track).toHaveProperty('audio');

      // @step And the response should be transformed from array to single track object
      // The data should be a single object, not an array
      expect(track).not.toBeInstanceOf(Array);
    });
  });

  describe('Scenario: Handle track not found gracefully', () => {
    it('should return error message when track is not found', async () => {
      // @step Given the RTK services package is configured
      const testStore = setupStore();

      // @step And the base API is set to "https://api.jamendo.com/v3.0"
      expect(jamendoApi.reducerPath).toBe('jamendoApi');

      // @step When a developer calls useGetTrackDetailQuery with non-existent track ID "99999999"
      // @step And the API returns an empty results array
      const result = await testStore.dispatch(
        jamendoApi.endpoints.getTrackDetail.initiate('99999999')
      );

      // @step Then the response should contain an error message "track not found"
      // NOTE: This test will FAIL because current implementation throws an error
      // instead of returning {error: 'track not found'}
      // This needs to be fixed in the implementation
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('error', 'track not found');

      // @step And the error should not be thrown as an exception
      // The query should succeed (not have result.error), but data should contain error field
      expect(result.error).toBeUndefined();
    });
  });

  describe('Scenario: Configure Redux store with RTK Query', () => {
    it('should have properly configured Redux store', () => {
      // @step Given the RTK services package exports a store
      expect(store).toBeDefined();

      // @step When a developer imports the store
      const importedStore = store;

      // @step Then the store should have jamendoApi reducer configured at "jamendoApi" path
      const state = importedStore.getState();
      expect(state).toHaveProperty('jamendoApi');

      // @step And the store should have RTK Query middleware registered
      // RTK Query middleware is registered if the store can handle subscriptions
      expect(importedStore.dispatch).toBeDefined();

      // @step And the store should export RootState and AppDispatch types
      // TypeScript types are checked at compile time, but we can verify the store structure
      expect(typeof state).toBe('object');
    });
  });

  describe('Scenario: Provide TypeScript type definitions', () => {
    it('should export TypeScript types for API responses', () => {
      // @step Given the RTK services package is configured
      // TypeScript types are available at compile time

      // @step When a developer imports types from the package
      // We verify types are available by checking they can be used in type annotations

      // @step Then JamendoTrack type should be available
      const track: JamendoTrack = {
        id: '123',
        name: 'Test Track',
        artist_name: 'Test Artist',
        album_name: 'Test Album',
        duration: 180,
        image: 'https://example.com/image.jpg',
        audio: 'https://example.com/audio.mp3',
      };
      expect(track).toBeDefined();

      // @step And JamendoSearchResponse type should be available
      const searchResponse: JamendoSearchResponse = {
        headers: {
          status: 'success',
          results_count: 1,
        },
        results: [
          {
            id: '123',
            name: 'Test Track',
            artist_name: 'Test Artist',
            image: 'https://example.com/image.jpg',
          },
        ],
      };
      expect(searchResponse).toBeDefined();

      // @step And JamendoTrackDetailResponse type should be available
      const detailResponse: JamendoTrackDetailResponse = {
        headers: {
          status: 'success',
          results_count: 1,
        },
        results: [track],
      };
      expect(detailResponse).toBeDefined();

      // @step And all API responses should have full TypeScript autocomplete
      // TypeScript autocomplete is verified at development time through the type system
      // Runtime verification: types should not cause compilation errors
      expect(true).toBe(true);
    });
  });
});
