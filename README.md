# Jamendo Music App

A React Native app for browsing and playing royalty-free music from Jamendo's music catalog.

## Overview

This app demonstrates a Redux-based music browsing and playback experience with two main screens:

1. **Home Page**: Search for music tracks with a text input and view results in a list
2. **Detail Page**: View detailed track information and play the selected track using an audio player

**Note**: This project was kick-started from an existing Expo monorepo template to accelerate development setup.

## Tech Stack

- **Expo** - Cross-platform app framework
- **Redux** - State management
- **Expo Router / React Navigation** - Navigation and routing
- **pnpm** - Fast, efficient package manager
- **Turborepo** - Monorepo build system
- **React Native Audio Pro** - Media playback

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
  - `eslint-config` - ESLint configuration
  - `feature-home` - Home screen features
  - `ui` - Shared UI components

## API Integration

This app uses the Jamendo API v3.0 tracks endpoint:
- **Home page**: Fetches minimal track data using `namesearch` parameter
- **Detail page**: Displays complete track information
- **Audio playback**: Uses the `audio` field from API response

API Documentation: https://developer.jamendo.com/v3.0/tracks

## Features

- Text-based music search
- Optimized API usage (minimal data on list, full data on detail)
- Audio playback with controls
- Redux state management for track data
- Navigation between search and detail views

## Commands

- `pnpm ios` - Run on iOS simulator
- `pnpm android` - Run on Android emulator
- `pnpm dev` - Start development server
- `pnpm lint` - Run ESLint on all packages
- `pnpm build` - Build all apps and packages
