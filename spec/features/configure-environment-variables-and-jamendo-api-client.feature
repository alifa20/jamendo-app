@done
@infrastructure
@high
@configuration
@environment
@api-integration
@typescript
@JAM-004
Feature: Configure environment variables and Jamendo API client
  """
  .env file gitignored for security. .env.example provides template for developers. Required variables: EXPO_PUBLIC_JAMENDO_CLIENT_ID, EXPO_PUBLIC_JAMENDO_API_URL. After changes, restart dev server with --clear to pick up new values.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. .env file must be created in apps/example/ directory with EXPO_PUBLIC_JAMENDO_CLIENT_ID and EXPO_PUBLIC_JAMENDO_API_URL
  #   2. Environment variables must use EXPO_PUBLIC_ prefix to be accessible in Expo app
  #   3. .env file must be gitignored to prevent committing sensitive credentials
  #   4. config.ts file must export typed constants from environment variables
  #   5. config.ts must provide validation that required environment variables are set
  #   6. .env.example file must be kept up to date as template for developers
  #   7. config.ts must throw error at module load time (fail fast) if required environment variables are missing
  #
  # EXAMPLES:
  #   1. Developer creates .env file with EXPO_PUBLIC_JAMENDO_CLIENT_ID=abc123 and can access it via process.env
  #   2. Developer imports { JAMENDO_CLIENT_ID, JAMENDO_API_URL } from config.ts and uses typed constants
  #   3. Developer forgets to set EXPO_PUBLIC_JAMENDO_CLIENT_ID and app throws clear error message at startup
  #   4. Developer runs 'git status' and .env file is not shown (gitignored)
  #   5. New developer clones repo, copies .env.example to .env, adds their client ID, and app works
  #   6. config.ts exports JAMENDO_CLIENT_ID as non-nullable string after validation
  #
  # QUESTIONS (ANSWERED):
  #   Q: Should config.ts throw an error at module load time if variables are missing, or return undefined and let callers handle it?
  #   A: Throw error at module load time if required environment variables are missing - fail fast approach
  #
  #   Q: Should we add any other environment variables now (like API timeout, max retries), or just the two from .env.example?
  #   A: Stick with the two existing variables from .env.example (JAMENDO_CLIENT_ID and JAMENDO_API_URL)
  #
  #   Q: Where should config.ts be located - in apps/example/ or in a shared package?
  #   A: Place config.ts in apps/example/ directory for now, can move to shared package later if needed
  #
  # ========================================
  Background: User Story
    As a mobile app developer
    I want to configure Jamendo API credentials securely
    So that I can access the Jamendo API without hardcoding sensitive keys

  Scenario: Access environment variables through process.env
    Given a .env file exists in apps/example/ directory
    And the .env file contains "EXPO_PUBLIC_JAMENDO_CLIENT_ID=abc123"
    And the .env file contains "EXPO_PUBLIC_JAMENDO_API_URL=https://api.jamendo.com/v3.0"
    When the application loads
    Then process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID should equal "abc123"
    And process.env.EXPO_PUBLIC_JAMENDO_API_URL should equal "https://api.jamendo.com/v3.0"

  Scenario: Import typed constants from config.ts
    Given config.ts file exists in apps/example/ directory
    And config.ts exports JAMENDO_CLIENT_ID constant
    And config.ts exports JAMENDO_API_URL constant
    When a developer imports { JAMENDO_CLIENT_ID, JAMENDO_API_URL } from config
    Then JAMENDO_CLIENT_ID should be a non-nullable string
    And JAMENDO_API_URL should be a non-nullable string
    And TypeScript should provide autocomplete for both constants

  Scenario: Throw error when required environment variable is missing
    Given config.ts file exists in apps/example/ directory
    And EXPO_PUBLIC_JAMENDO_CLIENT_ID is not set in environment
    When config.ts module is loaded
    Then an error should be thrown with message "Missing required environment variable: EXPO_PUBLIC_JAMENDO_CLIENT_ID"
    And the application should fail to start

  Scenario: Verify .env file is gitignored
    Given a .env file exists in apps/example/ directory
    And .gitignore file includes ".env" entry
    When developer runs "git status"
    Then .env file should not appear in untracked files
    And .env file should not appear in staged changes

  Scenario: New developer onboarding workflow
    Given a new developer clones the repository
    And .env.example file exists with template values
    When developer copies .env.example to .env
    And developer sets EXPO_PUBLIC_JAMENDO_CLIENT_ID to their client ID
    And developer starts the application
    Then the application should start successfully
    And the Jamendo API client should be configured with their credentials

  Scenario: Validate config.ts exports non-nullable types
    Given config.ts validates environment variables at load time
    And EXPO_PUBLIC_JAMENDO_CLIENT_ID is set to "valid_client_id"
    And EXPO_PUBLIC_JAMENDO_API_URL is set to "https://api.jamendo.com/v3.0"
    When config.ts exports JAMENDO_CLIENT_ID
    Then JAMENDO_CLIENT_ID type should be string (not string | undefined)
    And JAMENDO_CLIENT_ID value should equal "valid_client_id"
