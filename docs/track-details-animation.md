# Track Details with Animated Header Image

## Feature Overview

A track details screen that displays comprehensive track information with an immersive animated header. As the user scrolls through track details, the large track image in the content area fades out while a smaller version simultaneously fades into the header (top-right corner), providing continuous visual context without consuming screen real estate.

**User Experience Goals:**
- Seamless navigation from search results to track details
- Smooth 60fps animations that feel native
- Persistent track image visibility during scroll
- Rich metadata display with integrated audio controls

## Architecture Decisions

### Navigation Structure
- **Route Type**: Stack screen at `app/track/[id].tsx`
- **Navigation Pattern**: Push from home screen with back button
- **Route Params**: Dynamic `[id]` parameter for track ID
- **Integration**: Uses Expo Router file-based routing

**Why Stack Screen?**
- Natural back navigation from detail to list
- Full-screen presentation for rich content
- Consistent with mobile platform conventions
- Easy to integrate with existing tab navigator

### Animation Approach: Dual-Image Fade

**Pattern**: Two separate image instances with opacity interpolation

**Content Area Image** (Hero):
- Large size (full width, ~300px height)
- Positioned at top of scrollable content
- Fades out: opacity 1 → 0 as scroll reaches 200px

**Header Image** (Thumbnail):
- Small size (60x60px)
- Fixed position in header, right-aligned
- Fades in: opacity 0 → 1 as scroll reaches 200px

**Why Dual-Image vs Shared Element Transition?**
- ✅ Simpler implementation with Reanimated
- ✅ Better performance (no layout recalculation)
- ✅ Independent control of each image's behavior
- ✅ Works seamlessly with ScrollView
- ❌ Shared element would require react-navigation integration complexity

### Component Architecture

**Reusable Components** (`packages/components/src/track/`):
- `TrackDetailView.tsx` - Main container with data fetching
- `AnimatedTrackHeader.tsx` - Fixed header with fade-in image
- `TrackMetadata.tsx` - Display track information
- `TrackPlayerControls.tsx` - Audio player interface (future)

**App-Specific Route** (`apps/example/app/track/[id].tsx`):
- Thin wrapper around TrackDetailView
- Navigation configuration
- Error boundaries

**Why Reusable Components?**
- Can be used in other apps within monorepo
- Easier to test in isolation
- Clear separation of concerns
- Follows existing pattern (TrackCard, TrackList)

## Technical Implementation

### React Native Reanimated Integration

**Dependencies** (Already Installed):
- `react-native-reanimated: ~4.1.0`
- `expo-image: ~3.0.8`

**Key Hooks Used**:
- `useSharedValue()` - Track scroll position
- `useAnimatedScrollHandler()` - Capture scroll events on UI thread
- `useAnimatedStyle()` - Create dynamic styles from shared values
- `interpolate()` - Map scroll offset to opacity values

### Scroll Handler Implementation

```typescript
import { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

const TrackDetailView = ({ trackId }: { trackId: string }) => {
  // Track scroll position (runs on UI thread)
  const scrollY = useSharedValue(0);

  // Capture scroll events
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Content image fade-out animation
  const contentImageStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 200],      // Input range: 0px to 200px scroll
        [1, 0],        // Output range: fully visible to invisible
        'clamp'        // Don't extrapolate beyond bounds
      ),
    };
  });

  // Header image fade-in animation
  const headerImageStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 200],      // Same input range
        [0, 1],        // Inverse output: invisible to visible
        'clamp'
      ),
    };
  });

  return (
    <>
      <AnimatedTrackHeader
        imageUrl={track.image}
        animatedStyle={headerImageStyle}
      />
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
        <Animated.View style={contentImageStyle}>
          <Image source={{ uri: track.image }} style={styles.heroImage} />
        </Animated.View>
        {/* Track content */}
      </Animated.ScrollView>
    </>
  );
};
```

### Animation Thresholds

**Fade Range**: 0px → 200px scroll offset

**Why 200px?**
- Content image height: ~300px
- At 200px scroll, image is mostly off-screen
- Provides smooth transition window
- Feels natural to user perception

**Performance Optimization**:
- `scrollEventThrottle={16}` - ~60fps event delivery
- Interpolation runs on UI thread (no JS bridge)
- `clamp` extrapolation prevents unnecessary calculations
- `expo-image` provides optimized image rendering

### Component Structure

#### 1. TrackDetailView (Main Container)

**Location**: `packages/components/src/track/TrackDetailView.tsx`

**Responsibilities**:
- Fetch track data via RTK Query
- Manage scroll state
- Coordinate animations
- Render content sections

**Props**:
```typescript
interface TrackDetailViewProps {
  trackId: string;
  onPlayPress?: () => void;
  onSharePress?: () => void;
}
```

**Data Fetching**:
```typescript
import { useGetTrackDetailQuery } from '@jamendo/rtk-services';

const { data: track, isLoading, error } = useGetTrackDetailQuery({
  trackId,
  include: 'musicinfo+lyrics',
  audioformat: 'mp31',
});
```

**Sections**:
1. Hero image (fades out)
2. Track metadata (name, artist, album)
3. Additional info (duration, release date, license)
4. Player controls
5. Lyrics (if available)

#### 2. AnimatedTrackHeader

**Location**: `packages/components/src/track/AnimatedTrackHeader.tsx`

**Responsibilities**:
- Fixed position header overlay
- Receive animated style from parent
- Display small track image

**Props**:
```typescript
interface AnimatedTrackHeaderProps {
  imageUrl: string;
  title?: string;
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
}
```

**Layout**:
```typescript
const AnimatedTrackHeader = ({ imageUrl, title, animatedStyle }) => {
  return (
    <Animated.View style={[styles.header, animatedStyle]}>
      <View style={styles.headerContent}>
        {title && <Text style={styles.headerTitle}>{title}</Text>}
        <Image
          source={{ uri: imageUrl }}
          style={styles.headerImage}
          contentFit="cover"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 100,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});
```

#### 3. TrackMetadata

**Location**: `packages/components/src/track/TrackMetadata.tsx`

**Display Fields** (from `JamendoTrack` type):
- Track name
- Artist name (linkable)
- Album name (linkable)
- Duration (formatted as mm:ss)
- Release date
- License info with link
- Share URL

#### 4. TrackPlayerControls (Placeholder)

**Location**: `packages/components/src/track/TrackPlayerControls.tsx`

**Initial Implementation**:
- Play/Pause button (UI only)
- Seek bar (static)
- Current time / Total time
- Volume control (optional)

**Future Enhancement**:
- Integrate with `expo-audio`
- Actual playback functionality
- Background audio support

## Data Flow

### RTK Query Hook

**Endpoint**: Already exists in `packages/rtk-services/src/api/jamendoApi.ts`

```typescript
getTrackDetail: builder.query<JamendoTrack, GetTrackDetailParams>({
  query: ({ trackId, include = 'musicinfo+lyrics', audioformat = 'mp31' }) => ({
    url: '/tracks',
    params: {
      client_id: process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID,
      format: 'json',
      id: trackId,
      include,
      audioformat,
    },
  }),
  transformResponse: (response: JamendoApiResponse<JamendoTrack>) =>
    response.results[0],
}),
```

**Hook Usage**:
```typescript
const { data, isLoading, error, refetch } = useGetTrackDetailQuery({ trackId });
```

**Response Type** (`JamendoTrack`):
```typescript
{
  id: string;
  name: string;
  artist_name: string;
  artist_id: string;
  album_name: string;
  album_id: string;
  image: string;           // Hero image URL
  album_image: string;
  audio: string;           // MP3 stream URL
  audiodownload: string;
  duration: number;        // Seconds
  position: number;
  releasedate: string;
  license_ccurl: string;
  shareurl: string;
  musicinfo?: object;
  lyrics?: string;
}
```

## File Structure

### Files to Create

```
packages/components/src/track/
├── TrackDetailView.tsx          # Main component (NEW)
├── AnimatedTrackHeader.tsx      # Header animation (NEW)
├── TrackMetadata.tsx            # Metadata display (NEW)
└── TrackPlayerControls.tsx      # Player UI (NEW)

apps/example/app/
└── track/
    └── [id].tsx                 # Dynamic route (NEW)

docs/
└── track-details-animation.md   # This file
```

### Files to Modify

```
packages/components/src/index.ts
  + export * from './track/TrackDetailView';
  + export * from './track/AnimatedTrackHeader';
  + export * from './track/TrackMetadata';
  + export * from './track/TrackPlayerControls';

apps/example/app/(tabs)/index.tsx
  - router.push(`/track/${trackId}` as any)
  + router.push(`/track/${trackId}`)
  + Add proper TypeScript types for route params
```

## Testing Strategy

### Gherkin Scenarios

**Feature File**: `spec/features/track-details.feature`

```gherkin
Feature: Track Details with Animated Header

  Scenario: Navigate to track details from search results
    Given I am on the home screen
    And I have searched for "blues"
    When I tap on a track in the search results
    Then I should see the track details screen
    And the track image should be displayed at full size
    And the track metadata should be visible

  Scenario: Image fades into header on scroll
    Given I am viewing track details
    And the content image is fully visible
    When I scroll down 200 pixels
    Then the content image should fade out completely
    And the header image should fade in completely
    And the header should show the track image on the right side

  Scenario: Image animations are smooth
    Given I am viewing track details
    When I scroll continuously from top to bottom
    Then the fade animation should run at 60fps
    And there should be no jank or stuttering

  Scenario: Display full track metadata
    Given I am viewing track details for a specific track
    Then I should see the track name
    And I should see the artist name
    And I should see the album name
    And I should see the track duration
    And I should see the release date
    And I should see the license information

  Scenario: Handle loading state
    Given I navigate to track details
    When the track data is loading
    Then I should see a loading indicator
    And the screen should not show incomplete data

  Scenario: Handle error state
    Given I navigate to track details with invalid ID
    When the API returns an error
    Then I should see an error message
    And I should have an option to retry or go back
```

### Manual Testing Checklist

- [ ] Animation runs smoothly at 60fps on iOS
- [ ] Animation runs smoothly at 60fps on Android
- [ ] Header image appears at correct scroll threshold (200px)
- [ ] Images use correct aspect ratio and content fit
- [ ] Loading state displays properly
- [ ] Error state displays with retry option
- [ ] Back navigation works correctly
- [ ] Deep linking to track ID works
- [ ] Screen reader announces track information
- [ ] Safe area insets respected on notched devices

## Implementation Checklist

### Phase 1: Core Components
- [ ] Create `TrackDetailView.tsx` with basic layout
- [ ] Create `AnimatedTrackHeader.tsx` with fixed positioning
- [ ] Set up scroll handler with `useAnimatedScrollHandler`
- [ ] Implement fade-out animation for content image
- [ ] Implement fade-in animation for header image
- [ ] Test animation performance on device

### Phase 2: Data Integration
- [ ] Integrate `useGetTrackDetailQuery` hook
- [ ] Handle loading state with skeleton UI
- [ ] Handle error state with retry button
- [ ] Display track metadata in content area
- [ ] Format duration, release date properly
- [ ] Add license link

### Phase 3: Route Setup
- [ ] Create `app/track/[id].tsx` route file
- [ ] Configure navigation options (title, back button)
- [ ] Add TypeScript types for route params
- [ ] Update home screen to navigate properly
- [ ] Test navigation flow end-to-end

### Phase 4: Player Controls (Basic UI)
- [ ] Create `TrackPlayerControls.tsx` component
- [ ] Add play/pause button (UI only)
- [ ] Add seek bar (static, no interaction)
- [ ] Add time display (current / total)
- [ ] Position controls in layout

### Phase 5: Polish
- [ ] Add safe area support for notched devices
- [ ] Ensure theme compatibility (light/dark mode)
- [ ] Add accessibility labels
- [ ] Optimize image loading with expo-image
- [ ] Test on multiple screen sizes

### Phase 6: Testing & Documentation
- [ ] Write Gherkin scenarios
- [ ] Create unit tests for components
- [ ] Link tests to scenarios with fspec
- [ ] Verify animation performance
- [ ] Update fspec work unit status

## Performance Considerations

### Animation Performance
- **Target**: Consistent 60fps on iOS/Android, 120fps on ProMotion displays
- **Techniques**:
  - All animations run on UI thread (Reanimated worklets)
  - No JavaScript bridge crossings during scroll
  - `scrollEventThrottle={16}` for ~60fps updates
  - Clamp interpolation to avoid unnecessary calculations

### Image Optimization
- **expo-image** provides:
  - Automatic caching
  - Progressive loading
  - Memory management
  - WebP support on Android
- Use `contentFit="cover"` for proper aspect ratio
- Specify explicit dimensions to avoid layout shift

### State Management
- RTK Query handles:
  - Automatic caching (no redundant fetches)
  - Background refetching
  - Optimistic updates
  - Request deduplication

### Bundle Size
- No new dependencies required
- Reanimated already included in app
- Component tree kept shallow
- Lazy loading for future player integration

## Future Enhancements

### Audio Playback Integration
- Integrate `expo-audio` for real playback
- Add background audio support
- Implement queue management
- Add playback controls (repeat, shuffle)

### Social Features
- Share track via share sheet
- Add to favorites/playlists
- View artist profile
- Related tracks section

### Enhanced Animations
- Add spring physics to fade transitions
- Implement gesture-driven seek bar
- Add haptic feedback on interactions
- Parallax effect on hero image

### Accessibility
- VoiceOver/TalkBack announcements
- Dynamic type support for text
- High contrast mode support
- Reduced motion preference support

## References

- **React Native Reanimated Docs**: https://docs.swmansion.com/react-native-reanimated/
- **Expo Router**: https://docs.expo.dev/router/introduction/
- **Jamendo API**: https://developer.jamendo.com/v3.0/tracks
- **expo-image**: https://docs.expo.dev/versions/latest/sdk/image/
- **RTK Query**: Already implemented in `packages/rtk-services`

## Related Work Units

- **JAM-005**: Redux Provider Integration (prerequisite)
- **JAM-006**: Home Screen Implementation (prerequisite)
- **JAM-007**: Track Search Implementation (prerequisite)
- **JAM-011**: Track Details with Animated Header (this feature)
- **Future**: Audio Player Implementation (depends on JAM-011)
