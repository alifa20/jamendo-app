# Jamendo Music App

A React Native app for browsing and playing royalty-free music from Jamendo's music catalog.

## Overview

This app demonstrates a Redux-based music browsing and playback experience with two main screens:

1. **Home Page**: Search for music tracks with a text input and view results in a list
2. **Detail Page**: View detailed track information and play the selected track using an audio player

**Note**: This project was kick-started from an existing Expo monorepo template to accelerate development setup.

<div align="center">

https://github.com/user-attachments/assets/e2f60dc0-6f83-40d2-bb59-6988506fcce3

</div>

## Tech Stack

- **Expo** - Cross-platform app framework
- **Redux Toolkit** - State management
- **RTK Query** - API data fetching and caching
- **Expo Router / React Navigation** - Navigation and routing
- **Expo Audio** - Media playback
- **FlashList** - High-performance list rendering
- **Expo Image** - Optimized image loading with caching
- **React Native Reanimated** - Smooth 60fps animations
- **pnpm** - Fast, efficient package manager
- **Turborepo** - Monorepo build system

### Development Tools

- **[Claude Code](https://claude.ai/code)** - AI-assisted development and code generation
  - Parallel AI agents for concurrent task execution
  - Advanced prompt engineering for high-quality code output
- **Advanced Git Techniques** - Efficient workflow management
  - Git worktree for parallel feature development
  - Branch management and isolation strategies
- **[fspec](https://fspec.dev/)** - Acceptance Criteria Driven Development (ACDD) and specification management

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- iOS Simulator (for iOS development) or Android emulator (for Android development)
- Jamendo API client ID (sign up at [Jamendo Developer](https://developer.jamendo.com/))

## Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure API credentials**:
   Create a `.env` file in the app directory with your Jamendo API client ID:
   ```
   EXPO_PUBLIC_JAMENDO_CLIENT_ID=your_client_id_here
   ```

## Running the App

### iOS
```bash
pnpm ios
```

### Android
```bash
pnpm android
```

### Development mode (all apps)
```bash
pnpm dev
```

## Project Structure

- [`apps/example`](./apps/example) - Main Jamendo music app
- [`packages/`](./packages) - Shared packages and components
  - `components` - Audio players and UI components
  - `eslint-config` - ESLint configuration
  - `feature-home` - Home screen features
  - `rtk-services` - RTK Query API services
  - `ui` - Shared UI components

## API Integration

This app uses the Jamendo API v3.0 tracks endpoint with **RTK Query** for data fetching and caching:
- **API Layer**: Separate `@jamendo/rtk-services` package handles all API calls
- **Home page**: Fetches minimal track data using `namesearch` parameter
- **Detail page**: Displays complete track information
- **Audio playback**: Uses the `audio` field from API response
- **Caching**: RTK Query automatically caches responses and manages loading states

API Documentation: https://developer.jamendo.com/v3.0/tracks

## Features

- **Text-based music search** - Real-time search with debounced input
- **Animated track details** - Smooth header animations with opacity transitions using Reanimated
- **Dual audio players** - Two different player UI styles for versatile playback experience
- **High-performance lists** - FlashList for smooth scrolling of large track catalogs
- **Optimized images** - Expo Image with automatic caching and blur placeholders
- **Smart API usage** - Minimal data on list view, full details on demand
- **State management** - Redux Toolkit with RTK Query for efficient data fetching and caching
- **Cross-platform** - Runs on iOS, Android, and web

## Commands

- `pnpm ios` - Run on iOS simulator
- `pnpm android` - Run on Android emulator
- `pnpm dev` - Start development server
- `pnpm lint` - Run ESLint on all packages
- `pnpm build` - Build all apps and packages
- `pnpm test:maestro` - Run E2E tests with Maestro

## Testing

This project uses **Maestro** for end-to-end testing:
- Flow-based E2E tests in `.maestro/flows/`
- Test user interactions across iOS and Android
- Run specific test: `pnpm test:single <flow-file>`

## CI/CD

Optimized GitHub Actions pipeline featuring:
- **Reusable workflows** - Shared lint, typecheck, and build workflows
- **Parallel execution** - Independent jobs run concurrently
- **Turborepo caching** - Fast incremental builds
