@high
@infrastructure
@dependency-management
@monorepo
@setup
@JAM-001
Feature: Setup project dependencies and package structure
  """
  This work unit sets up the required dependencies for the Jamendo music app:
  - Audio playback: expo-audio package for React Native audio functionality
  - List rendering: @shopify/flash-list for performant scrolling
  - State management: @jamendo/rtk-services (already configured with RTK Query)
  - Components: @jamendo/components (contains FlashList-based components)
  - Environment: .env file with EXPO_PUBLIC_JAMENDO_CLIENT_ID for API access

  Implementation requirements:
  - Use workspace:* protocol for monorepo packages (@jamendo/components, @jamendo/rtk-services)
  - Install expo-audio and @shopify/flash-list as direct dependencies in apps/example
  - Create .env file in apps/example directory (gitignored)
  - Packages already exist: @jamendo/rtk-services and @jamendo/components with correct naming
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. expo-audio must be installed for audio playback functionality
  #   2. @shopify/flash-list must be installed for performant list rendering
  #   3. Environment variables must be configured in .env file with EXPO_PUBLIC_JAMENDO_CLIENT_ID (required)
  #   4. All installed packages must appear in package.json dependencies
  #   5. @jamendo/components package must be added as dependency in apps/example
  #   6. @jamendo/rtk-services package must be added as dependency in apps/example
  #
  # EXAMPLES:
  #   1. Developer runs 'pnpm add expo-audio' in apps/example directory, expo-audio appears in package.json
  #   2. Developer runs 'pnpm add @shopify/flash-list' in apps/example directory, @shopify/flash-list appears in package.json
  #   3. Developer creates .env file in apps/example with EXPO_PUBLIC_JAMENDO_CLIENT_ID=test_client_id
  #   4. Developer runs 'pnpm install' and all packages install successfully without errors
  #   5. Developer adds @jamendo/components as dependency in apps/example/package.json
  #   6. Developer adds @jamendo/rtk-services as dependency in apps/example/package.json
  #
  # QUESTIONS (ANSWERED):
  #   Q: Should we install @reduxjs/toolkit and configure RTK Query with a base API service, or just install the package?
  #   A: RTK Query is already configured in @packages/rtk-services/, so we can skip this
  #
  #   Q: Should we install both expo-audio and react-native-audio-pro, or choose one? What's the preferred audio solution?
  #   A: Use expo-audio for now
  #
  #   Q: For the rtk-services package, should it be named @jamendo/rtk-services? What about the components package name?
  #   A: Yes, follow @jamendo/ naming convention (already done)
  #
  #   Q: What specific environment variables need to be configured besides EXPO_PUBLIC_JAMENDO_CLIENT_ID?
  #   A: EXPO_PUBLIC_JAMENDO_CLIENT_ID (required), EXPO_PUBLIC_JAMENDO_API_URL (optional, defaults to https://api.jamendo.com/v3.0)
  #
  #   Q: Should FlashList replace existing FlatList usage in the codebase, or is it only for new features?
  #   A: No FlatList exists currently. Use FlashList for all list implementations going forward. Do not remove or touch FlatList if found.
  #
  # ========================================
  Background: User Story
    As a developer
    I want to set up project dependencies and package structure
    So that I can start building features with the required libraries

  Scenario: Install expo-audio for audio playback
    Given I am in the apps/example directory
    When I run "pnpm add expo-audio"
    Then expo-audio should appear in apps/example/package.json dependencies
    And the package should be installed in node_modules

  Scenario: Install @shopify/flash-list for performant list rendering
    Given I am in the apps/example directory
    When I run "pnpm add @shopify/flash-list"
    Then @shopify/flash-list should appear in apps/example/package.json dependencies
    And the package should be installed in node_modules

  Scenario: Add @jamendo/components as workspace dependency
    Given I am in the apps/example directory
    And @jamendo/components package exists in packages/components
    When I add "@jamendo/components": "workspace:*" to package.json dependencies
    Then @jamendo/components should appear in apps/example/package.json dependencies with workspace:* protocol

  Scenario: Add @jamendo/rtk-services as workspace dependency
    Given I am in the apps/example directory
    And @jamendo/rtk-services package exists in packages/rtk-services
    When I add "@jamendo/rtk-services": "workspace:*" to package.json dependencies
    Then @jamendo/rtk-services should appear in apps/example/package.json dependencies with workspace:* protocol

  Scenario: Create .env file with required environment variables
    Given I am in the apps/example directory
    When I create a .env file with EXPO_PUBLIC_JAMENDO_CLIENT_ID=test_client_id
    Then the .env file should exist in apps/example
    And the file should contain EXPO_PUBLIC_JAMENDO_CLIENT_ID environment variable

  Scenario: Install all dependencies successfully
    Given all required dependencies are listed in apps/example/package.json
    When I run "pnpm install" in the project root
    Then all packages should install without errors
    And node_modules should contain all required dependencies
