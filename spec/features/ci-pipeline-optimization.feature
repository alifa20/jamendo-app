@ci-optimization
@infrastructure
@done
@JAM-010
Feature: Optimize CI pipeline - remove duplicate lint, typecheck, and build steps
  """
  Key architectural decisions:
  - Extract duplicate lint-and-typecheck job from test.yml and preview.yml
  - Create reusable workflow (.github/workflows/lint-and-typecheck.yml) with on.workflow_call trigger
  - Both workflows call the reusable workflow using 'uses:' syntax
  - Maintains same job dependencies (lint-and-typecheck is prerequisite for build/example jobs)
  
  Dependencies and integrations:
  - GitHub Actions environment and runner configuration
  - Setup monorepo action (./.github/actions/setup-monorepo)
  - pnpm commands for lint and typecheck tasks
  - Works with existing Turborepo configuration
  
  Critical implementation requirements:
  - Reusable workflow must be idempotent (can be called from multiple workflows)
  - Must preserve all inputs and outputs from original jobs
  - Must maintain dependency chains (build depends on lint-and-typecheck)
  - Must ensure test job still depends on build in test.yml
  - Must ensure example job still depends on lint-and-typecheck in preview.yml
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Lint and typecheck are duplicated in both test.yml and preview.yml workflows
  #   2. Both workflows should use a shared job or reusable workflow for lint and typecheck
  #   3. Each workflow file (test.yml, preview.yml) should be optimized to remove redundancy
  #
  # EXAMPLES:
  #   1. test.yml has a 'lint-and-typecheck' job that is duplicated identically in preview.yml
  #   2. After optimization, both workflows reference the same reusable workflow file or shared job template
  #   3. test.yml build job depends on lint-and-typecheck; preview.yml example job depends on lint-and-typecheck
  #
  # QUESTIONS (ANSWERED):
  #   Q: Should we use a reusable workflow file (.github/workflows/lint-and-typecheck.yml) or extract it into a separate workflow that other workflows call with 'uses:'?
  #   A: Use a reusable workflow file (.github/workflows/lint-and-typecheck.yml) that both test.yml and preview.yml call via 'uses:' to centralize the shared quality checks
  #
  # ========================================
  Background: User Story
    As a DevOps Engineer
    I want to optimize the CI pipeline by removing duplicate steps
    So that reduce CI runtime and improve workflow efficiency

  Scenario: Identify duplicate lint-and-typecheck job in workflows
    Given I have workflow files test.yml and preview.yml
    When I examine both workflow files
    Then test.yml should contain a 'lint-and-typecheck' job with checkout, setup monorepo, lint, and typecheck steps
    And preview.yml should contain an identical 'lint-and-typecheck' job with the same steps
    And both jobs should have identical structure and commands

  Scenario: Create reusable workflow for lint and typecheck
    Given the project uses GitHub Actions workflows
    When I create a new file .github/workflows/lint-and-typecheck.yml
    Then the file should be a reusable workflow (with on.workflow_call)
    And the workflow should contain the lint-and-typecheck job from the original files
    And the workflow should accept inputs for setup options
    And both test.yml and preview.yml can call this workflow using 'uses:'

  Scenario: Update test.yml to use reusable workflow
    Given I have the reusable lint-and-typecheck workflow
    When I update test.yml to replace the duplicate lint-and-typecheck job with a call to the reusable workflow
    Then test.yml should call the reusable workflow with 'uses: ./.github/workflows/lint-and-typecheck.yml'
    And the build job should still depend on the lint-and-typecheck result
    And the test job should still depend on both lint-and-typecheck and build

  Scenario: Update preview.yml to use reusable workflow
    Given I have the reusable lint-and-typecheck workflow
    And test.yml has been updated to use the reusable workflow
    When I update preview.yml to replace its duplicate lint-and-typecheck job with a call to the reusable workflow
    Then preview.yml should call the reusable workflow with 'uses: ./.github/workflows/lint-and-typecheck.yml'
    And the example job should still depend on the lint-and-typecheck result
    And the workflow should have no duplicate lint-and-typecheck code

  Scenario: Verify workflow dependencies still work correctly
    Given both test.yml and preview.yml have been updated to use the reusable workflow
    And the .github/workflows/lint-and-typecheck.yml reusable workflow exists
    When I review the dependency chain in both workflows
    Then the build/example jobs should execute after lint-and-typecheck completes
    And subsequent jobs should still depend on their original prerequisites
    And no lint or typecheck steps should be duplicated across workflows
