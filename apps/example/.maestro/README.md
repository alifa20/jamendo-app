# Maestro E2E Testing for Jamendo App

This directory contains Maestro test flows for end-to-end testing of the Jamendo React Native app.

## What is Maestro?

Maestro is a mobile UI testing framework that allows you to write declarative tests in YAML format. It's particularly well-suited for React Native apps and provides:

- Cross-platform testing (iOS & Android)
- Simple YAML-based test syntax
- Fast execution
- No need for app instrumentation
- Built-in support for deep linking, network conditions, and more

## Prerequisites

Install Maestro CLI:

```bash
# macOS
brew tap mobile-dev-inc/tap
brew install maestro

# Other platforms
curl -Ls "https://get.maestro.mobile.dev" | bash
```

## Running Tests

### Run all tests
```bash
pnpm test
```

### Run a specific flow
```bash
pnpm test:single .maestro/flows/track-detail-load.yaml
```

### Run tests on specific device
```bash
# iOS Simulator
maestro test --device "iPhone 15 Pro" .maestro/flows

# Android Emulator
maestro test --device emulator-5554 .maestro/flows
```

## Test Flows

### JAM-007: Track Detail Page
- `track-detail-load.yaml` - Successfully load track detail page with complete information
- `track-detail-scroll.yaml` - Scroll track details with fixed audio player
- `track-detail-invalid-id.yaml` - Handle invalid track ID
- `track-detail-network-error.yaml` - Handle network error when loading track
- `track-detail-play-audio.yaml` - Play audio track on user interaction

## Writing New Flows

Each flow file corresponds to a Gherkin scenario and includes `@step` comments mapping to the feature file.

Example structure:
```yaml
# Feature: spec/features/my-feature.feature
# Scenario: My test scenario

appId: com.anonymous.jamendo
---
# @step Given I am on the home page
- launchApp

# @step When I tap the search button
- tapOn: "Search"

# @step Then I should see search results
- assertVisible: "Results"
```

## Best Practices

1. **Use testID for assertions**: Add `testID` props to React Native components for reliable element selection
2. **Wait for animations**: Use `waitForAnimationToEnd` after navigation or data loading
3. **Keep flows focused**: Each flow should test one scenario
4. **Comment with Gherkin steps**: Map each Maestro command to a Gherkin step using `# @step` comments
5. **Handle async operations**: Use appropriate timeouts for network requests and animations

## Debugging

### View Maestro Studio (interactive testing)
```bash
maestro studio
```

### Record a flow
```bash
maestro record .maestro/flows/my-new-flow.yaml
```

### View test results
Test results are displayed in the terminal. For CI/CD, Maestro can export JUnit XML reports.

## CI/CD Integration

Maestro can run in CI/CD pipelines. Example GitHub Actions:

```yaml
- name: Run Maestro tests
  uses: mobile-dev-inc/action-maestro-cloud@v1
  with:
    api-key: ${{ secrets.MAESTRO_CLOUD_API_KEY }}
    app-file: app-release.apk
```

## Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro CLI Reference](https://maestro.mobile.dev/reference/commands)
- [Maestro Examples](https://github.com/mobile-dev-inc/maestro/tree/main/maestro-cli/test-suites)
