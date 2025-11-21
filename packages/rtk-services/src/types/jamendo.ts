/**
 * Jamendo API Types
 *
 * TypeScript interfaces for Jamendo API responses and data structures.
 */

/**
 * Track data structure from Jamendo API
 */
export interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  artist_id: string;
  album_name: string;
  album_id: string;
  duration: number;
  image: string;
  audio: string;
  audiodownload: string;
  license_ccurl: string;
  position: number;
  releasedate: string;
  album_image: string;
  shareurl: string;
}

/**
 * Minimal track data for list views (optimized API response)
 */
export interface JamendoTrackMinimal {
  id: string;
  name: string;
  artist_name: string;
  image: string;
}

/**
 * Search API response structure
 */
export interface JamendoSearchResponse {
  headers: {
    status: string;
    code: number;
    error_message: string;
    warnings: string;
    results_count: number;
  };
  results: JamendoTrackMinimal[];
}

/**
 * Track detail API response structure
 */
export interface JamendoTrackDetailResponse {
  headers: {
    status: string;
    code: number;
    error_message: string;
    warnings: string;
    results_count: number;
  };
  results: JamendoTrack[];
}

/**
 * Search query parameters
 */
export interface SearchTracksParams {
  namesearch?: string;
  limit?: number;
  offset?: number;
  order?: 'name' | 'popularity_total' | 'releasedate';
}

/**
 * Track detail query parameters
 */
export interface GetTrackDetailParams {
  id: string;
  include?: string;
}
