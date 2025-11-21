# Jamendo Music App - Implementation Plan

**Date:** 2025-11-21
**Architecture:** Monorepo with RTK Query

## Overview

Build a React Native music streaming app using Jamendo's API with the following features:
1. Home page with search and track results (FlashList)
2. Detail page with track info and TWO audio player implementations (ScrollView)
3. Redux Toolkit Query for state management and API calls
4. Optimal API usage (minimal fields on list, full fields on detail)

## Architecture Decisions

### State Management: RTK Query
- **Why:** Built into Redux Toolkit, handles caching, refetching, loading states automatically
- **Structure:**
  - `createApi` for Jamendo endpoints
  - Automatic cache invalidation
  - Built-in loading/error states
  - No need for separate slices for API data

### Code Organization
- **`@jamendo/rtk-services`** - Store + RTK Query APIs
- **`@jamendo/components`** - Shared UI components
- **`apps/example/app/`** - Expo Router screens only

### Audio Libraries (Both for Comparison)
1. **expo-audio** - Expo's new audio library
2. **react-native-audio-pro** - Alternative player

### UI Libraries
- **@shopify/flash-list** - High-performance list for search results
- **ScrollView** - For track detail page

---

## Phase 1: Setup Dependencies

### 1.1 Install RTK Query Dependencies
```bash
cd apps/example
pnpm add @reduxjs/toolkit react-redux
```

### 1.2 Install Audio Libraries
```bash
pnpm add expo-audio react-native-audio-pro
```

### 1.3 Install FlashList
```bash
pnpm add @shopify/flash-list
```

### 1.4 Install Environment Variables Support
```bash
pnpm add expo-constants dotenv
pnpm add -D @types/dotenv
```

### 1.5 Create New Packages
```bash
# Create rtk-services package
mkdir -p packages/rtk-services/src/{api,types}

# Create components package
mkdir -p packages/components/src/{player,track,search}
```

---

## Phase 2: Configure RTK Services Package

### 2.1 Create `packages/rtk-services/package.json`
```json
{
  "name": "@jamendo/rtk-services",
  "version": "0.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {
    "@reduxjs/toolkit": "*",
    "react-redux": "*"
  }
}
```

### 2.2 Create Jamendo API Types
**File:** `packages/rtk-services/src/types/jamendo.ts`

Define TypeScript interfaces for:
- `JamendoTrack` - Track data structure
- `JamendoSearchResponse` - Search API response
- `JamendoTrackDetailResponse` - Detail API response
- API query parameters

### 2.3 Create Base RTK Query API
**File:** `packages/rtk-services/src/api/baseApi.ts`

- Configure `createApi` with fetchBaseQuery
- Base URL: `https://api.jamendo.com/v3.0`
- Add client_id to all requests
- Set up proper headers

### 2.4 Create Jamendo API Endpoints
**File:** `packages/rtk-services/src/api/jamendoApi.ts`

Define endpoints:
```typescript
searchTracks: builder.query<JamendoSearchResponse, string>({
  // Minimal fields: id, name, artist_name, image
  query: (searchTerm) => ({
    url: '/tracks',
    params: {
      namesearch: searchTerm,
      limit: 20,
      // Only essential fields for list view
    }
  })
})

getTrackDetail: builder.query<JamendoTrack, string>({
  // Full fields: all track metadata + audio URL
  query: (trackId) => ({
    url: '/tracks',
    params: {
      id: trackId,
      include: 'musicinfo+lyrics',
      // All fields for detail view
    }
  })
})
```

### 2.5 Create Redux Store
**File:** `packages/rtk-services/src/store.ts`

- Configure store with jamendoApi reducer
- Add middleware for RTK Query
- Export typed hooks: `useAppDispatch`, `useAppSelector`
- Export store and types

### 2.6 Export Package
**File:** `packages/rtk-services/src/index.ts`
```typescript
export { store } from './store'
export { jamendoApi, useSearchTracksQuery, useGetTrackDetailQuery } from './api/jamendoApi'
export type * from './types/jamendo'
```

---

## Phase 3: Configure Components Package

### 3.1 Create `packages/components/package.json`
```json
{
  "name": "@jamendo/components",
  "version": "0.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {
    "react": "*",
    "react-native": "*",
    "expo-audio": "*",
    "react-native-audio-pro": "*",
    "@shopify/flash-list": "*"
  }
}
```

### 3.2 Create Player Components

#### 3.2.1 Expo Audio Player
**File:** `packages/components/src/player/ExpoAudioPlayer.tsx`

Using `expo-audio` library:
- Play/Pause button
- Progress bar (seekable)
- Current time / Duration display
- Loading state
- Error handling

Props:
```typescript
interface ExpoAudioPlayerProps {
  audioUrl: string
  trackName: string
}
```

#### 3.2.2 React Native Audio Pro Player
**File:** `packages/components/src/player/AudioProPlayer.tsx`

Same features as above, different implementation.

### 3.3 Create Track Components

#### 3.3.1 Track Card
**File:** `packages/components/src/track/TrackCard.tsx`

Display:
- Track image (square thumbnail)
- Track name
- Artist name
- Tap handler to navigate to detail

Props:
```typescript
interface TrackCardProps {
  id: string
  name: string
  artistName: string
  imageUrl: string
  onPress: () => void
}
```

#### 3.3.2 Track List (FlashList)
**File:** `packages/components/src/track/TrackList.tsx`

- **FlashList** of TrackCard components (not FlatList)
- Pull to refresh
- Loading state
- Empty state
- Optimized rendering

Props:
```typescript
interface TrackListProps {
  tracks: JamendoTrack[]
  onTrackPress: (trackId: string) => void
  isLoading?: boolean
  onRefresh?: () => void
}
```

### 3.4 Create Search Component
**File:** `packages/components/src/search/SearchBar.tsx`

Features:
- TextInput with search styling
- Debounced input (300ms)
- Clear button
- Search icon

### 3.5 Export Components
**File:** `packages/components/src/index.ts`
```typescript
export { ExpoAudioPlayer } from './player/ExpoAudioPlayer'
export { AudioProPlayer } from './player/AudioProPlayer'
export { TrackCard } from './track/TrackCard'
export { TrackList } from './track/TrackList'
export { SearchBar } from './search/SearchBar'
```

---

## Phase 4: Configure Environment Variables

### 4.1 Create `.env` File
**File:** `apps/example/.env`
```
EXPO_PUBLIC_JAMENDO_CLIENT_ID=your_client_id_here
```

### 4.2 Update `app.json`
Add extra configuration for environment variables.

### 4.3 Create Constants File
**File:** `apps/example/constants/config.ts`
```typescript
import Constants from 'expo-constants'

export const JAMENDO_CLIENT_ID = Constants.expoConfig?.extra?.jamendoClientId
```

---

## Phase 5: Integrate Redux Provider

### 5.1 Update Root Layout
**File:** `apps/example/app/_layout.tsx`

- Import `Provider` from react-redux
- Import `store` from @jamendo/rtk-services
- Wrap entire app with Redux Provider

```typescript
import { Provider } from 'react-redux'
import { store } from '@jamendo/rtk-services'

export default function RootLayout() {
  return (
    <Provider store={store}>
      {/* existing navigation setup */}
    </Provider>
  )
}
```

---

## Phase 6: Build Home Page (Search & Results)

### 6.1 Update Home Screen
**File:** `apps/example/app/(tabs)/index.tsx`

Structure:
1. **Search Section**
   - `SearchBar` component
   - Local state for search term
   - Trigger RTK Query on search

2. **Results Section (FlashList)**
   - Use `useSearchTracksQuery(searchTerm)` hook
   - Show loading spinner while `isLoading`
   - Show error message if `error`
   - Render `TrackList` (FlashList) with `data`

3. **Navigation**
   - On track press: navigate to `/track/[id]`
   - Use `router.push()` from expo-router

Implementation:
```typescript
import { useSearchTracksQuery } from '@jamendo/rtk-services'
import { SearchBar, TrackList } from '@jamendo/components'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { View, ActivityIndicator, Text } from 'react-native'

export default function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading, error } = useSearchTracksQuery(searchTerm, {
    skip: searchTerm.length < 2 // Don't search if too short
  })
  const router = useRouter()

  const handleTrackPress = (trackId: string) => {
    router.push(`/track/${trackId}`)
  }

  return (
    <View style={{ flex: 1 }}>
      <SearchBar value={searchTerm} onChangeText={setSearchTerm} />
      {isLoading && <ActivityIndicator />}
      {error && <Text>Error loading tracks</Text>}
      {data && (
        <TrackList
          tracks={data.results}
          onTrackPress={handleTrackPress}
        />
      )}
    </View>
  )
}
```

---

## Phase 7: Build Track Detail Page

### 7.1 Create Dynamic Route
**File:** `apps/example/app/track/[id].tsx`

Structure (using **ScrollView**):
1. **Get Track ID from Route**
   - Use `useLocalSearchParams()` to get `id`

2. **Fetch Track Details**
   - Use `useGetTrackDetailQuery(id)` hook
   - Show loading state
   - Handle errors

3. **ScrollView Layout**
   - Large album art
   - Track information
   - Player 1: Expo Audio
   - Player 2: React Native Audio Pro

Implementation:
```typescript
import { useLocalSearchParams, Stack } from 'expo-router'
import { useGetTrackDetailQuery } from '@jamendo/rtk-services'
import { ExpoAudioPlayer, AudioProPlayer } from '@jamendo/components'
import { ScrollView, View, Image, Text, ActivityIndicator, StyleSheet } from 'react-native'

export default function TrackDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: track, isLoading, error } = useGetTrackDetailQuery(id)

  if (isLoading) return <ActivityIndicator style={styles.loading} />
  if (error) return <Text>Error loading track</Text>
  if (!track) return null

  return (
    <>
      <Stack.Screen options={{ title: track.name }} />
      <ScrollView style={styles.container}>
        {/* Track Image */}
        <Image
          source={{ uri: track.image }}
          style={styles.albumArt}
        />

        {/* Track Info */}
        <View style={styles.info}>
          <Text style={styles.trackName}>{track.name}</Text>
          <Text style={styles.artistName}>{track.artist_name}</Text>
          <Text style={styles.albumName}>{track.album_name}</Text>
          <Text style={styles.duration}>{track.duration}</Text>
        </View>

        {/* Player 1: Expo Audio */}
        <View style={styles.playerSection}>
          <Text style={styles.playerTitle}>Player 1: Expo Audio</Text>
          <ExpoAudioPlayer
            audioUrl={track.audio}
            trackName={track.name}
          />
        </View>

        {/* Player 2: React Native Audio Pro */}
        <View style={styles.playerSection}>
          <Text style={styles.playerTitle}>Player 2: React Native Audio Pro</Text>
          <AudioProPlayer
            audioUrl={track.audio}
            trackName={track.name}
          />
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center' },
  albumArt: { width: '100%', aspectRatio: 1 },
  info: { padding: 16 },
  trackName: { fontSize: 24, fontWeight: 'bold' },
  artistName: { fontSize: 18, marginTop: 8 },
  albumName: { fontSize: 16, marginTop: 4, opacity: 0.7 },
  duration: { fontSize: 14, marginTop: 4, opacity: 0.5 },
  playerSection: { padding: 16, borderTopWidth: 1, borderTopColor: '#ddd' },
  playerTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 }
})
```

---

## Phase 8: Update Navigation

### 8.1 Update Tab Bar
**File:** `apps/example/app/(tabs)/_layout.tsx`

- Rename "Home" tab to "Search" or "Music"
- Add music-related icons
- Remove or repurpose "Explore" tab

### 8.2 Configure Stack Navigation
Expo Router handles this automatically with the folder structure:
```
app/
├── (tabs)/
│   └── index.tsx        # Search screen (FlashList)
└── track/
    └── [id].tsx         # Detail screen (ScrollView)
```

---

## Phase 9: Testing & Validation

### 9.1 API Usage Verification
- **Search endpoint:** Only minimal fields requested
- **Detail endpoint:** Full fields including audio URL
- **Caching:** RTK Query caches responses automatically

### 9.2 Player Comparison Testing
Test both players for:
- Playback functionality
- Seeking/scrubbing
- Play/Pause responsiveness
- Progress updates
- Error handling
- Memory usage
- UI responsiveness

### 9.3 FlashList Performance
- Verify smooth scrolling
- Check recycling of items
- Measure performance vs FlatList

### 9.4 Navigation Testing
- Search → Detail navigation
- Back navigation from detail
- Deep linking to track ID

### 9.5 Redux DevTools
- Install Redux DevTools extension
- Verify state updates
- Check RTK Query cache

---

## Data Flow Diagram

```
User Input (Search)
    ↓
SearchBar component
    ↓
useSearchTracksQuery hook
    ↓
RTK Query API call (minimal fields)
    ↓
Redux store (cached)
    ↓
TrackList component (FlashList)
    ↓
User taps track
    ↓
Navigation to /track/[id]
    ↓
useGetTrackDetailQuery hook
    ↓
RTK Query API call (full fields + audio)
    ↓
Redux store (cached)
    ↓
Track detail (ScrollView) + 2 players
```

---

## File Structure Summary

```
jamendo-app/
├── packages/
│   ├── rtk-services/
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   ├── baseApi.ts
│   │   │   │   └── jamendoApi.ts
│   │   │   ├── types/
│   │   │   │   └── jamendo.ts
│   │   │   ├── store.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── components/
│       ├── src/
│       │   ├── player/
│       │   │   ├── ExpoAudioPlayer.tsx      (expo-audio)
│       │   │   └── AudioProPlayer.tsx       (react-native-audio-pro)
│       │   ├── track/
│       │   │   ├── TrackCard.tsx
│       │   │   └── TrackList.tsx            (FlashList)
│       │   ├── search/
│       │   │   └── SearchBar.tsx
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
└── apps/
    └── example/
        ├── app/
        │   ├── (tabs)/
        │   │   ├── _layout.tsx
        │   │   └── index.tsx                # Search screen (FlashList)
        │   ├── track/
        │   │   └── [id].tsx                 # Detail screen (ScrollView)
        │   └── _layout.tsx                  # Redux Provider
        ├── constants/
        │   └── config.ts
        ├── .env
        └── package.json
```

---

## Key Libraries Summary

| Purpose | Library | Version |
|---------|---------|---------|
| State Management | @reduxjs/toolkit + react-redux | Latest |
| Audio Player 1 | expo-audio | Latest |
| Audio Player 2 | react-native-audio-pro | Latest |
| List Performance | @shopify/flash-list | Latest |
| Detail Layout | ScrollView | Built-in |
| Environment Vars | expo-constants + dotenv | Latest |

---

## Success Criteria

- ✅ Search functionality works with debouncing
- ✅ FlashList displays track results smoothly
- ✅ Track detail uses ScrollView for layout
- ✅ Both audio players (expo-audio + audio-pro) can play tracks
- ✅ Navigation works smoothly (search ↔ detail)
- ✅ RTK Query handles loading/error states
- ✅ API calls use optimal field selection
- ✅ Redux DevTools shows proper state management
- ✅ No unnecessary re-renders
- ✅ Caching works (going back doesn't refetch)
- ✅ FlashList provides better performance than FlatList

---

## Next Steps After Implementation

1. Compare player performance (expo-audio vs audio-pro) and choose one
2. Add error boundaries
3. Add pull-to-refresh on search
4. Add infinite scroll for search results (FlashList pagination)
5. Add track duration display on list items
6. Add proper loading skeletons
7. Optimize images (caching, lazy loading)
8. Add background audio support (if needed)
