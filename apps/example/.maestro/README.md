# Maestro E2E Tests

This directory contains Maestro end-to-end tests for the Jamendo Music App.

## Setup

### 1. Install Maestro CLI

**macOS/Linux:**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

**Windows:**
```powershell
iwr "https://get.maestro.mobile.dev/windows" | iex
```

### 2. Verify Installation

```bash
maestro --version
```

## Running Tests

### Run all E2E tests

From the project root:
```bash
pnpm test:e2e
```

Or directly with Maestro:
```bash
maestro test apps/example/.maestro
```

### Run specific test flow

```bash
maestro test apps/example/.maestro/home-screen.yaml
```

### Run with iOS Simulator

```bash
# Start the iOS simulator first
pnpm ios

# In another terminal, run Maestro tests
pnpm test:e2e
```

### Run with Android Emulator

```bash
# Start the Android emulator first
pnpm android

# In another terminal, run Maestro tests
pnpm test:e2e
```

## Test Files

- `home-screen.yaml` - Tests the home screen search and track listing functionality

## Writing Maestro Tests

Maestro tests use YAML format. Common commands:

- `launchApp` - Launch the app
- `assertVisible` - Assert an element is visible
- `tapOn` - Tap on an element
- `inputText` - Type text into an input field
- `scroll` - Scroll the screen
- `swipe` - Swipe in a direction

For more information, see:
- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro with Expo Guide](https://maestro.mobile.dev/blog/pokedex-ui-testing-series-getting-started-with-maestro-in-expo-react-native-part-1)
- [EAS Workflows with E2E Tests](https://docs.expo.dev/eas/workflows/examples/e2e-tests/)

## CI/CD Integration

For EAS Build integration with Maestro, see:
https://docs.expo.dev/eas/workflows/examples/e2e-tests/
