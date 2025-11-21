@done
@high
@app
@state-management
@redux
@rtk-query
@infrastructure
@JAM-005
Feature: Integrate Redux Provider in app root layout
  """
  Provider must wrap entire app at root layout level (_layout.tsx). Redux store imported from @jamendo/rtk-services package. Provider must be placed inside ThemeProvider (ThemeProvider wraps Provider). DevTools integration enabled in development mode using __DEV__ flag. Integration must not affect existing navigation (Expo Router) or theme switching functionality.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Redux Provider must be placed in the root layout to make store accessible to all screens
  #   2. Provider must be configured with the store from @jamendo/rtk-services package
  #   3. Integration must not break existing navigation or theme functionality
  #   4. Redux DevTools must be enabled in development builds for debugging
  #
  # EXAMPLES:
  #   1. Developer imports Provider and store in _layout.tsx and wraps app tree
  #   2. Screen component uses useSearchTracksQuery hook and successfully fetches data through Redux store
  #   3. User switches between light and dark themes, theme continues to work with Redux Provider present
  #   4. User navigates between tabs, navigation works normally with Redux store available
  #   5. Developer opens Redux DevTools in development build and sees current store state with API cache
  #
  # QUESTIONS (ANSWERED):
  #   Q: Should Redux Provider wrap ThemeProvider, or vice versa? What's the correct nesting order for providers?
  #   A: ThemeProvider wraps Redux Provider (Provider is nested inside ThemeProvider)
  #
  #   Q: Should we enable Redux DevTools integration for development builds?
  #   A: Yes, enable Redux DevTools integration for development builds
  #
  # ========================================
  Background: User Story
    As a mobile app developer
    I want to use Redux state management throughout the app
    So that I have centralized state and API caching available in all screens

  Scenario: Redux Provider wraps app at root layout
    Given the root layout file exists at apps/example/app/_layout.tsx
    When I import Provider from react-redux and store from @jamendo/rtk-services
    Then the Provider should wrap all child components inside ThemeProvider
    Given the store is configured in @jamendo/rtk-services package
    When I wrap the app tree with Provider component
    Then all screens should have access to the Redux store

  Scenario: RTK Query hooks access Redux store
    Given Redux Provider is configured in root layout
    When a screen component uses useSearchTracksQuery hook
    Then the hook should successfully access the Redux store
    Given the app is running
    Then API data should be fetched and cached

  Scenario: Theme switching works with Redux Provider
    Given Redux Provider is configured in root layout
    When user switches between light and dark themes
    Then the theme should change successfully
    Given the app is running with theme controls
    Then Redux Provider should continue to function normally

  Scenario: Navigation works with Redux store available
    Given Redux Provider is configured in root layout
    When user navigates between tabs
    Then navigation should work normally
    Given the app is running with tab navigation
    Then Redux store should remain accessible in all screens

  Scenario: Redux DevTools shows store state in development
    Given Redux Provider is configured with DevTools integration
    When developer opens Redux DevTools
    Then DevTools should show current store state
    Given the app is running in development mode
    Then RTK Query cache should be visible in DevTools
