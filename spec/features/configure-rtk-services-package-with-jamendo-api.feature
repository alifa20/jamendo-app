@done
@api-integration
@JAM-002
@high
@api
@services
@rtk-query
@typescript
Feature: Configure RTK Services package with Jamendo API
  """
  Critical requirements: Search endpoint must use minimal fields (id, name, artist_name, image) for performance. Detail endpoint must request audio URL with mp31 format. Track not found returns error message (NOT exception). Store configured with jamendoApi reducer and RTK Query middleware. All types exported for TypeScript autocomplete.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Base API must be configured with Jamendo API v3.0 endpoint (https://api.jamendo.com/v3.0)
  #   2. All API requests must include client_id from EXPO_PUBLIC_JAMENDO_CLIENT_ID environment variable
  #   3. Search endpoint must request minimal fields (id, name, artist_name, image) for optimal performance
  #   4. Detail endpoint must request full track data including audio URL with mp31 format
  #   5. Redux store must be configured with jamendoApi reducer and RTK Query middleware
  #   6. API responses must be fully typed with TypeScript interfaces
  #   7. When track detail returns empty results, endpoint must return a 'track not found' message instead of throwing an error
  #
  # EXAMPLES:
  #   1. Developer calls useSearchTracksQuery('jazz') and receives results with id, name, artist_name, and image fields only
  #   2. Developer calls useGetTrackDetailQuery('12345') and receives full track data including audio URL
  #   3. Search request is made to https://api.jamendo.com/v3.0/tracks with namesearch parameter and limit=20
  #   4. Detail request is made to https://api.jamendo.com/v3.0/tracks with id parameter and audioformat=mp31
  #   5. Store is created with jamendoApi reducer at 'jamendoApi' path and RTK Query middleware configured
  #   6. Developer imports JamendoTrack, JamendoSearchResponse types and gets full TypeScript autocomplete
  #   7. Detail endpoint transforms response array to single track object, throwing error if track not found
  #   8. Developer calls useGetTrackDetailQuery('99999999') for non-existent track and receives {error: 'track not found'} response
  #
  # QUESTIONS (ANSWERED):
  #   Q: Should the search endpoint use 'namesearch' parameter (searches track names and artist names), or should we also support other search types like 'search' (full-text) or 'artist_name'?
  #   A: Use 'namesearch' parameter (current implementation) which searches both track names and artist names
  #
  #   Q: When track detail is not found (empty results array), should we throw an error or return null/undefined?
  #   A: Return a message 'track not found' instead of throwing an error (needs implementation change)
  #
  #   Q: Should we validate that EXPO_PUBLIC_JAMENDO_CLIENT_ID is set, or let API requests fail with 401?
  #   A: Let API requests fail with 401 - no upfront validation needed (current implementation is correct)
  #
  # ========================================
  Background: User Story
    As a mobile app developer
    I want to integrate Jamendo API using RTK Query
    So that I can search tracks and fetch track details with automatic caching

  Scenario: Search for tracks with minimal fields
    Given the RTK services package is configured
    And the base API is set to "https://api.jamendo.com/v3.0"
    When a developer calls useSearchTracksQuery with search term "jazz"
    Then an API request should be made to "/tracks" endpoint
    And the request should include parameter "namesearch=jazz"
    And the request should include parameter "limit=20"
    And the request should include parameter "client_id" from environment
    And the request should include only minimal fields "id name artist_name image"
    And the response should contain results with id, name, artist_name, and image fields only

  Scenario: Get track details with full fields
    Given the RTK services package is configured
    And the base API is set to "https://api.jamendo.com/v3.0"
    When a developer calls useGetTrackDetailQuery with track ID "12345"
    Then an API request should be made to "/tracks" endpoint
    And the request should include parameter "id=12345"
    And the request should include parameter "audioformat=mp31"
    And the request should include parameter "client_id" from environment
    And the request should include parameter "include=musicinfo+lyrics"
    And the response should contain full track data including audio URL
    And the response should be transformed from array to single track object

  Scenario: Handle track not found gracefully
    Given the RTK services package is configured
    And the base API is set to "https://api.jamendo.com/v3.0"
    When a developer calls useGetTrackDetailQuery with non-existent track ID "99999999"
    And the API returns an empty results array
    Then the response should contain an error message "track not found"
    And the error should not be thrown as an exception

  Scenario: Configure Redux store with RTK Query
    Given the RTK services package exports a store
    When a developer imports the store
    Then the store should have jamendoApi reducer configured at "jamendoApi" path
    And the store should have RTK Query middleware registered
    And the store should export RootState and AppDispatch types

  Scenario: Provide TypeScript type definitions
    Given the RTK services package is configured
    When a developer imports types from the package
    Then JamendoTrack type should be available
    And JamendoSearchResponse type should be available
    And JamendoTrackDetailResponse type should be available
    And all API responses should have full TypeScript autocomplete
