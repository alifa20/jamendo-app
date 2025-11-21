# Jamendo App - Codebase Analysis

**Date:** 2025-11-21
**Status:** Initial Analysis

## Executive Summary

This is an Expo monorepo project with a solid foundation for building a React Native music streaming app. The project uses modern tooling (Expo SDK 54, TypeScript, Expo Router) and is structured as a monorepo using pnpm workspaces and Turborepo.

## Project Structure

```
jamendo-app/
├── apps/
│   └── example/              # Main Expo application
│       ├── app/              # Expo Router pages (file-based routing)
│       ├── components/       # App-specific components
│       ├── hooks/           # Custom React hooks
│       ├── constants/       # App constants
│       └── assets/          # Static assets
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── feature-home/        # Home feature module
│   ├── rtk-services/        # Redux store + RTK Query APIs (NEW)
│   ├── components/          # Shared components (NEW)
│   └── eslint-config/       # Shared ESLint config
└── docs/                    # Documentation
```

## What's Already in Place ✅

### 1. Expo Project Setup
- **Expo SDK:** ~54.0.6 (latest stable)
- **React:** 19.1.0
- **React Native:** 0.81.4
- **TypeScript:** Fully configured
- **New Architecture:** Enabled (`newArchEnabled: true`)

### 2. Navigation System
- **Expo Router:** v6.0.3 (file-based routing)
- **Tab Navigation:** Pre-configured with 2 tabs
  - Home tab (`index.tsx`)
  - Explore tab (`explore.tsx`)
- **Modal Support:** Modal screen configured
- **Typed Routes:** Enabled for type-safe navigation

### 3. Theming System
- Dark/light mode support
- Theme provider from `@react-navigation/native`
- Custom hooks: `useColorScheme`, `useThemeColor`
- Themed components: `ThemedText`, `ThemedView`

### 4. Monorepo Infrastructure
- **Package Manager:** pnpm with workspaces
- **Build System:** Turborepo for fast builds
- **Workspace Packages:**
  - `@jamendo/ui` - Shared UI components
  - `@jamendo/feature-home` - Feature modules
  - `@jamendo/eslint-config` - Linting config

### 5. Development Tooling
- **Testing:** Jest + React Native Testing Library
- **Linting:** ESLint configured
- **Metro Bundler:** Configured and ready
- **Platform Support:** iOS, Android, Web

### 6. Existing Components
- `ThemedText` - Typography with theme support
- `ThemedView` - Container with theme support
- `ParallaxScrollView` - Animated scroll view
- `ExternalLink` - External link handler
- `HapticTab` - Tab with haptic feedback
- `Collapsible` - Expandable/collapsible container
- `IconSymbol` - Icon wrapper

### 7. Existing Hooks
- `useColorScheme` - Detects system color scheme
- `useThemeColor` - Gets color from theme

## What's Missing ❌

### 1. State Management
- **No Redux Toolkit** installed or configured
- **No RTK Query** for API data fetching
- No data persistence layer

### 2. API Integration
- No RTK Query API setup
- No type definitions for Jamendo API responses
- No environment variable configuration

### 3. Audio Playback
- No audio library installed
- No player components
- No audio state management

### 4. Music-Specific Features
- No search functionality
- No track listing components
- No music player UI
- No track detail screens

## Technology Stack

### Core
- **Runtime:** Expo SDK 54.0.6
- **Language:** TypeScript
- **UI Framework:** React Native 0.81.4
- **Web Support:** React Native Web

### Navigation
- **Router:** Expo Router 6.0.3
- **Navigation Library:** React Navigation 7.x

### Styling
- **Approach:** StyleSheet API
- **Theming:** Custom theme system

### Build & Deploy
- **iOS:** Native project in `/ios`
- **Android:** Native project in `/android`
- **Prebuild:** Configured for custom native code

## Dependencies Analysis

### Production Dependencies (18 total)
```json
{
  "expo": "~54.0.6",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "expo-router": "~6.0.3",
  "@react-navigation/native": "^7.1.8"
}
```

### Missing Dependencies for Jamendo App
- `@reduxjs/toolkit` - Includes RTK Query
- `react-redux` - Redux React bindings
- `expo-av` - Expo audio/video library
- `react-native-audio-pro` - Alternative audio library
- `expo-constants` - Environment variables
- `expo-secure-store` - Secure storage (optional)

## Configuration Files

### Key Configurations
- `app.json` - Expo configuration
- `tsconfig.json` - TypeScript configuration
- `metro.config.js` - Metro bundler configuration
- `babel.config.js` - Babel configuration
- `jest.config.js` - Testing configuration
- `turbo.json` - Turborepo configuration
- `pnpm-workspace.yaml` - pnpm workspaces

### Environment Setup Needed
- `.env` file for API keys (Jamendo client ID)
- Expo constants configuration

## Current Screens

### 1. Home Screen (`app/(tabs)/index.tsx`)
- Welcome message with demo content
- Needs replacement with search functionality

### 2. Explore Screen (`app/(tabs)/explore.tsx`)
- Placeholder screen
- Can be repurposed or removed

### 3. Modal Screen (`app/modal.tsx`)
- Demo modal

## Architecture Observations

### Strengths
1. **Modern Stack:** Latest Expo and React Native versions
2. **Type Safety:** Full TypeScript coverage
3. **Scalable:** Monorepo structure supports growth
4. **Best Practices:** File-based routing, typed routes
5. **Cross-Platform:** iOS, Android, Web support
6. **Performance:** New Architecture enabled, Turborepo builds

## Recommended Architecture

### Package Organization

```
packages/
├── rtk-services/              # Redux + RTK Query
│   ├── src/
│   │   ├── store.ts          # Store configuration
│   │   ├── api/
│   │   │   ├── baseApi.ts    # Base RTK Query API
│   │   │   └── jamendoApi.ts # Jamendo endpoints (createApi)
│   │   └── types/
│   │       └── jamendo.ts    # API type definitions
│   ├── package.json
│   └── tsconfig.json
│
├── components/                # Shared components
│   ├── src/
│   │   ├── player/
│   │   │   ├── ExpoAudioPlayer.tsx
│   │   │   └── AudioProPlayer.tsx
│   │   ├── track/
│   │   │   ├── TrackCard.tsx
│   │   │   └── TrackList.tsx
│   │   └── search/
│   │       └── SearchBar.tsx
│   ├── package.json
│   └── tsconfig.json
```

### App Structure

```
apps/example/
├── app/                       # Expo Router screens only
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab navigation
│   │   └── index.tsx         # Home/Search screen
│   ├── track/
│   │   └── [id].tsx          # Track detail screen
│   └── _layout.tsx           # Root layout with Redux Provider
```

## Git Status

**Branch:** main
**Status:** Clean working directory
**Recent Commits:**
- `7a2a88f` - fix: build fixed
- `dad97a2` - feat: init

## Next Steps

See `implementation-plan.md` for detailed implementation steps.
