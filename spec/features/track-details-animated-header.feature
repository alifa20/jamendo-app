@JAM-011
@high
@mobile
@ui-animation
@reanimated
Feature: Track Details with Animated Header Image
  """
  Uses React Native Reanimated 3 for smooth 60fps animations. Implements dual-image fade pattern: full-quality image fades to blurred background as user scrolls. Header dimensions remain fixed (only opacity changes). Scroll-driven animation responds immediately without momentum-based completion. TrackMetadata and play controls are overlaid and fade synchronously with header image.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Header image opacity decreases linearly with scroll position (0 opacity at top, decreases to full transparency after scrolling)
  #   2. Blurred background image becomes progressively more visible as header image fades
  #   3. Animation must run at 60fps with React Native Reanimated worklet functions for smooth performance
  #   4. Header fade animation completes over a distance equal to the full header height
  #   5. Animation follows scroll position directly without momentum-based auto-completion
  #   6. Background image has fixed 10px blur radius throughout animation
  #   7. Header image maintains fixed dimensions throughout animation - only opacity changes
  #   8. TrackMetadata and TrackPlayerControls are overlaid on the header and fade out as user scrolls (opacity linked to header fade)
  #
  # EXAMPLES:
  #   1. User opens track details screen - large header image is fully visible and opaque (100% opacity)
  #   2. User scrolls down 50 pixels - header image becomes 50% transparent, blurred background shows through at 50% opacity
  #   3. User scrolls down 100 pixels - header image is fully transparent, blurred background is fully visible (100% opacity)
  #   4. User scrolls back up to top - header image fades back to 100% opacity, blurred background fades out smoothly
  #   5. User scrolls down to 1/4 header height - header opacity is at 75%, blurred background is at 25% opacity with 10px blur applied
  #   6. User scrolls down to 2/3 height, pauses, then scrolls down more - animation immediately reflects new scroll position without auto-completing
  #   7. TrackMetadata and play controls appear overlaid on the header image and fade out as header becomes transparent
  #
  # QUESTIONS (ANSWERED):
  #   Q: What happens when user scrolls?
  #   A: Header image fades from opaque to transparent as user scrolls down
  #
  #   Q: When does the animation start?
  #   A: Animation starts immediately when the track details screen loads
  #
  #   Q: What are the two images in the dual-image fade?
  #   A: Full-quality image fades to blurred background image as user scrolls
  #
  # ========================================
  Background: User Story
    As a music listener
    I want to view track details
    So that I see a beautiful animated header that reacts to my scrolling

  Scenario: Header image displays at full opacity when screen loads
    Given the track details screen is loaded with track data
    When the screen first appears
    Then the header image should be displayed at 100% opacity
    And the blurred background should not be visible
    And the overlaid TrackMetadata should be visible
    And the play controls should be visible

  Scenario: Header image fades as user scrolls down
    Given the track details screen is open
    And the header image is at 100% opacity
    When the user scrolls down by 50 pixels
    Then the header image opacity should decrease to 50%
    And the blurred background image should appear at 50% opacity
    And the overlaid content opacity should match the header fade

  Scenario: Header image becomes fully transparent at scroll threshold
    Given the track details screen is open
    And the header height is 200 pixels
    When the user scrolls down by 200 pixels (full header height)
    Then the header image should be fully transparent (0% opacity)
    And the blurred background should be fully visible (100% opacity)
    And the overlaid TrackMetadata and controls should be hidden

  Scenario: Animation is reversible when user scrolls back up
    Given the user has scrolled down to full transparency
    And the blurred background is fully visible
    When the user scrolls back up to the top
    Then the header image should fade back to 100% opacity
    And the blurred background should fade out smoothly
    And the overlaid content should become visible again

  Scenario: Scroll position controls opacity linearly
    Given the track details screen is open
    And the header height is 200 pixels
    When the user scrolls down to 1/4 of the header height (50 pixels)
    Then the header image opacity should be 75%
    And the blurred background opacity should be 25%
    And the blur radius should remain at 10px

  Scenario: Animation responds immediately to scroll without momentum
    Given the user has scrolled to 2/3 of the header height
    When the user pauses scrolling momentarily
    Then the animation should maintain the current opacity state
    When the user continues scrolling down
    Then the animation should immediately reflect the new scroll position
    And no auto-completion or momentum animation should occur

  Scenario: Overlaid controls fade with header image opacity
    Given the track details screen is open
    And TrackMetadata and play controls are overlaid on the header image
    When the header image starts fading (user scrolls)
    Then the overlaid content opacity should match the header image opacity
    And when the header is fully transparent, the controls should also be hidden
    And when scrolling back up, the controls should become visible again in sync
