@expo
@audio
@ui-features
@infrastructure
@JAM-003
Feature: Configure Components package with audio players and UI
  """
  Architecture notes:
  - ExpoAudioPlayer component created in packages/components/src/ExpoAudioPlayer.tsx
  - Uses expo-av Audio API for audio playback (Audio.Sound.createAsync)
  - Component is a controlled component accepting props: audioUrl, title, artistName, albumArtUrl
  - Internal state manages: isPlaying (boolean), sound (Audio.Sound instance), error (string | null)
  - Play/pause toggle managed via Audio.Sound.playAsync() and pauseAsync()
  - Error handling wrapped in try-catch, displays generic error message on failure
  - Component unmount cleanup: sound.unloadAsync() to prevent memory leaks
  - No playback state persistence - fresh instance on each mount
  - Exported from packages/components/src/index.ts as named export
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. ExpoAudioPlayer must display track title, artist name, and album art
  #   2. ExpoAudioPlayer must have basic play/pause button control
  #   3. ExpoAudioPlayer must use expo-av Audio API for playback
  #   4. ExpoAudioPlayer must show error message 'An error occurred while loading audio' when audio fails to load
  #   5. ExpoAudioPlayer must not persist playback state - resets when user navigates away
  #   6. ExpoAudioPlayer must be part of @jamendo/components package
  #   7. Component must accept track data as props: audioUrl, title, artistName, albumArtUrl
  #
  # EXAMPLES:
  #   1. User sees ExpoAudioPlayer with track 'Summer Vibes', artist 'Cool Band', album art displayed, and play button in paused state
  #   2. User taps play button, audio starts playing, play button changes to pause icon
  #   3. User taps pause button while audio is playing, audio stops, button changes back to play icon
  #   4. Audio URL fails to load (network error), user sees error message 'An error occurred while loading audio'
  #   5. User navigates away from page with playing audio, then returns - player is reset (not playing, at beginning)
  #   6. Component receives props: audioUrl='https://api.jamendo.com/track/123.mp3', title='Summer Vibes', artistName='Cool Band', albumArtUrl='https://api.jamendo.com/art/123.jpg'
  #
  # QUESTIONS (ANSWERED):
  #   Q: You mentioned ExpoAudioPlayer component. What specific playback controls should it have? (play/pause, seek bar, volume, playback speed, etc.)
  #   A: Basic controls only: play/pause button
  #
  #   Q: Should the ExpoAudioPlayer display track metadata (title, artist, album art) or just playback controls?
  #   A: Display track title, artist name, and album art
  #
  #   Q: The work unit mentions 'AudioProPlayer' as well. Do you still want both ExpoAudioPlayer AND AudioProPlayer, or should we focus on just ExpoAudioPlayer for now?
  #   A: Just ExpoAudioPlayer for now
  #
  #   Q: Should the audio player handle errors (e.g., network failure, invalid audio URL)? If so, what should the error UI look like?
  #   A: Show generic error message: 'An error occurred while loading audio'
  #
  #   Q: The work unit mentions TrackCard, TrackList (FlashList), and SearchBar components. Should all of these be part of JAM-003, or should we break them into separate work units and focus JAM-003 only on the audio player?
  #   A: Focus JAM-003 on ExpoAudioPlayer only. Create separate work units for TrackCard, TrackList, and SearchBar
  #
  #   Q: Should the audio player remember playback state (e.g., continue from last position if user leaves and returns)?
  #   A: No playback state persistence - player resets when navigating away
  #
  # ========================================
  Background: User Story
    As a music listener using the Jamendo app
    I want to play audio tracks with a simple and intuitive audio player
    So that I can listen to music with standard playback controls

  Scenario: Display ExpoAudioPlayer with track metadata and play button
    Given I am using the ExpoAudioPlayer component
    And the component receives track data with title "Summer Vibes"
    And the component receives artist name "Cool Band"
    And the component receives album art URL
    And the component receives audio URL
    When the component renders
    Then I should see the track title "Summer Vibes"
    And I should see the artist name "Cool Band"
    And I should see the album art
    And I should see a play button in paused state

  Scenario: Play audio when user taps play button
    Given the ExpoAudioPlayer is displayed
    And the audio is in paused state
    And the play button is visible
    When I tap the play button
    Then the audio should start playing
    And the play button should change to a pause icon

  Scenario: Pause audio when user taps pause button
    Given the ExpoAudioPlayer is displayed
    And the audio is currently playing
    And the pause button is visible
    When I tap the pause button
    Then the audio should stop playing
    And the button should change back to a play icon

  Scenario: Handle audio loading error
    Given the ExpoAudioPlayer is displayed
    And the audio URL fails to load due to network error
    When the component attempts to load the audio
    Then I should see the error message "An error occurred while loading audio"
    And the play button should be disabled

  Scenario: Reset playback state when navigating away
    Given the ExpoAudioPlayer is playing audio
    And the user is on the track detail page
    When the user navigates away from the page
    And then returns to the page
    Then the player should be reset
    And the audio should not be playing
    And the playback position should be at the beginning

  Scenario: Component accepts track data as props
    Given I integrate the ExpoAudioPlayer component
    When I pass audioUrl prop as "https://api.jamendo.com/track/123.mp3"
    And I pass title prop as "Summer Vibes"
    And I pass artistName prop as "Cool Band"
    And I pass albumArtUrl prop as "https://api.jamendo.com/art/123.jpg"
    Then the component should render with all provided data
    And the audio player should be ready to play
