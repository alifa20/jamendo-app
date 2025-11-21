@done
@high
@ui
@feature-home
@react-native
@expo
@JAM-006
Feature: Build Home page with search and track results
  """
  Navigation to track detail uses Expo Router's useRouter hook
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Search bar must be visible at the top of the home screen
  #   2. Track results must be displayed using FlashList for performance
  #   3. Search must use RTK Query useSearchTracksQuery hook
  #   4. Tapping a track must navigate to track detail screen
  #
  # EXAMPLES:
  #   1. User opens home screen and sees search bar with placeholder text 'Search tracks...'
  #   2. User types 'jazz' in search bar and sees list of jazz tracks with titles, artists, and album art
  #   3. User taps on a track from search results and is taken to track detail screen showing full track information
  #   4. User searches for tracks and can scroll through results smoothly using FlashList
  #
  # ========================================
  Background: User Story
    As a music listener
    I want to search for tracks and view results
    So that I can discover and explore music on Jamendo

  Scenario: Display search bar on home screen
    Given I am on the home screen
    When I open the app
    Then I should see a search bar at the top
    Then the search bar should have placeholder text 'Search tracks...'

  Scenario: Search for tracks and display results
    Given I am on the home screen
    When I type 'jazz' in the search bar
    Then I should see a list of jazz tracks
    Then each track should display title, artist, and album art

  Scenario: Navigate to track detail from search results
    Given I am viewing search results for 'jazz'
    When I tap on a track from the results
    Then I should be taken to the track detail screen
    Then the track detail screen should show full track information

  Scenario: Scroll through search results smoothly
    Given I am viewing search results with many tracks
    When I scroll through the track list
    Then the list should scroll smoothly without lag
    Then the track list should be rendered using FlashList
