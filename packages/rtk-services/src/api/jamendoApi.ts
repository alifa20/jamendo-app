/**
 * Jamendo API Endpoints
 *
 * RTK Query endpoints for Jamendo API operations.
 */

import { baseApi } from './baseApi';
import type {
  JamendoSearchResponse,
  JamendoTrackDetailResponse,
  JamendoTrack,
} from '../types/jamendo';

/**
 * Jamendo API endpoints with optimized field selection
 *
 * - searchTracks: Minimal fields for list view (id, name, artist_name, image)
 * - getTrackDetail: Full fields including audio URL for detail view
 */
export const jamendoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Search tracks with minimal fields for list view
     *
     * Optimized API call requesting only essential fields:
     * - id: Track identifier
     * - name: Track title
     * - artist_name: Artist name
     * - image: Album artwork URL
     */
    searchTracks: builder.query<JamendoSearchResponse, string>({
      query: (searchTerm) => ({
        url: '/tracks',
        params: {
          client_id: process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID,
          format: 'json',
          namesearch: searchTerm,
          limit: 20,
          // Minimal fields for list view
          include: 'id name artist_name image',
        },
      }),
    }),

    /**
     * Get track detail with full fields
     *
     * Fetches complete track information including:
     * - All metadata (album, duration, release date, etc.)
     * - Audio playback URL
     * - License information
     * - Music info and lyrics (if available)
     */
    getTrackDetail: builder.query<JamendoTrack, string>({
      query: (trackId) => ({
        url: '/tracks',
        params: {
          client_id: process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID,
          format: 'json',
          id: trackId,
          // Full fields for detail view
          include: 'musicinfo+lyrics',
          audioformat: 'mp31',
        },
      }),
      transformResponse: (response: JamendoTrackDetailResponse) => {
        // Extract first track from results array
        if (!response.results?.length) {
          throw new Error('Track not found');
        }
        return response.results[0];
      },
    }),
  }),
});

/**
 * Auto-generated hooks for components
 */
export const { useSearchTracksQuery, useGetTrackDetailQuery } = jamendoApi;
