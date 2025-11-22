@done
@monorepo
@dependency-management
@app
@medium
@JAM-012
Feature: Remove unused feature-home package and explore screen

  """
  This cleanup removes unused boilerplate from the Expo starter template. The @jamendo/feature-home package is declared in package.json but never imported in the codebase (verified via grep). The explore screen (app/(tabs)/explore.tsx) contains only Expo documentation content, not Jamendo music app functionality. Removal reduces confusion for developers and users by eliminating unused screens from the tab navigator.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. The feature-home package must be removed from package.json dependencies
  #   2. The explore screen file must be deleted from app/(tabs)/explore.tsx
  #   3. The explore tab must be removed from the tab layout configuration
  #   4. The feature-home package must have zero imports before removal
  #   5. The packages/feature-home directory must be completely deleted
  #
  # EXAMPLES:
  #   1. Developer removes '@jamendo/feature-home: workspace:*' from apps/example/package.json dependencies
  #   2. Developer deletes app/(tabs)/explore.tsx file containing boilerplate Expo documentation
  #   3. Developer removes Tabs.Screen with name='explore' from app/(tabs)/_layout.tsx
  #   4. Developer runs 'pnpm install' after removing package to update lockfile
  #   5. Developer runs 'pnpm build' successfully after all removals with no errors
  #   6. Developer deletes packages/feature-home directory completely including all source files
  #
  # QUESTIONS (ANSWERED):
  #   Q: Should we also delete the packages/feature-home directory itself, or just remove it from dependencies?
  #   A: Yes, completely remove the packages/feature-home directory and do proper cleanup
  #
  #   Q: Should we verify the app runs successfully (pnpm dev) after removal, or is building enough?
  #   A: Building is enough - user will verify the app runs manually
  #
  #   Q: Are there any other boilerplate screens or unused packages we should remove in this task?
  #   A: No, only the explore screen needs to be removed in this task
  #
  # ========================================

  Background: User Story
    As a developer maintaining the codebase
    I want to remove unused feature-home package and explore screen boilerplate
    So that new developers and users aren't confused by unused screens and packages

  Scenario: Remove feature-home package from dependencies
    Given the package.json contains "@jamendo/feature-home: workspace:*" in dependencies
    And the package has zero imports in the codebase
    When I remove the dependency from apps/example/package.json
    Then the "@jamendo/feature-home" dependency should be deleted from dependencies section

  Scenario: Delete explore screen file
    Given the explore screen file exists at "app/(tabs)/explore.tsx"
    And the file contains only Expo boilerplate documentation
    When I delete the file "app/(tabs)/explore.tsx"
    Then the file should no longer exist

  Scenario: Remove explore tab from tab layout
    Given the tab layout exists at "app/(tabs)/_layout.tsx"
    And it contains a Tabs.Screen component with name="explore"
    When I remove the Tabs.Screen component for explore
    Then the tab layout should no longer reference the explore screen

  Scenario: Delete feature-home package directory
    Given the packages/feature-home directory exists
    And it contains source files and package configuration
    When I delete the packages/feature-home directory completely
    Then the directory should no longer exist

  Scenario: Update lockfile after package removal
    Given the "@jamendo/feature-home" package has been removed from package.json
    When I run "pnpm install"
    Then the pnpm-lock.yaml should be updated without errors
    And the lockfile should not reference "@jamendo/feature-home"

  Scenario: Build successfully after cleanup
    Given all removals are complete
    And the lockfile has been updated
    When I run "pnpm build"
    Then the build should complete successfully without errors
    And there should be no references to removed packages or screens
