# Jamendo Music App - Documentation

## Project Overview

A React Native music streaming app built with Expo, featuring:
- Search functionality for Jamendo's music catalog
- High-performance track listing with FlashList
- Detailed track view with TWO audio player implementations
- Redux Toolkit Query for state management
- Optimal API usage pattern

## Documentation Index

### 1. [Codebase Analysis](./codebase-analysis.md)
**What's inside:**
- Current project structure and setup
- Existing dependencies and configurations
- What's already built vs what needs to be implemented
- Technology stack overview
- Recommended architecture

**Read this first to understand:** What you have and what you need to build.

---

### 2. [Implementation Plan](./implementation-plan.md)
**What's inside:**
- Complete step-by-step implementation guide
- Phase-by-phase breakdown (9 phases)
- Code examples for each component
- File structure and organization
- Success criteria and testing strategy

**Use this as:** Your implementation roadmap from start to finish.

---

### 3. [Expo Audio Implementation](./expo-audio-implementation.md)
**What's inside:**
- expo-audio API reference
- Hook-based usage patterns (`useAudioPlayer`, `useAudioPlayerStatus`)
- Complete player component template
- Error handling and edge cases
- iOS background audio configuration

**Use this when:** Building the ExpoAudioPlayer component.

---

### 4. [Jamendo API Reference](./jamendo-api-reference.md)
**What's inside:**
- Complete Jamendo API documentation
- Endpoint details and parameters
- Minimal vs full field selection strategy
- TypeScript type definitions
- Example requests and responses
- Best practices and common issues

**Use this when:** Building the RTK Query API service.

---

## Quick Start Guide

### Prerequisites
- Expo development environment set up
- Jamendo API client ID (you mentioned you have it)
- Node.js and pnpm installed

### Implementation Order

1. **Setup (Phase 1-2)**
   - Install dependencies
   - Create package structure
   - Set up RTK Query services

2. **Core Features (Phase 3-5)**
   - Build components package
   - Configure environment variables
   - Integrate Redux Provider

3. **UI Implementation (Phase 6-7)**
   - Build home/search page
   - Build track detail page

4. **Testing (Phase 8-9)**
   - Update navigation
   - Test and validate

### Key Technology Decisions

| Component | Technology | Why |
|-----------|-----------|-----|
| State Management | RTK Query | Built-in caching, loading states, less boilerplate |
| List Performance | @shopify/flash-list | Better performance than FlatList |
| Audio Player 1 | expo-audio | Modern Expo audio library with hooks |
| Audio Player 2 | react-native-audio-pro | Alternative for comparison |
| Detail Layout | ScrollView | Standard scrollable layout |
| Navigation | Expo Router | File-based, already configured |
| Code Organization | Monorepo packages | Modular, reusable architecture |

---

## Architecture Overview

```
User Flow:
Home Page (Search) → Track List (FlashList) → Track Detail (ScrollView)

State Flow:
Component → RTK Query Hook → API Call → Cache → Redux Store → Component

Package Structure:
@jamendo/rtk-services → Store + API logic
@jamendo/components → Reusable UI components
apps/example → Expo Router screens only
```

---

## Package Structure

### `@jamendo/rtk-services`
**Purpose:** Redux store and RTK Query API definitions

**Contains:**
- `store.ts` - Redux store configuration
- `api/baseApi.ts` - Base RTK Query setup
- `api/jamendoApi.ts` - Jamendo endpoints (searchTracks, getTrackDetail)
- `types/jamendo.ts` - API type definitions

**Exports:**
- `store` - Redux store instance
- `useSearchTracksQuery` - Search tracks hook
- `useGetTrackDetailQuery` - Get track details hook
- TypeScript types

---

### `@jamendo/components`
**Purpose:** Shared UI components

**Contains:**
- `player/ExpoAudioPlayer.tsx` - expo-audio player
- `player/AudioProPlayer.tsx` - react-native-audio-pro player
- `track/TrackCard.tsx` - Individual track item
- `track/TrackList.tsx` - FlashList of tracks
- `search/SearchBar.tsx` - Search input with debouncing

**Exports:**
- All player components
- All track components
- Search components

---

### `apps/example`
**Purpose:** Main Expo application

**Contains:**
- `app/(tabs)/index.tsx` - Search/home screen
- `app/track/[id].tsx` - Track detail screen
- `app/_layout.tsx` - Root layout with Redux Provider
- Environment variables (.env)

---

## Data Optimization Strategy

### Home Page (List View)
**API Request:**
```
GET /tracks?namesearch={query}&limit=20
```

**Fields:**
- ✅ id, name, artist_name, image, duration
- ❌ No audio URL
- ❌ No musicinfo
- ❌ No lyrics

**Bandwidth:** ~5KB per track

---

### Detail Page (Full View)
**API Request:**
```
GET /tracks?id={trackId}&include=musicinfo&audioformat=mp31
```

**Fields:**
- ✅ All basic fields
- ✅ Audio URL (required for playback)
- ✅ Album info
- ✅ Music metadata
- ✅ Release date

**Bandwidth:** ~15KB per track

**Cache:** RTK Query caches this, so going back is instant

---

## Environment Variables

Create `apps/example/.env`:
```env
EXPO_PUBLIC_JAMENDO_CLIENT_ID=your_client_id_here
```

Access in code:
```typescript
import Constants from 'expo-constants'

const clientId = Constants.expoConfig?.extra?.jamendoClientId
```

---

## Development Workflow

### 1. Install dependencies
```bash
cd apps/example
pnpm install
```

### 2. Start development server
```bash
pnpm start
```

### 3. Run on platform
```bash
pnpm ios      # iOS Simulator
pnpm android  # Android Emulator
pnpm web      # Web browser
```

### 4. Development tools
- Redux DevTools - Monitor state
- React DevTools - Inspect components
- Expo DevTools - Debug app

---

## Testing Strategy

### Unit Tests
- RTK Query API slices
- Component rendering
- Player functionality
- Search debouncing

### Integration Tests
- Search flow (input → results → detail)
- Navigation flow
- Audio playback

### Performance Tests
- FlashList scroll performance
- Memory usage during playback
- API response caching

### Comparison Tests
- expo-audio vs react-native-audio-pro
  - Playback latency
  - Seeking accuracy
  - Memory footprint
  - UI responsiveness

---

## Success Metrics

- ✅ Search returns results in < 1 second
- ✅ FlashList scrolls at 60fps
- ✅ Track detail loads from cache instantly on back navigation
- ✅ Audio players can play, pause, and seek smoothly
- ✅ No memory leaks during extended use
- ✅ App works on iOS, Android, and Web

---

## Next Steps After MVP

1. **Pick the better audio player** based on testing
2. **Remove the other player** to reduce bundle size
3. **Add features:**
   - Pull-to-refresh on search
   - Infinite scroll / pagination
   - Recently searched terms
   - Play queue
   - Favorites
4. **Optimize:**
   - Image caching
   - Prefetch next tracks
   - Reduce bundle size
5. **Polish:**
   - Loading skeletons
   - Error boundaries
   - Empty states
   - Animations

---

## Common Commands

```bash
# Install new dependency in main app
cd apps/example && pnpm add <package>

# Install in rtk-services package
cd packages/rtk-services && pnpm add <package>

# Install in components package
cd packages/components && pnpm add <package>

# Install in all packages
pnpm add <package> -w

# Run type checking
pnpm tsc --noEmit

# Run linting
pnpm lint

# Run tests
pnpm test

# Build for production
pnpm build
```

---

## Troubleshooting

### Issue: RTK Query hook not found
**Solution:** Make sure `@jamendo/rtk-services` is added to app dependencies

### Issue: Components not rendering
**Solution:** Check that Redux Provider wraps the app in `_layout.tsx`

### Issue: Audio not playing
**Solution:**
- Check that `audio` field is in API response
- Verify `audioformat=mp31` parameter
- Check iOS background audio config

### Issue: FlashList not scrolling smoothly
**Solution:**
- Ensure `estimatedItemSize` is set
- Check that items have consistent heights
- Verify no expensive operations in render

---

## Resources

### Documentation
- [Expo Audio](https://docs.expo.dev/versions/latest/sdk/audio/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [FlashList](https://shopify.github.io/flash-list/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Jamendo API](https://developer.jamendo.com/v3.0)

### Community
- [Expo Discord](https://chat.expo.dev/)
- [React Native Community](https://www.reactnative.dev/community/overview)
- [Redux Discord](https://discord.gg/redux)

---

## Contributors

- Initial setup and architecture planning
- Comprehensive documentation
- Implementation roadmap

**Last Updated:** 2025-11-21
