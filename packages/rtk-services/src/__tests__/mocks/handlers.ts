/**
 * MSW Request Handlers for Jamendo API
 *
 * Mock API responses for testing RTK Query endpoints.
 */

import { http, HttpResponse } from 'msw';

import type { JamendoSearchResponse, JamendoTrackDetailResponse } from '../../types/jamendo';

const BASE_URL = 'https://api.jamendo.com/v3.0';

/**
 * Mock track data for testing
 */
const mockTracks = {
  track1: {
    id: '1234567',
    name: 'Test Track 1',
    artist_name: 'Test Artist',
    artist_id: '123',
    album_name: 'Test Album',
    album_id: '456',
    duration: 180,
    image: 'https://example.com/image1.jpg',
    audio: 'https://example.com/audio1.mp3',
    audiodownload: 'https://example.com/download1.mp3',
    license_ccurl: 'https://creativecommons.org/licenses/by-nc-nd/3.0/',
    position: 1,
    releasedate: '2024-01-15',
    album_image: 'https://example.com/album1.jpg',
    shareurl: 'https://jamendo.com/track/1234567',
  },
  track2: {
    id: '2345678',
    name: 'Test Track 2',
    artist_name: 'Another Artist',
    artist_id: '789',
    album_name: 'Another Album',
    album_id: '012',
    duration: 240,
    image: 'https://example.com/image2.jpg',
    audio: 'https://example.com/audio2.mp3',
    audiodownload: 'https://example.com/download2.mp3',
    license_ccurl: 'https://creativecommons.org/licenses/by-nc-nd/3.0/',
    position: 1,
    releasedate: '2024-02-20',
    album_image: 'https://example.com/album2.jpg',
    shareurl: 'https://jamendo.com/track/2345678',
  },
};

/**
 * MSW Handlers for Jamendo API endpoints
 */
export const handlers = [
  /**
   * Search tracks endpoint
   * GET /tracks?namesearch=...&limit=...
   */
  http.get(`${BASE_URL}/tracks`, ({ request }) => {
    const url = new URL(request.url);
    const namesearch = url.searchParams.get('namesearch');
    const id = url.searchParams.get('id');

    // Track detail request (by ID)
    if (id) {
      const track = id === '1234567' ? mockTracks.track1 : mockTracks.track2;

      const response: JamendoTrackDetailResponse = {
        headers: {
          status: 'success',
          code: 0,
          error_message: '',
          warnings: '',
          results_count: 1,
        },
        results: [track],
      };

      return HttpResponse.json(response);
    }

    // Search request
    if (!namesearch) {
      return HttpResponse.json(
        {
          headers: {
            status: 'error',
            code: 400,
            error_message: 'Missing namesearch parameter',
            warnings: '',
            results_count: 0,
          },
          results: [],
        },
        { status: 400 }
      );
    }

    // Return mock search results
    const response: JamendoSearchResponse = {
      headers: {
        status: 'success',
        code: 0,
        error_message: '',
        warnings: '',
        results_count: 2,
      },
      results: [
        {
          id: mockTracks.track1.id,
          name: mockTracks.track1.name,
          artist_name: mockTracks.track1.artist_name,
          image: mockTracks.track1.image,
        },
        {
          id: mockTracks.track2.id,
          name: mockTracks.track2.name,
          artist_name: mockTracks.track2.artist_name,
          image: mockTracks.track2.image,
        },
      ],
    };

    return HttpResponse.json(response);
  }),
];
