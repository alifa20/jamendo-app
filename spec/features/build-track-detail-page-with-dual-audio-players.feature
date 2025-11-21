@JAM-007
Feature: Build Track detail page with dual audio players
  """
  Layout: ScrollView for scrollable content, fixed position audio player at bottom using React Native absolute positioning
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Track detail page must display title, release date, album art, and additional fields to fill the page
  #   2. Audio player must be fixed at the bottom of the page
  #   3. Track details must scroll underneath the fixed audio player
  #   4. Track data must be fetched using the API integration from JAM-002
  #   5. User navigates to track detail page by tapping a track from JAM-006 search results
  #   6. Skeleton loading state must be displayed while track details are loading
  #   7. Error message must be displayed if track ID is invalid or track data fails to load
  #
  # EXAMPLES:
  #   1. User taps track 'Summer Vibes' from search results, navigates to /track/12345, sees skeleton loading, then track details appear with title, artist, album art, release date, duration, genre, license, tags, and ExpoAudioPlayer at bottom
  #   2. User scrolls down through track details, player remains fixed at bottom, details scroll underneath player
  #   3. User navigates to /track/invalid-id, sees error message 'Failed to load track details. Please try again.'
  #   4. User loads track detail page, audio player shows play button (not playing), user taps play button, audio starts playing
  #   5. API request fails with network error, user sees error message 'Failed to load track details. Please try again.'
  #
  # QUESTIONS (ANSWERED):
  #   Q: You mentioned we need ONE player at the bottom. The work unit description mentions BOTH ExpoAudioPlayer AND AudioProPlayer for comparison. Should we use only one player, or both? If both, how should they be positioned?
  #   A: Use only ExpoAudioPlayer (not AudioProPlayer) for this iteration
  #
  #   Q: What additional fields should we display besides title, release date, and album art? (e.g., artist name, album name, duration, genre, license, tags, download count?)
  #   A: Display artist name, album name, duration, genre, license, and tags in addition to title, release date, and album art
  #
  #   Q: What should the error message say when a track fails to load or has an invalid ID?
  #   A: Display message: 'Failed to load track details. Please try again.'
  #
  #   Q: Should the audio player start playing automatically when the page loads, or wait for user interaction?
  #   A: Audio player should NOT autoplay - wait for user to press play button
  #
  # ========================================
  Background: User Story
    As a music listener using the Jamendo app
    I want to view detailed information about a track and compare different audio players
    So that I can make an informed decision about which track to listen to and evaluate playback quality

  Scenario: Successfully load track detail page with complete information
    Given I am on the search results page from JAM-006
    When I tap on track "Summer Vibes" with ID "12345"
    Then I should navigate to "/track/12345"
    And I should see a skeleton loading state
    And the skeleton should disappear when track data loads
    And I should see the track title "Summer Vibes"
    And I should see the artist name
    And I should see the album art
    And I should see the release date
    And I should see the duration
    And I should see the genre
    And I should see the license information
    And I should see the tags
    And I should see ExpoAudioPlayer fixed at the bottom of the page
    And the audio player should show a play button (not playing)

  Scenario: Scroll track details with fixed audio player
    Given I am on the track detail page for track ID "12345"
    And the track details are fully loaded
    When I scroll down through the track details
    Then the audio player should remain fixed at the bottom of the page
    And the track details should scroll underneath the player

  Scenario: Handle invalid track ID
    Given I am on the app
    When I navigate to "/track/invalid-id"
    Then I should see the error message "Failed to load track details. Please try again."
    And I should not see the audio player
    And I should not see track information

  Scenario: Handle network error when loading track
    Given I am on the app
    And the network request will fail
    When I navigate to "/track/12345"
    Then I should see a skeleton loading state
    And the skeleton should disappear after the request fails
    And I should see the error message "Failed to load track details. Please try again."
    And I should not see the audio player
    And I should not see track information

  Scenario: Play audio track on user interaction
    Given I am on the track detail page for track ID "12345"
    And the track details are fully loaded
    And the audio player shows a play button
    When I tap the play button on the audio player
    Then the audio should start playing
    And the play button should change to a pause button
